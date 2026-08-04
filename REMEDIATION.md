# Remediation — 3 August 2026

What changed in response to [`AUDIT_REPORT.md`](AUDIT_REPORT.md), plus the two
product decisions that came with it: **the influencer/affiliate programme is
gone**, and **the price is now ₹99**.

Verified: `npm run lint` clean (was 28 errors), `npm run build` clean, landing
page and checkout flow exercised in a browser.

---

## 1. Things you must do before this goes live

| # | Action | Why |
|---|---|---|
| 1 | **Rotate the Firebase service-account key**, then update `FIREBASE_SERVICE_ACCOUNT` in Vercel | It was printed into a chat transcript during the audit. Treat as exposed. |
| 2 | **Deploy the Firestore rules**: `firebase deploy --only firestore:rules` | The new rules are what actually stop a user granting themselves free access. The code changes alone are not enough. |
| 3 | **Delete the `coupons` and `commissions` collections** in the Firebase console | Nothing reads or writes them any more. They still contain influencer names, emails and payout records. |
| 4 | **Deactivate any live coupon codes you gave out** and tell those influencers | The `/api/validate-coupon` endpoint is gone — old codes now do nothing, silently. |
| 5 | Optionally set `VITE_SITE_URL` in Vercel | Canonical/OG tags otherwise derive from `VERCEL_PROJECT_PRODUCTION_URL`, which is correct for a Vercel domain but not for a custom apex domain. |

Nothing else in the environment changes — no new secrets are required.

---

## 2. Affiliate programme: removed

Deleted outright: `affiliate/` (all 9 files), `webapp/api/validate-coupon.js`,
`webapp/src/pages/AffiliateAdmin.jsx`, `webapp/src/pages/InfluencerPortal.jsx`.

Stripped from the surviving code: coupon state and validation in `Landing.jsx`,
the coupon UI in `CheckoutModal.jsx`, commission recording in
`verify-payment.js`, coupon pricing in `create-order.js`, the `#admin` and
`#affiliate/CODE` hash routes in `App.jsx`, and the admin-panel link in
`ProfileModal.jsx`.

This also closes three audit findings by deletion: the unauthenticated
influencer dashboard, the client-side-only admin gate, and the brute-forceable
coupon endpoint.

Hash routing is gone entirely — there are no longer any hidden URLs in the app.

---

## 3. Price: ₹399 → ₹99

`api/_pricing.js` is now the single server-side source of truth
(`PRICE_RUPEES = 99`). Every order is created at that amount, and the amount
Razorpay actually captured is checked against it before access is granted.

Display copy in `Landing.jsx` uses three constants: `PRICE` (99),
`PREVIOUS_PRICE` (399, shown struck through — it is what you genuinely used to
charge) and `BUNDLE_VALUE` (2,094, unchanged). The "you save" figures now
compute rather than being hard-coded, so they can't drift again.

**Judgement call worth reviewing:** the pricing card used to anchor at a ₹599
strike-through above ₹399. I replaced that with ₹399 → ₹99, because ₹399 is a
price you actually charged and is therefore defensible. If you want the ₹599
anchor back, change `PREVIOUS_PRICE`.

At ₹99 with ~2% payment fees you net roughly ₹97 per sale, which puts real
pressure on ad CAC. That is a business decision, not a code one — but it is the
reason the missing funnel events (below) mattered enough to fix.

---

## 4. Security and payment integrity

**Access is now granted by the server, never the browser.**
`verify-payment` writes `users/{uid}.isEnrolled`; `firestore.rules` explicitly
rejects any client write to `isEnrolled`, `enrolled_at` or `last_payment_id`.
The app reads enrolment from Firestore only — the old
`localStorage.getItem('ar_enrolled_…')` shortcut is gone, so setting a
localStorage key no longer buys you the course.

**Every money endpoint requires a Firebase ID token.** `src/api.js` attaches it;
`api/_firebase-admin.js` verifies it. `create-order` and `verify-payment` are no
longer anonymous, which also removes the "anyone can spam Razorpay orders"
problem.

**Replay and amount tampering are fixed.** `verify-payment` now:
- compares the signature with `crypto.timingSafeEqual`
- fetches the order back from Razorpay and confirms `notes.uid` is the caller
- confirms `status === 'paid'` and `amount_paid >= PRICE_PAISE`
- claims `purchases/{payment_id}` with `create()`, so a replayed request is
  recognised and does nothing

`final_amount` and `coupon_code` are no longer accepted from the request body at
all. The exploit in the audit (replay your own payment to book unlimited
commission) is structurally impossible now — there is no commission, and the
amount comes from Razorpay.

**Firestore rules are in the repo** (`firestore.rules`, `firebase.json`,
`firestore.indexes.json`) with a default-deny catch-all. They no longer exist
only as a snippet in a markdown file with the wrong admin email in it.

**Paid-but-no-access is now recoverable.** `create-order` records the order;
`api/check-entitlement.js` runs on sign-in for anyone not yet enrolled, asks
Razorpay whether any of their outstanding orders was actually paid, and grants
access if so. This covers the browser dying between payment and verification.

> **One gap to know about:** this recovery only sees orders created by the *new*
> code. If a customer paid under the old flow and their access never got
> recorded, `check-entitlement` won't find them — that still needs a manual fix
> from the Razorpay dashboard. Existing customers whose `isEnrolled` is already
> `true` in Firestore are unaffected and keep access.

