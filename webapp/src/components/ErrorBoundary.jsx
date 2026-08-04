import React from 'react';

/**
 * Stops one bad render from white-screening a paying customer. Without this, any
 * exception inside a Day page takes the whole app down with no way back.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info?.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '2rem',
          textAlign: 'center',
          background: '#0E0E0B',
          color: '#EDE8DC',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', margin: 0 }}>
          Something broke on our side
        </h1>
        <p style={{ color: 'rgba(237,232,220,0.6)', maxWidth: '380px', lineHeight: 1.6, margin: 0 }}>
          Your progress is saved. Reloading usually fixes it — if it doesn&apos;t, message us and
          we&apos;ll sort it out.
        </p>
        <button
          onClick={this.handleReload}
          style={{
            marginTop: '8px',
            background: '#F5C842',
            color: '#0E0E0B',
            border: 'none',
            borderRadius: '6px',
            padding: '13px 28px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Reload
        </button>
        <a
          href="https://wa.me/919061926060"
          style={{ color: '#6B6860', fontSize: '0.8rem', textDecoration: 'underline' }}
        >
          Contact support
        </a>
      </div>
    );
  }
}
