import React from 'react';

export default function TermsAndConditions({ onBack }) {
  return (
    <div style={{ background: '#0E0E0B', minHeight: '100vh', color: '#EDE8DC', padding: '4rem 1.25rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#F5C842', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', padding: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Home
        </button>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.5rem', marginBottom: '2rem' }}>Terms & Conditions</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.7', color: 'rgba(237,232,220,0.85)' }}>
          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>1. Digital Product</h2>
            <p>The 7-Day Attention Reset by Deeper Fix is entirely a digital product. All content, tools, and workbooks are accessed online via our web application. There is no physical shipping or delivery involved with your purchase.</p>
          </section>

          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>2. Access Rules</h2>
            <p>Your purchase grants you a personal, non-transferable license to access the programme. This license is limited to one account per user. Sharing login credentials, allowing others to use your account, or attempting to bypass these restrictions is strictly prohibited and may result in the termination of your access without a refund.</p>
          </section>

          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>3. Refund Policy</h2>
            <p>We offer a 7-Day Money-Back Guarantee, and it works exactly as described on our home page: complete the 7-day programme, and if you do not feel a clear improvement in your focus, clarity, and control, email us within 7 days of finishing for a 100% refund. We will not ask you to justify the request or complete any additional steps. Because eligibility depends on completing the programme, refund requests from accounts that have not finished all 7 days cannot be processed under this guarantee — if you are having trouble finishing, contact us and we will help.</p>
          </section>

          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>4. No Redistribution</h2>
            <p>All materials provided within the programme—including text, checklists, methodologies, and structure—are the intellectual property of Deeper Fix. You may not copy, reproduce, distribute, publish, display, or modify any part of the programme, nor may you create derivative works from it or use it for commercial purposes.</p>
          </section>

          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>5. Disclaimer</h2>
            <p>This programme is designed for educational and behavioral improvement purposes only. It is not a medical, psychological, or therapeutic treatment. If you have a diagnosed condition such as ADHD or any mental health concerns, please consult a qualified professional.</p>
          </section>

          <section>
            <h2 style={{ color: '#F5C842', fontSize: '1.25rem', marginBottom: '0.75rem' }}>6. Contact Us</h2>
            <p>If you have any questions regarding these Terms and Conditions, please reach out to our support team: <br/><br/>Email: <a href="mailto:favazmk12@gmail.com" style={{ color: '#00E87A' }}>favazmk12@gmail.com</a><br/>WhatsApp: <a href="https://wa.me/919061926060" style={{ color: '#00E87A' }}>+91 9061926060</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
