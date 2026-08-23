import React, { useEffect, useState } from 'react';
import { useInView, prefersReducedMotion } from './useInView';

/**
 * Counts from 0 to `to` once, when it first scrolls into view.
 *
 * Driven by requestAnimationFrame against a timestamp rather than a setInterval
 * tick, so the duration holds on a slow device instead of stretching out. A
 * non-numeric value (a range like "10–20") isn't counted — it's rendered
 * through `Range` below.
 */
function Counter({ value, inView }) {
  const numeric = typeof value === 'number';

  // Whether to animate is decided once, synchronously, before the first paint —
  // so a reader who can't have the animation is rendered the real number rather
  // than a zero waiting for an effect to correct it.
  const [canAnimate] = useState(
    () =>
      numeric &&
      typeof requestAnimationFrame === 'function' &&
      !prefersReducedMotion()
  );

  const [shown, setShown] = useState(() => (canAnimate ? 0 : value));

  useEffect(() => {
    if (!canAnimate || !inView) return undefined;

    const DURATION = 900;
    let frame;
    let start;

    const step = (now) => {
      if (start === undefined) start = now;
      const t = Math.min((now - start) / DURATION, 1);
      // easeOutCubic — fast off the line, settles rather than stops.
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    // A stat stuck at 0 is a false claim, not a missing flourish. If the frame
    // loop never advances — a throttled tab, a context that isn't compositing —
    // this lands the true value anyway.
    const settle = setTimeout(() => setShown(value), DURATION + 700);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, [canAnimate, inView, value]);

  return <>{shown}</>;
}

/**
 * Renders a range like "10–20" with the dash in its own element.
 *
 * The headline numbers carry -0.045em of tracking, which is right for digits
 * but closes the gaps either side of an en dash until it welds itself to the
 * first number. The dash needs its own spacing, and it can only get that as a
 * separate element — so the string is split rather than set as one run.
 */
function Range({ value }) {
  const parts = String(value).split(/([–—-])/);

  if (parts.length === 1) return <>{value}</>;

  return (
    <>
      {parts.map((part, i) =>
        /^[–—-]$/.test(part) ? (
          <span className="l-stat-sep" key={i}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function StatBand({ stats }) {
  const [ref, inView] = useInView({ threshold: 0.3 });

  return (
    <div className="l-stats" ref={ref}>
      {stats.map((s) => (
        <div className="l-stat" key={s.label}>
          <div className="l-stat-n">
            {typeof s.value === 'number' ? (
              <Counter value={s.value} inView={inView} />
            ) : (
              <Range value={s.value} />
            )}
            {s.suffix ? <span className="l-stat-suffix">{s.suffix}</span> : null}
          </div>
          <div className="l-stat-k">{s.label}</div>
          {s.note ? <div className="l-stat-note">{s.note}</div> : null}
        </div>
      ))}
    </div>
  );
}
