import { Fragment } from 'react';
import { WEEK, TIMES, SUBJECTS } from '../../data/timetableData';

export default function WeekView({ todayIndex = 1 }) {
  return (
    <div className="tw">
      <div className="tt">
        <div />
        {WEEK.map((w, i) => <div key={w.day} className={`h${i === todayIndex ? ' on' : ''}`}>{w.day}{i === todayIndex ? ' · today' : ''}</div>)}
        {TIMES.map((t, p) => (
          <Fragment key={t}>
            <div className="tm">{t}</div>
            {WEEK.map((w) => { const s = SUBJECTS[w.slots[p]]; return <div key={w.day + t} className={`sl k${s.type}`}><b>{s.name}</b>{s.teacher}</div>; })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
