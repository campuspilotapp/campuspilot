import Card from '../common/Card';
import Ring from '../common/Ring';
import Icon from '../common/Icon';
import { attendanceTrend } from '../../data/attendanceData';

export default function AttendanceSummary({ overall, lowCourse }) {
  const pts = attendanceTrend.map((y, i) => `${i ? 'L' : 'M'}${i * 40} ${34 - (y - 82) * 4.4}`).join('');
  return (
    <Card title="Attendance">
      <Ring value={overall} />
      <div className="alert">
        <Icon name="warn" />
        <span><b>{lowCourse.name} is at {Math.round((lowCourse.attended / lowCourse.total) * 100)}%.</b> Attend the next 3 classes to reach 75%.</span>
      </div>
      <div className="spk">
        <span>Last 6 weeks</span>
        <svg viewBox="0 0 200 36" preserveAspectRatio="none"><path pathLength="1" d={pts} /></svg>
        <b>+5%</b>
      </div>
    </Card>
  );
}
