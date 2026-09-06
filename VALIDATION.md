# Validation and boundaries

Completed locally:

- Eight Node tests passed against the payment implementation with mocked Firebase transactions and mocked Razorpay responses.
- Tests cover the extracted pricing/slabs/category commissions, trusted catalog checks, malformed quantities and cart tampering, exact HMAC, wrong owner/order/amount/currency, captured versus authorized payment, concurrent creates, repeated verification, webhook replay, missed callback recovery, late failed/captured events, partial/full refunds, COD totals and one-time delivery ledger crediting.
- All 58 nonempty executable inline scripts in the four supplied pages parse, as do all added browser modules.
- Installed backend dependencies and generated a lockfile. The real Firebase/Razorpay module exports load locally; eight function exports are present.
- Tests ran on local Node 24.19.0; deployment package targets Node 22. Node 22 acceptance is still required.

Not verified:

- Firebase emulator rules/transactions, deployed IAM/rules/indexes, real Razorpay Test Mode payments, actual webhook delivery, authenticated browser UI, assignment/tracking, or live vendor/admin/rider workflows.
- Actual existing backend/functions/rules were not supplied. The rules fragment is guidance for a required merge, not a deployed security guarantee.
- Cross-browser/device inventory and idempotency beyond the same checkout ID. Independent checkout IDs are intentionally separate orders.

Dependency audit: installation and compatible `npm audit fix` report **12 moderate advisories**, through transitive `qs` and `uuid` dependencies in the Firebase stack. No high/critical findings were reported. The suggested force fix downgrades Firebase packages across major versions; it was not applied. Resolve/review these dependency advisories before production deployment. The package is staged and checkout disabled by default.

No deployment, real payment, refund, payout or credential configuration was performed.

Run `npm test` from `functions/` to reproduce the local mocked tests. Run Firebase Emulator Suite role tests after merging the actual rules, then follow the acceptance checks in SETUP.md.
