/**
 * Per-day background washes. Kept out of Mascot.jsx so that file only exports a
 * component — mixing components and constants in one module breaks Fast Refresh.
 */
export const PAGE_PATTERNS = {
  day1: (color) => ({
    backgroundImage: `
      radial-gradient(circle at 90% 10%, ${color}15 0%, transparent 40%),
      repeating-linear-gradient(0deg, transparent, transparent 28px, ${color}08 28px, ${color}08 29px),
      repeating-linear-gradient(90deg, transparent, transparent 28px, ${color}08 28px, ${color}08 29px)
    `,
  }),
  day2: (color) => ({
    backgroundImage: `
      radial-gradient(circle at 10% 80%, ${color}12 0%, transparent 35%),
      repeating-linear-gradient(45deg, ${color}06 0%, ${color}06 1px, transparent 1px, transparent 20px),
      repeating-linear-gradient(-45deg, ${color}06 0%, ${color}06 1px, transparent 1px, transparent 20px)
    `,
  }),
  day3: (color) => ({
    backgroundImage: `
      radial-gradient(circle at 50% 40%, ${color}18 0%, transparent 50%),
      radial-gradient(circle at 50% 40%, transparent 30%, ${color}08 31%, ${color}08 32%, transparent 33%),
      radial-gradient(circle at 50% 40%, transparent 42%, ${color}06 43%, ${color}06 44%, transparent 45%)
    `,
  }),
  day4: (color) => ({
    backgroundImage: `
      radial-gradient(circle at 80% 50%, ${color}15 0%, transparent 40%),
      repeating-linear-gradient(170deg, transparent, transparent 12px, ${color}06 12px, ${color}06 13px)
    `,
  }),
  day5: (color) => ({
    backgroundImage: `
      radial-gradient(circle at 50% 20%, ${color}12 0%, transparent 30%),
      repeating-linear-gradient(0deg, ${color}07 0%, ${color}07 1px, transparent 1px, transparent 40px),
      repeating-linear-gradient(90deg, ${color}07 0%, ${color}07 1px, transparent 1px, transparent 40px)
    `,
  }),
  day6: (color) => ({
    backgroundImage: `
      radial-gradient(ellipse at 50% 100%, ${color}18 0%, transparent 50%),
      repeating-linear-gradient(180deg, transparent, transparent 18px, ${color}05 18px, ${color}05 19px, transparent 19px, transparent 36px, ${color}08 36px, ${color}08 37px)
    `,
  }),
  day7: (color) => ({
    backgroundImage: `
      radial-gradient(circle at 50% 30%, ${color}20 0%, transparent 45%),
      radial-gradient(circle at 15% 70%, ${color}10 0%, transparent 25%),
      radial-gradient(circle at 85% 70%, ${color}10 0%, transparent 25%)
    `,
  }),
};
