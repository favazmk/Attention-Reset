import React from 'react';
import { useInView } from './useInView';

/**
 * The loop, drawn.
 *
 * The reader recognises their own last twenty minutes here before we've made a
 * single claim. The apps are the same ones the programme audits on Day 2 —
 * this is the product's own list, not a generic set of logos.
 *
 * It plays once on entry and then holds. A distraction loop that keeps
 * animating forever would be its own small hypocrisy on a page about
 * attention.
 */
const HOPS = [
  { app: 'Notification', note: 'One ping.' },
  { app: 'Instagram', note: '“Just five minutes.”' },
  { app: 'YouTube', note: 'Autoplay decides for you.' },
  { app: 'WhatsApp', note: 'Three groups, unread.' },
  { app: 'Email', note: 'The infinite refresh.' },
];

export default function AttentionLoop() {
  const [ref, inView] = useInView({ threshold: 0.25 });

  return (
    <div className={`l-loop ${inView ? 'is-on' : ''}`} ref={ref}>
      <p className="l-loop-open">
        You unlock your phone to do <em>one thing.</em>
      </p>

      <ol className="l-loop-chain">
        {HOPS.map((h, i) => (
          <li className="l-loop-hop" key={h.app} style={{ '--i': i }}>
            <span className="l-loop-connector" aria-hidden="true" />
            <span className="l-loop-chip">
              <span className="l-loop-app">{h.app}</span>
              <span className="l-loop-note">{h.note}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="l-loop-end" style={{ '--i': HOPS.length }}>
        <span className="l-loop-connector l-loop-connector--end" aria-hidden="true" />
        <p className="l-loop-verdict">30 minutes gone.</p>
        <p className="l-loop-verdict-sub">You never did the one thing.</p>
      </div>
    </div>
  );
}
