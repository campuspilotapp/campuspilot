import Card from '../common/Card';
import { inr } from '../../utils/formatters';

export default function FeeSummary({ fees }) {
  const total = fees.reduce((a, f) => a + f.amount, 0);
  const paid = fees.filter((f) => f.status === 'Paid').reduce((a, f) => a + f.amount, 0);
  const big = (v, color) => <div style={{ font: '800 32px var(--sans)', color }}>{inr(v)}</div>;
  return (
    <div className="g g3">
      <Card><div className="sm">Total payable</div>{big(total)}</Card>
      <Card><div className="sm">Paid</div>{big(paid, 'var(--ok)')}</Card>
      <Card><div className="sm">Balance due</div>{big(total - paid, 'var(--warn)')}</Card>
    </div>
  );
}
