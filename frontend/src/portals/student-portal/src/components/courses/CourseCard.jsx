import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { useApp } from '../../context/useApp';

export default function CourseCard({ course: c }) {
  const { toast } = useApp();
  return (
    <Card title={null} action={null}>
      <div className="ch"><div><Badge>{c.code}</Badge> <Badge tone="w">{c.kind}</Badge></div><span className="sm">{c.credits} credits</span></div>
      <h3 style={{ fontSize: 17 }}>{c.name}</h3>
      <div className="sm" style={{ marginBottom: 14 }}>{c.teacher}</div>
      <div className="sm">Attendance · {c.attendance}%</div>
      <ProgressBar value={c.attendance} tone={c.attendance < 75 ? 'o' : 'v'} style={{ margin: '4px 0 10px' }} />
      <div className="sm">Course progress · {c.progress}%</div>
      <ProgressBar value={c.progress} tone="g" style={{ margin: '4px 0' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <Button small onClick={() => toast('Syllabus opened')}>Syllabus</Button>
        <Button small onClick={() => toast('Study material opened')}>Materials</Button>
      </div>
    </Card>
  );
}
