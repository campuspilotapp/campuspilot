import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { scholarship } from '../../data/feesData';
import { useApp } from '../../context/useApp';
import { inr } from '../../utils/formatters';

export function PaymentHistory({ fees }) {
  const { toast } = useApp();
  const paid = fees.filter((f) => f.status === 'Paid');
  return (
    <Card title="Payment history">
      {paid.map((f) => (
        <div className="row" key={f.id}>
          <div><b>{f.title}</b><span className="sm">Receipt {f.receipt} · {inr(f.amount)}</span></div>
          <Button small icon="dl" onClick={() => toast(`Receipt ${f.receipt} downloaded`)}>Receipt</Button>
        </div>
      ))}
    </Card>
  );
}

export default function ScholarshipCard() {
  return (
    <Card title="Scholarship & refunds">
      <div className="row"><div><b>{scholarship.name}</b><span className="sm">{scholarship.detail}</span></div><Badge tone="g">{scholarship.status}</Badge></div>
      <div className="row"><div><b>Refund status</b><span className="sm">No refund requests</span></div><Badge>None</Badge></div>
    </Card>
  );
}
