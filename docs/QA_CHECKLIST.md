# Hatid QA Checklist

Use this checklist after every UI, copy, routing, safety, balance-preview, or documentation change.

## Build checks

- Run `npm install`.
- Run `node scripts/smoke-check.mjs`.
- Run `npm run build`.
- Confirm there are no TypeScript errors.
- Confirm Vercel deployment returns success.

## Core passenger flow

- Open the app from the splash screen.
- Complete phone input using a valid PH number format.
- Complete OTP with any six digits.
- Complete profile and permissions.
- Confirm Home loads with pickup and destination copy.
- Open destination search.
- Pick a popular destination.
- Choose each ride type: Car, Moto, XL.
- Change pickup instruction.
- Change payment method.
- Confirm a ride.

## Mock route controls

- From Home, open Adjust pickup.
- Select each pickup preset.
- Confirm pickup copy updates on Home.
- From Home or Choose Ride, open Change drop-off.
- Select each destination preset.
- Confirm ETA, fare, traffic, and route copy update.
- Confirm selected route persists into Choose Ride, Active Trip, Share Trip, and Receipt.

## Active trip flow

- Confirm search moves to assigned, arriving, arrived.
- Confirm the trip does not feel instant or jumpy.
- Start trip demo.
- Move to arriving soon.
- Complete trip.
- Submit a rating.
- Select feedback chips.
- Save rating.
- Open receipt.
- Rebook same trip.
- Return Home.

## Cancellation behavior

- Cancel during searching and confirm modal copy is clear.
- Cancel after driver accepted and confirm warning copy appears.
- Cancel while driver is approaching and confirm warning copy appears.
- Cancel after driver arrived and confirm warning copy appears.
- Try leaving Active Trip through bottom navigation and confirm active-trip exit guard appears.
- Confirm Share Trip remains available from the exit guard.

## Safety and trust

- Add a trusted contact using a valid PH mobile number.
- Try an invalid trusted-contact number and confirm save is blocked.
- Edit an existing trusted contact.
- Cancel contact edit.
- Remove a trusted contact and confirm the removal modal appears.
- Generate a live trip link.
- Copy the trip link.
- Send to trusted contacts.
- Create a support ticket.
- Confirm Safety Center shows support ticket status.
- Open ticket status from Safety Center.
- Open driver verification.
- Read passenger safety guide.
- Confirm the safety action remains clearly marked as demo-only.

## Receipt and support

- Confirm receipt shows selected route, driver, ride type, payment method, and fare.
- Confirm Download / Share receipt is preview-only.
- Confirm Report Issue can be opened from completed trip and receipt.
- Confirm created ticket includes issue type and summary.

## Balance-preview wording

- Confirm Hatid Balance is described as transport credits.
- Confirm Hatid Balance does not claim to be a regulated stored-value product.
- Confirm Send remains disabled.
- Confirm Add ride credits routes to informational copy only.
- Confirm no screen claims live transaction handling.

## Navigation and back behavior

- Test bottom nav on Home, Trips, Balance, Safety, Account.
- Test bottom nav on Completed and Receipt.
- Test back button from Search, Trusted Contacts, Share Trip, Report Issue, Driver Verification, Terms, Safety Guide.
- During an active trip, attempt to leave and confirm the active-trip exit guard appears.

## Visual QA

- Confirm no broken logo or sun-in-wordmark issue.
- Confirm the wordmark is the complete word `Hatid`.
- Confirm no obvious emoji icons remain in primary navigation or main booking surfaces.
- Confirm text fits on iPhone-sized viewport.
- Confirm bottom nav does not block primary actions.
- Confirm toast appears and disappears.
- Confirm route modal, cancellation modal, and support modal feel consistent.

## PWA metadata

- Confirm `/manifest.json` loads.
- Confirm `theme-color` is `#0033CC`.
- Confirm app name is `Hatid - Premium Mobility` in manifest.
- Confirm the app can be added to home screen using the browser install flow where supported.

## Documentation checks

- Confirm `docs/PHASE_STATUS.md` matches current work.
- Confirm `docs/PRODUCTION_READINESS.md` still clearly says the preview is not a live operating service.
- Confirm README mentions the live URL, smoke check command, limitations, and manual QA path.

## Known limitations

- This is still a frontend preview.
- No real ride dispatch occurs.
- No real booking backend exists.
- Safety actions are demo-only.
- Balance is transport-credit preview only.
- Provider integrations are placeholders until licensed partner integration is implemented.
- Support tickets are local preview state only.
- Active runtime fallback is deferred.
- Telemetry wrapper is deferred.
