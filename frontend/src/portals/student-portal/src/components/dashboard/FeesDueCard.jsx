import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { inr } from '../../utils/formatters';

export default function FeesDueCard({ fee, onPay }) {
  return (
    <Card title="Fees due" action={fee ? <Badge tone="w">20 days left</Badge> : <Badge tone="g">All clear</Badge>}>
      {fee ? (
        <>
          <div className="sm">{fee.title}</div>
          <div style={{ font: '800 32px var(--sans)', margin: '4px 0 12px' }}>{inr(fee.amount)}</div>
          <Button variant="primary" style={{ width: '100%' }} onClick={() => onPay(fee)}>Pay now</Button>
        </>
      ) : <div className="sm">No pending payments. Receipts are in Requests.</div>}
    </Card>
  );
}
