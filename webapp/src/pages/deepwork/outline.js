/**
 * The marketing-safe outline of the Deep Work System: what a buyer is told they
 * are getting, and nothing more.
 *
 * This exists as its own module so the offer screen can describe the programme
 * without importing it. `content.js` carries every daily practice, every
 * reflection prompt and all the teaching prose — bundlers put that in a chunk,
 * and a chunk is a public URL. Importing it from the pre-purchase screen served
 * the entire paid programme to people who had not bought it, as part of the
 * normal flow.
 *
 * `content.js` builds its weeks from this list, so titles and promises are
 * defined once and the two can never disagree.
 */
export const WEEK_OUTLINE = [
  {
    n: 1,
    key: 'w1',
    color: '#00E5C0',
    title: 'The Long Sprint',
    promise: 'Find out how long you can actually hold a hard problem — then extend it.',
    days: 7,
  },
  {
    n: 2,
    key: 'w2',
    color: '#B060FF',
    title: 'The Weekly Architecture',
    promise: 'Stop defending a day. Design a week.',
    days: 7,
  },
  {
    n: 3,
    key: 'w3',
    color: '#F5C842',
    title: 'The Input Diet',
    promise: 'The reset silenced what arrives. This controls what you go and get.',
    days: 7,
  },
  {
    n: 4,
    key: 'w4',
    color: '#FF8C00',
    title: 'The Self-Running System',
    promise: 'Make it survive a bad week.',
    days: 7,
  },
];

export const TOTAL_DAYS = WEEK_OUTLINE.reduce((n, w) => n + w.days, 0);
export const TOTAL_WEEKS = WEEK_OUTLINE.length;
