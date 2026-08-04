# Project Audit — 7-Day Attention Reset (Deeper Fix)

> **Status: superseded.** This is the audit as it stood *before* the remediation
> pass of 3 August 2026. Most findings below have since been fixed, and the
> affiliate programme they describe has been removed entirely. Read
> [`REMEDIATION.md`](REMEDIATION.md) for what changed and what is still open.
> This file is kept as the record of what was found.

**Date:** 3 August 2026
**Scope reviewed:** entire repository — `webapp/` (React SPA + Vercel serverless API), `affiliate/` (duplicate source + docs), `landing/` (legacy static page), `reels/` (marketing asset), root Python PDF tooling.
**Method:** full source read, `npm run build`, `npx eslint .`, git history review. No runtime/production testing, no analytics or sales data available.

---

## 0. Immediate action required (security)

| # | Item | Why |
|---|---|---|
| 0.1 | **Rotate the Firebase service-account key** (`FIREBASE_SERVICE_ACCOUNT` in `webapp/.env`) | During this audit the full private key was printed into a chat transcript. The file is correctly git-ignored and was never committed, but the key must now be treated as exposed. Firebase Console → Project Settings → Service Accounts → generate new key, delete the old one, update the Vercel env var. |
| 0.2 | **Rotate `RAZORPAY_KEY_SECRET` and `META_CAPI_TOKEN`** | Same file, same precaution. Lower urgency than 0.1 (they were not printed in full), but cheap to do while you're in there. |
| 0.3 | **Publish Firestore security rules to the repo and verify what is live** | There is no `firestore.rules` file anywhere. The only rules that exist are a snippet in `affiliate/SETUP.md`, and that snippet grants admin access to `favazmk@gmail.com` while the app's admin is `favazmk12@gmail.com`. Either the live rules differ from the docs, or the `commissions` collection is world-readable. See §4.3. |

---

## 1. What this project is

A single-product Indian direct-to-consumer info-product business:

- **Product:** "7-Day Attention Reset" — an interactive web workbook (7 days × ~7 tasks each, ~41 tasks total) that ends in a shareable "attention report" image.
- **Price:** ₹399 one-time (anchored against a ₹2,094 "value stack" and a ₹599 strike-through).
- **Payment:** Razorpay (INR only).
- **Auth/data:** Firebase Auth (email/password + Google) with Firestore for cross-device progress sync.
- **Acquisition:** Meta ads (Pixel + Conversions API are wired), plus an influencer/affiliate coupon programme (coupon → discount for buyer, % commission for influencer, manual payout).
- **Brand:** "Deeper Fix". Support is a personal Gmail + WhatsApp number.
- **Hosting:** Vercel (SPA + 3 serverless functions).

### Repository layout

| Path | Status | Notes |
|---|---|---|
| `webapp/` | **Live application** | Vite + React 19, ~5,500 lines of JSX. The only thing that ships. |
| `affiliate/` | **Stale duplicate** | Byte-identical API files; `AffiliateAdmin.jsx` is an older copy missing the Copy-Link feature and the second admin email. Delete or convert to docs-only. |
| `landing/index.html` | **Dead** | 680-line legacy static landing page. Superseded by `Landing.jsx`. |
| `webapp/public/landing.html` | **Dead but publicly served** | Same file with CRLF endings and one content difference ("7-Day Progress Report" vs "Certificate of Completion"). Vercel serves static files ahead of the SPA rewrite, so `yourdomain.com/landing.html` is a live, orphaned sales page with non-functional CTAs (`href="#"`). Delete it. |
| `reels/` | Marketing asset | HyperFrames reel project + rendered `reel.mp4`. Fine. |
| `generate_pdf.py`, `test_*.py`, `.venv/` | Abandoned tooling | Generated the original PDF workbook before the app existed. Keep in a `tools/` dir or delete; the committed `test_*.pdf` files are build artefacts. |
| `webapp/scratch/check_braces.js` | Debris | Committed scratch file. Delete. |

---

## 2. Business scope & demand

**Caveat, stated plainly:** demand cannot be measured from source code. There is no analytics export, no Razorpay settlement data, no ad-account data, and no customer count in this repo. Everything below is an assessment of the *funnel machinery and positioning*, not of actual market demand. If you want a real demand read, the inputs needed are: Meta ads spend/CPM/CTR, landing-page sessions, checkout-open rate, paid conversions, and refund rate.

