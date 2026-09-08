import { PRODUCTS, readEntitlements, resolvePurchase } from '../api/_products.js';

let pass = 0;
let fail = 0;

function check(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name}\n          expected ${e}\n          actual   ${a}`);
  }
}

const HOUR = 60 * 60 * 1000;
const NOW = 1_700_000_000_000;

const buy = (product, userData, now = NOW) => {
  const r = resolvePurchase({ product: PRODUCTS[product], userData, now });
  return r.allowed
    ? { allowed: true, rupees: r.priceRupees, discounted: r.discounted }
    : { allowed: false, reason: r.reason };
};

console.log('\n── readEntitlements ──');
check('empty doc owns nothing', readEntitlements({}), { reset7: false, deepwork: false });
check(
  'legacy isEnrolled reads as reset7',
  readEntitlements({ isEnrolled: true }),
  { reset7: true, deepwork: false }
);
check(
  'entitlements map wins',
  readEntitlements({ entitlements: { reset7: true, deepwork: true } }),
  { reset7: true, deepwork: true }
);
check(
  'deepwork never inferred from isEnrolled',
  readEntitlements({ isEnrolled: true, entitlements: {} }),
  { reset7: true, deepwork: false }
);
check('null doc is safe', readEntitlements(null), { reset7: false, deepwork: false });

console.log('\n── reset7 ──');
check('new user can buy at 99', buy('reset7', {}), { allowed: true, rupees: 99, discounted: false });
check(
  'legacy enrolled user cannot rebuy',
  buy('reset7', { isEnrolled: true }),
  { allowed: false, reason: 'already_owned' }
);

console.log('\n── deepwork prerequisite ──');
check(
  'cannot buy without the reset',
  buy('deepwork', {}),
  { allowed: false, reason: 'missing_prerequisite' }
);
check(
  'cannot rebuy what is owned',
  buy('deepwork', { isEnrolled: true, entitlements: { deepwork: true } }),
  { allowed: false, reason: 'already_owned' }
);

console.log('\n── deepwork new-buyer window (48h) ──');
const enrolled = (agoHours) => ({ isEnrolled: true, enrolled_at: NOW - agoHours * HOUR });

check('1h after enrolling → 699', buy('deepwork', enrolled(1)), { allowed: true, rupees: 699, discounted: true });
check('47h → still 699', buy('deepwork', enrolled(47)), { allowed: true, rupees: 699, discounted: true });
check('exactly 48h → still 699', buy('deepwork', enrolled(48)), { allowed: true, rupees: 699, discounted: true });
check('49h → full 1000', buy('deepwork', enrolled(49)), { allowed: true, rupees: 1000, discounted: false });
check('30 days later → full 1000', buy('deepwork', enrolled(720)), { allowed: true, rupees: 1000, discounted: false });

console.log('\n── window edge cases ──');
check(
  'no enrolled_at → full price, never free',
  buy('deepwork', { isEnrolled: true }),
  { allowed: true, rupees: 1000, discounted: false }
);
check(
  'enrolled_at in the future (clock skew) → full price',
  buy('deepwork', { isEnrolled: true, enrolled_at: NOW + 5 * HOUR }),
  { allowed: true, rupees: 1000, discounted: false }
);
check(
  'Firestore Timestamp object is understood',
  buy('deepwork', { isEnrolled: true, enrolled_at: { toMillis: () => NOW - 2 * HOUR } }),
  { allowed: true, rupees: 699, discounted: true }
);
check(
  'Date object is understood',
  buy('deepwork', { isEnrolled: true, enrolled_at: new Date(NOW - 2 * HOUR) }),
  { allowed: true, rupees: 699, discounted: true }
);
check(
  'garbage enrolled_at → full price',
  buy('deepwork', { isEnrolled: true, enrolled_at: 'yesterday' }),
  { allowed: true, rupees: 1000, discounted: false }
);

console.log('\n── paise conversion ──');
const r = resolvePurchase({ product: PRODUCTS.deepwork, userData: enrolled(1), now: NOW });
check('699 → 69900 paise', r.pricePaise, 69900);
const full = resolvePurchase({ product: PRODUCTS.deepwork, userData: enrolled(99), now: NOW });
check('1000 → 100000 paise', full.pricePaise, 100000);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
