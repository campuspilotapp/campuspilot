import { useState } from 'react';
import Hero from '../components/dashboard/Hero';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import AttendanceSummary from '../components/dashboard/AttendanceSummary';
import FeesDueCard from '../components/dashboard/FeesDueCard';
import UpcomingExams from '../components/dashboard/UpcomingExams';
import LatestNotices from '../components/dashboard/LatestNotices';
import QuickActions from '../components/dashboard/QuickActions';
import DeadlinesList from '../components/dashboard/DeadlinesList';
import PaymentModal from '../components/fees/PaymentModal';
import { classesFor } from '../utils/classesFor';
import { WEEK } from '../data/timetableData';
import { attendanceCourses } from '../data/attendanceData';
import { semesterResults } from '../data/resultsData';
import { useApp } from '../context/useApp';
import { cgpa, pct } from '../utils/formatters';

export default function Dashboard() {
  const { state } = useApp();
  const [paying, setPaying] = useState(null);
  const today = new Date();
  const dayIdx = today.getDay() - 1; // Mon=0 … Fri=4; weekend → no classes
  const classes = WEEK[dayIdx] ? classesFor(WEEK[dayIdx].slots) : [];
  const attended = attendanceCourses.reduce((a, c) => a + c.attended, 0);
  const total = attendanceCourses.reduce((a, c) => a + c.total, 0);
  const overall = pct(attended, total);
  const lowCourse = [...attendanceCourses].sort((a, b) => a.attended / a.total - b.attended / b.total)[0];
  const nextFee = state.fees.find((f) => f.status !== 'Paid');
  const dateLabel = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  return (
    <>
      <Hero classes={classes} cgpaValue={cgpa(semesterResults)} attendance={overall} />
      <div className="g g2"><TodaySchedule classes={classes} dateLabel={dateLabel} /><AttendanceSummary overall={overall} lowCourse={lowCourse} /></div>
      <div className="g g3"><FeesDueCard fee={nextFee} onPay={setPaying} /><UpcomingExams /><LatestNotices /></div>
      <QuickActions />
      <DeadlinesList />
      <PaymentModal fee={paying} onClose={() => setPaying(null)} />
    </>
  );
}
