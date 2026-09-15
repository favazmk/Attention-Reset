import crypto from 'node:crypto';
import { buildUserData } from '../api/_meta.js';

let pass = 0;
let fail = 0;
const ok = (n, c) => {
  if (c) { pass++; console.log('  PASS  ' + n); }
  else { fail++; console.log('  FAIL  ' + n); }
};

const sha256 = (v) => crypto.createHash('sha256').update(v).digest('hex');

const req = (cookie, extra = {}) => ({
  headers: {
    cookie,
    'user-agent': 'Mozilla/5.0 (test)',
    'x-forwarded-for': '203.0.113.9, 70.41.3.18',
    ...extra,
  },
});

console.log('\n-- PII must be hashed before it leaves for Meta --');
const withUser = buildUserData(req(''), { email: 'Favaz@Example.com ', uid: 'uid_abc123' });

ok('email is not sent in the clear',
   JSON.stringify(withUser).toLowerCase().includes('favaz@example.com') === false);
ok('email is sha256, lowercased and trimmed first',
   withUser.em?.[0] === sha256('favaz@example.com'));
ok('uid is not sent in the clear',
   JSON.stringify(withUser).includes('uid_abc123') === false);
ok('uid is sha256 as external_id', withUser.external_id?.[0] === sha256('uid_abc123'));

console.log('\n-- click and browser ids are forwarded raw (Meta requires this) --');
const withCookies = buildUserData(
  req('_fbp=fb.1.1700000000.987654321; _fbc=fb.1.1700000000.IwAR0abc; other=x')
);
ok('_fbp extracted', withCookies.fbp === 'fb.1.1700000000.987654321');
ok('_fbc extracted (the ad click id - strongest attribution signal)',
   withCookies.fbc === 'fb.1.1700000000.IwAR0abc');
ok('unrelated cookies are not forwarded',
   JSON.stringify(withCookies).includes('other') === false);

console.log('\n-- request context --');
ok('takes the first ip from x-forwarded-for, not the proxy chain',
   withCookies.client_ip_address === '203.0.113.9');
ok('forwards user agent', withCookies.client_user_agent === 'Mozilla/5.0 (test)');

console.log('\n-- degrades safely --');
const bare = buildUserData({ headers: {} });
ok('no cookie header does not throw', typeof bare === 'object');
ok('absent fields are omitted, not sent as undefined strings',
   bare.fbp === undefined && bare.em === undefined && bare.external_id === undefined);
const anon = buildUserData(req('_fbp=fb.1.2.3'));
ok('anonymous visitor still yields fbp for matching', anon.fbp === 'fb.1.2.3');
ok('anonymous visitor carries no identity fields',
   anon.em === undefined && anon.external_id === undefined);

console.log('\n-- malformed cookie headers --');
for (const bad of ['=novalue', 'novalue', '; ;;', '_fbp=', 'a=b; _fbp=ok']) {
  let threw = false;
  try { buildUserData(req(bad)); } catch { threw = true; }
  ok(`cookie header ${JSON.stringify(bad)} does not throw`, !threw);
}
ok('a valid _fbp is still found among junk', buildUserData(req('a=b; _fbp=ok')).fbp === 'ok');

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
