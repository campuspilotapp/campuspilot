import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useApp } from '../../context/useApp';

export default function PlacementTab() {
  const { state, patch, toast } = useApp();
  const upload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2e6) { toast('Choose a file under 2 MB'); return; }
    patch((s) => { s.resume = f.name; }); toast('Resume uploaded');
  };
  return (
    <div className="g g2">
      <Card title="Drives & internships">
        {state.drives.map((d) => (
          <div className="row" key={d.id}>
            <div><b>{d.company} · {d.pay}</b><span className="sm">{d.role} · {d.branches}</span></div>
            {d.applied ? <Badge tone="g">Applied</Badge> : d.eligible ? <Button small variant="primary" onClick={() => { patch((s) => { s.drives.find((x) => x.id === d.id).applied = true; }); toast(`Applied to ${d.company}`); }}>Apply</Button> : <Badge>Not eligible</Badge>}
          </div>
        ))}
      </Card>
      <div>
        <Card title="Interviews & offers"><div className="sm">Apply to a drive to see interview schedules.</div>
          <div className="row"><div><b>Offers</b><span className="sm">No offers yet</span></div><Badge>None</Badge></div></Card>
        <div style={{ height: 20 }} />
        <Card title="Resume"><div className="row"><div><b>{state.resume || 'No resume uploaded'}</b><span className="sm">PDF up to 2 MB</span></div>
          <label className="btn s"><input type="file" accept=".pdf" hidden onChange={upload} />Upload resume</label></div></Card>
      </div>
    </div>
  );
}
