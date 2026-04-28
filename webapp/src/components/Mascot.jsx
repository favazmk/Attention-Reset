import React from 'react';

/* ─── SVG Characters ─────────────────────────────────────── */

const ScrollerSVG = ({ color }) => (
  <svg viewBox="0 0 80 90" width="72" height="81" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Phone body = the "face" */}
    <rect x="18" y="8" width="44" height="64" rx="8" stroke={color} strokeWidth="2" fill={color + '10'}/>
    <rect x="22" y="14" width="36" height="48" rx="4" fill={color + '18'}/>
    {/* Home button */}
    <circle cx="40" cy="78" r="3" stroke={color} strokeWidth="1.5"/>
    {/* Glazed rectangular eyes (screen glow) */}
    <rect x="26" y="26" width="11" height="8" rx="2" fill={color} opacity="0.85"/>
    <rect x="43" y="26" width="11" height="8" rx="2" fill={color} opacity="0.85"/>
    {/* Screen reflections */}
    <line x1="28" y1="28" x2="28" y2="32" stroke="white" strokeWidth="0.8" opacity="0.6"/>
    <line x1="45" y1="28" x2="45" y2="32" stroke="white" strokeWidth="0.8" opacity="0.6"/>
    {/* Slack jaw / open mouth */}
    <path d="M30 44 Q40 52 50 44" fill={color + '33'} stroke={color} strokeWidth="1.5"/>
    {/* Notification badge floating */}
    <circle cx="10" cy="22" r="6" fill={color}/>
    <text x="6.5" y="26" fill="white" fontSize="7" fontFamily="monospace" fontWeight="bold">3</text>
    <circle cx="70" cy="16" r="5" fill={color} opacity="0.7"/>
    <text x="67" y="20" fill="white" fontSize="6" fontFamily="monospace">!</text>
    {/* Wi-fi signal lines top */}
    <path d="M35 18 Q40 15 45 18" stroke={color} strokeWidth="1" opacity="0.5"/>
    <path d="M33 15 Q40 11 47 15" stroke={color} strokeWidth="0.8" opacity="0.3"/>
    {/* Slouch drool */}
    <path d="M40 52 Q41 56 40 60" stroke={color} strokeWidth="1.2" opacity="0.4" strokeLinecap="round"/>
  </svg>
);

const DetectiveSVG = ({ color }) => (
  <svg viewBox="0 0 80 90" width="72" height="81" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hat brim */}
    <rect x="10" y="22" width="60" height="6" rx="2" fill={color} opacity="0.8"/>
    {/* Hat top */}
    <rect x="20" y="6" width="40" height="18" rx="4" fill={color} opacity="0.9"/>
    {/* Face */}
    <ellipse cx="40" cy="52" rx="22" ry="26" fill={color + '12'} stroke={color} strokeWidth="1.5"/>
    {/* Normal left eye */}
    <circle cx="30" cy="48" r="5" fill={color} opacity="0.8"/>
    <circle cx="32" cy="46" r="1.5" fill="white" opacity="0.6"/>
    {/* Magnifying glass right eye */}
    <circle cx="50" cy="48" r="8" stroke={color} strokeWidth="2" fill={color + '20'}/>
    <circle cx="50" cy="48" r="4" fill={color} opacity="0.7"/>
    <circle cx="52" cy="46" r="1.5" fill="white" opacity="0.6"/>
    {/* Magnifying glass handle */}
    <line x1="56" y1="54" x2="63" y2="62" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    {/* Sharp brow */}
    <path d="M23 40 L37 43" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M44 41 L60 38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    {/* Thin mouth - determined */}
    <path d="M32 62 L48 62" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Collar */}
    <path d="M22 75 L30 68 L40 72 L50 68 L58 75" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
  </svg>
);

