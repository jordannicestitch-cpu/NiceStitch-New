import { Resend } from "resend";
import { QUOTE_MAX_UPLOAD_BYTES, quoteServiceLabel } from "@/lib/quote";

// Receives the Nice Stitch quote-request form (multipart, with artwork files)
// and emails it to NOTIFY_EMAIL via Resend. NOTIFY_EMAIL is an env var on the
// Vercel project — change it anytime in the Vercel dashboard (and redeploy)
// without touching the code.

// Sending an email with attachments can take several seconds. Same allowance
// the previous site gave this function in vercel.json.
export const maxDuration = 30;

const UNREADABLE_FORM_ERROR =
  "Could not read the submitted form. Check file sizes and try again.";

type QuoteResponseBody = { ok: true } | { error: string };

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(status: number, body: QuoteResponseBody): Response {
  return Response.json(body, { status, headers: corsHeaders() });
}

// MAX_UPLOAD_BYTES overrides the shared default; anything that isn't a
// positive number (unset, blank, a typo) falls back to the default.
function maxUploadBytes(): number {
  const configured = Number(process.env.MAX_UPLOAD_BYTES);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : QUOTE_MAX_UPLOAD_BYTES;
}

function isFile(entry: FormDataEntryValue): entry is File {
  return typeof entry !== "string";
}

function textField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: Request): Promise<Response> {
  // Trim: pasting a key into a dashboard field often carries a trailing
  // newline, which makes an otherwise-valid key fail auth.
  const notifyEmail = (process.env.NOTIFY_EMAIL ?? "").trim();
  const fromEmail = (process.env.FROM_EMAIL ?? "").trim();
  const resendApiKey = (process.env.RESEND_API_KEY ?? "").trim();

  if (!notifyEmail || !fromEmail || !resendApiKey) {
    console.error(
      "Quote service misconfigured: set NOTIFY_EMAIL, FROM_EMAIL, and RESEND_API_KEY in Vercel project env vars.",
    );
    return json(500, { error: "Quote service is not configured yet." });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch (err) {
    console.error("Failed to parse quote form submission", err);
    return json(400, { error: UNREADABLE_FORM_ERROR });
  }

  const uploadLimit = maxUploadBytes();
  const uploadedBytes = Array.from(form.values())
    .filter(isFile)
    .reduce((total, file) => total + file.size, 0);
  if (uploadedBytes > uploadLimit) {
    console.error(
      `Failed to parse quote form submission: ${uploadedBytes} bytes of files exceeds the ${uploadLimit} byte limit`,
    );
    return json(400, { error: UNREADABLE_FORM_ERROR });
  }

  const name = textField(form, "name");
  const email = textField(form, "email");
  const company = textField(form, "company");
  const phone = textField(form, "phone");
  const serviceType = textField(form, "service_type");
  const quantity = textField(form, "quantity");
  const deadline = textField(form, "deadline");
  const details = textField(form, "details");

  if (!name || !email || !serviceType) {
    return json(400, { error: "Name, email, and service type are required." });
  }

  // Browsers submit an empty, nameless file when no artwork was chosen.
  const artworkFiles = form
    .getAll("artwork")
    .filter(isFile)
    .filter((file) => file.size > 0);

  let attachments: { filename: string; content: string }[];
  try {
    attachments = await Promise.all(
      artworkFiles.map(async (file) => ({
        filename: file.name || "artwork",
        content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      })),
    );
  } catch (err) {
    console.error("Failed to read uploaded artwork", err);
    return json(500, { error: "Failed to process uploaded artwork." });
  }

  const summaryRows: [label: string, value: string][] = [
    ["Name", name],
    ["Company / team", company],
    ["Email", email],
    ["Phone", phone],
    ["Service", quoteServiceLabel(serviceType)],
    ["Quantity", quantity],
    ["Needed by", deadline],
  ];

  const htmlRows = summaryRows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px;font-weight:600;">${escapeHtml(label)}</td><td style="padding:4px 12px;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const html = `
    <h2>New quote request — Nice Stitch</h2>
    <table>${htmlRows}</table>
    <p><strong>Details:</strong></p>
    <p>${escapeHtml(details).replace(/\n/g, "<br>")}</p>
    <p>${artworkFiles.length} artwork file(s) attached.</p>
  `;

  const sendFailed = (err: unknown): Response => {
    console.error("Failed to send quote email", err);
    return json(502, { error: "Could not send the quote request email." });
  };

  try {
    const { error } = await new Resend(resendApiKey).emails.send({
      from: fromEmail,
      to: notifyEmail,
      replyTo: email,
      subject: `New quote request from ${name}`,
      html,
      attachments,
    });
    if (error) return sendFailed(error);
  } catch (err) {
    return sendFailed(err);
  }

  return json(200, { ok: true });
}
