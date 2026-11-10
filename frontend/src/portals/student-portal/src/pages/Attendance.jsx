import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Ring from '../components/common/Ring';
import CourseAttendance from '../components/attendance/CourseAttendance';
import MonthlyChart from '../components/attendance/MonthlyChart';
import ExamEligibility from '../components/attendance/ExamEligibility';
import AttendanceHistory from '../components/attendance/AttendanceHistory';
import { attendanceCourses } from '../data/attendanceData';
import { pct } from '../utils/formatters';

export default function Attendance() {
  const a = attendanceCourses.reduce((s, c) => s + c.attended, 0);
  const t = attendanceCourses.reduce((s, c) => s + c.total, 0);
  const low = [...attendanceCourses].sort((x, y) => x.attended / x.total - y.attended / y.total)[0];
  return (
    <>
      <PageHeader title="Attendance" subtitle="Minimum required attendance is 75% per course." />
      <div className="g g2">
        <CourseAttendance />
        <Card className="attendance-overview" title="Overall">
          <Ring value={pct(a, t)} />
          <div className="sm attendance-caption">{a} of {t} classes attended</div>
        </Card>
      </div>
      <div className="g g2"><MonthlyChart /><ExamEligibility overall={pct(a, t)} lowCourse={low.name} /></div>
      <AttendanceHistory />
    </>
  );
}
