import Badge from '../common/Badge';

export default function ScheduleRow({ time, subject: s, hours }) {
  return (
    <div className="leg">
      <div className="t">{time}<small>{hours}</small></div>
      <div className={`bar t${s.type}`} />
      <div><b>{s.name}</b><span className="sm">{s.teacher}{s.room ? ` · Room ${s.room}` : ''}</span></div>
      <Badge tone={s.type === 2 ? 'g' : ''} style={{ marginLeft: 'auto' }}>{s.type === 2 ? 'Lab' : 'Theory'}</Badge>
    </div>
  );
}
