import Card from '../common/Card';
import { upcomingExams } from '../../data/dashboardData';

export default function UpcomingExams() {
  return (
    <Card title="Upcoming exams">
      {upcomingExams.map((e) => (
        <div className="row" key={e.title}>
          <div className="dt">{e.day}<small>{e.month}</small></div>
          <div><b>{e.title}</b><span className="sm">{e.where}</span></div>
        </div>
      ))}
    </Card>
  );
}
