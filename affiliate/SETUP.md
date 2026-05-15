# Affiliate System Setup Guide

## What's in the box

| File | What it does |
|------|-------------|
| `api/_firebase-admin.js` | Shared Firebase Admin SDK helper (used by API routes) |
| `api/validate-coupon.js` | Validates a coupon code, returns discount info |
| `api/create-order.js` | Modified — creates Razorpay order with discount applied |
| `api/verify-payment.js` | Modified — records commission to Firestore after payment |
| `src/pages/AffiliateAdmin.jsx` | Admin panel — create coupons, view & manage commissions |
| `LANDING_CHANGES.md` | 4 exact changes to make in Landing.jsx + App.jsx |

---

## Step 1 — Install firebase-admin

In your `webapp/` directory:

```bash
npm install firebase-admin
```

---

## Step 2 — Set up Firestore collections

In your Firebase Console → Firestore Database, create these collections:

### `coupons` collection
Each document ID = the coupon code (e.g., `RAVI10`).
You can create them manually OR use the admin panel (Step 5).

```
coupons / RAVI10 = {
  influencer_name: "Ravi Kumar",
  influencer_email: "ravi@gmail.com",
  discount_percent: 10,
  commission_percent: 50,
  active: true,
  created_at: <timestamp>,
  total_uses: 0,
  total_commission_earned: 0
}
```

### `commissions` collection
Auto-created by the system on every successful coupon purchase. No manual setup needed.

---

## Step 3 — Create a Firebase service account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **"Generate new private key"** → download the JSON file
3. In Vercel dashboard → Your project → Settings → Environment Variables, add:

```
FIREBASE_SERVICE_ACCOUNT = <paste the entire JSON content as a string>
```

⚠️ The JSON must be on one line (or Vercel will handle multiline — just paste it in).

---

## Step 4 — Update Firestore security rules

Add read/write rules for the new collections (only your backend can write commissions):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Existing users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Coupons — anyone can read (needed for admin panel), only server writes
    match /coupons/{code} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email in
        ['favazmk@gmail.com'];  // your admin email
    }

    // Commissions — admin read only, server writes
    match /commissions/{id} {
      allow read, write: if request.auth != null && request.auth.token.email in
        ['favazmk@gmail.com'];  // your admin email
    }
  }
}
```

---

## Step 5 — Apply Landing.jsx + App.jsx changes

Open `LANDING_CHANGES.md` and apply the 4 changes in order:
1. Add coupon state variables + `applyCoupon` + `removeCoupon` functions
2. Replace `handlePayment` function
3. Replace the pricing section JSX
4. Add admin route in App.jsx

---

## Step 6 — Access the admin panel

Go to your app URL + `#admin`:
```
https://your-app.vercel.app/#admin
```

You must be logged in with the admin email (`favazmk@gmail.com`) to access it.

From there you can:
- **Create** coupon codes for influencers
- **Enable / Disable** codes at any time
- **View** all commission records
- **Mark commissions as Paid** after you transfer the money

---

## How it works end-to-end

```
Customer lands on page
    ↓
Clicks "Have a coupon code?" → types RAVI10
    ↓
/api/validate-coupon → Firestore checks code is active
    ↓
Price updates: ₹399 → ₹359 (10% off shown on page)
    ↓
Customer clicks CTA → /api/create-order with coupon_code
    ↓
Razorpay opens with ₹359 order
    ↓
Customer pays
    ↓
/api/verify-payment → verifies signature → writes to commissions collection
    ↓
Commission record: { sale: ₹359, commission: ₹179.50, status: 'pending' }
    ↓
You go to #admin panel → see commission → pay Ravi → mark as Paid
```

---

## Commission math (defaults)

| | Amount |
|---|---|
| Original price | ₹399 |
| Customer pays (10% off) | ₹359 |
| Influencer earns (50% of ₹359) | ₹179.50 |
| You keep | ₹179.50 |

These percentages are configurable per influencer in the admin panel.
