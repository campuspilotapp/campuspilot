import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { vault } from '../../data/servicesData';
import { useApp } from '../../context/useApp';

export default function DocumentVault() {
  const { toast } = useApp();
  return (
    <Card title="Document vault">
      {vault.map((d) => (
        <div className="row" key={d}><div><b style={{ fontWeight: 500 }}>{d}</b></div><Badge>PDF</Badge><Button small icon="dl" aria-label={`Download ${d}`} onClick={() => toast(`Downloaded ${d}`)} /></div>
      ))}
    </Card>
  );
}