const MonkSVG = ({ color }) => (
  <svg viewBox="0 0 80 90" width="72" height="81" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Aura rings */}
    <circle cx="40" cy="42" r="36" stroke={color} strokeWidth="0.5" opacity="0.15"/>
    <circle cx="40" cy="42" r="30" stroke={color} strokeWidth="0.5" opacity="0.2"/>
    <circle cx="40" cy="42" r="24" stroke={color} strokeWidth="0.8" opacity="0.3"/>
    {/* Robe/body shape */}
    <path d="M20 72 Q20 56 40 54 Q60 56 60 72 Z" fill={color + '20'} stroke={color} strokeWidth="1.2"/>
    {/* Face */}
    <circle cx="40" cy="40" r="22" fill={color + '15'} stroke={color} strokeWidth="1.5"/>
    {/* Closed eyes - peaceful arcs */}
    <path d="M28 40 Q32 36 36 40" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M44 40 Q48 36 52 40" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Serene smile */}
    <path d="M33 50 Q40 55 47 50" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Third eye dot */}
    <circle cx="40" cy="33" r="2.5" fill={color} opacity="0.8"/>
    {/* Radiating lines from head */}
    <line x1="40" y1="14" x2="40" y2="8" stroke={color} strokeWidth="1" opacity="0.5"/>
    <line x1="54" y1="18" x2="59" y2="13" stroke={color} strokeWidth="1" opacity="0.4"/>
    <line x1="26" y1="18" x2="21" y2="13" stroke={color} strokeWidth="1" opacity="0.4"/>
    <line x1="60" y1="32" x2="68" y2="29" stroke={color} strokeWidth="1" opacity="0.3"/>
    <line x1="20" y1="32" x2="12" y2="29" stroke={color} strokeWidth="1" opacity="0.3"/>
  </svg>
);

const SprinterSVG = ({ color }) => (
  <svg viewBox="0 0 80 90" width="72" height="81" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Speed lines behind */}
    <line x1="2" y1="30" x2="22" y2="30" stroke={color} strokeWidth="1" opacity="0.3"/>
    <line x1="2" y1="38" x2="18" y2="38" stroke={color} strokeWidth="1.5" opacity="0.4"/>
    <line x1="2" y1="46" x2="22" y2="46" stroke={color} strokeWidth="1" opacity="0.3"/>
    <line x1="2" y1="54" x2="15" y2="54" stroke={color} strokeWidth="0.8" opacity="0.2"/>
    {/* Aerodynamic head - tilted forward */}
    <ellipse cx="46" cy="38" rx="20" ry="24" fill={color + '15'} stroke={color} strokeWidth="1.8" transform="rotate(-10 46 38)"/>
    {/* Determined narrow eyes */}
    <path d="M34 33 L44 35" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 36 L60 34" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    {/* Eye glints */}
    <circle cx="39" cy="34" r="1.5" fill={color}/>
    <circle cx="55" cy="35" r="1.5" fill={color}/>
    {/* Clenched jaw line */}
    <path d="M36 50 Q46 48 58 52" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Strong brow */}
    <path d="M33 28 L45 31" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M50 31 L62 27" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    {/* Neck/body forward lean */}
    <path d="M38 60 Q30 68 28 78" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
    {/* Sweat drop */}
    <path d="M68 25 Q70 22 72 25 Q70 30 68 25" fill={color} opacity="0.5"/>
  </svg>
);

const ArchitectSVG = ({ color }) => (
  <svg viewBox="0 0 80 90" width="72" height="81" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Blueprint grid background on face */}
    <rect x="14" y="16" width="52" height="54" rx="4" fill={color + '08'} stroke={color} strokeWidth="1.5"/>
    {/* Grid lines */}
    <line x1="14" y1="29" x2="66" y2="29" stroke={color} strokeWidth="0.5" opacity="0.3"/>
    <line x1="14" y1="42" x2="66" y2="42" stroke={color} strokeWidth="0.5" opacity="0.3"/>
    <line x1="14" y1="55" x2="66" y2="55" stroke={color} strokeWidth="0.5" opacity="0.3"/>
    <line x1="27" y1="16" x2="27" y2="70" stroke={color} strokeWidth="0.5" opacity="0.3"/>
    <line x1="40" y1="16" x2="40" y2="70" stroke={color} strokeWidth="0.5" opacity="0.3"/>
    <line x1="53" y1="16" x2="53" y2="70" stroke={color} strokeWidth="0.5" opacity="0.3"/>
    {/* Face features - geometric */}
    {/* Eyes - diamond shapes */}
    <polygon points="28,38 32,34 36,38 32,42" fill={color} opacity="0.85"/>
    <polygon points="44,38 48,34 52,38 48,42" fill={color} opacity="0.85"/>
    {/* Eye highlights */}
    <circle cx="32" cy="37" r="1" fill="white" opacity="0.7"/>
    <circle cx="48" cy="37" r="1" fill="white" opacity="0.7"/>
    {/* Ruler mouth - precise horizontal */}
    <line x1="30" y1="54" x2="50" y2="54" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="33" y1="57" x2="47" y2="57" stroke={color} strokeWidth="1" opacity="0.4"/>
    {/* Compass on forehead */}
    <circle cx="40" cy="24" r="5" stroke={color} strokeWidth="1.2" fill="none"/>
    <line x1="40" y1="20" x2="40" y2="24" stroke={color} strokeWidth="1"/>
    <line x1="40" y1="24" x2="43" y2="28" stroke={color} strokeWidth="1"/>
    {/* Corner markers */}
    <path d="M14 16 L20 16 L20 22" stroke={color} strokeWidth="1" fill="none" opacity="0.6"/>
    <path d="M66 16 L60 16 L60 22" stroke={color} strokeWidth="1" fill="none" opacity="0.6"/>
    <path d="M14 70 L20 70 L20 64" stroke={color} strokeWidth="1" fill="none" opacity="0.6"/>
    <path d="M66 70 L60 70 L60 64" stroke={color} strokeWidth="1" fill="none" opacity="0.6"/>
  </svg>
);

