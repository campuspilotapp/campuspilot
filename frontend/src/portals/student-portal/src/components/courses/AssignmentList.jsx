import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { assignments } from '../../data/coursesData';
import { useApp } from '../../context/useApp';

export default function AssignmentList() {
  const { state, patch, toast } = useApp();
  return (
    <Card title="Assignments">
      {assignments.map((a) => (
        <div className="row" key={a.id}>
          <div><b>{a.title}</b><span className="sm">{a.course} · due {a.due}</span></div>
          {state.assignments[a.id] ? <Badge tone="g">Submitted</Badge> : <Button small onClick={() => { patch((s) => { s.assignments[a.id] = true; }); toast('Assignment submitted'); }}>Submit</Button>}
        </div>
      ))}
    </Card>
  );
}
