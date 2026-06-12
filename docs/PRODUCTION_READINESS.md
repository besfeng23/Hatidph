# Hatid Production Readiness Guardrails

This document keeps the passenger preview honest while the product is still frontend-only.

## Current status

Hatid is a polished product preview. It uses mock data, local UI state, and demo flows only.

The preview must not be presented as a live transport, payment, support, or dispatch service until the required operating, data, partner, and support reviews are complete.

## Demo-only limits

The current preview does not perform real-world actions:

- No real ride booking
- No real driver dispatch
- No real fare charging
- No stored wallet value
- No peer-to-peer transfers
- No real payment processing
- No production support case handling
- No real-time location backend
- No production identity verification

## Payment and balance wording

Hatid Balance is currently transport-credit UI only.

Before enabling cash-in, stored credits, refunds, payouts, or partner payments, the product needs:

- Licensed payment partner review
- Reconciliation process
- Refund and dispute process
- Receipt numbering process
- Fraud monitoring process
- Customer support process
- Data retention policy

Until then, buttons for top-up, transfer, payout, refund, and cash-in should remain disabled, clearly marked as preview-only, or routed to an informational modal.

## Location and trip sharing

Location and trip-sharing features must be treated as sensitive user-data workflows.

Before production release, the product needs:

- User consent copy
- Clear sharing controls
- Ability to stop sharing
- Contact edit and removal flow
- Audit trail for shared links
- Expiry rules for shared links
- Support workflow for route or identity disputes

## Safety and support flows

The current safety center is a preview. Before production use, it needs operational SOPs, human support coverage, escalation paths, and legal review.

Required workflows:

- Support ticket intake
- Ticket status lifecycle
- Driver identity dispute review
- Route dispute review
- Lost item process
- Passenger complaint handling
- Driver complaint handling
- Incident review process

## Transport operations

Before launch, the operating model must be reviewed for Philippine transport rules and local partner requirements.

Required work:

- Driver onboarding process
- Vehicle document review
- Plate and vehicle matching process
- Driver suspension process
- Service-area rules
- Fare policy rules
- Cancellation rules
- Passenger terms
- Driver terms

## Data privacy

Before release, the app needs a privacy implementation review covering:

- Account data
- Phone numbers
- Location data
- Trip records
- Receipts
- Trusted contacts
- Support tickets
- Shared trip links
- Deletion requests
- Retention period

## Launch checklist

Do not launch production operations until these items are complete:

- Legal review
- Transport compliance review
- Payment partner review
- Data privacy review
- Support SOP approval
- Driver onboarding SOP approval
- Incident response SOP approval
- QA for passenger booking loop
- QA for support loop
- QA for privacy and deletion flows
- Production monitoring plan
- Production rollback plan

## Copy rule

Any screen that appears functional but is not connected to production infrastructure must use preview-safe wording such as:

- Preview only
- Coming soon
- Requires partner integration
- Demo status
- No real transaction is processed

Avoid copy that implies live booking, live payment, live dispatch, or production support until those systems exist.
