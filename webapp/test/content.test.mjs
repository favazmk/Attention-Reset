import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  weekTaskIds,
  weekReflectionIds,
  isWeekComplete,
  weekProgress,
  DW_PAGES,
} from '../src/pages/deepwork/content.js';
import { WEEK_OUTLINE, TOTAL_DAYS, TOTAL_WEEKS } from '../src/pages/deepwork/outline.js';
import { WEEKS } from '../api/_deepwork-content.js';

let pass = 0;
let fail = 0;
const ok = (n, c) => {
  if (c) { pass++; console.log('  PASS  ' + n); }
  else { fail++; console.log('  FAIL  ' + n); }
};

console.log('\n-- programme shape (server side) --');
ok(`${TOTAL_WEEKS} weeks`, WEEKS.length === TOTAL_WEEKS);
ok('every week has 7 daily practices', WEEKS.every((w) => w.practice.days.length === 7));
ok(`${TOTAL_DAYS} daily practices total`,
   WEEKS.reduce((n, w) => n + w.practice.days.length, 0) === TOTAL_DAYS);
ok('every week has reflections', WEEKS.every((w) => w.reflect.length > 0));
ok('every week has colour, title, promise, close',
   WEEKS.every((w) => w.color && w.title && w.promise && w.close));
ok('every week has a from/to shift', WEEKS.every((w) => w.shift?.from && w.shift?.to));
ok('every week names a background pattern', WEEKS.every((w) => typeof w.pattern === 'string'));

console.log('\n-- navigation is derived from the outline, not the fetched content --');
ok('6 pages', DW_PAGES.length === TOTAL_WEEKS + 2);
ok('pages in order',
   DW_PAGES.join(',') === 'dw_intro,dw_week1,dw_week2,dw_week3,dw_week4,dw_completion');

console.log('\n-- the offer cannot promise more than the programme delivers --');
ok('outline and content have the same number of weeks', WEEK_OUTLINE.length === WEEKS.length);
for (const o of WEEK_OUTLINE) {
  const w = WEEKS.find((x) => x.key === o.key);
  ok(`week ${o.n}: exists server-side`, !!w);
  ok(`week ${o.n}: title matches what the buyer was shown`, w?.title === o.title);
  ok(`week ${o.n}: promise matches`, w?.promise === o.promise);
  ok(`week ${o.n}: colour matches`, w?.color === o.color);
  ok(`week ${o.n}: delivers the ${o.days} days promised`, w?.practice.days.length === o.days);
}

console.log('\n-- field key hygiene --');
const allIds = WEEKS.flatMap((w) => [...weekTaskIds(w), ...weekReflectionIds(w)]);
ok(`no duplicate field ids (${allIds.length} ids)`, new Set(allIds).size === allIds.length);
ok('every id is dw_ prefixed, so it cannot collide with the 7-day progress bag',
   allIds.every((id) => id.startsWith('dw_')));

console.log('\n-- week completion gating --');
const w1 = WEEKS[0];
ok('empty -> not complete', isWeekComplete(w1, {}) === false);
const tasksOnly = Object.fromEntries(weekTaskIds(w1).map((id) => [id, true]));
ok('tasks but no reflections -> not complete', isWeekComplete(w1, tasksOnly) === false);
const full = { ...tasksOnly, ...Object.fromEntries(weekReflectionIds(w1).map((id) => [id, 'x'])) };
ok('tasks + reflections -> complete', isWeekComplete(w1, full) === true);
const whitespace = {
  ...tasksOnly,
  ...Object.fromEntries(weekReflectionIds(w1).map((id) => [id, '   '])),
};
ok('whitespace-only reflections do not count', isWeekComplete(w1, whitespace) === false);

console.log('\n-- progress --');
const p0 = weekProgress(w1, {});
ok(`empty -> 0 of ${p0.total}`, p0.done === 0 && p0.total === 7 + w1.reflect.length);
ok('full -> done equals total', (() => { const p = weekProgress(w1, full); return p.done === p.total; })());

console.log('\n-- no invented empirical claims in the paid prose --');
const prose = WEEKS.flatMap((w) => [...w.why, w.promise, w.close, w.practice.intro]).join(' ');
ok('no percentage or multiplier claims',
   (prose.match(/\b\d+\s?(%|percent|times|x)\b/gi) || []).length === 0);
ok('no appeals to studies or research',
   (prose.match(/\b(stud(y|ies)|research|scientists?|proven|clinically)\b/gi) || []).length === 0);

console.log('\n-- the paywall: paid material must not reach the client bundle --');
// A phrase from each week's practice, which only the server module should hold.
const canaries = WEEKS.map((w) => w.practice.days[0]);

// fileURLToPath, not .pathname - the repo path contains spaces, which a URL
// percent-encodes and readdirSync will not find.
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  );
const srcFiles = walk(srcDir);
const leakedSrc = srcFiles.filter((f) => {
  const text = readFileSync(f, 'utf8');
  return canaries.some((c) => text.includes(c));
});
ok('no paid practice text anywhere under src/', leakedSrc.length === 0);
if (leakedSrc.length) leakedSrc.forEach((f) => console.log('        leaked in ' + f));

const distDir = fileURLToPath(new URL('../dist/assets/', import.meta.url));
if (existsSync(distDir)) {
  const leakedDist = readdirSync(distDir).filter((f) => {
    if (!f.endsWith('.js')) return false;
    const text = readFileSync(join(distDir, f), 'utf8');
    return canaries.some((c) => text.includes(c));
  });
  ok('no paid practice text in any built chunk', leakedDist.length === 0);
  if (leakedDist.length) leakedDist.forEach((f) => console.log('        leaked in dist/assets/' + f));
} else {
  console.log('  SKIP  dist/ not built - run `npm run build` to check the shipped chunks');
}

// A client file importing the server module would silently re-bundle the whole
// programme and undo the paywall, while every other check here still passed.
const crossImports = srcFiles.filter((f) => {
  if (!/\.(js|jsx)$/.test(f)) return false;
  return /from\s+['"][^'"]*\/api\//.test(readFileSync(f, 'utf8'));
});
ok('nothing under src/ imports from api/', crossImports.length === 0);
if (crossImports.length) crossImports.forEach((f) => console.log('        imports api/ in ' + f));

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
