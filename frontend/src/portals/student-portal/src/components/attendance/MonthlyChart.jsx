import Card from '../common/Card';
import { monthlyAttendance } from '../../data/attendanceData';

export default function MonthlyChart() {
  return (
    <Card title="Monthly attendance">
      <div className="bars">
        {monthlyAttendance.map(([m, v], i) => (
          <div key={m} className={i === monthlyAttendance.length - 1 ? 'on' : ''} style={{ height: `${v}%` }}><b>{v}%</b><span>{m}</span></div>
        ))}
      </div>
    </Card>
  );
}
