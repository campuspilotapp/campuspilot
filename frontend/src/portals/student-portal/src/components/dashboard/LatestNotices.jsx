import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import useNotifications from '../../hooks/useNotifications';

export default function LatestNotices() {
  const navigate = useNavigate();
  const { notices } = useNotifications();
  return (
    <Card title="Latest notices" action={<Button small onClick={() => navigate('/notifications')}>View all</Button>}>
      {notices.slice(0, 3).map((n) => <div className="row" key={n.id}><div><b>{n.title}</b><span className="sm">{n.source} · {n.when}</span></div></div>)}
    </Card>
  );
}
