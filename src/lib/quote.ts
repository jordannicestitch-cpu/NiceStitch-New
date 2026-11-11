// Shared by the quote form (browser) and the /api/quote Route Handler
// (server), so the two can't drift apart.

// The "Service needed" choices. `value` is what the form submits; `label` is
// shown in the dropdown and in the notification email, so the shop reads
// "UV DTF" rather than "uv_dtf".
export const QUOTE_SERVICE_OPTIONS = [
  { value: "dtf", label: "DTF Transfers / Gangsheets" },
  { value: "uv_dtf", label: "UV DTF" },
  { value: "dtg", label: "DTG Printing" },
  { value: "screen_print", label: "Screen Printing" },
  { value: "embroidery", label: "Embroidery" },
  { value: "banner", label: "Banners / Signage" },
  { value: "other", label: "Not sure / Multiple" },
] as const;

// Falls back to the submitted value when it isn't one of the known options.
export function quoteServiceLabel(value: string): string {
  return (
    QUOTE_SERVICE_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}

// Combined size limit for artwork uploads. Vercel Functions reject request
// bodies over 4.5 MB before the Route Handler runs, so the limit sits just
// under that, leaving room for the other form fields and multipart framing.
// The browser always checks against this value; the server checks against it
// unless the MAX_UPLOAD_BYTES env var says otherwise.
const QUOTE_MAX_UPLOAD_MB = 4;
export const QUOTE_MAX_UPLOAD_BYTES = QUOTE_MAX_UPLOAD_MB * 1024 * 1024;
// How the limit is written in the form's help text and error message.
export const QUOTE_MAX_UPLOAD_LABEL = `${QUOTE_MAX_UPLOAD_MB}MB`;
