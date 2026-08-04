import React, { useState } from 'react';

const inputStyle = {
  width: '100%',
  padding: '0.9rem',
  borderRadius: '4px',
  border: '1px solid var(--border)',
  background: '#202020',
  color: 'var(--cream)',
  fontFamily: 'var(--font-sans)',
};

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--day1)',
  cursor: 'pointer',
  textDecoration: 'underline',
  padding: 0,
  fontSize: 'inherit',
  fontFamily: 'inherit',
};

const Auth = ({ onAuth, allowSignUp = true, defaultTab = 'signin', onBack }) => {
  const [mode, setMode] = useState(defaultTab === 'signup' ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const isSigningUp = mode === 'signup';
  const isResetting = mode === 'reset';

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const emailLower = email.trim().toLowerCase();
    const commonTypos = ['@gmqil.', '@gamil.', '@gmail.con', '@gmial.', '@gmai.'];
    if (commonTypos.some((typo) => emailLower.includes(typo))) {
      setError('Did you mean @gmail.com? Please check your email address for typos.');
      return;
    }

    setBusy(true);
    try {
      if (isResetting) {
        try {
          await onAuth('reset', { email: emailLower });
        } catch (err) {
          // Don't confirm or deny that an address has an account — say the same
          // thing either way.
          if (err.code !== 'auth/user-not-found') throw err;
        }
        setNotice(
          `If an account exists for ${emailLower}, a reset link is on its way. Check your spam folder too.`
        );
        return;
      }

      await onAuth(isSigningUp ? 'signup' : 'signin', { email: emailLower, password });
    } catch (err) {
      if (err.message === 'email-in-use') {
        setError(
          <span>
            An account already exists with this email. Please{' '}
            <button type="button" onClick={() => switchMode('signin')} style={linkButtonStyle}>
              sign in
            </button>
            .
          </span>
        );
      } else if (err.message === 'invalid-credential') {
        setError(
          <span>
            Invalid email or password.{' '}
            <button type="button" onClick={() => switchMode('reset')} style={linkButtonStyle}>
              Reset your password
            </button>
            .
          </span>
        );
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a minute and try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError("That doesn't look like a valid email address.");
      } else {
        const msg = err.message ? err.message.replace(/^Firebase:\s*/, '') : 'Something went wrong.';
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      await onAuth('google');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // The user changed their mind — not an error worth shouting about.
      } else {
        const msg = err.message ? err.message.replace(/^Firebase:\s*/, '') : 'Something went wrong.';
        setError(`Google sign-in failed: ${msg}`);
      }
    } finally {
      setBusy(false);
    }
  };

  const heading = isResetting
    ? 'Reset Your Password'
    : isSigningUp
      ? 'Create Your Account'
      : 'Welcome Back';

  const subheading = isResetting
    ? "Enter your email and we'll send you a link to set a new password."
    : isSigningUp
      ? 'Create an account to save your progress.'
      : 'Sign in to pick up right where you left off.';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#101010',
        color: 'var(--cream)',
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: '600',
            marginBottom: '1rem',
          }}
        >
          {heading}
        </h1>

        <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: '1.5' }}>{subheading}</p>

        {!isResetting && (
          <>
            <button
              onClick={handleGoogleSubmit}
              disabled={busy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                justifyContent: 'center',
                backgroundColor: '#4285F4',
                boxShadow: '0 0 15px rgba(66, 133, 244, 0.4)',
                fontSize: '1rem',
                color: 'white',
                border: 'none',
                padding: '0.9rem 1rem',
                cursor: busy ? 'wait' : 'pointer',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-sans)',
                opacity: busy ? 0.7 : 1,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z" />
                <path d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23Z" />
                <path d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z" />
                <path d="M12,5.38c1.62,0,3.06.56,4.21,1.64l3.15-3.15C17.45,2.09,14.97,1,12,1,7.7,1,3.99,3.47,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z" />
              </svg>
              Sign {isSigningUp ? 'Up' : 'In'} with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--muted)', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ margin: '0 1rem', fontSize: '0.9rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>
          </>
        )}

        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: 'rgba(255, 59, 59, 0.1)',
              border: '1px solid rgba(255, 59, 59, 0.3)',
              color: '#FF3B3B',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              lineHeight: '1.4',
              textAlign: 'left',
            }}
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            style={{
              backgroundColor: 'rgba(0, 232, 122, 0.1)',
              border: '1px solid rgba(0, 232, 122, 0.3)',
              color: '#00E87A',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              lineHeight: '1.4',
              textAlign: 'left',
            }}
          >
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-email" className="visually-hidden">
            Email address
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ ...inputStyle, marginBottom: '1rem' }}
          />

          {!isResetting && (
            <div style={{ position: 'relative', width: '100%', marginBottom: '1.5rem' }}>
              <label htmlFor="auth-password" className="visually-hidden">
                Password
              </label>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSigningUp ? 'new-password' : 'current-password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                style={{ ...inputStyle, paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px',
                }}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={busy}
            style={{
              width: '100%',
              fontSize: '1rem',
              padding: '0.9rem',
              border: 'none',
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy
              ? 'Please wait…'
              : isResetting
                ? 'Send Reset Link'
                : isSigningUp
                  ? 'Create Account'
                  : 'Sign In'}
          </button>
        </form>

        {!isSigningUp && !isResetting && (
          <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            <button type="button" onClick={() => switchMode('reset')} style={{ ...linkButtonStyle, color: 'var(--muted)' }}>
              Forgot your password?
            </button>
          </p>
        )}

        {isResetting && (
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
            <button type="button" onClick={() => switchMode('signin')} style={linkButtonStyle}>
              Back to sign in
            </button>
          </p>
        )}

        {allowSignUp && !isResetting && (
          <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
            {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => switchMode(isSigningUp ? 'signin' : 'signup')}
              style={{ ...linkButtonStyle, marginLeft: '5px' }}
            >
              {isSigningUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
