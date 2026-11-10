import { useEffect, useState } from 'react';
import Avatar from '../profile/Avatar';
import CountUp from '../common/CountUp';
import { student } from '../../data/studentData';
import { heroNote } from '../../data/dashboardData';
import { greeting, minutesFromTime } from '../../utils/formatters';

function nextClassLabel(classes, now) {
  const n = now.getHours() * 60 + now.getMinutes();
  const next = classes.find((c) => minutesFromTime(c.time) + 60 > n);
  if (!next) return 'No more classes today';
  const diff = minutesFromTime(next.time) - n;
  if (diff <= 0) return `Now · ${next.subject.name}`;
  return `Next · ${next.subject.name} · in ${diff >= 60 ? `${Math.floor(diff / 60)}h ` : ''}${diff % 60}m`;
}

export default function Hero({ classes, cgpaValue, attendance }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  return (
    <section className="hero">
      <div className="who">
        <Avatar className="big" />
        <div>
          <h1>{greeting(now)}, {student.name}</h1>
          <p>You have {classes.length} {classes.length === 1 ? 'class' : 'classes'} today. {heroNote}</p>
          <div className="chips">
            <span>{student.reg}</span>
            <span>{student.programme} · Sem {student.semester} · {student.section}</span>
            <span>Batch {student.batch}</span>
            <span className="nx">{nextClassLabel(classes, now)}</span>
          </div>
        </div>
      </div>
      <div className="hs">
        <div><b><CountUp value={cgpaValue} decimals={2} /></b><small>CGPA</small></div>
        <div><b><CountUp value={attendance} suffix="%" /></b><small>Attendance</small></div>
        <div><b>82/160</b><small>Credits</small></div>
      </div>
    </section>
  );
}
