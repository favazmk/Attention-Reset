import React, { useRef, useState, useEffect } from 'react';
import ClickBox from '../components/ClickBox';

export default function Completion({ data, updateData, user }) {
  const accent = '#F5C842'; // Landing page accent gold
  const reportRef = useRef(null);
  const containerRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scale, setScale] = useState(1);
  const [wantsMore, setWantsMore] = useState(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setScale(width / 1080);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const d1Score = parseInt(data.d1_total_score) || 0;
  const d7Score = parseInt(data.d7_total_score) || 0;
  // Can be negative if someone scored worse on Day 7 — report that honestly
  // rather than rendering "+-20%" on the one screen people screenshot.
  const improvement = d1Score > 0 ? Math.round(((d1Score - d7Score) / d1Score) * 100) : 0;
  const improved = improvement > 0;
  const improvementLabel = `${improvement > 0 ? '+' : improvement < 0 ? '−' : ''}${Math.abs(improvement)}%`;
  const shareText = improved
    ? `I just completed the 7-Day Attention Reset and cut my distractibility by ${improvement}%.`
    : 'I just completed the 7-Day Attention Reset.';


  const tags = ((data.d7_testimonial_tags) || 'Focus improved|More control').split('|').filter(Boolean);

  const assassinsList = [
    { id: "d2_a1", text: "Instagram / TikTok / Reels scrolling" },
    { id: "d2_a2", text: "Email refresh" },
    { id: "d2_a3", text: 'The "quick" news / weather check' },
    { id: "d2_a4", text: "Desktop notification pings" },
    { id: "d2_a5", text: 'Google rabbit holes' },
    { id: "d2_a6", text: "YouTube autoplay" },
    { id: "d2_a7", text: "WhatsApp group chats" },
    { id: "d2_a8", text: "People interrupting" },
  ];
  const checkedAssassin = assassinsList.find(a => data[a.id]);
  const largestDistraction = checkedAssassin ? checkedAssassin.text : (data.d2_ref_3 || 'Social Media');

  // html2canvas is ~200 kB and only ever needed if someone taps download/share,
  // so it is fetched at that moment rather than shipped to every visitor.
  const generateCanvas = async () => {
    if (!reportRef.current) return null;
    const { default: html2canvas } = await import('html2canvas');
    return await html2canvas(reportRef.current, {
      backgroundColor: '#0c0c0c',
      scale: 1.5,
      useCORS: true,
      logging: false,
    });
  };

  const downloadBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Attention-Report.png';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateCanvas();
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) downloadBlob(blob);
        }, 'image/png', 1.0);
      }
    } catch (err) {
      console.error('Report generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGenerating(false);
          return;
        }

        const file = new File([blob], 'Attention-Report.png', { type: 'image/png' });
        try {
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'My 7-Day Attention Report',
              text: shareText,
            });
          } else {
            await navigator.share({
              title: 'My 7-Day Attention Report',
              text: shareText,
              url: window.location.origin,
            });
          }
        } catch {
          // Sharing unavailable or dismissed — fall back to a plain download.
          downloadBlob(blob);
        } finally {
          setIsGenerating(false);
        }
      }, 'image/png', 1.0);
    } catch (err) {
      console.error('Report generation failed', err);
      setIsGenerating(false);
    }
  };

  const glassCard = {
    background: '#131311', // Landing page style stark background
    border: '1px solid #2C2C26', // Landing page style border
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden'
  };

  const labelStyle = { color: '#888', fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '12px' };
  
  const clampText = (lines, size, weight, color) => ({
    fontSize: size,
    fontWeight: weight,
    color,
    margin: 0,
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: lines || 5,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  });

  const userNameRaw = data.user_name || (user?.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') : 'Your');
  const capitalizedName = userNameRaw.trim().split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : '').join(' ') || 'Your';

  return (
    <div className="page-content" style={{ '--accent': accent, paddingBottom: '4rem' }}>
      
      <style>{`
        .report-action-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .report-action-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(245, 200, 66, 0.25) !important;
        }
        .cta-btn {
          transition: all 0.2s ease;
        }
        .cta-btn:hover {
          transform: scale(1.02);
          opacity: 0.9;
        }
      `}</style>

      {/* The Container */}
      <div ref={containerRef} style={{ width: '100%', maxWidth: '540px', margin: '0 auto', height: `${1920 * scale}px`, position: 'relative', borderRadius: `${36 * scale}px`, overflow: 'hidden', boxShadow: '0 0 50px rgba(0,0,0,0.8)' }}>
        
        {/* Canvas Render Logic */}
        <div ref={reportRef} style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1920px', transform: `scale(${scale})`, transformOrigin: 'top left', backgroundColor: '#0c0c0c', padding: '60px 50px', boxSizing: 'border-box', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "DM Sans", sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h4 style={{ color: '#888', fontSize: '22px', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 800, marginBottom: '16px' }}>7 Days Completed.</h4>
            <h2 style={{ color: '#EDE8DC', fontSize: '76px', fontWeight: 400, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: '"DM Serif Display", serif' }}>{capitalizedName}'s Attention Reset</h2>
            <p style={{ color: '#aaa', fontSize: '28px', marginTop: '16px', fontStyle: 'italic', fontWeight: 500 }}>You're now in control.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
            <div style={{ ...glassCard, border: `1px solid ${accent}` }}>
              <span style={{ ...labelStyle, color: accent }}>Focus Shift</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <span style={{ color: improved ? '#EDE8DC' : '#FF8C00', fontSize: '100px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em' }}>{improvementLabel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '22px', color: '#aaa', fontWeight: 500 }}>
                <span>Day 1 Urge Level: <strong style={{color: '#EDE8DC'}}>{data.d1_total_score || '-'}</strong></span>
                <span>Day 7 Urge Level: <strong style={{color: '#EDE8DC'}}>{data.d7_total_score || '-'}</strong></span>
              </div>
              <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, Math.max(5, Math.abs(improvement)))}%`, height: '100%', background: improved ? accent : '#FF8C00', borderRadius: '10px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ ...glassCard, flex: 1, justifyContent: 'center', border: '1px solid #00E87A' }}>
                <span style={{...labelStyle, color: '#00E87A'}}>Largest Distraction</span>
                <p style={clampText(2, '28px', 700, '#EDE8DC')}>{largestDistraction}</p>
              </div>
              <div style={{ ...glassCard, flex: 1, justifyContent: 'center', border: '1px solid #3BB8E8' }}>
                <span style={{...labelStyle, color: '#3BB8E8'}}>Peak Output Window</span>
                <p style={clampText(2, '28px', 700, '#EDE8DC')}>{data.d4_r1 || 'Morning'}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ ...glassCard, position: 'relative', border: '1px solid #B060FF' }}>
              <span style={{...labelStyle, color: '#B060FF'}}>Deep Focus Test</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                <div>
                  <span style={{ color: '#aaa', fontSize: '20px', display: 'block', marginBottom: '6px' }}>Task:</span>
                  <p style={clampText(3, '26px', 600, '#EDE8DC')}>{data.d3_r1 || 'Complete coding sprint'}</p>
                </div>
                <div>
                  <span style={{ color: '#aaa', fontSize: '20px', display: 'block', marginBottom: '6px' }}>Hardest moment:</span>
                  <p style={{ ...clampText(3, '26px', 500, '#aaa'), fontStyle: 'italic' }}>"{data.d3_r2 || 'The urge to check my messages'}"</p>
                </div>
              </div>
            </div>

            <div style={{ ...glassCard, border: '1px solid #FF3B3B' }}>
              <span style={{...labelStyle, color: '#FF3B3B'}}>Dopamine Insight</span>
              <p style={{ ...clampText(5, '28px', 500, '#EDE8DC'), fontStyle: 'italic', lineHeight: 1.4, marginTop: '8px' }}>
                "{data.d6_r2 || 'My brain literally craves clicking anything random.'}"
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <p style={{ color: '#00E87A', fontSize: '24px', fontWeight: 700 }}>You sat without distraction. That's control.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr', gap: '24px' }}>
            <div style={{ ...glassCard, border: '1px solid #FF8C00' }}>
              <span style={{...labelStyle, color: '#FF8C00'}}>Attention OS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
                <div>
                  <span style={{ color: '#aaa', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>Morning Rule</span>
                  <p style={{ ...clampText(3, '24px', 600, '#EDE8DC'), borderBottom: '1px solid #2C2C26', paddingBottom: '10px', marginTop: '4px' }}>{data.d7_r1 || 'No device before breakfast'}</p>
                </div>
                <div>
                  <span style={{ color: '#aaa', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>Deep Work</span>
                  <p style={{ ...clampText(2, '24px', 600, '#EDE8DC'), borderBottom: '1px solid #2C2C26', paddingBottom: '10px', marginTop: '4px' }}>{data.d7_r2 || '8:00 AM - 9:30 AM'}</p>
                </div>
                <div>
                  <span style={{ color: '#aaa', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>Shutdown</span>
                  <p style={{ ...clampText(2, '24px', 600, '#EDE8DC'), borderBottom: 'none', paddingBottom: '6px', marginTop: '4px' }}>{data.d7_r3 || 'Phone out of bedroom at 9 PM'}</p>
                </div>
              </div>
            </div>

            <div style={{ ...glassCard, background: '#181815', border: `1px solid ${accent}`, padding: '24px 32px' }}>
              <span style={{...labelStyle, color: accent, marginBottom: '8px'}}>The Transformation</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '4px' }}>
                <div>
                  <span style={{ color: '#aaa', fontSize: '18px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Before:</span>
                  <p style={{ ...clampText(4, '28px', 500, '#999'), fontStyle: 'italic', lineHeight: 1.4 }}>"{data.d7_testimonial_before || 'I was constantly overwhelmed.'}"</p>
                </div>
                <div>
                  <span style={{ color: '#00E87A', fontSize: '18px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>After:</span>
                  <p style={{ ...clampText(5, '30px', 600, '#EDE8DC'), fontStyle: 'italic', lineHeight: 1.4 }}>"{data.d7_testimonial_after || 'I feel calm and intentional.'}"</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ ...glassCard, padding: '24px', alignItems: 'center', border: '1px solid #2C2C26' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {tags.map((tag, i) => (
                  <div key={i} style={{ background: '#2C2C26', padding: '12px 28px', borderRadius: '50px', fontSize: '24px', color: '#EDE8DC', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: accent }}>✔</span> {tag}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...glassCard, padding: '24px', textAlign: 'center', background: '#1c1c1a', border: '1px solid #333' }}>
              <span style={{...labelStyle, color: '#aaa', marginBottom: '12px'}}>30-Day Focus Goal</span>
              <p style={{ ...clampText(4, '34px', 700, '#EDE8DC'), fontStyle: 'italic', lineHeight: 1.3, fontFamily: '"DM Serif Display", serif' }}>"{data.d7_vision || 'To finally launch my side project and stop procrastinating.'}"</p>
            </div>
          </div>
          
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '2.5rem', marginBottom: '3rem' }}>
        <button className="report-action-btn" onClick={handleDownloadImage} disabled={isGenerating} style={{ background: '#131311', border: '1px solid #2C2C26', padding: '14px 28px', color: '#EDE8DC', borderRadius: '980px', fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontWeight: 500 }}>
          {isGenerating ? 'Generating...' : 'Download Image'}
        </button>
        {navigator.share && (
          <button className="report-action-btn" onClick={handleShare} disabled={isGenerating} style={{ background: accent, border: `1px solid ${accent}`, padding: '14px 28px', color: '#000', borderRadius: '980px', fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(245,200,66,0.3)', fontWeight: 600 }}>
            {isGenerating ? 'Wait...' : 'Share Report'}
          </button>
        )}
      </div>

      {/* POST-RESET COMMITMENTS */}
      <div style={{ maxWidth: '540px', margin: '4rem auto 3rem auto' }}>
        <h4 style={{ color: accent, fontSize: '0.9rem', marginBottom: '1.5rem', letterSpacing: '2px', textAlign: 'center', textTransform: 'uppercase' }}>
          Post-Reset Commitments
        </h4>
        
        {[
          { id: 'c_c1', text: 'One Monk Sprint every single day' },
          { id: 'c_c2', text: 'Phone stays out of the bedroom at night' },
          { id: 'c_c3', text: 'Social media only after breakfast' },
          { id: 'c_c4', text: 'One real boredom walk per week (no earphones)' },
          { id: 'c_c5', text: 'Follow your 3 step focus ritual before monk sprint' },
          { id: 'c_c6', text: 'Share this workbook with one friend who needs it' }
        ].map((item) => (
          <ClickBox 
            key={item.id} id={item.id} label={item.text}
            checked={data[item.id] || false} onChange={(v) => updateData(item.id, v)} accentColor={accent}
            noStrike={true}
          />
        ))}
      </div>

      {/* YES/NO DYNAMIC CTA */}
      <div style={{ borderTop: '1px solid #2C2C26', paddingTop: '4rem', textAlign: 'center', paddingBottom: '2rem' }}>
        <h3 style={{ color: '#EDE8DC', fontSize: '1.8rem', marginBottom: '1.2rem', fontFamily: '"DM Serif Display", serif', letterSpacing: '1px' }}>
          Are you ready to fix this permanently?
        </h3>
        <p style={{ color: '#aaa', fontSize: '1.15rem', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
          You've completed the 7-day reset. Most people stop here and slowly relapse. Are you ready to build a permanent focus system?
        </p>

        {wantsMore === null && (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              className="cta-btn"
              onClick={() => setWantsMore(true)}
              style={{ padding: '16px 36px', background: accent, color: '#000', fontSize: '1.1rem', fontWeight: 600, borderRadius: '8px', cursor: 'pointer', border: 'none' }}
            >
              Yes, I'm ready
            </button>
            <button 
              className="cta-btn"
              onClick={() => setWantsMore(false)}
              style={{ padding: '16px 36px', background: '#131311', color: '#aaa', fontSize: '1.1rem', fontWeight: 500, borderRadius: '8px', cursor: 'pointer', border: '1px solid #2C2C26' }}
            >
              No, I'm good
            </button>
          </div>
        )}

        {wantsMore === false && (
          <div style={{ padding: '2rem', background: '#131311', border: '1px solid #2C2C26', borderRadius: '12px', maxWidth: '450px', margin: '0 auto' }}>
            <p style={{ color: '#EDE8DC', fontSize: '1.1rem', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
              Understood. You have your roadmap. Stick to the 7-day principles, keep your focus boundaries strict, and don't let the algorithms win.
            </p>
          </div>
        )}

        {wantsMore === true && (
          <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
            <h3 style={{ color: accent, fontSize: '1.4rem', marginBottom: '1rem', fontFamily: '"DM Serif Display", serif' }}>
              Let's secure your progress.
            </h3>
            <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
              Tell us what your worst distraction still is and we'll help you build a focus framework
              around your actual work and routine.
            </p>
            <a
              href={`https://wa.me/919061926060?text=${encodeURIComponent(
                "Hi! I just finished the 7-Day Attention Reset and I'd like help building a permanent focus system."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
              style={{ fontSize: '1.15rem', padding: '20px 48px', letterSpacing: '2px', boxShadow: `0 0 30px ${accent}44`, maxWidth: '400px', margin: '0 auto', display: 'block', borderRadius: '6px', background: accent, color: '#000', border: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}
            >
              Talk to us on WhatsApp
            </a>
          </div>
        )}
      </div>

    </div>
  );
}
