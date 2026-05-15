import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';

const fmt = (n) => `₹${Number(n).toFixed(2)}`;
const fmtInt = (n) => `₹${Math.round(Number(n))}`;

export default function InfluencerPortal({ couponCode, onBack }) {
  const [state, setState] = useState('loading'); // loading | found | notfound | error
  const [coupon, setCoupon] = useState(null);
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    if (!couponCode) { setState('notfound'); return; }
    load();
  }, [couponCode]);

  const load = async () => {
    try {
      // 1. Fetch coupon doc
      const couponRef = doc(db, 'coupons', couponCode.toUpperCase());
      const couponSnap = await getDoc(couponRef);

      if (!couponSnap.exists()) { setState('notfound'); return; }

      const couponData = { id: couponSnap.id, ...couponSnap.data() };
      setCoupon(couponData);

      // 2. Fetch commissions for this code
      const q = query(
        collection(db, 'commissions'),
        where('coupon_code', '==', couponCode.toUpperCase()),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(q);
      setCommissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));

      setState('found');
    } catch (e) {
      console.error(e);
      setState('error');
    }
  };

  // Derived stats
  const totalSales    = commissions.reduce((s, c) => s + (c.sale_amount || 0), 0);
  const totalEarned   = commissions.reduce((s, c) => s + (c.commission_amount || 0), 0);
  const pendingAmount = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + (c.commission_amount || 0), 0);
  const paidAmount    = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + (c.commission_amount || 0), 0);

  const styles = {
    root: {
      minHeight: '100vh',
      background: '#0E0E0B',
      color: '#EDE8DC',
      fontFamily: "'DM Sans', sans-serif",
    },
    header: {
      background: 'rgba(14,14,11,0.95)',
      borderBottom: '1px solid #2C2C26',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    },
    logo: {
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '2.5px',
      textTransform: 'uppercase',
      color: '#F5C842',
    },
    codeTag: {
      fontSize: '0.72rem',
      fontFamily: 'monospace',
      letterSpacing: '2px',
      color: '#EDE8DC',
      background: 'rgba(245,200,66,0.1)',
      border: '1px solid rgba(245,200,66,0.3)',
      padding: '4px 12px',
      borderRadius: '4px',
    },
    wrap: { maxWidth: '760px', margin: '0 auto', padding: '2.5rem 1.5rem' },
    greeting: {
      marginBottom: '2rem',
    },
    label: {
      fontSize: '0.72rem', color: '#6B6860', textTransform: 'uppercase',
      letterSpacing: '2px', marginBottom: '6px',
    },
    name: {
      fontSize: '1.8rem', fontFamily: "'DM Serif Display', serif",
      color: '#EDE8DC', marginBottom: '6px',
    },
    sub: { fontSize: '0.88rem', color: 'rgba(237,232,220,0.5)', fontWeight: 300 },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '12px',
      marginBottom: '2rem',
    },
    statCard: (accent) => ({
      background: '#1C1C18',
      border: `1px solid ${accent ? 'rgba(245,200,66,0.25)' : '#2C2C26'}`,
      borderRadius: '8px',
      padding: '1.25rem',
    }),
    statLabel: { fontSize: '0.7rem', color: '#6B6860', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
    statVal: (color = '#F5C842') => ({ fontSize: '1.6rem', fontWeight: 700, color }),
    divider: { borderTop: '1px solid #2C2C26', marginBottom: '1.5rem' },
    sectionTitle: { fontSize: '0.72rem', color: '#6B6860', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' },
    infoBox: {
      background: 'rgba(245,200,66,0.04)',
      border: '1px dashed rgba(245,200,66,0.2)',
      borderRadius: '8px',
      padding: '1.25rem',
      marginBottom: '2rem',
      fontSize: '0.85rem',
      color: 'rgba(237,232,220,0.65)',
      lineHeight: '1.6',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      textAlign: 'left', fontSize: '0.68rem', color: '#6B6860',
      textTransform: 'uppercase', letterSpacing: '1px',
      padding: '8px 10px', borderBottom: '1px solid #2C2C26',
    },
    td: { padding: '13px 10px', borderBottom: '1px solid rgba(44,44,38,0.4)', fontSize: '0.85rem' },
    badge: (status) => ({
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '100px',
      fontSize: '0.7rem',
      fontWeight: 600,
      background: status === 'paid' ? 'rgba(0,232,122,0.1)' : 'rgba(245,200,66,0.1)',
      color: status === 'paid' ? '#00E87A' : '#F5C842',
      border: `1px solid ${status === 'paid' ? 'rgba(0,232,122,0.3)' : 'rgba(245,200,66,0.3)'}`,
    }),
    emptyState: {
      textAlign: 'center', padding: '3rem', color: '#6B6860',
      background: '#1C1C18', border: '1px solid #2C2C26',
      borderRadius: '8px',
    },
    centeredFull: {
      minHeight: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '2rem', background: '#0E0E0B', gap: '16px',
    },
  };

  // ── States ─────────────────────────────────────────────────────────────────

  if (state === 'loading') {
    return (
      <div style={styles.centeredFull}>
        <div style={{ width: '28px', height: '28px', border: '2px solid rgba(245,200,66,0.2)', borderTop: '2px solid #F5C842', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: '0.85rem', color: '#6B6860' }}>Loading your dashboard...</div>
      </div>
    );
  }

  if (state === 'notfound') {
    return (
      <div style={styles.centeredFull}>
        <div style={{ fontSize: '2.5rem', color: '#FF3B3B' }}>✕</div>
        <div style={{ fontSize: '1.1rem', color: '#EDE8DC' }}>Coupon not found</div>
        <div style={{ fontSize: '0.85rem', color: '#6B6860' }}>
          The link you followed doesn't match any active affiliate code.<br />
          Check the URL or contact Favaz.
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div style={styles.centeredFull}>
        <div style={{ fontSize: '2.5rem', color: '#FF3B3B' }}>!</div>
        <div style={{ fontSize: '1.1rem', color: '#EDE8DC' }}>Something went wrong</div>
        <div style={{ fontSize: '0.85rem', color: '#6B6860' }}>Couldn't load your stats. Try refreshing.</div>
        <button
          onClick={load}
          style={{ marginTop: '8px', background: '#F5C842', color: '#0E0E0B', border: 'none', borderRadius: '4px', padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
        >
          Retry
        </button>
      </div>
    );
  }

  const originalPrice = 399;
  const discountedPrice = Math.round(originalPrice * (1 - coupon.discount_percent / 100));

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.logo}>7-Day Attention Reset</span>
        <span style={styles.codeTag}>{coupon.id}</span>
      </div>

      <div style={styles.wrap}>

        {/* Greeting */}
        <div style={styles.greeting}>
          <div style={styles.label}>Affiliate dashboard</div>
          <div style={styles.name}>Hey, {coupon.influencer_name.split(' ')[0]}!</div>
          <div style={styles.sub}>Here's how your code <strong style={{ color: '#F5C842', fontFamily: 'monospace', letterSpacing: '2px' }}>{coupon.id}</strong> is performing.</div>
        </div>

        {/* Stats */}
        <div style={styles.statGrid}>
          <div style={styles.statCard(false)}>
            <div style={styles.statLabel}>Total sales driven</div>
            <div style={styles.statVal()}>{commissions.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B6860', marginTop: '4px' }}>purchases</div>
          </div>
          <div style={styles.statCard(false)}>
            <div style={styles.statLabel}>Revenue generated</div>
            <div style={styles.statVal('#EDE8DC')}>{fmtInt(totalSales)}</div>
          </div>
          <div style={styles.statCard(true)}>
            <div style={styles.statLabel}>Total commission earned</div>
            <div style={styles.statVal('#F5C842')}>{fmt(totalEarned)}</div>
          </div>
          <div style={styles.statCard(false)}>
            <div style={styles.statLabel}>Pending payout</div>
            <div style={styles.statVal('#FF8C00')}>{fmt(pendingAmount)}</div>
          </div>
          <div style={styles.statCard(false)}>
            <div style={styles.statLabel}>Paid out</div>
            <div style={styles.statVal('#00E87A')}>{fmt(paidAmount)}</div>
          </div>
        </div>

        {/* How your code works */}
        <div style={styles.infoBox}>
          <div style={{ color: '#F5C842', fontWeight: 600, marginBottom: '8px', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px' }}>How your code works</div>
          Your audience uses <strong style={{ color: '#EDE8DC', fontFamily: 'monospace', letterSpacing: '2px' }}>{coupon.id}</strong> at checkout
          and gets <strong style={{ color: '#EDE8DC' }}>{coupon.discount_percent}% off</strong> — they pay <strong style={{ color: '#EDE8DC' }}>₹{discountedPrice}</strong> instead of ₹{originalPrice}.
          You earn <strong style={{ color: '#F5C842' }}>{coupon.commission_percent}% of every sale</strong> = <strong style={{ color: '#F5C842' }}>₹{Math.round(discountedPrice * coupon.commission_percent / 100)} per purchase.</strong>
          {' '}Payouts happen manually — Favaz will transfer your earnings to your UPI/bank once you reach a payout threshold.
        </div>

        {/* Transaction history */}
        <div style={styles.divider} />
        <div style={styles.sectionTitle}>Transaction history</div>

        {commissions.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🚀</div>
            <div>No sales yet — start sharing your link!</div>
            <div style={{ fontSize: '0.82rem', marginTop: '6px', color: 'rgba(107,104,96,0.8)' }}>
              Every time someone buys using your code, it'll show up here.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Customer paid</th>
                  <th style={styles.th}>Your commission</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map(c => {
                  const date = c.timestamp?.toDate
                    ? c.timestamp.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—';
                  return (
                    <tr key={c.id}>
                      <td style={{ ...styles.td, color: '#6B6860', fontSize: '0.8rem' }}>{date}</td>
                      <td style={styles.td}>
                        {fmtInt(c.sale_amount)}
                        <span style={{ fontSize: '0.75rem', color: '#6B6860', marginLeft: '6px' }}>({c.discount_percent || coupon.discount_percent}% off)</span>
                      </td>
                      <td style={{ ...styles.td, color: '#F5C842', fontWeight: 600 }}>{fmt(c.commission_amount)}</td>
                      <td style={styles.td}><span style={styles.badge(c.status)}>{c.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #2C2C26', fontSize: '0.78rem', color: '#6B6860', textAlign: 'center' }}>
          Questions about your earnings? Reach out to Favaz directly.<br />
          <span style={{ fontFamily: 'monospace', color: '#F5C842', fontSize: '0.72rem' }}>favazmk@gmail.com</span>
        </div>

      </div>
    </div>
  );
}
