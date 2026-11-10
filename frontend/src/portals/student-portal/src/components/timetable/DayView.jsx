import { useState } from 'react';
import Segmented from '../common/Segmented';
import EmptyState from '../common/EmptyState';
import ScheduleRow from './ScheduleRow';
import { classesFor } from '../../utils/classesFor';
import { WEEK, TIMES } from '../../data/timetableData';

export default function DayView({ initialDay = 1 }) {
  const [day, setDay] = useState(initialDay);
  const list = classesFor(WEEK[day].slots);
  const free = WEEK[day].slots.map((k, i) => (k === 'X' ? TIMES[i] : null)).filter(Boolean);
  return (
    <>
      <Segmented options={WEEK.map((w, i) => ({ value: i, label: w.day }))} value={day} onChange={setDay} />
      {list.length ? list.map((c) => <ScheduleRow key={c.time} {...c} />) : <EmptyState title="No classes" icon="timetable" />}
      {free.map((t) => <div className="leg" key={t}><div className="t">{t}</div><div className="bar t0" /><div className="sm">Free period</div></div>)}
    </>
  );
}
