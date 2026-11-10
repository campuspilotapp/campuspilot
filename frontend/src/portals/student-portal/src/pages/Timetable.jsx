import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Segmented from '../components/common/Segmented';
import DayView from '../components/timetable/DayView';
import WeekView from '../components/timetable/WeekView';
import { student } from '../data/studentData';

export default function Timetable() {
  const [view, setView] = useState('day');
  const today = Math.min(Math.max(new Date().getDay() - 1, 0), 4);
  return (
    <>
      <PageHeader title="Timetable" subtitle={`${student.programme} · Semester ${student.semester} · ${student.section}`}>
        <Segmented style={{ margin: 0 }} options={[{ value: 'day', label: 'Daily' }, { value: 'week', label: 'Weekly' }]} value={view} onChange={setView} />
      </PageHeader>
      <Card>{view === 'day' ? <DayView initialDay={today} /> : <WeekView todayIndex={today} />}</Card>
    </>
  );
}
