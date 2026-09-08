import {
  WEEKS,
  DW_PAGES,
  weekTaskIds,
  weekReflectionIds,
  isWeekComplete,
  weekProgress,
} from '../src/pages/deepwork/content.js';
import { WEEK_OUTLINE, TOTAL_DAYS } from '../src/pages/deepwork/outline.js';

let pass = 0;
let fail = 0;
const ok = (n, c) => {
  if (c) { pass++; console.log('  PASS  ' + n); }
  else { fail++; console.log('  FAIL  ' + n); }
};

console.log('\n-- programme shape --');
ok('4 weeks', WEEKS.length === 4);
ok('outline and content agree on week count', WEEKS.length === WEEK_OUTLINE.length);
ok('6 pages (intro + 4 weeks + completion)', DW_PAGES.length === 6);
ok(
  'pages in order',
  DW_PAGES.join(',') === 'dw_intro,dw_week1,dw_week2,dw_week3,dw_week4,dw_completion'
);
ok('every week has 7 daily practices', WEEKS.every((w) => w.practice.days.length === 7));
ok(`${TOTAL_DAYS} daily practices, matching the outline`,
   WEEKS.reduce((n, w) => n + w.practice.days.length, 0) === TOTAL_DAYS);
ok('every week has reflections', WEEKS.every((w) => w.reflect.length > 0));
ok('every week has colour, title, promise, close',
   WEEKS.every((w) => w.color && w.title && w.promise && w.close));
ok('every week has a from/to shift', WEEKS.every((w) => w.shift?.from && w.shift?.to));
ok('every week names a background pattern', WEEKS.every((w) => typeof w.pattern === 'string'));

console.log('\n-- the offer cannot promise more than the programme delivers --');
for (const o of WEEK_OUTLINE) {
  const w = WEEKS.find((x) => x.key === o.key);
  ok(`week ${o.n}: title matches the outline the buyer saw`, w?.title === o.title);
  ok(`week ${o.n}: day count matches the outline (${o.days})`, w?.practice.days.length === o.days);
}

console.log('\n-- field key hygiene --');
const allIds = WEEKS.flatMap((w) => [...weekTaskIds(w), ...weekReflectionIds(w)]);
ok(`no duplicate field ids (${allIds.length} ids)`, new Set(allIds).size === allIds.length);
ok('every id is dw_ prefixed, so it cannot collide with the 7-day progress bag',
   allIds.every((id) => id.startsWith('dw_')));
ok('week numbers are 1..4', WEEKS.map((w) => w.n).join(',') === '1,2,3,4');

console.log('\n-- week completion gating --');
const w1 = WEEKS[0];
ok('empty -> not complete', isWeekComplete(w1, {}) === false);
const tasksOnly = Object.fromEntries(weekTaskIds(w1).map((id) => [id, true]));
ok('tasks but no reflections -> not complete', isWeekComplete(w1, tasksOnly) === false);
const full = {
  ...tasksOnly,
  ...Object.fromEntries(weekReflectionIds(w1).map((id) => [id, 'x'])),
};
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

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
