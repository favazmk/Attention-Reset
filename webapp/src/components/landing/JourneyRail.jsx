import React, { useEffect, useRef, useState } from 'react';

/**
 * The 7-day programme as a journey rather than seven cards.
 *
 * A lit spine runs down the left; whichever day is nearest the middle of the
 * viewport becomes active, days above it read as completed, days below stay
 * dim. Scrolling *is* the interaction — there is no carousel state to get out
 * of sync, and it behaves identically on a phone and a desktop.
 *
 * Rows are also focusable buttons, so the same progression is reachable from
 * the keyboard for anyone who isn't scrolling with a mouse.
 */
export default function JourneyRail({ days }) {
  const [active, setActive] = useState(0);
  const rowRefs = useRef([]);

  useEffect(() => {
    const nodes = rowRefs.current.filter(Boolean);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return undefined;

    // A narrow band across the middle of the viewport. Whatever is inside it is
    // what the reader is looking at, so that's what lights up.
    //
    // More than one row can be in the band at once — a short row, a fast scroll,
    // or the initial batch where every row reports at the same instant. Taking
    // the last entry would light whichever happened to be reported last (on load,
    // day 7). So the intersecting set is tracked, and the row whose centre is
    // nearest the viewport's centre wins.
    const intersecting = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const i = Number(entry.target.dataset.index);
          if (Number.isNaN(i)) return;
          if (entry.isIntersecting) intersecting.add(i);
          else intersecting.delete(i);
        });

        if (!intersecting.size) return;

        const mid = window.innerHeight / 2;
        let best = null;
        let bestDistance = Infinity;

        intersecting.forEach((i) => {
          const el = rowRefs.current[i];
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - mid);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        });

        if (best !== null) setActive(best);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [days.length]);

  const progress = ((active + 1) / days.length) * 100;

  return (
    <div className="l-journey">
      <div className="l-journey-spine" aria-hidden="true">
        <span className="l-journey-spine-fill" style={{ height: `${progress}%` }} />
      </div>

      <ol className="l-journey-list">
        {days.map((d, i) => (
          <li
            key={d.n}
            ref={(el) => { rowRefs.current[i] = el; }}
            data-index={i}
            className="l-journey-row"
            data-state={i === active ? 'active' : i < active ? 'done' : 'ahead'}
            style={{ '--day-rgb': d.rgb, '--day-hex': d.color }}
          >
            <button
              type="button"
              className="l-journey-hit"
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className="l-journey-node" aria-hidden="true" />

              <span className="l-journey-body">
                <span className="l-journey-n">
                  Day <b>{d.n}</b>
                </span>
                <span className="l-journey-title">{d.title}</span>
                <span className="l-journey-action">{d.action}</span>
                <span className="l-journey-feel">
                  <span className="l-journey-feel-k">Outcome</span>
                  {d.feel}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