### 2.1 What the funnel is built to do

The landing page is a competent, complete direct-response structure — symptom mirror → mechanism ("the problem isn't you, it's the system") → 7-day ladder → value stack → for/not-for qualifier → price → guarantee → binary choice close → FAQ → final CTA. Copy is specific and the objection handling (ADHD, "I've quit before", "screens all day", "is this a video course") is well targeted. This is above the quality bar for a first info-product.

### 2.2 Structural constraints on revenue

1. **One product, one price, no back end.** ₹399 is the entire lifetime value of a customer. The only upsell in the codebase is `Completion.jsx:360` — "Get My Custom Plan" — and it links to `#`. It does nothing. Every customer who finishes the programme and clicks "Yes, I'm ready" hits a dead button. This is the single largest revenue item in this report: your highest-intent moment is unmonetised.
2. **Value stack undermines the price.** The landing claims a ₹2,094 bundle value, but the components ("27 clickable checklists — ₹499 value") are features of the same app, not separable products. Sophisticated buyers discount this; it is also the sort of claim that invites chargebacks.
3. **Ad optimisation is crippled by missing events.** Only two Pixel events fire: `PageView` (`index.html:23`) and `Purchase` (`Landing.jsx:235`). There is no `ViewContent`, `InitiateCheckout`, or `AddToCart`. At ₹399 you will not reach the ~50 purchases/week that Meta needs to optimise a Purchase campaign quickly, so you *need* mid-funnel events to optimise against. This is a direct, quantifiable drag on CAC.
4. **No email capture anywhere.** No lead magnet, no abandoned-checkout capture, no list. The only owned channel is WhatsApp-by-request. For a ₹399 product with paid traffic, an email list is usually what makes the economics work.
5. **No server-side customer record.** `verify-payment.js` verifies the signature and returns success — it never writes to `users/{uid}`. Non-coupon purchases produce **no record in your own database at all**. You cannot email your customers, reconcile Razorpay against users, or prove who bought what without exporting from Razorpay manually. See §4.1.
6. **Zero social/SEO surface.** `webapp/index.html` has no meta description, no Open Graph tags, no Twitter card, no `robots.txt`, no `sitemap.xml`. Every share of your link on WhatsApp, Instagram DM, or Twitter renders as a bare URL with no title card. For a product that asks buyers to "share this workbook with one friend" (`Completion.jsx:306`), this kills the referral loop.

### 2.3 Affiliate programme assessment

The mechanics are sound (coupon → discount → commission record → manual payout) and the influencer-facing dashboard is a genuinely good idea — most small affiliate programmes give influencers nothing. Two problems:

- **The dashboard is unauthenticated.** `#affiliate/CODE` shows earnings to anyone who knows or guesses the code (`App.jsx:57-62`, `InfluencerPortal.jsx`). Codes are short and human-guessable ("RAVI10"). Anyone can enumerate them and read your affiliates' names, emails, sale counts and payouts.
- **Default 50% commission on a ₹399 product** leaves ~₹180 gross per sale before Razorpay fees (~2%) and any ad spend. That is workable only if affiliate traffic is genuinely incremental. It is not sustainable alongside paid ads on the same product.
- Payouts are manual with no threshold enforced in code — the ₹ amounts are tracked but the "payout threshold" mentioned in the portal copy (`InfluencerPortal.jsx:248`) exists nowhere in the system.

### 2.4 Legal / policy risk

The landing page says **"7-Day Money-Back Guarantee — No questions asked"** (`Landing.jsx:893`, repeated at 913). The Terms say the refund is **"conditional upon your active participation… you must complete the entire 7-day reset programme"** (`TermsAndConditions.jsx:26`). These contradict each other. In a Razorpay dispute the customer-facing headline is what counts, and the contradiction itself is evidence of a misleading term. Pick one and make both surfaces match.

---

## 3. Architecture

```
Browser (React SPA, single 968 kB bundle)
  ├── Firebase Auth  ────────────────► Google Identity Platform
  ├── Firestore (client SDK)  ───────► users/{uid}, coupons/*, commissions/*
  └── fetch /api/*  ─────────────────► Vercel serverless (Node ESM)
                                         ├── validate-coupon  → Firestore Admin
                                         ├── create-order     → Firestore Admin + Razorpay
                                         └── verify-payment   → HMAC + Firestore Admin + Meta CAPI
```

