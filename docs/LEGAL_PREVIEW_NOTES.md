# Hatid Preview Legal and Compliance Notes

This repository currently contains a frontend product preview. It is not yet a production transport, wallet, payment, emergency, or dispatch system.

## Demo-only limits

- No real driver dispatch occurs.
- No payment is collected.
- No wallet or e-money function is active.
- No emergency call or police/medical alert is triggered.
- All trip, driver, fare, and receipt data is mock data.

## Payments and credits

Hatid Balance is presented as transport credits only. It must not be treated as an e-money wallet, stored value account, remittance feature, peer-transfer feature, or cash-out product unless reviewed and implemented with licensed payment partners.

## Location and safety data

The UI assumes location is used for pickup, routing, active trip display, trusted contact sharing, support context, and receipts. Production must implement consent, retention rules, access control, and Philippine Data Privacy Act review before launch.

## Trusted contacts

Trusted contacts should receive trip details only when the passenger chooses to share a trip or triggers a confirmed emergency flow. Production must include consent copy and revocation controls.

## Emergency flow

Emergency/SOS actions are demo-only in this preview. Production should require confirmation, prevent accidental taps, record trip context, notify trusted contacts when selected, and comply with local emergency and safety procedures.

## Driver verification

Driver verification in this preview is mock data. Production must connect identity, vehicle, plate, licensing, safety status, and support escalation to verified operational systems.

## Launch requirement

Before production launch, Hatid needs legal review, data privacy review, payment provider review, transport compliance review, support SOPs, and emergency escalation SOPs.
