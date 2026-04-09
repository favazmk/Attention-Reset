import React, { useRef } from 'react';
import ClickBox from '../components/ClickBox';

export default function Completion({ data, updateData }) {
  const accent = 'var(--day7)';
  const gold = '#F39C12';
  
  return (
    <div className="page-content" style={{ '--accent': accent }}>
      
      {/* Certificate Banner */}
      <div style={{
        border: `2px solid ${gold}`, borderRadius: '12px', padding: '6px',
        marginBottom: '3rem', position: 'relative'
      }}>
        <div style={{
          border: '1px solid #2E2E3A', borderRadius: '8px', padding: '2rem 1rem',
          textAlign: 'center', background: 'var(--bg)'
        }}>
          <h4 style={{ color: gold, fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '1.5rem' }}>CERTIFICATE OF COMPLETION</h4>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--cream)', marginBottom: '1rem', lineHeight: '1.1' }}>
            THE 7-DAY ATTENTION RESET
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--light-text)', marginBottom: '1.5rem' }}>This certifies that</p>
          
          <input 
            type="text"
            value={data.cert_name || ''}
            onChange={(e) => updateData('cert_name', e.target.value)}
            placeholder="Your Name Here"
            style={{
              width: '80%', maxWidth: '300px', background: 'transparent',
              border: 'none', borderBottom: `2px solid ${gold}`,
              color: gold, fontSize: '1.2rem', textAlign: 'center',
              padding: '8px', marginBottom: '1.5rem', outline: 'none',
              fontFamily: 'inherit', fontWeight: 'bold'
            }}
          />

          <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--light-text)' }}>
            has completed all 7 days of the protocol
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--cream)', textAlign: 'center' }}>
        YOU FINISHED.
      </h2>
      <p style={{ fontSize: '1rem', color: 'var(--light-text)', textAlign: 'center', marginBottom: '2rem', padding: '0 10px' }}>
        Most people never finish what they start. You did. That puts you ahead of 90% of people who opened this workbook.
      </p>

      <div style={{ height: '2px', background: accent, width: '100%', marginBottom: '2.5rem' }} />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        POST-RESET COMMITMENTS
      </h4>
      
      {[
        { id: 'c_c1', text: 'One Monk Sprint every single day' },
        { id: 'c_c2', text: 'Phone stays out of the bedroom at night' },
        { id: 'c_c3', text: 'Social media only in designated windows' },
        { id: 'c_c4', text: 'One real boredom walk per week (no earphones)' },
        { id: 'c_c5', text: 'Revisit your Attention Score in 30 days and compare' },
        { id: 'c_c6', text: 'Share this workbook with one friend who needs it' }
      ].map((item) => (
        <ClickBox 
          key={item.id} id={item.id} label={item.text}
          checked={data[item.id] || false} onChange={(v) => updateData(item.id, v)} accentColor={accent}
        />
      ))}

      <div className="spacer-lg" />

      <div className="card" style={{ backgroundColor: 'var(--mid-gray)' }}>
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>YOUR ATTENTION PLEDGE</h4>
        <p style={{ fontSize: '0.95rem' }}>
          I commit to protecting my attention as the valuable resource it is. I will not let algorithms, notifications, or endless scrolling dictate where my mind goes. My focus is mine.
        </p>
      </div>

      <div className="spacer-md" />

      <div style={{ display: 'flex', gap: '16px', marginBottom: '2rem' }}>
        <div style={{ flex: 2 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--light-text)', fontWeight: 'bold' }}>SIGNED:</span>
          <input 
            type="text" value={data.sig_name || ''} onChange={(e) => updateData('sig_name', e.target.value)}
            style={{ width: '100%', background: 'var(--dark-card)', border: '1px solid var(--border-c)', color: 'var(--cream)', padding: '8px 12px', borderRadius: '6px', outline: 'none', display: 'block', marginTop: '4px' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--light-text)', fontWeight: 'bold' }}>DATE:</span>
          <input 
            type="date" value={data.sig_date || ''} onChange={(e) => updateData('sig_date', e.target.value)}
            style={{ width: '100%', background: 'var(--dark-card)', border: '1px solid var(--border-c)', color: 'var(--cream)', padding: '6px 12px', borderRadius: '6px', outline: 'none', display: 'block', marginTop: '4px' }}
          />
        </div>
      </div>

      <div className="card" style={{ backgroundColor: '#0A1A0A', borderColor: '#1A3A1A' }}>
        <h4 style={{ color: '#2ECC71', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>CONTINUE THE JOURNEY</h4>
        <p style={{ fontSize: '0.95rem' }}>
          This workbook is Day 0 of a longer road. Follow <strong style={{color:'var(--cream)'}}>@favazmk</strong> for AI tools, habit trackers, and deep work systems that build on what you started here.
        </p>
      </div>
      
    </div>
  );
}
