/**
 * Client-side view of what the user owns.
 *
 * Deliberately the same shape as `api/_products.js#readEntitlements`, and
 * deliberately only about *reading*. Prices are never mirrored here — the offer
 * screen asks `/api/offer` for the number, so there is exactly one place that
 * decides what anything costs.
 */
export function readEntitlements(userData) {
  const data = userData || {};
  const owned = data.entitlements || {};
  return {
    // Accounts that bought before there was more than one product carry a bare
    // `isEnrolled` flag and no entitlements map. It always meant this.
    reset7: owned.reset7 === true || data.isEnrolled === true,
    deepwork: owned.deepwork === true,
  };
}
