# Oppverse Design and Route Contract

This document is a mandatory preservation contract for every human, coding agent, design agent, automation, migration tool, and deployment tool that works in this repository.

## Default rule

Do not redesign, rebrand, recolor, restructure, relocate, replace, or remove the established Oppverse interface or route architecture. A request to fix a bug, add a feature, change authentication, modify onboarding, update data, improve responsiveness, or deploy the application does not authorize visual or routing changes.

Changes to this contract require an explicit user request that names the exact protected visual or route behavior to change. Before editing, the agent must state the impact and limit the modification to that named behavior.

## Protected product identity

- Product name: `Oppverse AI`.
- Brand presentation: restrained text wordmark plus the existing Oppverse brand assets in `public/brand/`.
- UI typography: Inter for interface text and Sora for established display headings.
- Product palette: black, white, neutral grays, and restrained semantic status colors.
- Oppverse violet is the interaction accent, not a decorative background color.
- Current violet tokens are protected: dark `--accent: #8272e8`; light `--accent: #6757d7`.
- Active navigation, selected filters, primary actions, and focus states use the semantic violet tokens with white foregrounds.
- Inactive navigation and filters remain neutral. Do not make the entire interface purple.
- Do not introduce gradients, glow, neon, glassmorphism, decorative AI sparkles, emoji icons, or mixed icon families.
- Use the existing Lucide icon system. Do not substitute generated, decorative, or emoji iconography.

## Protected themes

Dark mode and light mode are equally supported product themes.

- Dark mode remains near-black with defined dark surfaces, readable light text, neutral borders, and violet selected states.
- Light mode remains a true-white workspace with subtly warm off-white navigation, white cards and controls, near-black text, neutral borders, and violet selected states.
- The public landing page at `/` retains its independent existing dark presentation and must not consume product theme overrides.
- Theme preference must persist and initialize before paint. Do not introduce a flash of the wrong theme.
- Do not replace semantic tokens with scattered hardcoded colors.

The protected token source is `app/globals.css`. Theme behavior is owned by `components/ThemeProvider.tsx` and the initialization logic in `app/layout.tsx`.

## Protected layout and behavior

- Preserve existing page purposes, information architecture, workflows, controls, and data behavior.
- Preserve the current application shell, sidebar behavior, header, mobile navigation, forms, cards, modals, and responsive breakpoints unless the user explicitly requests a named change.
- A styling task does not authorize product logic, backend, API, database, matching, eligibility, authentication, or data-model changes.
- A product-logic task does not authorize visual redesign.
- Do not copy ChatGPT, Linear, Notion, Vercel, Stripe, Raycast, Figma templates, or another product literally. References may inform restraint and quality only.

## Permanent route ownership

| Route | Permanent owner | Invariant |
| --- | --- | --- |
| `/` | Public landing page | Main-domain marketing page. Never replace it with the app and never redirect it to `/app`. |
| `/app` | Authenticated Opportunity Universe | Protected product home. Never move it into `app/page.tsx`. |
| `/login`, `/signup` | Public authentication | Must remain outside the authenticated application shell. |
| `/onboarding` | Authenticated onboarding | Successful signup proceeds here before `/app`. |
| `/discover`, `/missions`, `/saved`, `/applications`, `/agent`, `/profile` | Authenticated product | Must remain protected and inside the product shell. |

Protected ownership files:

- `app/page.tsx`: landing page only.
- `app/app/page.tsx`: authenticated Opportunity Universe only.
- `components/AppShell.tsx`: separates public/auth pages from product chrome.
- `components/Sidebar.tsx` and `components/BottomNav.tsx`: Opportunity Universe links to `/app`.
- `lib/supabase/middleware.ts`: protects product routes but never protects `/`.
- `scripts/verify-route-contract.mjs`: automated route invariant checks.

## Prohibited shortcuts

- Never replace the landing page while fixing the app.
- Never make `/` the authenticated dashboard.
- Never redirect the main domain directly to `/app`.
- Never apply product light-mode CSS to the landing page.
- Never remove dark mode or light mode.
- Never change the Oppverse wordmark, logo assets, typography, or violet accent as collateral work.
- Never globally recolor the application from a page-level request.
- Never run a formatter, generator, Figma import, theme tool, or component installer that overwrites protected files without reviewing its diff first.
- Never treat generated design code as authoritative over this contract or the existing codebase.

## Mandatory workflow

Before modifying UI, navigation, authentication, middleware, or routes:

1. Read `AGENTS.md`, this contract, and `docs/ROUTING.md`.
2. Inspect the current component and semantic tokens.
3. State which protected surface is affected.
4. Make the smallest scoped change.
5. Review the diff for unintended branding, theme, landing-page, or route changes.
6. Run `npx tsc --noEmit`.
7. Run `npm run test:routes`.
8. Run `npm run build` before deployment.
9. Verify `/` remains the landing page and `/app` remains the authenticated product home.
10. Verify both product themes when the change touches shared UI.

If a tool cannot guarantee these invariants, do not use that tool for the change.
