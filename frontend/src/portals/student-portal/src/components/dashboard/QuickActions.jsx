import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import { quickActions } from '../../data/dashboardData';

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <>
      <div className="ch"><h3>Quick actions</h3></div>
      <div className="qa">
        {quickActions.map((q) => <button key={q.label} type="button" onClick={() => navigate(q.to)}><Icon name={q.icon} />{q.label}</button>)}
      </div>
    </>
  );
}
