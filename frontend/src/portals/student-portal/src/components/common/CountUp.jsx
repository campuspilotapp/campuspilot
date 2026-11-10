import { useEffect, useState, useSyncExternalStore } from 'react';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToMotionPreference(onChange) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getReducedMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export default function CountUp({ value, decimals = 0, prefix = '', suffix = '' }) {
  const [v, setV] = useState(0);
  const reduceMotion = useSyncExternalStore(subscribeToMotionPreference, getReducedMotionPreference, () => true);
  useEffect(() => {
    if (reduceMotion) return undefined;
    let raf; let t0;
    const tick = (t) => {
      t0 = t0 ?? t;
      const p = Math.min(1, (t - t0) / 900);
      setV(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduceMotion]);
  const displayValue = reduceMotion ? value : v;
  return <>{prefix}{displayValue.toFixed(decimals)}{suffix}</>;
}