Routing is `window.location.hash` inspected in `App.jsx:47-71` (`#admin`, `#affiliate/CODE`) plus a `currentPageIndex` integer for the 9 workbook pages. There is no router library, no URL for individual days, and therefore no deep-linking, no browser back button, and no per-page analytics.

State is a single flat `data` object of ~80 string/boolean keys (`d1_c0`, `d7_testimonial_after`, …) mirrored into `localStorage` under `ar_data_{uid}` and into `users/{uid}.data`. There is no schema, no validation, and no migration path.

---

## 4. Critical findings

### 4.1 The paywall is entirely client-side — content is free to anyone who looks
**Severity: Critical (revenue).** `App.jsx:396-418`, `App.jsx:289-296`

Enrolment is decided by `localStorage.getItem('ar_enrolled_' + uid)` and `users/{uid}.isEnrolled` — both written by the browser, both writable by the user. Firestore rules allow a user full write access to their own document, so `setDoc(doc(db,'users',uid),{isEnrolled:true})` from the browser console grants free access. More fundamentally, all 7 days of content are compiled into the JS bundle that is served before payment, so the material is downloadable regardless.

The server never learns that a user paid: `verify-payment.js` returns `{status:'success'}` and writes nothing to `users/`.

**Consequences beyond piracy:** if the browser closes between Razorpay's success callback and the client-side `setDoc`, the customer has paid and has no access, and you have no record connecting the payment to their account. Recovery is a manual Razorpay-dashboard lookup.

**Fix:**
1. In `verify-payment.js`, require a Firebase ID token in the request, verify it with `getAuth().verifyIdToken()`, and write `users/{uid}.isEnrolled = true` plus `purchase: {order_id, payment_id, amount, at}` with the Admin SDK.
2. Tighten the Firestore rule for `users/{uid}` so the client may write `data`/`currentPageIndex` but **not** `isEnrolled`.
3. Add a Razorpay webhook (`payment.captured`) as a fallback so enrolment lands even if the browser dies.
4. Accept that content in the bundle is copyable; if that matters, lazy-load days 2-7 behind an authenticated API. (Probably not worth it at ₹399 — the enrolment fix is what matters.)

### 4.2 `verify-payment` is replayable and trusts the client's sale amount
**Severity: Critical (financial).** `webapp/api/verify-payment.js:32-74`

Two compounding flaws:

- **No idempotency.** Nothing checks whether `razorpay_payment_id` has already been processed. The same valid `(order_id, payment_id, signature)` triple can be POSTed unlimited times; each call `add()`s a new commission document and increments `total_uses` and `total_commission_earned`.
- **`final_amount` is taken from the request body** (line 44) and used directly to compute `commissionAmount` (line 45). It is never checked against the actual Razorpay order.

**Exploit:** an affiliate buys the product once (₹399, no coupon). They copy their own `order_id`/`payment_id`/`signature` from the browser network tab, then POST to `/api/verify-payment` with `coupon_code: "THEIRCODE"` and `final_amount: 100000`. Each request books a ₹50,000 commission "owed". Repeat as desired. Your admin panel shows the inflated total as payable.

**Fix:** make the commission write conditional on a transaction that first claims `commissions/{razorpay_payment_id}` as the document ID (`create()` throws if it exists). Fetch the order from Razorpay (`razorpay.orders.fetch(order_id)`) and compute `saleAmount` from `order.amount / 100` and `order.notes.coupon_code` — never from the request body. Drop `final_amount` and `coupon_code` from the accepted payload entirely.

### 4.3 Firestore rules are undefined in the repo and contradict the app
**Severity: Critical (data exposure).**

There is no `firestore.rules`, no `firebase.json`. The documented rules (`affiliate/SETUP.md`, Step 4) restrict `commissions` read/write to `favazmk@gmail.com` — but:
- the app's real admin is `favazmk12@gmail.com` (`AffiliateAdmin.jsx:7`), and
- `InfluencerPortal.jsx:30-36` queries `commissions` from an **unauthenticated** browser.

Both cannot be true. Either the deployed rules are more permissive than documented (in which case commission records — influencer names, emails, revenue — are readable by anyone), or the influencer portal is broken in production. **Check the live rules today.** Then commit them to the repo so they are reviewable.

