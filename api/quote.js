const { readFileSync, unlink } = require('fs');
const { formidable } = require('formidable');
const { Resend } = require('resend');

const MAX_TOTAL_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 25 * 1024 * 1024);

// Mirrors the service_type values in quote.html, so the notification email reads
// "UV DTF" rather than "uv_dtf".
const SERVICE_LABELS = {
  dtf: 'DTF Transfers / Gangsheets',
  uv_dtf: 'UV DTF',
  dtg: 'DTG Printing',
  screen_print: 'Screen Printing',
  embroidery: 'Embroidery',
  banner: 'Banners / Signage',
  other: 'Not sure / Multiple'
};

function setCors(res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function firstValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

// Receives the Nice Stitch quote-request form (multipart, with artwork files)
// and emails it to NOTIFY_EMAIL via Resend. NOTIFY_EMAIL is an env var on this
// Vercel project, not a theme setting — change it anytime in the Vercel
// dashboard without touching the Shopify theme.
module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  // Trim: pasting a key into a dashboard field often carries a trailing newline,
  // which makes an otherwise-valid key fail auth.
  const notifyEmail = (process.env.NOTIFY_EMAIL || '').trim();
  const fromEmail = (process.env.FROM_EMAIL || '').trim();
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();

  if (!notifyEmail || !fromEmail || !resendApiKey) {
    console.error('Quote service misconfigured: set NOTIFY_EMAIL, FROM_EMAIL, and RESEND_API_KEY in Vercel project env vars.');
    sendJson(res, 500, { error: 'Quote service is not configured yet.' });
    return;
  }

  const form = formidable({
    multiples: true,
    maxTotalFileSize: MAX_TOTAL_BYTES,
  });

  let fields;
  let files;
  try {
    [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, parsedFields, parsedFiles) => {
        if (err) reject(err);
        else resolve([parsedFields, parsedFiles]);
      });
    });
  } catch (err) {
    console.error('Failed to parse quote form submission', err);
    sendJson(res, 400, { error: 'Could not read the submitted form. Check file sizes and try again.' });
    return;
  }

  const name = firstValue(fields.name);
  const email = firstValue(fields.email);
  const company = firstValue(fields.company);
  const phone = firstValue(fields.phone);
  const serviceType = firstValue(fields.service_type);
  const quantity = firstValue(fields.quantity);
  const deadline = firstValue(fields.deadline);
  const details = firstValue(fields.details);

  if (!name || !email || !serviceType) {
    sendJson(res, 400, { error: 'Name, email, and service type are required.' });
    return;
  }

  const artworkFiles = toArray(files.artwork).filter((file) => file && file.size > 0);

  let attachments = [];
  try {
    attachments = artworkFiles.map((file) => ({
      filename: file.originalFilename || 'artwork',
      content: readFileSync(file.filepath).toString('base64'),
    }));
  } catch (err) {
    console.error('Failed to read uploaded artwork', err);
    sendJson(res, 500, { error: 'Failed to process uploaded artwork.' });
    return;
  }

  const resend = new Resend(resendApiKey);

  const summaryRows = [
    ['Name', name],
    ['Company / team', company],
    ['Email', email],
    ['Phone', phone],
    ['Service', SERVICE_LABELS[serviceType] || serviceType],
    ['Quantity', quantity],
    ['Needed by', deadline],
  ].filter(([, value]) => value);

  const htmlRows = summaryRows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px;font-weight:600;">${escapeHtml(label)}</td><td style="padding:4px 12px;">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  const html = `
    <h2>New quote request — Nice Stitch</h2>
    <table>${htmlRows}</table>
    <p><strong>Details:</strong></p>
    <p>${escapeHtml(details).replace(/\n/g, '<br>')}</p>
    <p>${artworkFiles.length} artwork file(s) attached.</p>
  `;

  try {
    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      replyTo: email,
      subject: `New quote request from ${name}`,
      html,
      attachments,
    });
    if (sendError) throw sendError;
  } catch (err) {
    console.error('Failed to send quote email', err);
    sendJson(res, 502, { error: 'Could not send the quote request email.' });
    return;
  } finally {
    artworkFiles.forEach((file) => {
      unlink(file.filepath, () => {});
    });
  }

  sendJson(res, 200, { ok: true });
};
