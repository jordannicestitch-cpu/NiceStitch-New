# Nice Stitch website

DTF, UV DTF, DTG, screen printing, embroidery, banners and signs — 1301 S Main St, Unit 103, Los Angeles CA 90015.

**Live: https://www.nicestitchla.com** (apex redirects to www; HTTPS issued by Vercel). Domain registered through Vercel, renews Nov 2027.

Hosted entirely on Vercel. Quote-request only — no cart, no checkout.

Static pages plus `api/quote.js`, a serverless function that receives the quote form (with artwork uploads) and emails it via [Resend](https://resend.com).

> The Vercel project is still named `kb-studios/quote-service` — a leftover from a scrapped "BT Studios" rebrand and an earlier Shopify-plus-backend split. Cosmetic only; renaming it in the dashboard won't affect the domain.

## Pages

| File | URL | Notes |
|---|---|---|
| `index.html` | `/` | Hero, six service cards, why-us, CTA |
| `services.html` | `/services.html` | One section per service, anchored (`#dtf`, `#uv-dtf`, `#dtg`, `#screen-printing`, `#embroidery`, `#banners`) |
| `pricing.html` | `/pricing.html` | Full rate tables — see Pricing below |
| `gallery.html` | `/gallery.html` | "Our Work" — **empty, and deliberately not in the nav** until there are real photos |
| `about.html` | `/about.html` | Placeholder copy |
| `contact.html` | `/contact.html` | Address, hours, phone |
| `quote.html` | `/quote.html` | The quote form |
| `404.html` | — | Not found |

## How it's wired together

Everything is same-origin: pages, CSS and JS at the project root and `/assets`, and the quote form posts to `/api/quote` on the same domain. No CORS complexity, no separate backend host.

## Deploying

```bash
npx vercel --prod
```

**Verify against the live file, not the command output.** The Vercel CLI has twice logged itself out (including on auto-update) and printed a credentials error while still exiting 0 — a deploy can appear to succeed and ship nothing:

```bash
curl -s "https://www.nicestitchla.com/assets/css/style.css?cb=$(date +%s)" | grep something-you-just-changed
```

If it says `No existing credentials found`, run `npx vercel login` and approve the device code.

To preview locally, either `npx vercel dev --listen 3500` (also serves `/api/quote`), or for static-only changes `python3 -m http.server 3600` from the repo root.

## Environment variables (Vercel → Settings → Environment Variables)

Env var changes need a redeploy to take effect.

- `NOTIFY_EMAIL` — where quote requests land. Currently `jordan.nicestitch@gmail.com`. Change it here, no code edit.
- `RESEND_API_KEY` — from Resend → API Keys. Only shown once at creation; the truncated value in Resend's table is **not** the key.
- `FROM_EMAIL` — currently `Nice Stitch Quotes <onboarding@resend.dev>`, Resend's sandbox sender. **See the Resend section below — this is the most important outstanding item.**
- `ALLOWED_ORIGIN` — `https://www.nicestitchla.com`.
- `MAX_UPLOAD_BYTES` — optional, defaults to 25MB. Resend caps attachments near 40MB, so don't exceed ~35MB.

## Resend — outstanding

The sender is still Resend's sandbox address, which has two real consequences:

1. Quote emails are **likely to hit spam**.
2. Resend will **only deliver to the Resend account's own email**. If `NOTIFY_EMAIL` is ever pointed anywhere else, quotes silently stop arriving.

The fix, now that the domain exists: verify `nicestitchla.com` in Resend (Domains → Add Domain, then add the DNS records — the domain is on Vercel DNS), and set `FROM_EMAIL` to something like `Nice Stitch Quotes <quotes@nicestitchla.com>`.

## Editing shop info

One file: [`assets/js/site-config.js`](assets/js/site-config.js) — name, phone, email, address, hours, trust-bar points, social links. Every page reads from it. Phone and email auto-hide anywhere they're left blank (the public contact email is currently blank).

## Branding

- Logo lives in `assets/img/`: `ns-wordmark.png` (header), `ns-logo.png` / `ns-logo-light.png` (full lockup, dark/light), `favicon.png`.
- These were colour-keyed out of a JPEG, so they're **raster, not vector** — they'll soften at large sizes. Get the mark redrawn as vector before any banner or signage use.
- Palette is CSS custom properties at the top of `assets/css/style.css`: brand blue `#79cce4` (sampled from the logo), deep blue `#0b2a38` for dark surfaces, black for text. Primary buttons are brand blue with black text, mirroring the logo.

## Photos

In `assets/img/`:

| File | Used on | Shows |
|---|---|---|
| `hero.jpg` | homepage hero | screen printing station |
| `dtf.jpg` | Services → DTF | heat press with a printed tee |
| `uv-dtf.jpg` | Services → UV DTF | vinyl decal on a hard surface |
| `dtg.jpg` | Services → DTG | a DTG printer mid-print (Epson-branded) |
| `screen-printing.jpg` | Services → Screen Printing | screen printing in a workshop |
| `embroidery.jpg` | Services → Embroidery | multi-head embroidery machine |
| `banners.jpg` | Services → Banners | large-format vinyl equipment |

**All licensed stock from [Pexels](https://www.pexels.com/license/)** — free commercially, no attribution — standing in for photos of the actual shop. To swap: keep the filenames, drop replacements into `assets/img/`. Landscape works best; service images crop to 4:3, hero crops wide. The hero filename is set via `--hero-image` in `index.html`.

Two notes: the DTG photo shows an **Epson** machine, which may not match the shop's actual printer; and the embroidery photo has more than six heads.

## Gallery

`gallery.html` is built and styled (filter buttons per service, click-to-enlarge lightbox) but **has no entries and is not linked in the nav** — an empty portfolio is worse than none. To populate: drop photos in `assets/img/work/` and add entries to `assets/js/gallery.js` (see the comment block at the top). Add the nav link once there are a few. Only real jobs belong here — the page claims "we made these."

## Pricing

`pricing.html` is transcribed from the shop's price sheet (kept outside this repo). Prices are hardcoded — when the sheet changes, update the tables there **and** the "from" prices in `index.html` (`.service-card__price`) and `services.html` (`.service-detail__price`).

UV DTF is sold on the site but wasn't on the price sheet, so it reads "quoted per job" rather than an invented number.

## Still outstanding

- **Resend domain verification** — see above. Highest impact.
- **Public contact email** — blank, so that row is hidden sitewide.
- **About page** — still placeholder text, needs the real shop story.
- **Gallery** — needs photos of actual work.
- **Photography** — all stock; the shop's own photos would beat every one.
- **UV DTF pricing** — missing from the price sheet.
- **Google Business Profile** — if one exists under the old branding, rename rather than recreate, so reviews and local ranking carry over.
