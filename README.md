# Hatid

**Biyahe natin. Bansa natin.**

Hatid is a premium lightweight passenger mobility frontend preview for Philippine roads. It currently demonstrates onboarding, route selection, ride booking, mock map/trip states, driver verification, live trip sharing, safety actions, support-ticket preview, receipts, transport-credit balance preview, account, and compliance-aware notes.

Live app: https://hatidph.vercel.app/

## Current status

This repository is a frontend product preview, not a production dispatch, payment, wallet, emergency, or support system.

Current phase: **Phase 9C — README and QA alignment**.

For the full handoff, read:

```txt
docs/PHASE_STATUS.md
docs/PRODUCTION_READINESS.md
docs/QA_CHECKLIST.md
```

## Completed phase summary

- Phase 1–5: Core passenger preview, mobile shell, booking flow, trip flow, safety center, bottom navigation, and visual polish.
- Phase 8A: Completed-trip loop, rating, feedback, receipt, rebook, return home.
- Phase 8B: Humanised trip transitions and cancellation confirmation.
- Phase 8C: Mock pickup/drop-off presets with route, fare, and ETA copy refresh.
- Phase 8D: Trusted contact edit/remove, PH mobile validation, support ticket status.
- Phase 8E: Runtime hardening attempt; active fallback deferred because the lightweight React shim caused build failure.
- Phase 8F: Production-readiness guardrails.
- Phase 9A: Zero-dependency smoke check in CI.
- Phase 9B: Phase status handoff document.
- Phase 9C: README and QA checklist alignment.

## Tech stack

- Vite
- React
- TypeScript
- Plain CSS through imported stylesheets
- Vercel deployment
- GitHub Actions build check

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Checks

```bash
node scripts/smoke-check.mjs
npm run build
```

The smoke check validates required files and key demo/legal guardrail copy. The production build runs TypeScript first, then Vite.

## Deployment

The app is connected to Vercel. Pushing to `main` triggers production deployment.

Production URL:

```txt
https://hatidph.vercel.app/
```

## Main files

```txt
src/App.tsx                       Main passenger app flow
src/components/BottomNav.tsx       Bottom navigation
src/components/DriverCard.tsx      Driver trust card
src/components/PhoneShell.tsx      Mobile shell
src/components/RouteMap.tsx        Simulated route map
src/components/SafetyModal.tsx     Modal system
src/lib/mockData.ts                Mock passenger, ride, fare, payment, route data
src/lib/tripState.ts               Trip stage model
src/styles.css                     Base styling
src/phase1.css                     Phase 1 and phase 2 UI/map styles
src/phase3-lite.css                Booking intelligence polish
src/phase4-lite.css                Safety action polish
src/phase5-lite.css                Premium visual polish
src/phase8-lite.css                Post-trip and phase 8 polish
public/manifest.json               PWA manifest
docs/QA_CHECKLIST.md               Manual QA flow
docs/PRODUCTION_READINESS.md       Production guardrails
docs/PHASE_STATUS.md               Current phase handoff
scripts/smoke-check.mjs            Zero-dependency repo smoke check
```

## Manual QA path

Use this path on an iPhone-sized viewport first:

```txt
Splash → Login → OTP → Profile → Permissions → Home → Search → Choose Ride → Active Trip → Completed → Receipt
```

Then test these support and safety flows:

```txt
Safety Center → Trusted Contacts → Edit Contact → Remove Contact → Share Trip → Report Issue → Driver Verification → Passenger Safety Guide
```

Then test route controls:

```txt
Home → Adjust pickup → Change drop-off → Choose Ride → Active Trip → Share Trip → Receipt
```

## Important limitations

- No real driver dispatch occurs.
- No real ride booking occurs.
- No payment is collected.
- Hatid Balance is transport-credit preview only, not an e-money wallet.
- Emergency/SOS actions are demo-only and do not call emergency services.
- All driver, route, fare, payment, support ticket, and receipt data is mock data.
- Production launch still requires legal, privacy, payment, transport compliance, support SOP, driver onboarding SOP, and emergency escalation review.

## Design direction

Keep the product premium but lightweight:

- Use the full `Hatid` wordmark only.
- Do not insert a sun or decorative mark inside the word.
- Avoid emoji-style primary icons.
- Prefer compact glyph chips and clean text hierarchy.
- Keep the app fast, light, and mobile-first.
