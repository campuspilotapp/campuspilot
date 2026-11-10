import Card from '../common/Card';
import Badge from '../common/Badge';
import { statusTone } from '../../utils/statusTone';
import { deadlines } from '../../data/dashboardData';

export default function DeadlinesList() {
  return (
    <Card title="Upcoming activities & deadlines">
      {deadlines.map((d) => (
        <div className="row" key={d.title}>
          <div><b>{d.title}</b><span className="sm">{d.sub}</span></div>
          <Badge tone={statusTone(d.tag) || 'w'}>{d.tag}</Badge>
        </div>
      ))}
    </Card>
  );
}
