# Test Plan: Affiliate Links Feature

## 1. Overview

Feature: Influencer Affiliate Program. `?ref={id}` on landing sets an `affiliate_tracking` cookie, which drives attribution on purchase, a UI banner on Checkout: Overview, and backend metrics

Acceptance criteria in scope:

1. Cookie Persistence (name `affiliate_tracking`, set from `?ref={id}`)
2. Duration (30 days, survives browser close)
3. Attribution (affiliate id sent to backend with order)
4. UI Feedback (banner on Checkout: Overview: "Referral applied: {Influencer_Name}")
5. Backend Metrics (affiliate, amount, products, date persisted per purchase)

Out of scope for this doc: implementation, automated test code

## 2. Pre-assumptions (needs clarification)

Spec is silent on several mechanics. Defaults assumed for test design:

- 30 day expiry measured from **cookie set time**, not last visit, and not sliding on every page view
- `ref` value is an opaque alphanumeric influencer code, case sensitive
- Attribution model is **last click**, a new valid `ref` overwrites the existing cookie value
- One active referral tracked per browser (single cookie), not stacked or multi touch
- `affiliate_tracking` is first party, set by saucedemo.com itself, not a third party

## 3. Test Strategy

| Layer                         | Method                                                                                                                        |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Cookie behavior               | Browser dev tools or automated cookie inspection: name, value, expiry, flags                                                  |
| UI banner                     | Visual and DOM assertion on Checkout                                                                                          |
| Attribution and order payload | Network interception (request body or API call at checkout submit)                                                            |
| Backend metrics               | DB or admin or reporting API query (needs backend access, currently a gap)                                                    |
| Time based (30 day expiry)    | Cookie expiry value inspection at set time, plus a cron job triggered rerun of the same test on day 31 to confirm real expiry |

Testing mix: functional scenarios (positive, negative, edge per AC) plus layered checks spanning unit, API/integration, end to end/UI, security, manual/exploratory, and regression against existing checkout flow

## 4. Test Scenarios by AC

### AC1: Cookie Persistence

- Valid `?ref=QA_INFLUENCER` on landing sets cookie `affiliate_tracking=QA_INFLUENCER`
- No `ref` param means no cookie set (fresh browser)
- Empty `ref` (`?ref=`) means no cookie set, or handled gracefully (no crash)
- Malformed or special char `ref` (`?ref=!!@@`) gets sanitized or rejected, no crash
- Multiple `ref` params in URL get handled deterministically (first or last wins, unclear which, see open question below), no error
- `ref` on a deep link (not homepage) still sets the cookie
- Revisit with a **different** valid `ref` while existing cookie present overwrites per last click assumption (product should confirm this model)
- Revisit site with **no** `ref` param and an existing cookie leaves the cookie untouched

### AC2: Duration

- Cookie `Max-Age` or `Expires` equals 30 days at set time
- Persists after browser fully closed and reopened
- Persists across multiple tabs or windows of the same browser profile
- Does **not** silently extend to a new 30 days on every subsequent page view without a new `ref` (behavior not specified, product should confirm)
- Expires correctly once past 30 days (verify via expiry timestamp, not real time wait)
- Incognito or private window: cookie set for session, does not leak into normal profile, cleared per browser's private mode rules
- Manual cookie clear by user removes tracking as expected

### AC3: Attribution

- Purchase completed with valid, unexpired cookie sends the affiliate id in the order submission payload or API call
- Purchase with no cookie sends no affiliate id (null or absent), order still completes successfully
- Cookie present but **expired** at time of purchase is not attributed (treated as no cookie case)
- Cookie value tampered to an unknown or invalid influencer id (e.g. dev tools) needs defined server side handling (reject vs store as is, product should confirm)
- Multi item cart, single order: attribution applied once at order level, not per item
- Attribution unaffected by unrelated cart operations (add or remove items) after cookie is set

### AC4: UI Feedback (Banner)

- Banner shows on Checkout: Overview with correct `"Referral applied: {Influencer_Name}"` when valid cookie present
- Banner absent when no cookie present
- Cookie holds unknown or invalid id: whether fallback text shows or banner is suppressed needs product confirmation, verify graceful handling either way (no broken UI)
- Banner appears **only** on Checkout: Overview step, not on cart, checkout info, or complete steps
- Accessibility: banner readable by screen reader, sufficient contrast, not conveyed by color alone
- Responsive layout: banner renders correctly on mobile viewport, does not overlap or clip other content
- Long influencer names do not break layout (truncation or wrap handled)

### AC5: Backend Metrics

