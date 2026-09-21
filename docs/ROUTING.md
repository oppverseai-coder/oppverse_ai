# Oppverse Route Architecture

> This route boundary is protected by `docs/DESIGN_AND_ROUTE_CONTRACT.md` and applies to every human and automated tool working in the repository.

## Permanent boundary

Oppverse has two distinct surfaces:

1. The public website at `/`.
2. The authenticated product workspace at `/app` and its supporting routes.

They share a codebase but do not share page ownership or application chrome.

## Route map

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Main-domain landing page |
| `/login` | Public | Existing-user authentication |
| `/signup` | Public | Account creation |
| `/onboarding` | Authenticated, incomplete profile | Post-signup profile setup |
| `/app` | Authenticated | Opportunity Universe and app home |
| `/discover` | Authenticated | Opportunity discovery |
| `/missions` | Authenticated | User missions |
| `/saved` | Authenticated | Saved opportunities |
| `/applications` | Authenticated | Application tracker |
| `/agent` | Authenticated | Oppverse AI Agent |
| `/profile` | Authenticated | Opportunity Profile |

## Implementation ownership

- `app/page.tsx`: public landing page only.
- `app/app/page.tsx`: authenticated Opportunity Universe only.
- `components/AppShell.tsx`: bypasses application chrome for `/` and authentication pages.
- `components/Sidebar.tsx`: hidden on `/`; Opportunity Universe links to `/app`.
- `components/BottomNav.tsx`: Opportunity Universe links to `/app`.
- `lib/supabase/middleware.ts`: protects `/app` and authenticated product routes, not `/`.

## Authentication flow

The intended first-time-user flow is:

`/signup` -> authenticated session -> `/onboarding` -> `/app`

Supabase email auto-confirm is enabled for seamless signup. Application code must not introduce a confirmation-email holding screen unless the product decision changes explicitly.

## Verification

Run:

```bash
npm run test:routes
npm run build
```

The route-contract test intentionally fails if the landing page is replaced, `/app` loses protection, `/` becomes protected, or primary application navigation points Opportunity Universe to `/`.
