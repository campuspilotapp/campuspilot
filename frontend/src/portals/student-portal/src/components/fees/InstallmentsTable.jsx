import Card from '../common/Card';
import Badge from '../common/Badge';
import { statusTone } from '../../utils/statusTone';
import Button from '../common/Button';
import DataTable from '../common/DataTable';
import { useApp } from '../../context/useApp';
import { inr } from '../../utils/formatters';

export default function InstallmentsTable({ fees, onPay }) {
  const { toast } = useApp();
  return (
    <Card title="Installments">
      <DataTable rows={fees} columns={[
        { key: 'title', label: 'Item', render: (f) => <b>{f.title}</b> }, { key: 'amount', label: 'Amount', render: (f) => inr(f.amount) },
        { key: 'due', label: 'Due date' }, { key: 'status', label: 'Status', render: (f) => <Badge tone={statusTone(f.status)}>{f.status}</Badge> },
        { key: 'act', label: '', align: 'right', render: (f) => (f.status === 'Paid'
          ? <Button small icon="dl" onClick={() => toast(`Receipt ${f.receipt} downloaded`)}>Receipt</Button>
          : <Button small variant="primary" onClick={() => onPay(f)}>Pay now</Button>) },
      ]} />
    </Card>
  );
}
