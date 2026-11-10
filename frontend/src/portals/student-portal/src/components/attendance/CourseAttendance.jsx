import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { attendanceCourses } from '../../data/attendanceData';
import { MIN_ATTENDANCE } from '../../utils/constants';

export default function CourseAttendance() {
  return (
    <Card title="By course">
      {attendanceCourses.map((a) => {
        const p = (a.attended / a.total) * 100; const low = p < MIN_ATTENDANCE;
        const msg = low ? `Attend ${Math.ceil((0.75 * a.total - a.attended) / 0.25)} more` : `Can miss ${Math.floor(a.attended / 0.75 - a.total)}`;
        return (
          <div className="sub" key={a.name}>
            <div><b>{a.name}</b><div className="sm">{a.attended} of {a.total} classes</div></div>
            <ProgressBar value={p} tone={low ? 'o' : 'v'} threshold />
            <div style={{ textAlign: 'right' }}><b>{p.toFixed(1)}%</b> <Badge tone={low ? 'w' : 'g'}>{msg}</Badge></div>
          </div>
        );
      })}
    </Card>
  );
}
