/**
 * Single source of truth for what we sell, server-side.
 *
 * The client displays prices but never gets to choose one. Every order is
 * created at a price computed here, that price is stamped into the Razorpay
 * order's notes, and the entitlement grant re-checks what Razorpay actually
 * captured against it.
 *
 * Adding a product means adding an entry here and a page route on the client —
 * nothing in the payment path needs to learn about it.
 */

export const CURRENCY = 'INR';

export const PRODUCTS = {
  reset7: {
    id: 'reset7',
    name: '7-Day Attention Reset',
    priceRupees: 99,
    listPriceRupees: 399,
    // Nothing has to be owned first — this is the entry product.
    requires: null,
  },

  deepwork: {
    id: 'deepwork',
    name: 'The Deep Work System',
    priceRupees: 1000,
    listPriceRupees: 1000,
    // The 4-week programme builds directly on the reset, and the only place it
    // is offered is after that purchase. Requiring it keeps the two in order
    // and makes the new-buyer price below mean something.
    requires: 'reset7',

    // A genuine new-buyer price, not a countdown painted on a page. Eligibility
    // is computed here from the server's own record of when the user enrolled,
    // so the browser cannot claim it and a stale tab cannot extend it.
    offer: {
      priceRupees: 699,
      windowHours: 48,
    },
  },
};

export const DEFAULT_PRODUCT_ID = 'reset7';

/**
 * `productId` arrives from the request body and ends up interpolated into a
 * Firestore field name, so the lookup is an own-property check rather than a
 * bare index. A plain `PRODUCTS[id]` returns truthy values for `constructor`,
 * `__proto__` and `toString`, which would slip past a `!product` guard.
 */
export function getProduct(productId) {
  if (typeof productId !== 'string') return null;
  if (!Object.prototype.hasOwnProperty.call(PRODUCTS, productId)) return null;
  return PRODUCTS[productId];
}

export function toPaise(rupees) {
  return Math.round(rupees * 100);
}

/**
 * Normalises whatever a user document happens to hold into a straight answer
 * about what they own.
 *
 * Accounts that bought before there was more than one product carry a bare
 * `isEnrolled: true` and no `entitlements` map. Rather than migrating that
 * data, it is read as the reset7 entitlement it always meant — so an existing
 * customer keeps access without anything having to run over the collection.
 */
export function readEntitlements(userData) {
  const data = userData || {};
  const owned = data.entitlements || {};
  return {
    reset7: owned.reset7 === true || data.isEnrolled === true,
    deepwork: owned.deepwork === true,
  };
}

/**
 * What this user should pay for this product right now, and why.
 *
 * Returns `null` when they may not buy it at all — already owned, or a
 * prerequisite they don't have. Callers treat null as a refusal, not a price
 * of zero.
 */
export function resolvePurchase({ product, userData, now = Date.now() }) {
  const entitlements = readEntitlements(userData);

  if (entitlements[product.id]) {
    return { allowed: false, reason: 'already_owned' };
  }

  if (product.requires && !entitlements[product.requires]) {
    return { allowed: false, reason: 'missing_prerequisite', requires: product.requires };
  }

  let priceRupees = product.priceRupees;
  let discounted = false;

  if (product.offer) {
    // `enrolled_at` is written by the server when the prerequisite was granted.
    // A missing timestamp means we cannot prove they are inside the window, so
    // they pay full price — the failure mode is charging correctly, not free.
    const enrolledAtMs = toMillis(userData?.enrolled_at);
    if (enrolledAtMs !== null) {
      const windowMs = product.offer.windowHours * 60 * 60 * 1000;
      if (now - enrolledAtMs <= windowMs && now >= enrolledAtMs) {
        priceRupees = product.offer.priceRupees;
        discounted = true;
      }
    }
  }

  return {
    allowed: true,
    priceRupees,
    pricePaise: toPaise(priceRupees),
    listPriceRupees: product.listPriceRupees,
    discounted,
  };
}

/** Firestore Timestamp, Date, or epoch millis — all end up as millis or null. */
function toMillis(value) {
  if (!value) return null;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  return null;
}
