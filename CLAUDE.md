# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Token Budget — Read First Every Session

**At the start of every prompt/session, read and apply `.claude/skills/token-budget.md`.**

Key rules in force:
- Front-load all file reads before large tool outputs
- Use `limit` + `offset` on Read calls for large files — never read more than needed
- Compact between logical phases (design → implementation → testing), never mid-implementation
- Save checkpoint to `.claude/state/pre-compact-checkpoint.json` before every compaction
- Model selection: Opus for architecture/debugging, Sonnet for business logic, Haiku for boilerplate

---

## Available Skills

All skills are in `.claude/skills/`. Invoke with `/skill-name`.

| Skill | Use when |
|---|---|
| `/token-budget` | Managing context in long sessions |
| `/senior-fullstack` | Full-stack feature implementation |
| `/senior-frontend` | UI/UX components, Tailwind, React |
| `/senior-backend` | API routes, auth, data layer |
| `/senior-architect` | System design decisions |
| `/senior-devops` | Docker, CI/CD, deployment |
| `/senior-qa` | Test strategy, coverage |
| `/simplify` | Code review — reuse, quality, efficiency |
| `/debug-issue` | Root cause analysis |
| `/perf-agent` | Lighthouse, Core Web Vitals |
| `/a11y-audit` | Accessibility review |
| `/epic-design` | Feature planning and breakdown |
| `/code-reviewer` | Thorough pre-merge review |
| `/refactor-safely` | Refactoring with regression protection |
| `/tdd-guide` | Test-driven development |
| `/senior-security` | Auth, JWT, security hardening |

---

## Commands

```bash
npm run dev        # Next.js dev server — localhost:3001
npm run build      # Production build → .next/
npm run start      # Run standalone production server
npm run lint       # ESLint
```

No test runner is configured yet.

---

## Project: PayPerHour — Next.js 16 App Router

Hotel booking by the hour. Migrated from React 19 + Vite SPA for 100/100 Lighthouse Performance + SEO.

### Tech Stack

| Concern | Decision |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| State | Redux Toolkit (auth/global) · URL `searchParams` for hotel filters |
| Auth | Custom JWT (`jose`) + `proxy.ts` — httpOnly cookie `pph_session` |
| UI | Tailwind CSS v4 (`@tailwindcss/postcss`) + shadcn/ui |
| Deployment | Self-hosted Node.js / Docker (`output: 'standalone'`) |

### Rendering Strategy

| Route | Strategy |
|---|---|
| `/` | SSG — fully static |
| `/hotels` | ISR `revalidate=3600` + URL `searchParams` (server-side filtering) |
| `/hotels/[id]` | SSG + `generateStaticParams` (50 pre-built pages) |
| `/login` | `'use client'` |
| `/owner-auth` | `'use client'` |
| `/owner/onboarding/*` | `'use client'` |

---

## Architecture

### Server vs Client boundary

Server Components can import Client Components, not the reverse. Components requiring `useState`, `useSelector`, `useRouter`, or event handlers must be `'use client'`.

- **Client:** `Header`, `FilterSidebar`, `SearchBar`, `FeaturedHotelCard`, `HotelGallery`, `HotelBookingPanel`, `StoreProvider`, all owner onboarding pages
- **Server:** `HeroSection`, `FeaturedHotels`, `Categories`, `Testimonials`, `Footer`, `TrendingCities`, `app/hotels/[id]/page.tsx`

### Auth

- `proxy.ts` (Next.js 16 — **not** `middleware.ts`) with export named `proxy` reads `pph_session` httpOnly cookie
- `/`, `/hotels`, `/hotels/[id]`, `/login`, `/owner-auth` are **public**
- Protected: `/owner/*`, `/bookings/*`, `/profile/*`, `/checkout/*`
- Use `jose` not `jsonwebtoken` — `jsonwebtoken` uses Node.js crypto and fails on Edge Runtime
- Two separate JWT routes: `POST /api/auth` (guest, role: "guest") and `POST /api/owner/auth` (owner, role: "owner")

### Redux Store

```
RootState = {
  auth: { user: User | null; role: "guest" | "owner" | null; isLoading: boolean }
  onboarding: { draftId, currentStep, completedSteps, status, ... }
}
```

- Persisted via `redux-persist` with SSR-safe noop storage on server
- `StoreProvider` wraps `app/layout.tsx`

### Filter state → URL (not Redux)

`/hotels?q=grand&minPrice=50&maxPrice=200&rating=4&amenities=WiFi,AC`

`FilterSidebar` calls `useRouter().push()`. `app/hotels/page.tsx` reads `searchParams` server-side and calls `filterHotels(hotelsData, searchParams)`.

### View-Model layer

Raw `Hotel` → `toHotelCardViewModel()` → `HotelCardViewModel`. UI never touches raw hotel data directly. Price labels use `₹` (rupees).

### Owner Onboarding

Multi-step wizard at `/owner/onboarding/[step]`. Draft/step/submit/status calls go to quicknestserver's Properties API via `propertiesApi` in `lib/api.ts`; remaining unbuilt pipelines (pincode lookup, file upload, GSTIN/IFSC validation) are mocked in `modules/owner/api.ts`. Steps: basics → location → rooms → photos → legal. State in `onboardingSlice`. Shared components: `WizardNav`, `FormSection`, `WizardStepper`.

### `@` path alias

`@` → project root (not `src/`). e.g. `@/components/client/Header`.

---

## Key Files

| File | Purpose |
|---|---|
| `proxy.ts` | Route protection middleware |
| `lib/auth.ts` | `signJWT` / `verifyJWT` using `jose` |
| `store/authSlice.ts` | User + role state |
| `store/onboardingSlice.ts` | Wizard progress state |
| `modules/hotels/view-model.ts` | `Hotel` → `HotelCardViewModel` |
| `modules/hotels/controller.ts` | `filterHotels()` + `buildHotelsPageViewModel()` |
| `lib/api.ts` | `authApi` + `propertiesApi` — real backend calls |
| `modules/owner/api.ts` | Remaining owner API stubs (pincode, uploads, GSTIN/IFSC) |
| `modules/owner/schemas/index.ts` | Zod schemas for all wizard steps |
| `modules/owner/constants.ts` | `PROPERTY_TYPE_VALUES`, `INDIAN_STATES`, labels |
| `data/hotelsData.ts` | 50 static hotel entries |
| `types/index.ts` | `Hotel`, `User`, `HotelCardViewModel`, `FilterParams` |

---

@AGENTS.md
