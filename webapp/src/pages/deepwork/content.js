import { TOTAL_WEEKS } from './outline.js';

/**
 * Structure only — how a week's progress is keyed and counted.
 *
 * The weeks themselves are NOT here any more. They live in
 * `api/_deepwork-content.js` and arrive at runtime from
 * `/api/deepwork-content`, which checks the entitlement first. Everything in
 * this file operates on a week object it is handed, so it works the same
 * whether that object came from the network or a test fixture — and none of the
 * paid material ends up in the bundle.
 *
 * Field keys are derived from the week's `key`, so they are stable across
 * content edits: renaming a week's title does not orphan someone's progress.
 */

export function weekTaskIds(week) {
  return week.practice.days.map((_, i) => `dw_${week.key}_d${i + 1}`);
}

export function weekReflectionIds(week) {
  return week.reflect.map((r) => r.id);
}

/** A week is done when every task is ticked and every reflection has something in it. */
export function isWeekComplete(week, data) {
  const tasksDone = weekTaskIds(week).every((id) => data[id]);
  const reflectionsDone = weekReflectionIds(week).every((id) => data[id]?.trim());
  return tasksDone && reflectionsDone;
}

export function weekProgress(week, data) {
  const taskIds = weekTaskIds(week);
  const reflectIds = weekReflectionIds(week);
  const done =
    taskIds.filter((id) => data[id]).length + reflectIds.filter((id) => data[id]?.trim()).length;
  return { done, total: taskIds.length + reflectIds.length };
}

/**
 * Derived from the outline rather than the content, so navigation and the
 * progress track exist before — and even without — the fetched weeks.
 */
export const DW_PAGES = [
  'dw_intro',
  ...Array.from({ length: TOTAL_WEEKS }, (_, i) => `dw_week${i + 1}`),
  'dw_completion',
];