const DetoxerSVG = ({ color }) => (
  <svg viewBox="0 0 80 90" width="72" height="81" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Flowing water/wave base */}
    <path d="M10 70 Q25 62 40 70 Q55 78 70 70" stroke={color} strokeWidth="1.5" fill="none" opacity="0.4"/>
    <path d="M10 78 Q25 70 40 78 Q55 86 70 78" stroke={color} strokeWidth="1" fill="none" opacity="0.25"/>
    {/* Organic fluid face */}
    <path d="M40 10 C56 10 62 22 62 38 C62 58 54 68 40 68 C26 68 18 58 18 38 C18 22 24 10 40 10Z" 
          fill={color + '15'} stroke={color} strokeWidth="1.8"/>
    {/* Wide open eyes - awakened */}
    <circle cx="30" cy="40" r="7" stroke={color} strokeWidth="1.5" fill={color + '20'}/>
    <circle cx="50" cy="40" r="7" stroke={color} strokeWidth="1.5" fill={color + '20'}/>
    <circle cx="30" cy="40" r="3.5" fill={color} opacity="0.9"/>
    <circle cx="50" cy="40" r="3.5" fill={color} opacity="0.9"/>
    <circle cx="31.5" cy="38.5" r="1.2" fill="white" opacity="0.7"/>
    <circle cx="51.5" cy="38.5" r="1.2" fill="white" opacity="0.7"/>
    {/* Relief/exhale mouth */}
    <path d="M32 54 Q40 62 48 54" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Waves emanating from sides */}
    <path d="M62 32 Q68 28 72 32 Q76 36 72 40" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5"/>
    <path d="M18 32 Q12 28 8 32 Q4 36 8 40" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5"/>
    {/* Cleanse droplets */}
    <path d="M36 8 Q38 4 40 8 Q38 13 36 8" fill={color} opacity="0.5"/>
    <path d="M44 5 Q46 1 48 5 Q46 10 44 5" fill={color} opacity="0.35"/>
    {/* Rising bubbles */}
    <circle cx="20" cy="60" r="2" stroke={color} strokeWidth="1" fill="none" opacity="0.4"/>
    <circle cx="60" cy="56" r="1.5" stroke={color} strokeWidth="1" fill="none" opacity="0.35"/>
  </svg>
);

