# Hatid Phase 6 QA Checklist

Use this checklist after every UI or flow change.

## Build checks

- Run `npm install`.
- Run `npm run build`.
- Confirm there are no TypeScript errors.
- Confirm Vite outputs a production build.

## Core passenger flow

- Open the app from the splash screen.
- Complete phone input using a valid PH number format.
- Complete OTP with any six digits.
- Complete profile and permissions.
- From Home, open destination search.
- Pick a popular destination.
- Choose each ride type: Car, Moto, XL.
- Change pickup instruction.
- Change payment method.
- Confirm a ride.

## Active trip flow

- Confirm search moves to assigned, arriving, arrived.
- Start trip demo.
- Move to arriving soon.
- Complete trip.
- Submit a rating.
- Open receipt.

## Safety and trust

- Add a trusted contact.
- Generate a live trip link.
- Copy the trip link.
- Send to trusted contacts.
- Create a support ticket.
- Open driver verification.
- Read passenger safety guide.
- Confirm emergency action stays demo-only.

## Navigation and back behavior

- Test bottom nav on Home, Trips, Balance, Safety, Account.
- Test back button from Search, Trusted Contacts, Share Trip, Report Issue, Driver Verification, Terms, Safety Guide.
- During an active trip, attempt to leave and confirm the active-trip exit guard appears.

## Visual QA

- Confirm no broken logo or sun-in-wordmark issue.
- Confirm no obvious emoji icons remain in primary navigation or main booking surfaces.
- Confirm text fits on iPhone-sized viewport.
- Confirm bottom nav does not block primary actions.
- Confirm toast appears and disappears.

## PWA metadata

- Confirm `/manifest.json` loads.
- Confirm `theme-color` is `#0033CC`.
- Confirm the app can be added to home screen using the browser install flow where supported.

## Known limitations

- This is still a frontend preview.
- No real ride dispatch occurs.
- No emergency call occurs.
- Wallet is transport-credit preview only and not an e-money wallet.
- Payment integrations are placeholders until licensed provider integration is implemented.
