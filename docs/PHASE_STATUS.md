# Hatid Phase Status Handoff

This document summarizes what is currently implemented in the Hatid passenger preview and what remains intentionally blocked or deferred.

## Current live preview

Live app: https://hatidph.vercel.app/

The preview is a frontend-only passenger product demo. It is designed to show the end-to-end product feel, not to process real bookings, dispatch drivers, collect payments, or handle production support.

## Completed phases

### Phase 1 to Phase 5

Core passenger preview, mobile shell, booking screens, basic trip flow, safety center, bottom navigation, and design polish are in place.

### Phase 8A: Completed-trip loop

Implemented:

- Completed trip no longer dead-ends
- Rating flow
- Feedback chips
- View receipt action
- Rebook same trip action
- Return Home action
- Bottom navigation visible on completed and receipt screens

### Phase 8B: Humanised trip transitions and cancellation

Implemented:

- Slower driver-matching transitions
- More realistic trip-stage copy
- Cancel confirmation before ending search, assigned, arriving, arrived, or in-trip states

### Phase 8C: Mock route controls

Implemented:

- Pickup preset selection
- Drop-off preset selection
- Route/fare/ETA copy refreshes from selected preset
- Selection persists into home, booking, active trip, share trip, and receipt

### Phase 8D: Safety flow depth

Implemented:

- Trusted contact IDs
- PH mobile validation for trusted contacts
- Edit trusted contact
- Remove trusted contact confirmation
- Support ticket object with status, issue type, summary, and created time
- Safety Center shows ticket status after ticket creation

### Phase 8E: Runtime hardening attempt

Attempted but not active:

- Branded runtime fallback file was added
- Runtime wiring caused build failure due to the repo's lightweight React shim
- Runtime wiring was removed
- The unused boundary file is excluded from TypeScript build by wildcard

Current status: live app is green, but active error-boundary hardening is deferred.

### Phase 8F: Production-readiness guardrails

Implemented:

- Production readiness guardrails document
- Preview-only limits
- Payment and balance wording rules
- Location, trip sharing, safety, transport, and data privacy launch checklist

### Phase 9A: Repo smoke check

Implemented:

- Zero-dependency smoke-check script
- GitHub Actions runs smoke check before build
- Smoke check validates required files and key preview/legal guardrail copy

## Known limitations

- No real driver dispatch
- No real booking backend
- No payment integration
- No wallet ledger
- No location backend
- No persistent user account storage
- No production support backend
- No real emergency/SOS workflow
- No active telemetry wrapper
- No active error boundary
- No end-to-end browser test suite yet

## Next recommended phases

### Phase 9C: README and QA alignment

Update README and QA checklist so anyone opening the repo understands the current status, live URL, smoke-check command, and demo-only guardrails.

### Phase 9D: Manual QA pass

Run the passenger flow manually and document pass/fail notes:

- onboarding
- home
- destination selection
- pickup/drop-off presets
- ride selection
- active trip
- cancellation confirmation
- share trip
- driver verification
- completed trip
- rating
- receipt
- trusted contacts
- support ticket
- balance wording

### Phase 10A: Safe UI polish pass

Polish copy spacing, route cards, modal consistency, and lightweight premium feel without adding new architecture.

## Rule for future changes

Do not add external service integrations until the preview guardrails, legal/payment wording, and production-readiness notes stay accurate.
