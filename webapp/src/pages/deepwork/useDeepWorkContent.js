import { useCallback, useEffect, useRef, useState } from 'react';
import { authedPost } from '../../api';

/**
 * Fetches the Deep Work weeks from the gated endpoint.
 *
 * The programme is no longer bundled, so it has to arrive over the network —
 * which means this page now has loading and failure states that a static import
 * never had. They are handled explicitly rather than left to a blank screen,
 * because the person waiting has paid for what is behind them.
 *
 * Held in a module-level cache so moving between weeks, or leaving and coming
 * back, does not refetch. It is deliberately memory-only: paid material is not
 * written to localStorage, where it would outlive both the session and any
 * later change to the account's entitlement.
 */
let cache = null;

export function clearDeepWorkCache() {
  cache = null;
}

export default function useDeepWorkContent(enabled = true) {
  const [weeks, setWeeks] = useState(cache);
  const [status, setStatus] = useState(cache ? 'ready' : 'loading');
  const [attempt, setAttempt] = useState(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || cache) return;

    let cancelled = false;

    authedPost('/api/deepwork-content')
      .then((res) => {
        if (cancelled || !alive.current) return;
        if (!Array.isArray(res.weeks) || res.weeks.length === 0) {
          throw new Error('empty programme');
        }
        cache = res.weeks;
        setWeeks(res.weeks);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled || !alive.current) return;
        // 403 is a different situation from a network failure: one is "you do
        // not have this", the other is "we could not reach it". Retrying only
        // makes sense for the second.
        if (err.status === 403 || err.data?.error === 'not_entitled') {
          setStatus('denied');
        } else {
          console.error('Deep Work content load failed:', err);
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, attempt]);

  // Setting 'loading' here rather than in the effect: this is an event handler,
  // so it does not trigger the cascading re-render an effect-body setState does.
  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  }, []);

  return { weeks, status, retry };
}