---

## 5. Bugs fixed

| Audit ref | Fix |
|---|---|
| 5.1 | `create-order` no longer crashes on a null coupon — the whole coupon path is gone |
| 5.2 | 100%-discount coupons can't break checkout — no coupons |
| 5.3 | Cross-device merge is now a **union** of local and cloud keys, with a `dataUpdatedAt` timestamp deciding conflicts. No answer is ever discarded. |
| 5.4 | Page index and data now come from a consistent merge |
| 5.5 | Legacy non-namespaced `ar_scroll_pos` fallback removed; scroll writes are rAF-throttled |
| 5.6 | A worse Day-7 score renders as `−25%`, not `+-25%`, in orange, with an honest share caption |
| 5.7 | "Get My Custom Plan" now opens WhatsApp with a pre-filled message instead of linking to `#` |
| 5.8 | Use-before-declare gone with `InfluencerPortal.jsx` |
| 5.9 | `Date.now()` no longer called during render — one ticker feeds a `now` state |
| 5.10 | The `nativeEvent` sniffing hack is gone; `CheckoutModal` calls `onProceed()` cleanly |
| 5.11 | The checkout modal closes before Razorpay opens |
| 5.12 | All three `alert()` calls replaced with a `Toast` component |
| 5.13 | **Password reset added** — "Forgot your password?" on sign-in, with a reset mode that doesn't leak whether an address has an account |
| 5.15 | `ErrorBoundary` at the root and around the page content |
| 5.16 | Meta Pixel `<noscript>` moved out of `<head>`; the build parse error is gone |

Also: a double-submit guard on checkout, Razorpay `ondismiss` resetting the busy
state, and Google sign-in popup cancellation no longer showing an error.

---

## 6. Revenue and marketing

- **Funnel events added.** `ViewContent` on landing-page mount and
  `InitiateCheckout` when the checkout modal opens, alongside the existing
  `PageView` and `Purchase`. Meta now has mid-funnel signal to optimise against,
  which matters far more at ₹99 than it did at ₹399.
- **Purchase CAPI now sends a hashed email**, materially improving match quality,
  and only fires on the first grant (replays no longer double-count).
- **Social/SEO metadata added**: title, description, canonical, Open Graph and
  Twitter card tags, resolved to the real domain at build time (`vite.config.js`).
- **A 1200×630 share image** was generated at `webapp/public/share.png` — shares
  on WhatsApp/Instagram/Twitter now render a card instead of a bare URL. Replace
  it if you'd rather use your own artwork.
- **Refund contradiction resolved.** The landing page's "no questions asked" next
  to a completion-conditional guarantee was a genuine dispute risk. Both surfaces
  now say the same thing: complete the 7 days, email within 7 days of finishing,
  100% back, no interrogation.

---

## 7. Code quality

- **Lint: 28 errors → 0.** Unused imports and dead state removed across Days 1–4;
  `PAGE_PATTERNS` extracted from `Mascot.jsx` into `components/pagePatterns.js`
  so that file exports only a component; ESLint now has a Node override for
  `api/`, so `process.env` is no longer five false positives.
- **Initial bundle: 968 kB → 389 kB (269 kB → 116 kB gzipped).** Days, Intro,
  Auth and Completion are `React.lazy`; Firestore loads on demand via `getDb()`;
  `html2canvas` is imported only when someone taps download/share; Firebase
  Analytics (initialised, never used) removed.
- **Firestore writes debounced** to 1.2 s. It used to be one write per keystroke.
- **Accessibility**: `useModalA11y` gives all three modals Escape-to-close, a
  focus trap, focus restore and scroll lock; `ClickBox` is now a real
  `role="checkbox"` that works from the keyboard; form labels added
  (visually hidden); focus-visible styling added globally; day-progress nodes are
  buttons with labels; `prefers-reduced-motion` respected.
- **CI added** (`.github/workflows/ci.yml`) — lint + build on push and PR.
- **Repo cleaned**: `landing/`, `webapp/public/landing.html` (an orphaned sales
  page Vercel was still serving with dead CTAs), `webapp/scratch/`, the Vite
  template SVGs, and the committed `test_*.pdf` artefacts are gone. The Python
  PDF tooling moved to `tools/pdf/`. `webapp/README.md` is now real documentation
  instead of the Vite template text.

---

## 8. Deliberately not done

- **No test suite.** CI runs lint and build only. Adding Vitest and meaningful
  coverage of the payment path is worth doing and is the obvious next step, but
  it is new tooling rather than a fix, so it isn't in this pass.
- **The seven Day pages were not merged into a shared template.** The audit
  flagged ~2,000 lines of duplication and it is a fair criticism, but rewriting
  seven pages of tuned, paid content carries real regression risk for zero
  user-visible benefit. Worth doing deliberately, not as part of a fix sweep.
- **The day-unlock timing was left as-is** — it opens at local midnight and
  trusts the device clock. It matches the on-screen copy ("Next Day Unlocks
  Tomorrow" plus a countdown to midnight), and server-enforcing it would be
  disproportionate for a self-paced product.
- **No email infrastructure.** Still no welcome email, receipt of your own, or
  Day-2 nudge. This is the largest remaining gap in the business and it needs a
  product decision (and an ESP) rather than a code change.
