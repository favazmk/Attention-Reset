import React, { useEffect, useState } from 'react';
import { authedPost } from '../api';
import useCheckout from '../hooks/useCheckout';
import Toast from './Toast';
import { TOTAL_DAYS, WEEK_OUTLINE } from '../pages/deepwork/outline';

const ACCENT = '#F5C842';

/**
 * The Deep Work System offer.
 *
 * Every number on this screen comes from somewhere real: the weeks, titles and
 * day count are read from the programme's own outline, and the price is fetched
 * from `/api/offer` rather than assumed — so the figure shown is the figure
 * Razorpay will charge, including whether the new-buyer price still applies.
 *
 * It reads `outline.js`, never `content.js`. The latter holds the actual paid
 * material, and importing it here would bundle the whole programme into a chunk
 * served to everyone who reaches this screen without buying.
 *
 * `variant="screen"` is the full-page moment right after the reset is bought.
 * `variant="inline"` is the same offer sitting at the end of Day 7.
 */
export default function UpsellOffer({ variant = 'screen', onDone, onPurchased, user }) {
  const [offer, setOffer] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [toast, setToast] = useState(null);

  const { start, busy } = useCheckout({
    onSuccess: () => onPurchased?.(),
    onError: (message) => setToast({ tone: 'error', message }),
  });

  useEffect(() => {
    let cancelled = false;
    authedPost('/api/offer')
      .then((res) => {
        if (!cancelled) setOffer(res.deepwork);
      })
      .catch((err) => {
        console.error('Offer load failed:', err);
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing is rendered until the price is known — a placeholder price on a
  // payment screen is the one thing that must never flash.
  if (!offer && !loadFailed) {
    return variant === 'screen' ? (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: '#6B6860' }}>
        Loading…
      </div>
    ) : null;
  }

  if (loadFailed || !offer?.allowed) {
    // Already owned, prerequisite missing, or the lookup failed. In the
    // full-screen slot we must not trap the user, so move them along.
    if (variant === 'screen') {
      return (
        <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
          <button
            onClick={onDone}
            style={{
              padding: '16px 40px',
              background: ACCENT,
              color: '#0E0E0B',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Continue to Day 1
          </button>
        </div>
      );
    }
    return null;
  }

  const saving = offer.listPriceRupees - offer.priceRupees;

  const buy = () =>
    start({
      productId: 'deepwork',
      name: offer.name,
      description: '4-week deep work programme',
      prefill: { name: '', email: user?.email || '', contact: '' },
    });

  const body = (
    <>
      <p
        style={{
          fontSize: '0.8rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: ACCENT,
          fontWeight: 700,
          marginBottom: '0.75rem',
        }}
      >
        {variant === 'screen' ? "You're in. One thing before you start." : 'What comes next'}
      </p>

      <h2
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
          color: '#EDE8DC',
          margin: '0 0 1rem',
          lineHeight: 1.15,
        }}
      >
        The reset clears it.
        <br />
        <em style={{ color: ACCENT }}>This rebuilds it.</em>
      </h2>

      <p
        style={{
          color: 'rgba(237,232,220,0.75)',
          fontSize: '1.05rem',
          lineHeight: 1.7,
          maxWidth: '54ch',
          margin: '0 0 2rem',
        }}
      >
        Seven days takes the interference out. It does not build the capacity to do hard
        work for a long time — that takes longer than a week.{' '}
        <strong style={{ color: '#EDE8DC' }}>The Deep Work System</strong> is the four
        weeks that do.
      </p>

      {/* What it actually is — read from the programme itself */}
      <div
        style={{
          background: '#131311',
          border: '1px solid #2C2C26',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}
      >
        {WEEK_OUTLINE.map((w, i) => (
          <div
            key={w.key}
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'baseline',
              padding: '14px 18px',
              borderTop: i === 0 ? 'none' : '1px solid #2C2C26',
            }}
          >
            <span
              style={{
                color: w.color,
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: '1.5px',
                minWidth: '54px',
                flexShrink: 0,
              }}
            >
              WEEK {w.n}
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', color: '#EDE8DC', fontSize: '1rem' }}>
                {w.title}
              </span>
              <span
                style={{
                  display: 'block',
                  color: 'rgba(237,232,220,0.55)',
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  marginTop: '2px',
                }}
              >
                {w.promise}
              </span>
            </span>
          </div>
        ))}

        <div
          style={{
            borderTop: '1px solid #2C2C26',
            padding: '14px 18px',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
            color: 'rgba(237,232,220,0.6)',
          }}
        >
          <span>{TOTAL_DAYS} daily practices</span>
          <span>Written system you keep</span>
          <span>Same app, same login</span>
        </div>
      </div>

      {/* Price */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '0.5rem',
        }}
      >
        {offer.discounted && (
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.2rem',
              color: '#6B6860',
              textDecoration: 'line-through',
            }}
          >
            ₹{offer.listPriceRupees}
          </span>
        )}
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '2.8rem',
            fontWeight: 700,
            color: ACCENT,
            lineHeight: 1,
          }}
        >
          ₹{offer.priceRupees}
        </span>
      </div>

      {offer.discounted ? (
        <p style={{ color: '#00E87A', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
          New-member price — saves ₹{saving}. {formatWindow(offer.offerEndsAt)}
        </p>
      ) : (
        <p style={{ color: '#6B6860', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
          One-time payment · Lifetime access
        </p>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={buy}
          disabled={busy}
          style={{
            flex: '1 1 240px',
            padding: '17px 32px',
            background: busy ? '#2C2C26' : ACCENT,
            color: busy ? '#6B6860' : '#0E0E0B',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: busy ? 'wait' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {busy ? 'Opening payment…' : `Add it for ₹${offer.priceRupees}`}
        </button>

        {variant === 'screen' && (
          <button
            onClick={onDone}
            style={{
              flex: '0 1 auto',
              padding: '17px 28px',
              background: 'transparent',
              color: '#8a877e',
              border: '1px solid #2C2C26',
              borderRadius: '8px',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            No thanks — start Day 1
          </button>
        )}
      </div>

      <p style={{ color: '#6B6860', fontSize: '0.78rem', marginTop: '1rem' }}>
        {variant === 'screen'
          ? 'Your 7-day reset is already unlocked either way. This is an add-on, not a requirement.'
          : 'Adds to the account you already have. Nothing to re-download.'}
      </p>
    </>
  );

  return (
    <>
      {variant === 'screen' ? (
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
          {body}
        </div>
      ) : (
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '2.5rem',
            background: 'rgba(19,19,17,0.6)',
            border: `1px solid ${ACCENT}33`,
            borderRadius: '16px',
            textAlign: 'left',
          }}
        >
          {body}
        </div>
      )}
      <Toast
        message={toast?.message}
        tone={toast?.tone}
        onDismiss={() => setToast(null)}
      />
    </>
  );
}

/**
 * Describes the remaining window in whole hours, from an absolute deadline.
 * Deliberately vague past a day and silent once expired — the server is the only
 * thing that decides eligibility, so this must never imply more precision (or
 * more urgency) than it actually knows.
 */
function formatWindow(endsAt) {
  if (!endsAt) return '';
  const hoursLeft = Math.floor((endsAt - Date.now()) / (60 * 60 * 1000));
  if (hoursLeft <= 0) return '';
  if (hoursLeft < 24) return `Available for another ${hoursLeft} hour${hoursLeft === 1 ? '' : 's'}.`;
  return 'Available for the next couple of days.';
}