### 4.4 Admin panel is gated only in the client
**Severity: High.** `AffiliateAdmin.jsx:7,33,245`

`ADMIN_EMAILS` lives in the shipped bundle and the gate is a React early-return. Anyone can render the panel; whether they can *do* anything depends entirely on the Firestore rules (§4.3). Coupon creation, deletion, enable/disable and "mark paid" all go direct from browser to Firestore with no server mediation. Move these to authenticated API routes, or at minimum enforce the admin email in rules using `request.auth.token.email`.

### 4.5 Public, unauthenticated, unthrottled endpoints
**Severity: Medium.**

`/api/validate-coupon` accepts unlimited POSTs with no rate limit, making coupon codes brute-forceable (they are short and predictable). `/api/create-order` accepts unlimited unauthenticated POSTs, each of which creates a real Razorpay order — an easy way for someone to pollute your Razorpay dashboard or burn API quota. Add Vercel rate limiting or a simple per-IP throttle, and require a Firebase ID token on `create-order`.

---

## 5. Functional bugs

| # | Location | Bug | Impact |
|---|---|---|---|
| 5.1 | `api/create-order.js:57-59` | If `coupon_code` is truthy but the coupon lookup fails (deleted, deactivated, or Firestore error), `couponData` stays `null` and `couponData.code` throws. The throw happens inside the `try`, so the user gets a **500 "Failed to create order"** instead of the documented "fall back to original price". | Checkout dies for anyone whose coupon was disabled between validation and payment, or during any Firestore blip. Silent revenue loss. Fix: `notes: couponData ? {...} : {}`. |
| 5.2 | `api/create-order.js:42` | A 100%-discount coupon produces `finalAmount = 0`, which fails the `< 100` guard and returns 400. The admin panel allows entering 100. | Free/press coupons are impossible; the admin gets an unexplained failure. Cap discount at 99% in the form, or handle zero-amount orders explicitly. |
| 5.3 | `App.jsx:129-133` | Cross-device merge picks *whichever object has more keys* and discards the other entirely: `Object.keys(cloudData).length > Object.keys(localData).length ? cloudData : localData`. | Real data loss. A user with 20 answers in the cloud and 19 *different* answers locally loses all 19. Fix: key-level merge with per-field timestamps, or at minimum `{...cloudData, ...localData}`. |
| 5.4 | `App.jsx:131` vs `:130` | `finalPage` is `Math.max(cloud, local)` while `finalData` comes from only one source. | A user can be dropped on Day 5 with Day 5's answers missing. |
| 5.5 | `App.jsx:182` | Scroll restore falls back to the **non-namespaced** `ar_scroll_pos` key, a leftover from before per-user namespacing (commit `d069a1e`). | Minor session bleed between accounts on a shared device. |
| 5.6 | `Completion.jsx:27-29, 180` | `improvement` is rendered as `+{improvement}%`. If the Day-7 score is *worse* than Day 1, the value is negative and the shareable report reads **"+-25%"**. | Broken output on the one screen designed to be screenshotted and shared. Clamp at 0 and change the copy, or render "−25%" honestly. |
| 5.7 | `Completion.jsx:360` | "Get My Custom Plan" → `window.location.href = '#'`. | Dead CTA at peak intent. See §2.2. |
| 5.8 | `InfluencerPortal.jsx:15` | `load()` is called in a `useEffect` before its `const` declaration on line 18 — flagged by ESLint as a hard error (`react-hooks/immutability`, "Cannot access variable before it is declared"). It happens to work because the effect runs after render, but it is fragile and the linter treats it as an error. | Move `load` above the effect or wrap in `useCallback`. |
| 5.9 | `App.jsx:484, 486, 582` | `Date.now()` called during render (ESLint: "Cannot call impure function during render"). | Non-deterministic renders; will break under React 19 concurrent features. Hoist to state or a ref. |
| 5.10 | `Landing.jsx:175-261` | `handlePayment` distinguishes a React event from a coupon object by sniffing `restoredCoupon.nativeEvent` (line 178). | Works, but is exactly the kind of thing that breaks silently. Give `CheckoutModal` an `onClick={() => onProceed()}` wrapper and delete the sniffing. |
| 5.11 | `CheckoutModal` / `Landing.jsx:195+` | When the user is already logged in, the checkout modal is never closed before `rzp.open()`. | The modal sits behind the Razorpay overlay and is still there if the user cancels. |
| 5.12 | `Landing.jsx:244,253,259` | Three raw `alert()` calls in the payment path. | Jarring native dialogs at the highest-stakes moment in the funnel, and inconsistent with the custom `ConfirmModal`/toast components you already built. |
| 5.13 | `Auth.jsx` (whole file) | **No password reset.** No "Forgot password?" link, no `sendPasswordResetEmail`. | A paying customer who forgets their password is permanently locked out of a product they bought, and your only recourse is manual Firebase Console intervention. This will generate support load. Highest-value small fix in this table. |
| 5.14 | `App.jsx:211-218, 484` | "Next day unlocks tomorrow" uses `isSameDay(...)` — i.e. it unlocks at local midnight, not 24 hours later, and it trusts the device clock. | Finish Day 1 at 23:55 → Day 2 opens in 5 minutes. Changing the device date bypasses the lock entirely. Acceptable for a self-paced product, but the commit message claims a "24h lock" and the copy implies one. |
| 5.15 | App-wide | **No React error boundary.** | A single render error on any Day page white-screens a paying customer with no recovery path and no error report to you. |
| 5.16 | `index.html:25-27` | The Meta Pixel `<noscript>` sits inside `<head>`, which is invalid HTML — Vite's build prints a parse5 error on every build. | Build noise; the pixel noscript fallback may not fire. Move it to the top of `<body>`. |

