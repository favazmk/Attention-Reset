import React from 'react';

export default function PrivacyPolicy({ onBack }) {
  return (
    <div style={{ background: '#0E0E0B', minHeight: '100vh', color: '#EDE8DC', padding: '4rem 1.25rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#F5C842', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', padding: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Home
        </button>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', marginBottom: '2rem' }}>Privacy Policy</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.7', color: 'rgba(237,232,220,0.85)' }}>
          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>1. What Data We Collect</h2>
            <p>We collect only the essential information needed to provide you with the 7-Day Attention Reset programme. This includes your email address (for account creation and login) and usage data (your progress, checklist completions, and workbook inputs).</p>
          </section>

          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>2. How We Use Your Data</h2>
            <p>Your data is used strictly to facilitate your experience within the programme. We use your email for authentication and account recovery. Your usage data is saved securely to track your progress and provide a seamless experience across devices.</p>
          </section>

          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>3. Payment Processing</h2>
            <p>All payments are securely processed through our designated payment gateway partner, Razorpay. We do not store or have access to your credit card numbers, UPI PINs, or bank account details. Razorpay handles your payment information in accordance with their strict security and privacy standards.</p>
          </section>

          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>4. No Data Selling</h2>
            <p>We respect your privacy. We will never sell, rent, or trade your personal information or usage data to third parties under any circumstances. Your data remains completely private and is used solely for your benefit within the Deeper Fix platform.</p>
          </section>

          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>5. Contact Us</h2>
            <p>If you have any questions or concerns regarding this privacy policy, please contact us at: <br/><br/>Email: <a href="mailto:favazmk12@gmail.com" style={{ color: '#00E87A' }}>favazmk12@gmail.com</a><br/>WhatsApp: <a href="https://wa.me/919061926060" style={{ color: '#00E87A' }}>+91 9061926060</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
