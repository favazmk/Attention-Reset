import React, { Suspense, lazy } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { DW_PAGES, WEEKS, isWeekComplete } from './content';

const DwIntro = lazy(() => import('./DwIntro'));
const DwWeek = lazy(() => import('./DwWeek'));
const DwCompletion = lazy(() => import('./DwCompletion'));

/**
 * The whole chrome for the Deep Work System — header, progress, page, nav.
 *
 * It is a separate shell rather than another branch inside the 7-day one on
 * purpose. That shell is built around daily unlocks and a next-day time lock,
 * neither of which applies to a four-week programme, and threading a second
 * mode through it would have put the live paid flow at risk for no benefit.
 *
 * Gating here is simply: a week opens when the one before it is finished.
 */
export default function DeepWorkShell({
  data,
  updateData,
  user,
  pageIndex,
  setPageIndex,
  onExit,
  introError,
  setIntroError,
}) {
  const pageId = DW_PAGES[pageIndex];
  const accent = '#F5C842';

  const weekFinished = (n) => !!data[`dw_w${n}_finished`];

  // Index 0 is the intro, 1..4 the weeks, 5 the completion.
  const isUnlocked = (i) => {
    if (i === 0) return true;
    if (i === 1) return !!data.dw_commitment;
    if (i <= WEEKS.length) return weekFinished(i - 1);
    return weekFinished(WEEKS.length);
  };

  const handleNext = () => {
    if (pageIndex === 0 && !data.dw_commitment) {
      setIntroError(true);
      setTimeout(() => setIntroError(false), 3000);
      return;
    }
    if (pageIndex < DW_PAGES.length - 1 && isUnlocked(pageIndex + 1)) {
      setPageIndex(pageIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderPage = () => {
    const props = { data, updateData, user };
    if (pageId === 'dw_intro') return <DwIntro {...props} introError={introError} />;
    if (pageId === 'dw_completion') return <DwCompletion {...props} />;
    const week = WEEKS[pageIndex - 1];
    return week ? <DwWeek week={week} {...props} /> : <DwIntro {...props} />;
  };

  const nextUnlocked = pageIndex < DW_PAGES.length - 1 && isUnlocked(pageIndex + 1);
  const nextLabel =
    pageIndex === 0
      ? 'Start Week 1'
      : pageIndex <= WEEKS.length - 1
        ? `Start Week ${pageIndex + 1}`
        : pageIndex === WEEKS.length
          ? 'See my system'
          : '';

  const currentWeek = pageIndex >= 1 && pageIndex <= WEEKS.length ? WEEKS[pageIndex - 1] : null;
  const trackColor = currentWeek ? currentWeek.color : accent;

  return (
    <div className="container">
      <header style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            gap: '12px',
          }}
        >
          <button
            onClick={onExit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.68rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg
              width="14"
              height="14"
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
            Back to the reset
          </button>

          <span
            style={{
              fontSize: '0.62rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: accent,
              fontWeight: 700,
            }}
          >
            Deep Work System
          </span>
        </div>

        {/* Six-node track: intro, four weeks, the system */}
        <div
          style={{
            position: 'relative',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '12px',
              right: '12px',
              height: '2px',
              backgroundColor: 'var(--border)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '12px',
              height: '2px',
              width: `calc(${(pageIndex / (DW_PAGES.length - 1)) * 100}% - 24px * ${
                pageIndex / (DW_PAGES.length - 1)
              })`,
              background: `linear-gradient(90deg, ${accent}, ${trackColor})`,
              boxShadow: `0 0 8px ${trackColor}`,
              transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {DW_PAGES.map((id, i) => {
              const unlocked = isUnlocked(i);
              const active = i === pageIndex;
              const done = i <= pageIndex;
              const color = i === 0 ? accent : (WEEKS[i - 1]?.color ?? accent);
              const label = i === 0 ? 'Start' : i <= WEEKS.length ? `W${i}` : 'System';

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => unlocked && setPageIndex(i)}
                  disabled={!unlocked}
                  aria-current={active ? 'step' : undefined}
                  aria-label={unlocked ? `Go to ${label}` : `${label} — finish the previous week first`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: unlocked ? 'pointer' : 'default',
                    zIndex: 10,
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      width: active ? '14px' : '8px',
                      height: active ? '14px' : '8px',
                      borderRadius: '50%',
                      backgroundColor: done ? color : 'var(--border)',
                      border: active ? `2px solid ${color}` : 'none',
                      boxShadow: done ? `0 0 6px ${color}` : 'none',
                      transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                      marginBottom: '4px',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.5rem',
                      fontWeight: active ? 700 : 400,
                      color: done ? color : 'var(--muted)',
                      position: 'absolute',
                      top: '18px',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main style={{ minHeight: '60vh' }}>
        <ErrorBoundary>
          <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>}>
            {renderPage()}
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <div className="footer-btn-container">
          <button
            className="outline-btn"
            onClick={handlePrev}
            style={{
              opacity: pageIndex === 0 ? 0 : 1,
              pointerEvents: pageIndex === 0 ? 'none' : 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span style={{ marginTop: '1px' }}>Back</span>
          </button>

          {pageIndex < DW_PAGES.length - 1 && (
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <button
                className="primary-btn"
                onClick={handleNext}
                disabled={!nextUnlocked && pageIndex !== 0}
                style={{
                  backgroundColor:
                    nextUnlocked || pageIndex === 0 ? trackColor : 'transparent',
                  color: nextUnlocked || pageIndex === 0 ? 'var(--bg)' : 'var(--muted)',
                  border: nextUnlocked || pageIndex === 0 ? 'none' : '1px solid var(--border)',
                  cursor: nextUnlocked || pageIndex === 0 ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.4s ease, transform 0.2s, box-shadow 0.2s',
                }}
              >
                {nextLabel}
              </button>
              {!nextUnlocked && pageIndex > 0 && (
                <span style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '8px' }}>
                  {currentWeek && !isWeekComplete(currentWeek, data)
                    ? `Finish week ${currentWeek.n} to continue`
                    : 'Mark this week finished to continue'}
                </span>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