---

## 6. Code quality

**Overall: functional, shipped, and clearly built fast by prompting rather than engineering. It works, and for a solo ₹399 product that is a legitimate trade-off — but the parts that touch money and access have been built with the same casualness as the parts that touch colour, and that is where it needs to stop.**

### What's good
- Genuinely coherent visual system — CSS custom properties for the per-day colour palette, consistent typography, considered micro-interactions.
- Serverless functions are small, readable, and correctly structured as ES modules.
- The Razorpay HMAC signature verification itself is implemented correctly (`verify-payment.js:22-29`).
- Meta CAPI + browser Pixel share an `event_id`, so server/browser Purchase deduplication is correct — a detail many teams get wrong.
- Secrets are properly git-ignored; nothing sensitive has ever been committed.
- Commit messages are clear and conventional.

### What needs work

**Styling.** Effectively 100% inline styles. `Landing.jsx` alone contains a 165-line CSS string injected into `document.head` at runtime (`Landing.jsx:268-438`) — this ships CSS in the JS bundle, delays first paint, and cannot be cached separately. `AffiliateAdmin.jsx` carries a 120-line `styles` object rebuilt on every render. `index.css` has **zero** media queries; all responsive behaviour lives in the six queries in `App.css` and in the injected string.

**Component size and duplication.** `Landing.jsx` is 1,099 lines. `App.jsx` is 709 lines with 6 `useEffect`s and two large IIFEs inside JSX. The seven Day pages (~2,900 lines total) are near-identical structures — same `getMissingTask` pattern, same `handleFinishDay`, same confetti, same progress bar — copy-pasted seven times with the answer keys changed. A single `<DayTemplate config={...}>` would remove roughly 2,000 lines and make content edits a data change rather than seven parallel edits.

**Lint health.** 28 errors, 1 warning. Three are genuine correctness issues (§5.8, §5.9); the rest are unused imports and dead variables (`resetData` in `App.jsx:242`, `removeCoupon` in `Landing.jsx:107`, `triggered`/`setTriggered` duplicated across four Day files, `useEffect` imported unused in Days 1-4). The `api/` folder is linted with browser globals, so every `process.env` is a false-positive error — add a Node override to the ESLint config.

**Testing and CI.** Zero tests. No `.github/`. No type checking. The payment path — the part where mistakes cost money — has never been exercised by anything but manual clicking. At minimum: unit tests for the signature verification and commission maths, and a smoke test that the build succeeds on push.

**Performance.** 968 kB JS / 269 kB gzipped in one chunk. The Firebase client SDK is the bulk of it, and it is loaded on the landing page before anyone has signed in. `html2canvas` (~200 kB) is needed only on the completion screen but ships to every visitor. For a mobile-first Indian audience arriving from Meta ads, this is a measurable bounce cost. Fix: dynamic-import Firebase after the CTA is clicked, lazy-load `html2canvas` in `Completion.jsx`, and split the Day pages with `React.lazy`. Realistic target: ~120 kB gzipped for the landing page.

