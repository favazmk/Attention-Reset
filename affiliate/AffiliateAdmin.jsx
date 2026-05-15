import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy
} from 'firebase/firestore';

// ── Admin email whitelist ─────────────────────────────────────────────────────
const ADMIN_EMAILS = ['favazmk@gmail.com']; // add your email here

const fmt = (n) => `₹${Number(n).toFixed(2)}`;

const TABS = ['Coupons', 'Commissions'];

export default function AffiliateAdmin({ user, onBack }) {
  const [tab, setTab] = useState('Coupons');
  const [coupons, setCoupons] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [form, setForm] = useState({
    code: '',
    influencer_name: '',
    influencer_email: '',
    discount_percent: 10,
    commission_percent: 50,
  });
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (!isAdmin) return;
    fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [couponSnap, commissionSnap] = await Promise.all([
        getDocs(collection(db, 'coupons')),
        getDocs(query(collection(db, 'commissions'), orderBy('timestamp', 'desc'))),
      ]);
      setCoupons(couponSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCommissions(commissionSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setError('Failed to load data: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async () => {
    setFormError('');
    const code = form.code.toUpperCase().trim();
    if (!code || !form.influencer_name || !form.influencer_email) {
      return setFormError('All fields are required.');
    }
    if (!/^[A-Z0-9]+$/.test(code)) {
      return setFormError('Code must be alphanumeric (A-Z, 0-9) with no spaces.');
    }
    setFormSaving(true);
    try {
      await setDoc(doc(db, 'coupons', code), {
        influencer_name: form.influencer_name.trim(),
        influencer_email: form.influencer_email.trim(),
        discount_percent: Number(form.discount_percent),
        commission_percent: Number(form.commission_percent),
        active: true,
        created_at: new Date(),
        total_uses: 0,
        total_commission_earned: 0,
      });
      setShowAddForm(false);
      setForm({ code: '', influencer_name: '', influencer_email: '', discount_percent: 10, commission_percent: 50 });
      await fetchAll();
    } catch (e) {
      setFormError('Save failed: ' + e.message);
    } finally {
      setFormSaving(false);
    }
  };

  const toggleActive = async (couponId, current) => {
    await updateDoc(doc(db, 'coupons', couponId), { active: !current });
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, active: !current } : c));
  };

  const deleteCoupon = async (couponId) => {
    if (!window.confirm(`Delete coupon "${couponId}"? This won't delete existing commissions.`)) return;
    await deleteDoc(doc(db, 'coupons', couponId));
    setCoupons(prev => prev.filter(c => c.id !== couponId));
  };

  const markAsPaid = async (commissionId) => {
    await updateDoc(doc(db, 'commissions', commissionId), { status: 'paid' });
    setCommissions(prev => prev.map(c => c.id === commissionId ? { ...c, status: 'paid' } : c));
  };

  // Summary stats
  const totalSales = commissions.reduce((s, c) => s + (c.sale_amount || 0), 0);
  const totalCommission = commissions.reduce((s, c) => s + (c.commission_amount || 0), 0);
  const pendingCommission = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + (c.commission_amount || 0), 0);

  // Per-influencer breakdown
  const influencerMap = {};
  commissions.forEach(c => {
    if (!influencerMap[c.influencer_name]) {
      influencerMap[c.influencer_name] = { sales: 0, commission: 0, pending: 0 };
    }
    influencerMap[c.influencer_name].sales += c.sale_amount || 0;
    influencerMap[c.influencer_name].commission += c.commission_amount || 0;
    if (c.status === 'pending') influencerMap[c.influencer_name].pending += c.commission_amount || 0;
  });

  const styles = {
    root: {
      minHeight: '100vh',
      background: '#0E0E0B',
      color: '#EDE8DC',
      fontFamily: "'DM Sans', sans-serif",
      padding: '0',
    },
    header: {
      background: 'rgba(14,14,11,0.95)',
      borderBottom: '1px solid #2C2C26',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    backBtn: {
      background: 'none',
      border: '1px solid #2C2C26',
      color: '#EDE8DC',
      cursor: 'pointer',
      padding: '6px 14px',
      borderRadius: '4px',
      fontSize: '0.85rem',
    },
    title: {
      fontSize: '1rem',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: '#F5C842',
    },
    container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    statCard: { background: '#1C1C18', border: '1px solid #2C2C26', borderRadius: '8px', padding: '1.25rem' },
    statLabel: { fontSize: '0.75rem', color: '#6B6860', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' },
    statValue: { fontSize: '1.6rem', fontWeight: 700, color: '#F5C842' },
    tabs: { display: 'flex', gap: '4px', marginBottom: '1.5rem', borderBottom: '1px solid #2C2C26' },
    tab: (active) => ({
      background: 'none',
      border: 'none',
      color: active ? '#F5C842' : 'rgba(237,232,220,0.5)',
      borderBottom: active ? '2px solid #F5C842' : '2px solid transparent',
      cursor: 'pointer',
      padding: '10px 20px',
      fontSize: '0.9rem',
      fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: '0.5px',
      marginBottom: '-1px',
    }),
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', fontSize: '0.72rem', color: '#6B6860', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 12px', borderBottom: '1px solid #2C2C26' },
    td: { padding: '14px 12px', borderBottom: '1px solid rgba(44,44,38,0.5)', fontSize: '0.88rem' },
    badge: (active) => ({
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '100px',
      fontSize: '0.72rem',
      fontWeight: 600,
      background: active ? 'rgba(0,232,122,0.1)' : 'rgba(255,59,59,0.1)',
      color: active ? '#00E87A' : '#FF3B3B',
      border: `1px solid ${active ? 'rgba(0,232,122,0.3)' : 'rgba(255,59,59,0.3)'}`,
    }),
    statusBadge: (status) => ({
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '100px',
      fontSize: '0.72rem',
      fontWeight: 600,
      background: status === 'paid' ? 'rgba(0,232,122,0.1)' : 'rgba(245,200,66,0.1)',
      color: status === 'paid' ? '#00E87A' : '#F5C842',
      border: `1px solid ${status === 'paid' ? 'rgba(0,232,122,0.3)' : 'rgba(245,200,66,0.3)'}`,
    }),
    actionBtn: (color = '#2C2C26') => ({
      background: 'none',
      border: `1px solid ${color}`,
      color: color === '#2C2C26' ? '#EDE8DC' : color,
      cursor: 'pointer',
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontFamily: "'DM Sans', sans-serif",
      marginRight: '6px',
    }),
    addBtn: {
      background: '#F5C842',
      color: '#0E0E0B',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 22px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      fontFamily: "'DM Sans', sans-serif",
    },
    modal: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    },
    modalBox: {
      background: '#1C1C18', border: '1px solid #2C2C26', borderRadius: '12px',
      padding: '2rem', width: '100%', maxWidth: '460px',
    },
    input: {
      width: '100%', background: '#0E0E0B', border: '1px solid #2C2C26',
      borderRadius: '4px', color: '#EDE8DC', padding: '10px 14px',
      fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
      boxSizing: 'border-box', marginTop: '6px',
    },
    label: { fontSize: '0.78rem', color: '#6B6860', textTransform: 'uppercase', letterSpacing: '1px' },
    fieldGroup: { marginBottom: '1rem' },
  };

  if (!isAdmin) {
    return (
      <div style={{ ...styles.root, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
          <div style={{ color: '#FF3B3B', marginBottom: '1rem' }}>Access denied.</div>
          <button style={styles.backBtn} onClick={onBack}>← Back to landing</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <span style={styles.title}>🤝 Affiliate Panel</span>
      </div>

      <div style={styles.container}>

        {/* Summary stats */}
        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Sales (via coupons)</div>
            <div style={styles.statValue}>{fmt(totalSales)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Commission Owed</div>
            <div style={styles.statValue}>{fmt(totalCommission)}</div>
          </div>
          <div style={{ ...styles.statCard, borderColor: 'rgba(245,200,66,0.3)' }}>
            <div style={styles.statLabel}>Pending Payouts</div>
            <div style={{ ...styles.statValue, color: '#FF8C00' }}>{fmt(pendingCommission)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Active Coupons</div>
            <div style={styles.statValue}>{coupons.filter(c => c.active).length}</div>
          </div>
        </div>

        {/* Per-influencer summary */}
        {Object.keys(influencerMap).length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#6B6860', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Influencer Breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {Object.entries(influencerMap).map(([name, stats]) => (
                <div key={name} style={{ ...styles.statCard, borderLeft: '3px solid #F5C842' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>{name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(237,232,220,0.6)' }}>Sales: <span style={{ color: '#EDE8DC' }}>{fmt(stats.sales)}</span></div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(237,232,220,0.6)' }}>Earned: <span style={{ color: '#F5C842' }}>{fmt(stats.commission)}</span></div>
                  {stats.pending > 0 && <div style={{ fontSize: '0.82rem', color: 'rgba(237,232,220,0.6)' }}>Pending: <span style={{ color: '#FF8C00' }}>{fmt(stats.pending)}</span></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          {TABS.map(t => (
            <button key={t} style={styles.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: '#6B6860', padding: '2rem 0' }}>Loading...</div>
        ) : error ? (
          <div style={{ color: '#FF3B3B' }}>{error}</div>
        ) : tab === 'Coupons' ? (
          <>
            {/* Add coupon button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button style={styles.addBtn} onClick={() => setShowAddForm(true)}>+ Add Coupon</button>
            </div>

            {coupons.length === 0 ? (
              <div style={{ color: '#6B6860', textAlign: 'center', padding: '3rem' }}>
                No coupons yet. Create one for your first influencer.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {['Code', 'Influencer', 'Email', 'Discount', 'Commission', 'Uses', 'Earned', 'Status', 'Actions'].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.id}>
                        <td style={{ ...styles.td, fontFamily: 'monospace', color: '#F5C842', fontWeight: 700, fontSize: '1rem' }}>{c.id}</td>
                        <td style={styles.td}>{c.influencer_name}</td>
                        <td style={{ ...styles.td, color: '#6B6860', fontSize: '0.8rem' }}>{c.influencer_email}</td>
                        <td style={styles.td}>{c.discount_percent}%</td>
                        <td style={styles.td}>{c.commission_percent}%</td>
                        <td style={styles.td}>{c.total_uses || 0}</td>
                        <td style={{ ...styles.td, color: '#00E87A' }}>{fmt(c.total_commission_earned || 0)}</td>
                        <td style={styles.td}><span style={styles.badge(c.active)}>{c.active ? 'Active' : 'Inactive'}</span></td>
                        <td style={styles.td}>
                          <button style={styles.actionBtn(c.active ? '#FF3B3B' : '#00E87A')} onClick={() => toggleActive(c.id, c.active)}>
                            {c.active ? 'Disable' : 'Enable'}
                          </button>
                          <button style={styles.actionBtn('#FF3B3B')} onClick={() => deleteCoupon(c.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          // Commissions tab
          commissions.length === 0 ? (
            <div style={{ color: '#6B6860', textAlign: 'center', padding: '3rem' }}>
              No commission records yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Date', 'Influencer', 'Code', 'Sale', 'Commission', 'Status', 'Action'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commissions.map(c => {
                    const date = c.timestamp?.toDate ? c.timestamp.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                    return (
                      <tr key={c.id}>
                        <td style={{ ...styles.td, color: '#6B6860', fontSize: '0.82rem' }}>{date}</td>
                        <td style={styles.td}>{c.influencer_name}</td>
                        <td style={{ ...styles.td, fontFamily: 'monospace', color: '#F5C842' }}>{c.coupon_code}</td>
                        <td style={styles.td}>{fmt(c.sale_amount)} <span style={{ fontSize: '0.75rem', color: '#6B6860' }}>(was {fmt(c.original_amount)})</span></td>
                        <td style={{ ...styles.td, color: '#00E87A', fontWeight: 600 }}>{fmt(c.commission_amount)}</td>
                        <td style={styles.td}><span style={styles.statusBadge(c.status)}>{c.status}</span></td>
                        <td style={styles.td}>
                          {c.status === 'pending' && (
                            <button style={styles.actionBtn('#00E87A')} onClick={() => markAsPaid(c.id)}>Mark Paid</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Add Coupon Modal */}
      {showAddForm && (
        <div style={styles.modal} onClick={e => e.target === e.currentTarget && setShowAddForm(false)}>
          <div style={styles.modalBox}>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '1px' }}>New Coupon Code</div>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>Coupon Code</div>
              <input
                style={styles.input}
                placeholder="e.g. RAVI10"
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              />
              <div style={{ fontSize: '0.75rem', color: '#6B6860', marginTop: '4px' }}>Alphanumeric only, no spaces. This is what influencers share with their audience.</div>
            </div>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>Influencer Name</div>
              <input style={styles.input} placeholder="e.g. Ravi Kumar" value={form.influencer_name} onChange={e => setForm(f => ({ ...f, influencer_name: e.target.value }))} />
            </div>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>Influencer Email (for payout)</div>
              <input style={styles.input} type="email" placeholder="e.g. ravi@gmail.com" value={form.influencer_email} onChange={e => setForm(f => ({ ...f, influencer_email: e.target.value }))} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={styles.fieldGroup}>
                <div style={styles.label}>Customer Discount %</div>
                <input style={styles.input} type="number" min="1" max="100" value={form.discount_percent} onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value }))} />
              </div>
              <div style={styles.fieldGroup}>
                <div style={styles.label}>Influencer Commission %</div>
                <input style={styles.input} type="number" min="1" max="100" value={form.commission_percent} onChange={e => setForm(f => ({ ...f, commission_percent: e.target.value }))} />
              </div>
            </div>

            {formError && <div style={{ color: '#FF3B3B', fontSize: '0.85rem', marginBottom: '1rem' }}>{formError}</div>}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button style={styles.backBtn} onClick={() => setShowAddForm(false)}>Cancel</button>
              <button style={styles.addBtn} onClick={handleAddCoupon} disabled={formSaving}>
                {formSaving ? 'Saving...' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
