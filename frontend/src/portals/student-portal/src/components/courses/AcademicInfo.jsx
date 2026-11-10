import Card from '../common/Card';
import { academicInfo, academicCalendar } from '../../data/coursesData';

export default function AcademicInfo() {
  return (
    <div className="g g2">
      <Card title="B.Tech academic information">{academicInfo.map(([k, v]) => <div className="row" key={k}><div><b>{k}</b><span className="sm">{v}</span></div></div>)}</Card>
      <Card title="Academic calendar">{academicCalendar.map(([d, t]) => <div className="row" key={d}><div className="dt">{d.split(' ')[0]}<small>{d.split(' ')[1]}</small></div><div><b>{t}</b></div></div>)}</Card>
    </div>
  );
}
