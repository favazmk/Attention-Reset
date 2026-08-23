import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when the element first crosses into view.
 *
 * Everything scroll-driven on the landing page runs through this rather than a
 * scroll listener: an observer costs nothing while the element is off-screen,
 * where a scroll handler pays on every frame of the whole page. Returns `true`
 * immediately when motion is reduced or the observer is unavailable, so the
 * failure mode is "content is visible", never "content never arrives".
 */
export function useInView({ threshold = 0.35, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  // Seeded true where there is no observer to wait on, so the "already in view"
  // state is the initial state rather than something an effect has to correct.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    // Same backstop as the reveal system: a context that creates observers but
    // never delivers to them would otherwise leave counters stuck at zero.
    const failsafe = setTimeout(() => setInView(true), 2500);

    return () => {
      clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, inView];
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
