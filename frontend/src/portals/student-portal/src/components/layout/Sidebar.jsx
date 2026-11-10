import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../common/Icon';
import logo from '../../assets/logos/campus-pilot.png';
import { NAV_ITEMS } from '../../utils/constants';
import { student } from '../../data/studentData';
import useNotifications from '../../hooks/useNotifications';

const ICON_COLORS = { home: '#6D4AFF', timetable: '#0284C7', attendance: '#059669', courses: '#C026D3', exams: '#E11D48', results: '#D97706', fees: '#2563EB', requests: '#DB2777', campus: '#EA580C', notices: '#0D9488', profile: '#7C3AED' };

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { unread } = useNotifications();
  return (
    <aside className={`sb${open ? ' open' : ''}`} id="sb">
      <img className="lg" src={logo} alt="Campus Pilot" />
      <nav className="nv" aria-label="Main">
        {NAV_ITEMS.map((n) => (
          <button key={n.path} type="button" className={pathname === n.path ? 'on' : ''} aria-current={pathname === n.path ? 'page' : undefined}
            style={{ '--ic': ICON_COLORS[n.icon] }} onClick={() => { navigate(n.path); onClose(); }}>
            <Icon name={n.icon} />
            {n.label}
            {n.badge && unread > 0 && <span className="ct">{unread}</span>}
          </button>
        ))}
      </nav>
      <div className="sem">
        <b>Semester {student.semester}</b>
        {student.reg} · {student.section}
        <i><s style={{ width: '88%' }} /></i>
      </div>
    </aside>
  );
}
