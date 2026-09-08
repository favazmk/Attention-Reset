import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { getProduct, PRODUCTS, readEntitlements } from '../api/_products.js';

const require = createRequire(import.meta.url);
const { DocumentMask } = require('@google-cloud/firestore/build/src/document.js');

let pass = 0;
let fail = 0;
const ok = (n, c) => {
  if (c) { pass++; console.log('  PASS  ' + n); }
  else { fail++; console.log('  FAIL  ' + n); }
};

/**
 * The entitlement write is the one place a silent shape error costs money: a
 * field written under the wrong path reads back as "not entitled", so a paying
 * customer loses access AND can be sold the same thing again.
 *
 * These assert the field paths a set({merge:true}) would actually produce.
 * Backticks in a path mean Firestore escaped it as one literal field name.
 */
const paths = (obj) => DocumentMask.fromObject(obj).toProto().fieldPaths;

console.log('\n-- entitlement write shape --');

const dotted = paths({ 'entitlements.deepwork': true });
ok('dotted keys are NOT a nested path under set() (the trap)',
   dotted[0].includes('`'));

const nested = paths({ entitlements: { deepwork: true } });
ok('nested object gives the real path entitlements.deepwork',
   nested.length === 1 && nested[0] === 'entitlements.deepwork');

// Mirror exactly what grantEntitlement builds, for each product.
const buildUpdate = (productId, existing = {}) => {
  const u = { entitlements: { [productId]: true }, last_payment_id: 'pay_1' };
  if (!existing.entitled_at?.[productId]) u.entitled_at = { [productId]: 'TS' };
  if (productId === 'reset7') {
    u.isEnrolled = true;
    if (!existing.enrolled_at) u.enrolled_at = 'TS';
  }
  return u;
};

for (const id of Object.keys(PRODUCTS)) {
  const p = paths(buildUpdate(id));
  ok(`${id}: writes entitlements.${id} as a nested path`, p.includes(`entitlements.${id}`));
  ok(`${id}: writes entitled_at.${id} as a nested path`, p.includes(`entitled_at.${id}`));
  ok(`${id}: no backtick-escaped literal field names`, !p.some((f) => f.includes('`')));
}

console.log('\n-- the write is readable by the reader --');
// What Firestore stores for a nested merge, as the client would then read it.
const stored = { entitlements: { deepwork: true }, isEnrolled: true };
ok('deepwork entitlement reads back true', readEntitlements(stored).deepwork === true);
ok('a literal dotted field does NOT read back (proves the bug was real)',
   readEntitlements({ 'entitlements.deepwork': true }).deepwork === false);

console.log('\n-- reset7 timestamps are written once --');
const first = buildUpdate('reset7', {});
ok('first grant stamps enrolled_at', first.enrolled_at === 'TS');
const replay = buildUpdate('reset7', { enrolled_at: 'OLD', entitled_at: { reset7: 'OLD' } });
ok('replayed grant does not re-stamp enrolled_at', !('enrolled_at' in replay));
ok('replayed grant does not re-stamp entitled_at', !('entitled_at' in replay));
ok('replayed grant still re-asserts the entitlement', replay.entitlements.reset7 === true);

console.log('\n-- productId lookup is not prototype-confusable --');
for (const bad of ['constructor', '__proto__', 'toString', 'hasOwnProperty', '', 'nope']) {
  ok(`getProduct(${JSON.stringify(bad)}) rejected`, getProduct(bad) === null);
}
ok('getProduct(non-string) rejected', getProduct(123) === null && getProduct(null) === null);
for (const id of Object.keys(PRODUCTS)) {
  ok(`getProduct("${id}") resolves`, getProduct(id)?.id === id);
}

console.log('\n-- razorpay receipt stays within its 40-char limit --');
const uid = 'x'.repeat(40);
for (const id of Object.keys(PRODUCTS)) {
  const receipt = `${id.slice(0, 8)}_${uid.slice(0, 14)}_${Date.now()}`;
  ok(`receipt for ${id} is ${receipt.length} chars (<=40)`, receipt.length <= 40);
}

console.log('\n-- firestore rules cover the fields the server writes --');
const rules = readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8');
const guarded = rules.match(/serverOwnedFields\(\)\s*\{\s*return\s*\[([^\]]*)\]/s)?.[1] ?? '';
for (const field of ['isEnrolled', 'enrolled_at', 'entitlements', 'entitled_at']) {
  ok(`rules guard top-level '${field}'`, guarded.includes(`'${field}'`));
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
