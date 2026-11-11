<div align="center">

# 🧵 Nice Stitch

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=22&duration=3000&pause=1000&color=0F7BA3&center=true&vCenter=true&width=600&height=50&lines=DTF+%C2%B7+UV+DTF+%C2%B7+DTG;Screen+Printing+%C2%B7+Embroidery;Banners+%26+Signage;LA+Fashion+District" alt="Typing SVG" />

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-0F7BA3?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-hosted-000000?style=for-the-badge&logo=vercel&logoColor=white)

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="line" />

**Website for Nice Stitch — custom printing and embroidery at 1301 S Main St, Unit 103, Los Angeles CA 90015. Quote-request only: no cart, no checkout.**

</div>

## Overview

This is the Next.js rebuild of the original static site. Pages, copy, prices and styling were ported 1:1; every page was compared against the original in a browser at desktop and phone widths.

| Route | Notes |
|---|---|
| `/` | Hero, six service cards, why-us, call to action |
| `/services` | One section per service, anchored (`#dtf`, `#uv-dtf`, `#dtg`, `#screen-printing`, `#embroidery`, `#banners`) |
| `/pricing` | Full rate tables |
| `/about` | Placeholder copy — needs the real shop story |
| `/contact` | Address, hours, phone |
| `/quote` | Quote form with artwork upload |
| `/gallery` | "Our Work" — empty, and deliberately not in the nav until there are real photos |
| `/api/quote` | Receives the form and emails it through [Resend](https://resend.com) |

The old `/<page>.html` addresses redirect permanently to the routes above.

## Setup

Requires Node.js 22 or later and pnpm.

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000
```

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Local development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm test` | Unit tests for the quote endpoint |

## Environment variables

Set these in Vercel under Settings → Environment Variables. A change needs a redeploy to take effect.

| Variable | Purpose |
|---|---|
| `NOTIFY_EMAIL` | Where quote requests are sent |
| `RESEND_API_KEY` | Resend API key (shown once, at creation) |
| `FROM_EMAIL` | Sender address; must be on a domain verified in Resend |
| `ALLOWED_ORIGIN` | `https://www.nicestitchla.com` |
| `MAX_UPLOAD_BYTES` | Optional. Server-side artwork limit, default 4 MB |

Until the first three are set, the quote form shows its error message and the endpoint answers `500 Quote service is not configured yet.`

<details>
<summary><b>Editing the site</b></summary>

### Shop info
One file: [`src/lib/site-config.ts`](src/lib/site-config.ts) — name, phone, email, address, hours, trust-bar points, social links. Phone, email and social links disappear everywhere they are left blank (the public email is currently blank).

### Prices
Prices are hardcoded. When the price sheet changes, update the tables in [`src/app/pricing/page.tsx`](src/app/pricing/page.tsx) **and** the "from" prices in [`src/app/page.tsx`](src/app/page.tsx) and [`src/app/services/page.tsx`](src/app/services/page.tsx).

UV DTF is not on the price sheet, so it reads "quoted per job".

### Photos
In `public/assets/img/`. All are licensed stock from [Pexels](https://www.pexels.com/license/), standing in for photos of the shop. To swap one, keep the filename and replace the file. Landscape works best; service images crop to 4:3.

### Gallery
Drop photos of real jobs into `public/assets/img/work/` and add an entry per photo in [`src/lib/work.ts`](src/lib/work.ts). The page joins the sitemap once it has entries; add the nav link in `site-config.ts` at the same time. Only real Nice Stitch work belongs there.

### Branding
The palette is CSS custom properties at the top of [`src/app/globals.css`](src/app/globals.css): brand blue `#79cce4`, deep blue `#0b2a38`. The logos are raster files keyed out of a JPEG and will soften at large sizes; get the mark redrawn as vector before banner or signage use.

</details>

<details>
<summary><b>Changes from the original site</b></summary>

- **Artwork limit is 4 MB, not 25 MB.** Vercel rejects any request over 4.5 MB before the quote function runs, so the old limit could never be met. Accepting larger files needs direct-to-storage uploads.
- **Quotes without artwork are accepted.** The new endpoint ignores the empty file part a browser sends when no file is chosen.
- **Required fields are checked in the browser** before the form is sent.
- **Shop details are in the page HTML** instead of being filled in by script after load.
- **Clean URLs**, with permanent redirects from the old `.html` addresses.
- **Added** `sitemap.xml`, `robots.txt`, and keyboard access for the gallery.

</details>

## Deployment

```bash
vercel            # preview
vercel --prod     # production
```

Check the deployed page itself after a deploy, not only the command output.

## Still outstanding

- **Resend domain verification.** The sender is Resend's sandbox address, which lands in spam and only delivers to the Resend account's own inbox. Verify `nicestitchla.com` in Resend and set `FROM_EMAIL` to an address on it.
- **Public contact email** — blank, so that row is hidden sitewide.
- **About page** — placeholder text.
- **Gallery and photography** — needs the shop's own photos.
- **UV DTF pricing** — missing from the price sheet.

## Support

Built and maintained by PRSMTECH.

<div align="center">

[![Back to top](https://img.shields.io/badge/↑_Back_to-Top-0F7BA3?style=for-the-badge)](#-nice-stitch)
[![Live site](https://img.shields.io/badge/Live-nicestitchla.com-79CCE4?style=for-the-badge&logoColor=white)](https://www.nicestitchla.com)

<br />

**Last Updated**: November 2026 | **Status**: ✅ Rebuilt on Next.js · production cutover pending

<img src="https://capsule-render.vercel.app/api?type=waving&color=0F7BA3&height=80&section=footer" width="100%" alt="footer" />

</div>
