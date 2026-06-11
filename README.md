# Hatid

**Biyahe natin. Bansa natin.**

Hatid is a premium lightweight passenger mobility frontend preview for Philippine roads. It currently demonstrates onboarding, ride booking, map/trip states, driver verification, live trip sharing, safety actions, receipts, balance preview, account, and compliance-aware notes.

Live app: https://hatidph.vercel.app

## Current status

This repository is a frontend product preview, not a production dispatch/payment/emergency system.

Completed phases:

- Phase 1: Navigation, browser back behavior, active trip exit guard, home polish
- Phase 2: Map realism, route progress, arriving-soon trip stage
- Phase 3: Booking intelligence, fare breakdown, payment choice, premium driver card
- Phase 4: Safety/trust actions, trusted contacts, share trip, support ticket, verification details
- Phase 5: Premium visual pass, icon cleanup, toast system, lighter UI polish
- Phase 6: PWA manifest, QA checklist, legal/compliance preview notes, deployment readiness

## Tech stack

- Vite
- React
- TypeScript
- CSS modules through standard imported stylesheets
- Vercel deployment

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The build script runs TypeScript first, then Vite production build.

## Deployment

The app is connected to Vercel. Pushing to `main` triggers production deployment.

Production URL:

```txt
https://hatidph.vercel.app
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
public/manifest.json               PWA manifest
docs/QA_CHECKLIST.md               Manual QA flow
docs/LEGAL_PREVIEW_NOTES.md        Legal/compliance preview notes
```

## Manual QA path

Use this path on iPhone-sized viewport first:

```txt
Splash → Login → OTP → Profile → Permissions → Home → Search → Choose Ride → Active Trip → Completed → Receipt
```

Then test these support flows:

```txt
Safety Center → Trusted Contacts → Share Trip → Report Issue → Driver Verification → Passenger Safety Guide
```

## Important limitations

- No real driver dispatch occurs.
- No payment is collected.
- Hatid Balance is transport-credit preview only, not an e-money wallet.
- Emergency/SOS actions are demo-only and do not call emergency services.
- All driver, route, fare, payment, and receipt data is mock data.
- Production launch still requires legal, privacy, payment, transport compliance, support SOP, and emergency escalation review.

## Design direction

Keep the product premium but lightweight:

- Use the full `Hatid` wordmark only.
- Do not insert a sun or decorative mark inside the word.
- Avoid emoji-style primary icons.
- Prefer compact glyph chips and clean text hierarchy.
- Keep the app fast, light, and mobile-first.
