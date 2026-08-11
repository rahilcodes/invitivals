# Myinvite — Go-Live Checklist

Do these before spending a rupee on ads.

## 1. Must-do (5 minutes)

- [ ] **WhatsApp number** — open `src/pages/index.astro`, top of the file:
  `const WHATSAPP = '919999999999';` → replace with your real number
  (country code + digits, no `+`). Every buy button on the site routes here.
- [ ] **Email & Instagram** — same file, `EMAIL` and `INSTAGRAM` constants.
- [ ] **Testimonials** — the three quotes in `testimonials` are **sample copy**.
  Replace them with real customer reviews before running ads (ad platforms
  treat fabricated reviews as misleading, and customers can tell).
- [ ] **Pricing** — the `plans` array holds the prices and features. Adjust to
  your market before launch.

## 2. Deploy (10 minutes)

```bash
npm run build
```

- **Netlify (easiest):** drag the `dist/` folder onto https://app.netlify.com/drop
- **Vercel:** `npx vercel` — build command `npm run build`, output dir `dist`
- Connect your domain (e.g. `myinvite.in`) in the host's dashboard.
- After the domain is live, redeploy once so share links use the final URL.

## 3. Before ads go out

- [ ] Send yourself the link on WhatsApp — check the preview card looks right.
- [ ] Open every demo (`/hindu`, `/nikah`, `/sikh`, `/christian`, `/modern`, `/luxe`)
  on a real phone — this is what your ad traffic will do.
- [ ] Test one full WhatsApp flow: tap "Choose this design" → confirm the
  pre-filled message reaches your number.
- [ ] Add analytics if you want conversion data (Plausible/GA4 — one script tag
  in `src/pages/index.astro` `<head>`).
- [ ] Decide your ad landing URL: the homepage converts best for cold traffic;
  a specific demo (e.g. `/hindu`) works for targeted campaigns — the floating
  "Get this design — Myinvite" pill routes demo visitors to pricing.

## 4. Operating promise (what the site tells customers)

The site promises: 48-hour delivery · unlimited text revisions · 50% advance,
balance after approval · full refund if unhappy · 12 months hosting · replies
9 AM–11 PM. Keep those promises or edit the copy — trust is the product.

## 5. When an order comes in

1. Customer messages you with a design + plan name (pre-filled).
2. Send them the details checklist (names, dates, events, story, photos, music).
3. Copy the chosen template page, fill in their content, deploy to a link like
   `couple-name.myinvite.in` (subdomains on Netlify/Vercel are free).
4. For RSVP collection, wire the template's endpoint to a Google Sheet —
   the Apps Script recipe is in `SETUP.md`.
