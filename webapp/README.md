# 7-Day Attention Reset — web app

React (Vite) SPA plus Vercel serverless functions. Firebase Auth for accounts,
Firestore for progress, Razorpay for payment.

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build
```

> `npm run dev` serves the SPA only — `/api/*` routes need `vercel dev` (or a
> deploy preview) because they run as serverless functions.

## Environment

Copy `.env.example` to `.env` for local work; the real values live in
Vercel → Settings → Environment Variables.

| Variable | Where it runs | What it is |
|---|---|---|
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | server | Razorpay API credentials |
| `FIREBASE_SERVICE_ACCOUNT` | server | Service-account JSON, one line |
| `META_CAPI_TOKEN` | server | Meta Conversions API token (optional — CAPI is skipped without it) |
| `VITE_RAZORPAY_KEY_ID` | browser | Razorpay publishable key |
| `VITE_SITE_URL` | build | Overrides the canonical/OG base URL. On Vercel it is derived from `VERCEL_PROJECT_PRODUCTION_URL` automatically. |

The Firebase web config in `src/firebase.js` is public by design. Access control
lives in Firebase Auth and `../firestore.rules`.

## Price

One number, one place: `api/_pricing.js`. The server creates every order at that
amount and re-checks it against what Razorpay captured, so the browser can never
influence what is charged. The display copy on the landing page (`PRICE`,
`PREVIOUS_PRICE`, `BUNDLE_VALUE` in `src/pages/Landing.jsx`) must be kept in step
with it by hand.

## How access is granted

```
create-order      signed-in user → Razorpay order for PRICE_PAISE, notes.uid = them
                                 → orders/{orderId} recorded in Firestore
Razorpay checkout user pays
verify-payment    signature check → fetch the order back from Razorpay →
                  confirm it is theirs, paid, and for the right amount →
                  purchases/{paymentId} claimed with create() (idempotent) →
                  users/{uid}.isEnrolled = true
check-entitlement called on sign-in for anyone not yet enrolled; reconciles any
                  order Razorpay says was paid but that never got verified
                  (i.e. the browser died mid-checkout)
```

`isEnrolled` is written **only** by the Admin SDK. `firestore.rules` rejects any
attempt by the browser to write it. Never move that decision back to the client.

## Deploying Firestore rules

Rules are not deployed by Vercel — they ship separately, from the repo root:

```bash
firebase deploy --only firestore:rules
```

## Layout

```
api/                serverless functions (_-prefixed files are shared, not routes)
src/pages/          Landing, Auth, Intro, Day1–7, Completion
src/components/     shared UI
src/hooks/          useModalA11y (escape / focus trap / scroll lock)
src/firebase.js     auth eagerly, Firestore lazily via getDb()
src/api.js          authedPost — attaches the Firebase ID token
```

Everything past the landing page is lazily loaded, so a visitor who never signs
up doesn't download the workbook, Firestore, or html2canvas.
