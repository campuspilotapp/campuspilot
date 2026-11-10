import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import ScheduleRow from '../timetable/ScheduleRow';

export default function TodaySchedule({ classes, dateLabel }) {
  const navigate = useNavigate();
  return (
    <Card title={`Today’s schedule · ${dateLabel}`} subtitle="Your classes for today" action={<Button small onClick={() => navigate('/timetable')}>Full timetable</Button>}>
      {classes.length ? classes.map((c) => <ScheduleRow key={c.time} {...c} />) : <EmptyState title="No classes today" hint="Enjoy the day off." icon="timetable" />}
    </Card>
  );
}
