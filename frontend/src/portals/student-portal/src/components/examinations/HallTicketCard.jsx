import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useApp } from '../../context/useApp';

export default function HallTicketCard({ onPay }) {
  const { state, patch, toast } = useApp();
  const fee = state.fees.find((f) => f.id === 'f3');
  const paid = fee.status === 'Paid';
  const { registered } = state;
  return (
    <Card title="Hall ticket · Internal Assessment 2">
      <div className="row"><div><b>Exam registration</b></div><Badge tone={registered ? 'g' : 'w'}>{registered ? 'Registered' : 'Not registered'}</Badge></div>
      <div className="row"><div><b>Attendance (89% overall)</b></div><Badge tone="g">Eligible</Badge></div>
      <div className="row"><div><b>Examination fee</b></div><Badge tone={paid ? 'g' : 'w'}>{paid ? 'Paid' : 'Due'}</Badge></div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        {registered
          ? <Button variant="primary" icon="dl" onClick={() => toast('Hall ticket download started')}>Download hall ticket</Button>
          : <Button variant="primary" onClick={() => { patch((s) => { s.registered = true; }); toast('Registered for Internal Assessment 2'); }}>Register now</Button>}
        {!paid && <Button onClick={() => onPay(fee)}>Pay exam fee</Button>}
      </div>
    </Card>
  );
}
