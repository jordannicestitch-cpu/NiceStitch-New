import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QUOTE_MAX_UPLOAD_BYTES } from "@/lib/quote";
import { OPTIONS, POST } from "./route";

type SentEmail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  attachments: { filename: string; content: string }[];
};
type SendResult = {
  data: { id: string } | null;
  error: { name: string; message: string; statusCode: number } | null;
};

// The real SDK is never loaded, so no test can reach Resend.
const resendMock = vi.hoisted(() => ({
  send: vi.fn<(email: SentEmail) => Promise<SendResult>>(),
  apiKeys: [] as string[],
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendMock.send };
    constructor(apiKey: string) {
      resendMock.apiKeys.push(apiKey);
    }
  },
}));

const ENDPOINT_URL = "http://localhost/api/quote";

const VALID_FIELDS = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  service_type: "uv_dtf",
};

function quoteRequest(
  fields: Record<string, string>,
  files: File[] = [],
): Request {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  for (const file of files) body.append("artwork", file);
  return new Request(ENDPOINT_URL, { method: "POST", body });
}

function fileOfSize(bytes: number, name = "artwork.png"): File {
  return new File([new Uint8Array(bytes)], name, { type: "image/png" });
}

function sentEmail(): SentEmail {
  expect(resendMock.send).toHaveBeenCalledTimes(1);
  const email = resendMock.send.mock.calls[0]?.[0];
  if (!email) throw new Error("emails.send was called without a payload");
  return email;
}

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv("NOTIFY_EMAIL", "shop@example.com");
  vi.stubEnv("FROM_EMAIL", "Nice Stitch Quotes <quotes@example.com>");
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("ALLOWED_ORIGIN", "");
  vi.stubEnv("MAX_UPLOAD_BYTES", "");
  resendMock.send.mockReset();
  resendMock.send.mockResolvedValue({ data: { id: "email_1" }, error: null });
  resendMock.apiKeys.length = 0;
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/quote", () => {
  describe("configuration", () => {
    it.each(["NOTIFY_EMAIL", "FROM_EMAIL", "RESEND_API_KEY"])(
      "returns 500 when %s is missing",
      async (variable) => {
        vi.stubEnv(variable, "");

        const response = await POST(quoteRequest(VALID_FIELDS));

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
          error: "Quote service is not configured yet.",
        });
        expect(resendMock.send).not.toHaveBeenCalled();
        expect(consoleError).toHaveBeenCalledTimes(1);
      },
    );

    it("treats a whitespace-only value as missing", async () => {
      vi.stubEnv("RESEND_API_KEY", " \n");

      const response = await POST(quoteRequest(VALID_FIELDS));

      expect(response.status).toBe(500);
      expect(resendMock.send).not.toHaveBeenCalled();
    });

    it("trims pasted whitespace from the env values before using them", async () => {
      vi.stubEnv("NOTIFY_EMAIL", " shop@example.com\n");
      vi.stubEnv("FROM_EMAIL", "Nice Stitch Quotes <quotes@example.com>\n");
      vi.stubEnv("RESEND_API_KEY", "re_test_key\n");

      const response = await POST(quoteRequest(VALID_FIELDS));

      expect(response.status).toBe(200);
      expect(resendMock.apiKeys).toEqual(["re_test_key"]);
      expect(sentEmail()).toMatchObject({
        to: "shop@example.com",
        from: "Nice Stitch Quotes <quotes@example.com>",
      });
    });
  });

  describe("validation", () => {
    it.each(["name", "email", "service_type"])(
      "returns 400 when %s is missing",
      async (field) => {
        const fields: Record<string, string> = { ...VALID_FIELDS };
        delete fields[field];

        const response = await POST(quoteRequest(fields));

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
          error: "Name, email, and service type are required.",
        });
        expect(resendMock.send).not.toHaveBeenCalled();
      },
    );

    it("returns 400 when a required field is submitted empty", async () => {
      const response = await POST(
        quoteRequest({ ...VALID_FIELDS, service_type: "" }),
      );

      expect(response.status).toBe(400);
      expect(resendMock.send).not.toHaveBeenCalled();
    });

    it("returns 400 when the body is not a readable form", async () => {
      const request = new Request(ENDPOINT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VALID_FIELDS),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error:
          "Could not read the submitted form. Check file sizes and try again.",
      });
      expect(resendMock.send).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledTimes(1);
    });
  });

  describe("sending the email", () => {
    it("returns 200 and emails the request to the shop", async () => {
      const artwork = new File(["fake png bytes"], "logo.png", {
        type: "image/png",
      });

      const response = await POST(
        quoteRequest(
          {
            name: "Ada Lovelace",
            company: "Analytical Engines",
            email: "ada@example.com",
            phone: "555-0100",
            service_type: "uv_dtf",
            quantity: "50",
            deadline: "2026-12-01",
            details: "Front chest\nTwo colors",
          },
          [artwork],
        ),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("application/json");
      expect(await response.json()).toEqual({ ok: true });

      const email = sentEmail();
      expect(email.to).toBe("shop@example.com");
      expect(email.from).toBe("Nice Stitch Quotes <quotes@example.com>");
      expect(email.replyTo).toBe("ada@example.com");
      expect(email.subject).toBe("New quote request from Ada Lovelace");
      expect(email.html).toContain("<h2>New quote request — Nice Stitch</h2>");
      expect(email.html).toContain(
        '<table><tr><td style="padding:4px 12px;font-weight:600;">Name</td><td style="padding:4px 12px;">Ada Lovelace</td></tr>',
      );
      for (const [label, value] of [
        ["Company / team", "Analytical Engines"],
        ["Email", "ada@example.com"],
        ["Phone", "555-0100"],
        ["Service", "UV DTF"],
        ["Quantity", "50"],
        ["Needed by", "2026-12-01"],
      ]) {
        expect(email.html).toContain(
          `<td style="padding:4px 12px;font-weight:600;">${label}</td><td style="padding:4px 12px;">${value}</td>`,
        );
      }
      // Multipart encoding turns each line break into "\r\n"; the "\n" becomes
      // the <br> and the "\r" is left as harmless HTML whitespace.
      expect(email.html).toContain("<p>Front chest\r<br>Two colors</p>");
      expect(email.html).toContain("<p>1 artwork file(s) attached.</p>");
      expect(email.attachments).toEqual([
        {
          filename: "logo.png",
          content: Buffer.from("fake png bytes").toString("base64"),
        },
      ]);
      expect(consoleError).not.toHaveBeenCalled();
    });

    it("escapes HTML in every submitted value", async () => {
      const response = await POST(
        quoteRequest({
          ...VALID_FIELDS,
          name: `<script>alert("x")</script>`,
          company: "Tom & Jerry's",
          details: "<img src=x onerror=alert(1)>",
        }),
      );

      expect(response.status).toBe(200);
      const email = sentEmail();
      expect(email.html).toContain(
        "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
      );
      expect(email.html).toContain("Tom &amp; Jerry&#039;s");
      expect(email.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
      expect(email.html).not.toContain("<script>");
      expect(email.html).not.toContain("<img");
      // The subject is plain text, so the name goes in as typed.
      expect(email.subject).toBe(
        `New quote request from <script>alert("x")</script>`,
      );
    });

    it("leaves optional rows out of the summary when they are blank", async () => {
      await POST(quoteRequest({ ...VALID_FIELDS, company: "", phone: "" }));

      const email = sentEmail();
      expect(email.html).not.toContain("Company / team");
      expect(email.html).not.toContain("Phone");
    });

    it("shows the submitted value when the service type is not a known option", async () => {
      await POST(quoteRequest({ ...VALID_FIELDS, service_type: "laser" }));

      expect(sentEmail().html).toContain(
        '<td style="padding:4px 12px;">laser</td>',
      );
    });

    it("attaches every artwork file", async () => {
      await POST(
        quoteRequest(VALID_FIELDS, [
          new File(["one"], "front.png"),
          new File(["two"], "back.pdf"),
        ]),
      );

      const email = sentEmail();
      expect(email.attachments.map((file) => file.filename)).toEqual([
        "front.png",
        "back.pdf",
      ]);
      expect(email.html).toContain("<p>2 artwork file(s) attached.</p>");
    });

    it("drops the empty file a browser submits when no artwork is chosen", async () => {
      const response = await POST(
        quoteRequest(VALID_FIELDS, [
          new File([], "", { type: "application/octet-stream" }),
        ]),
      );

      expect(response.status).toBe(200);
      const email = sentEmail();
      expect(email.attachments).toEqual([]);
      expect(email.html).toContain("<p>0 artwork file(s) attached.</p>");
    });

    it("returns 502 when Resend reports an error", async () => {
      const resendError = {
        name: "validation_error",
        message: "Invalid `from` field.",
        statusCode: 422,
      };
      resendMock.send.mockResolvedValue({ data: null, error: resendError });

      const response = await POST(quoteRequest(VALID_FIELDS));

      expect(response.status).toBe(502);
      expect(await response.json()).toEqual({
        error: "Could not send the quote request email.",
      });
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to send quote email",
        resendError,
      );
    });

    it("returns 502 when the Resend call throws", async () => {
      const failure = new Error("network down");
      resendMock.send.mockRejectedValue(failure);

      const response = await POST(quoteRequest(VALID_FIELDS));

      expect(response.status).toBe(502);
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to send quote email",
        failure,
      );
    });
  });

  describe("upload size limit", () => {
    it("accepts artwork totalling exactly the default limit", async () => {
      const response = await POST(
        quoteRequest(VALID_FIELDS, [fileOfSize(QUOTE_MAX_UPLOAD_BYTES)]),
      );

      expect(response.status).toBe(200);
      expect(sentEmail().attachments).toHaveLength(1);
    });

    it("returns 400 when artwork is over the default limit", async () => {
      const response = await POST(
        quoteRequest(VALID_FIELDS, [fileOfSize(QUOTE_MAX_UPLOAD_BYTES + 1)]),
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error:
          "Could not read the submitted form. Check file sizes and try again.",
      });
      expect(resendMock.send).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledTimes(1);
    });

    it("counts the combined size of all files", async () => {
      const half = QUOTE_MAX_UPLOAD_BYTES / 2;

      const response = await POST(
        quoteRequest(VALID_FIELDS, [
          fileOfSize(half, "front.png"),
          fileOfSize(half + 1, "back.png"),
        ]),
      );

      expect(response.status).toBe(400);
      expect(resendMock.send).not.toHaveBeenCalled();
    });

    it("lets MAX_UPLOAD_BYTES lower the limit", async () => {
      vi.stubEnv("MAX_UPLOAD_BYTES", "10");

      const atLimit = await POST(quoteRequest(VALID_FIELDS, [fileOfSize(10)]));
      const overLimit = await POST(
        quoteRequest(VALID_FIELDS, [fileOfSize(11)]),
      );

      expect(atLimit.status).toBe(200);
      expect(overLimit.status).toBe(400);
    });

    it("lets MAX_UPLOAD_BYTES raise the limit", async () => {
      vi.stubEnv("MAX_UPLOAD_BYTES", String(QUOTE_MAX_UPLOAD_BYTES + 1));

      const response = await POST(
        quoteRequest(VALID_FIELDS, [fileOfSize(QUOTE_MAX_UPLOAD_BYTES + 1)]),
      );

      expect(response.status).toBe(200);
    });

    it("falls back to the default limit when MAX_UPLOAD_BYTES is not a number", async () => {
      vi.stubEnv("MAX_UPLOAD_BYTES", "4mb");

      const response = await POST(
        quoteRequest(VALID_FIELDS, [fileOfSize(QUOTE_MAX_UPLOAD_BYTES + 1)]),
      );

      expect(response.status).toBe(400);
    });
  });

  describe("CORS", () => {
    it("allows any origin when ALLOWED_ORIGIN is not set", async () => {
      const response = await POST(quoteRequest(VALID_FIELDS));

      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
        "POST, OPTIONS",
      );
      expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
        "Content-Type",
      );
    });

    it("sends the CORS headers on error responses too", async () => {
      vi.stubEnv("ALLOWED_ORIGIN", "https://www.nicestitchla.com");

      const response = await POST(quoteRequest({}));

      expect(response.status).toBe(400);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
        "https://www.nicestitchla.com",
      );
    });
  });
});

describe("OPTIONS /api/quote", () => {
  it("returns 204 with the CORS headers for the configured origin", async () => {
    vi.stubEnv("ALLOWED_ORIGIN", "https://www.nicestitchla.com");

    const response = OPTIONS();

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://www.nicestitchla.com",
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "POST, OPTIONS",
    );
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type",
    );
  });

  it("allows any origin when ALLOWED_ORIGIN is not set", () => {
    expect(OPTIONS().headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