const MasterSVG = ({ color }) => (
  <svg viewBox="0 0 80 90" width="72" height="81" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer neural glow halo */}
    <circle cx="40" cy="40" r="36" stroke={color} strokeWidth="0.5" opacity="0.2"/>
    {/* Neural network connections */}
    <line x1="10" y1="20" x2="26" y2="30" stroke={color} strokeWidth="0.8" opacity="0.4"/>
    <line x1="70" y1="20" x2="54" y2="30" stroke={color} strokeWidth="0.8" opacity="0.4"/>
    <line x1="10" y1="60" x2="24" y2="52" stroke={color} strokeWidth="0.8" opacity="0.4"/>
    <line x1="70" y1="60" x2="56" y2="52" stroke={color} strokeWidth="0.8" opacity="0.4"/>
    {/* Neural nodes */}
    <circle cx="10" cy="20" r="2.5" fill={color} opacity="0.5"/>
    <circle cx="70" cy="20" r="2.5" fill={color} opacity="0.5"/>
    <circle cx="10" cy="60" r="2.5" fill={color} opacity="0.5"/>
    <circle cx="70" cy="60" r="2.5" fill={color} opacity="0.5"/>
    {/* Diamond/angular face */}
    <path d="M40 10 L64 40 L40 72 L16 40 Z" fill={color + '12'} stroke={color} strokeWidth="1.8"/>
    {/* Inner circuit pattern */}
    <line x1="40" y1="22" x2="40" y2="58" stroke={color} strokeWidth="0.6" opacity="0.3"/>
    <line x1="28" y1="40" x2="52" y2="40" stroke={color} strokeWidth="0.6" opacity="0.3"/>
    {/* Calm powerful eyes */}
    <path d="M28 37 Q32 32 36 37 Q32 42 28 37Z" fill={color} opacity="0.9"/>
    <path d="M44 37 Q48 32 52 37 Q48 42 44 37Z" fill={color} opacity="0.9"/>
    <circle cx="32" cy="37" r="1.2" fill="white" opacity="0.7"/>
    <circle cx="48" cy="37" r="1.2" fill="white" opacity="0.7"/>
    {/* Thin commanding mouth */}
    <path d="M33 52 Q40 56 47 52" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Third eye / circuit node on forehead */}
    <circle cx="40" cy="26" r="4" fill={color} opacity="0.9"/>
    <circle cx="40" cy="26" r="2" fill="white" opacity="0.6"/>
    {/* Circuit sparks */}
    <path d="M36 26 L30 20" stroke={color} strokeWidth="0.8" opacity="0.5"/>
    <path d="M44 26 L50 20" stroke={color} strokeWidth="0.8" opacity="0.5"/>
  </svg>
);

/* ─── Page Background Patterns ───────────────────────────── */
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

/* ─── Mascot Data ─────────────────────────────────────────── */
const MASCOTS = {
  day1: { SVG: ScrollerSVG,   name: 'The Scroller',   vibe: 'Phone in hand. Soul in the cloud. Every ping a tiny hit of dopamine.', mood: 'SCATTERED',   moodColor: '#00E87A' },
  day2: { SVG: DetectiveSVG,  name: 'The Detective',  vibe: 'I see my leaks now. Every distraction leaves a trail.',                  mood: 'AWARE',       moodColor: '#B060FF' },
  day3: { SVG: MonkSVG,       name: 'The Monk',       vibe: 'One task. One hour. The noise is gone — I left it outside.',             mood: 'DISCIPLINED', moodColor: '#3BB8E8' },
  day4: { SVG: SprinterSVG,   name: 'The Sprinter',   vibe: 'Focus is a muscle. Every rep makes me stronger.',                       mood: 'TRAINING',    moodColor: '#F5C842' },
  day5: { SVG: ArchitectSVG,  name: 'The Architect',  vibe: 'I don\'t fight distractions. I designed them out of existence.',         mood: 'STRATEGIC',   moodColor: '#00E5C0' },
  day6: { SVG: DetoxerSVG,    name: 'The Detoxer',    vibe: 'Boredom is not the enemy. It\'s the signal that I\'m healing.',         mood: 'RESETTING',   moodColor: '#FF3B3B' },
  day7: { SVG: MasterSVG,     name: 'The Master',     vibe: 'I don\'t react. I respond. I don\'t scroll. I think. I don\'t resist. I don\'t need to.', mood: 'LOCKED IN', moodColor: '#FF8C00' },
};

/* ─── Component ───────────────────────────────────────────── */
export default function Mascot({ day }) {
  const m = MASCOTS[day];
  if (!m) return null;
  const { SVG, name, vibe, mood, moodColor } = m;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '16px 20px 16px 16px',
      backgroundColor: moodColor + '0D',
      border: `1px solid ${moodColor}28`,
      borderRadius: '8px',
      marginBottom: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '100px', height: '100px',
        background: `radial-gradient(circle, ${moodColor}25, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* SVG Character */}
      <div style={{ flexShrink: 0, animation: `mascot-${day} 3s ease-in-out infinite` }}>
        <SVG color={moodColor} />
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1rem', color: 'var(--cream)' }}>
            {name}
          </span>
          <span style={{
            fontSize: '0.5rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
            color: moodColor, backgroundColor: moodColor + '18',
            border: `1px solid ${moodColor}44`, borderRadius: '3px', padding: '3px 7px',
          }}>
            {mood}
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.5, margin: 0 }}>
          "{vibe}"
        </p>
      </div>
    </div>
  );
}
