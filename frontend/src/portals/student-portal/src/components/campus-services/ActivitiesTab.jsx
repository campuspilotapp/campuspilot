import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { clubs, events } from '../../data/servicesData';
import { useApp } from '../../context/useApp';

export default function ActivitiesTab() {
  const { state, patch, toast } = useApp();
  return (
    <div className="g g2">
      <Card title="Clubs">
        {clubs.map((c) => (
          <div className="row" key={c}><div><b>{c}</b></div>
            {state.clubs[c] ? <Button small onClick={() => { patch((s) => { s.clubs[c] = false; }); toast(`Left ${c}`); }}>Leave</Button>
              : <Button small variant="primary" onClick={() => { patch((s) => { s.clubs[c] = true; }); toast(`Joined ${c}`); }}>Join</Button>}</div>
        ))}
      </Card>
      <Card title="Events">
        {events.map(([name, date]) => (
          <div className="row" key={name}><div><b>{name}</b><span className="sm">{date}</span></div>
            {state.events[name] ? <Badge tone="g">Registered</Badge> : <Button small onClick={() => { patch((s) => { s.events[name] = true; }); toast(`Registered for ${name}`); }}>Register</Button>}</div>
        ))}
      </Card>
    </div>
  );
}
