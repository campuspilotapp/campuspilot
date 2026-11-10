import { useEffect, useState } from 'react';
import CountUp from './CountUp';

export default function Ring({ value, label = 'overall' }) {
  const c = 2 * Math.PI * 62;
  const [on, setOn] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(t); }, []);
  const percentage = Number(value).toFixed(1);
  return (
    <div className="attendance-ring" role="img" aria-label={`${percentage}% ${label} attendance`}>
      <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
        <circle cx="75" cy="75" r="62" fill="none" stroke="#EFE8FF" strokeWidth="12" />
        <circle cx="75" cy="75" r="62" fill="none" stroke="#5B2EE5" strokeWidth="12" strokeLinecap="round" strokeDasharray={on ? `${(c * value) / 100} ${c}` : `0 ${c}`} />
      </svg>
      <div><CountUp value={value} decimals={1} suffix="%" /><small>{label}</small></div>
    </div>
  );
}