**Accessibility.** Two `aria-label`s in the entire codebase, both on carousel arrows. No form `<label>` elements (placeholders only). Checkbox rows are `<li onClick>` — not focusable, not keyboard-operable, invisible to screen readers. The custom modals do not trap focus, do not close on Escape, and do not set `aria-modal`. Given the product explicitly markets to people with ADHD, keyboard and screen-reader support is not a nice-to-have.

**Data modelling.** ~80 flat string keys with no schema, mixing UI state (`d1_c0`), user content (`d3_r1`), progress (`day1_finished`) and timestamps (`day1_completedAt`) in one bag written wholesale to Firestore on every keystroke-triggered state change (`App.jsx:163-168` has no debounce). That is a Firestore write per character in a textarea. It works at your current scale and will become a cost line if it doesn't.

**Duplication across the repo.** `affiliate/` duplicates four API files byte-for-byte and one component in an older state. `landing/index.html` and `webapp/public/landing.html` are two copies of a dead page. Someone will eventually edit the wrong copy.

---

## 7. Limitations (things that are structural, not bugs)

1. **INR/Razorpay only.** No international payments. Any non-Indian traffic from ads is wasted.
2. **No admin view of customers.** The admin panel covers affiliates only. There is no way to see who bought, who is stuck on Day 3, or who finished — the exact data that would tell you whether the product works.
3. **No email infrastructure.** No welcome email, no receipt of your own, no Day-2 nudge, no win-back. The calendar-link reminder (`App.jsx:220-231`) is the only retention mechanism, and it requires the user to click through to Google Calendar.
4. **No content management.** Every word of the 7 days is hard-coded in JSX. A copy tweak is a code change plus a deploy.
5. **Hash routing.** No shareable URLs, no working back button, no per-page analytics, and `#admin` / `#affiliate/CODE` are discoverable by anyone reading the bundle.
6. **Single point of failure on identity.** Support, admin access, and the affiliate contact are all one personal Gmail, hard-coded in six places across the codebase.
7. **No monitoring.** Vercel Speed Insights only. No error tracking (Sentry), so client-side crashes in production are invisible to you.

---

## 8. Prioritised fix plan

**This week — money and access**
1. Rotate the Firebase service-account key (§0.1).
2. Audit and commit the live Firestore rules (§4.3).
3. Make `verify-payment` idempotent and server-authoritative on amount (§4.2).
4. Write enrolment server-side from `verify-payment` with a verified ID token, and add a Razorpay webhook fallback (§4.1).
5. Fix the `create-order` null-coupon 500 (§5.1) — one line.
6. Add password reset to `Auth.jsx` (§5.13).

**Next two weeks — revenue**
7. Add `ViewContent` and `InitiateCheckout` Pixel events (§2.2.3).
8. Add OG/Twitter/description meta tags and a share image (§2.2.6).
9. Wire or remove the "Get My Custom Plan" CTA (§5.7).
10. Authenticate the influencer portal (§2.3).
11. Resolve the refund-policy contradiction (§2.4).
12. Delete `public/landing.html`, `landing/`, `affiliate/` duplicates, `scratch/` (§1).

**Following month — durability**
13. Add an error boundary + Sentry (§5.15).
14. Fix the merge-by-key-count data loss (§5.3).
15. Code-split Firebase and `html2canvas`; target <150 kB gzipped landing (§6).
16. Clear the 28 lint errors; add a Node override for `api/`.
17. Extract a `DayTemplate` and drive Days 1-7 from config (§6).
18. Accessibility pass: real labels, keyboard-operable checkboxes, focus-trapped modals (§6).
19. Tests for signature verification and commission maths; GitHub Action running build + lint (§6).

---

## 9. Bottom line

The product is real, the funnel is well constructed, and the code ships. The problem is that the *money layer* was built with the same speed as the *presentation layer*. Right now: anyone can take the course without paying, anyone can inflate an affiliate's commission arbitrarily, you have no server-side record of who your customers are, and a customer who forgets their password is simply locked out. Those four items are a weekend of work and they are worth more than any new feature.

The second-order finding is that your best revenue lever isn't in the code at all — it's that a customer who has just finished 7 days of your programme and clicked "Yes, I'm ready to fix this permanently" currently lands on a button that goes nowhere.
