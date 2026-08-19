# quicknestweb — history & context

> Handoff doc for developers picking up this repo. Complements `CLAUDE.md`
> (coding rules / architecture) and `AGENTS.md`. Last updated: 2026-08.
> NOTE: the npm package is still named `payperhour-next` (pre-rebrand); the
> product/brand is **EzyHotels.com**.

---

## What this is

The **public storefront** (guest-facing website) for **EzyHotels.com** — book
hotels by the hour, "Pay Less, Stay More". Next.js 16 App Router, TypeScript,
Tailwind v4. Runs on **port 3001**. SSG/ISR for SEO (targets 100/100 Lighthouse).

## The three apps

| Repo | Role | Port |
|------|------|------|
| quicknestserver | Backend API + DB | 4000 |
| **quicknestweb** (this) | Public storefront (guests) | 3001 |
| quicknestportal | Owner / Admin / Support portal | 3000 |

This app calls the backend at `:4000` (see `lib/api.ts`). Guest auth uses a
custom JWT (`jose`) + `proxy.ts` (Next 16 middleware, **not** `middleware.ts`)
with the `pph_session` httpOnly cookie.

## Current state

- Full storefront: home, `/hotels` list (server-side filter via `searchParams`),
  `/hotels/[id]`, booking flow, `/booking-confirm`, login/register, terms,
  privacy.
- **Real booking loop wired to the backend**: create booking → **payment
  (Layer C sandbox)** → confirm. `app/payment/page.tsx` runs the real gateway
  flow: `createPaymentOrder` → `simulatePayment` (sandbox checkout) →
  `verifyPayment`. Client (`lib/api.ts`) exposes those; the old `confirmPayment`
  is gone.
- `data/hotelsData.ts` holds **50 static demo hotels**; the list page mixes
  these with real backend properties (real ones drive the true book→pay flow).

## Rebrand (this session)

- **EzyHotels.com** brand everywhere: header/footer wordmark, page titles/OG,
  `metadataBase`, sitemap, robots, canonicals → `ezyhotels.com`; testimonials,
  terms/privacy, promo `EZY10`.
- **Brand color `#F05A00`** — the whole Tailwind `orange-*` scale is
  reharmonized around `orange-600 = #F05A00` in `app/globals.css`.
- **Logo**: `components/brand/EzyLogo.tsx`. `EzyMark` renders the official pin
  mark PNG from `/public` via `next/image`; `EzyMark dark` uses the white-bed
  variant for dark surfaces (the footer). Assets: `public/ezyhotels-mark.png`
  (light), `public/ezyhotels-mark-dark.png` (dark), `public/ezyhotels-logo.png`
  (full lockup). Favicon: `app/icon.png`.
- Contact number: **+91 94926 91010** (header, mobile drawer, booking-confirm).
- Homepage: **Exclusive Deals is commented out** in `app/page.tsx` (re-enable
  when deals are ready); **Trending Cities** now shows Indian cities (Mumbai,
  Delhi, Bengaluru with skyline, Hyderabad with Charminar) with ₹ pricing.

## How to run

**Prerequisites:** Node 20. For live data, the backend must be running (see
`quicknestserver/history-context.md` → docker compose + `start:dev`).

```bash
npm install
npm run dev        # → http://localhost:3001
npm run build      # production build (validates SSG prerender)
npm run lint
```

- The **homepage and static content render without the backend** (SSG + static
  hotels). Live data (real backend hotels, login, booking, payment) needs the
  API on `:4000`.
- Allowed remote image hosts are whitelisted in `next.config` `images.remotePatterns`
  (add new CDNs there or `next/image` will 400).

## Gotchas / watch-outs

- Payment is **sandbox** — nothing is charged; the "Pay ₹X" button runs the real
  order→verify flow against the sandbox adapter. Tell demo viewers up front.
- For demos, prefer **logging in** over fresh-registering, and drive to a **real
  approved** backend property (not a static demo hotel) to show the true loop.
- No test runner is configured here yet.

## Next steps / TODO

- Point image/OG hosts and any remaining copy at production.
- Re-enable Exclusive Deals when real deals exist.
- Going forward: **feature branches + PRs** (this session went straight to
  `master` as a one-time catch-up).

## Related

- Backend + DB setup: `quicknestserver/history-context.md`
- Portal: `quicknestportal/history-context.md`
