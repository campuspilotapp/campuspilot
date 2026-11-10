import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { transport } from '../../data/servicesData';
import { useApp } from '../../context/useApp';

export default function TransportTab() {
  const { toast } = useApp();
  return (
    <div className="g g2">
      <div>
        <Card title="Your route"><div className="row"><div><b>{transport.route}</b><span className="sm">{transport.bus}</span></div><Badge tone="g">Active</Badge></div>
          <div className="row"><div><b>Transport fee</b><span className="sm">{transport.fee}</span></div><Badge tone="g">Paid</Badge></div></Card>
      </div>
      <Card title="Other routes">
        {transport.others.map(([r, s]) => <div className="row" key={r}><div><b>{r}</b><span className="sm">{s}</span></div></div>)}
        <div style={{ marginTop: 14 }}><Button onClick={() => toast('Route change request submitted (demo)')}>Request route change</Button></div>
      </Card>
    </div>
  );
}