- Successful attributed purchase creates a metrics record with affiliate id, transaction amount, products bought, and purchase date
- Recorded amount matches order total (whether tax and shipping are included needs product confirmation)
- Multi item purchase records the full product list, not just first or last item
- Date and timestamp recorded correctly, timezone consistent
- Duplicate checkout submission (e.g. double click, network retry) does not create duplicate metrics records
- Non attributed purchases (no referral) are **not** miscounted as affiliate purchases
- Metrics data is queryable or reportable (flagged as a gap, needs backend or API access to verify directly)

## 5. Testing Layers

**Unit and Component**

- Ref value parsing and sanitization logic (rejects malformed input before it ever reaches a cookie)
- Influencer name lookup function: valid id resolves to a name, unknown id resolves to a defined fallback
- Cookie expiry calculation logic (30 days from set time)

**API & Integration**

- Order submission includes the affiliate id when a valid cookie is present, omits it otherwise
- Backend correctly rejects or handles an unknown or tampered influencer id sent with an order
- Metrics record created per attributed purchase: affiliate id, transaction amount, product list, date all correct and reconciled with the order total
- Metrics writes are idempotent under duplicate or retried submissions
- Race condition check: rapid or concurrent checkouts from the same session

**E2E & UI**

- Full flow from landing with `?ref=` through checkout to banner display and order completion
- Banner shows only on Checkout: Overview, with correct text, and is absent without a valid referral
- Banner accessibility: screen reader readable, sufficient contrast, not conveyed by color alone
- Responsive layout on mobile viewport, long influencer names do not break layout
- Cookie set, read, and persist correctly across major browsers (Chrome, Firefox, Safari), and across tabs and a full browser restart

**Security Testing**

- Cookie tampering: a client edited `affiliate_tracking` value must not be blindly trusted server side for anything financially consequential
- Referral fraud: self referral, scripted or bot traffic inflating referral hits. At minimum confirm this is a known risk, not necessarily blocked by MVP

**Manual & Exploratory**

- Cookie consent flow: does setting `affiliate_tracking` require prior consent acceptance (GDPR, CCPA, ePrivacy)? Needs product confirmation
- Incognito or private window behavior: cookie set for session, does not leak into the normal profile, cleared per the browser's private mode rules
- Mobile Safari ITP (Intelligent Tracking Prevention) may cap first party cookie lifetime below 30 days in some configurations
- Actual expiry after 30 real days, verified via a cron job triggered rerun of the automated check rather than a manual real time wait

**Regression Level**

- Existing checkout, cart, and sort flows must continue passing unaffecte. No referral or banner logic should alter non referred purchase behavior or break unrelated functionality

## 6. Automation Feasibility

| Scenario group                                 | Feasibility                   | Notes                                                                                                                                    |
| ---------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Cookie set, value, attrs on `?ref=` navigation | Automatable                   | Navigate with query param, read cookie via browser automation API                                                                        |
| Cookie absence without `ref`                   | Automatable                   | Same mechanism                                                                                                                           |
| 30 day expiry value check                      | Automatable                   | Inspect cookie's expiry field immediately after set, no real time wait needed                                                            |
| Actual expiry after 30 real days               | Automatable via scheduled run | Set the cookie on day 0, then a cron job triggers the same automated test again on day 31 to confirm the cookie and attribution are gone |
| Banner presence, text, absence                 | Automatable                   | Locator and assertion on Checkout: Overview page                                                                                         |
| Order payload contains affiliate id            | Automatable                   | Network request interception at checkout submit                                                                                          |
| Cookie tampering via dev tools                 | Automatable                   | Overwrite cookie value directly, assert server rejects or ignores it for payout relevant metrics                                         |
| Cross browser cookie behavior                  | Automatable                   | Run same checks across major browser engines                                                                                             |
| Banner accessibility, responsive               | Partially automatable         | Basic DOM and contrast checks automatable                                                                                                |
| Backend metrics record correctness             | Needs backend or API access   | No DB or reporting endpoint assumed reachable from the test environment, a gap                                                           |
| Consent gating                                 | Manual                        | Depends on unresolved product question (see AC1 to AC5 notes above)                                                                      |

## 7. Risks & Priorities

| Priority | Area                                                  | Reasoning                                                                                                                    |
| -------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| P0       | Backend metrics accuracy (AC5)                        | Directly drives influencer payouts: errors here have financial and legal impact                                              |
| P0       | Attribution correctness (AC3)                         | Same reason: wrong or missing affiliate id misattributes revenue                                                             |
| P1       | Banner display (AC4)                                  | incorrect name or missing banner removes credibility but causes no financial harm                                            |
| P1       | Cookie duration edge cases (AC2)                      | Silent under or over attribution window if 30 day logic is wrong                                                             |
| P2       | Cookie edge cases (AC1: malformed or multiple params) | Low likelihood, low impact if mishandled gracefully                                                                          |
| P2       | NFR (privacy, consent, security)                      | Real risk (legal, compliance, fraud) but likely governed by existing site wide policies rather than net new for this feature |
