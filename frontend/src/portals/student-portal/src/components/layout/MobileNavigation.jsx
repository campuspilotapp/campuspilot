import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../common/Icon';
import { MOBILE_NAV } from '../../utils/constants';

export default function MobileNavigation({ onMore }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <nav className="bn" aria-label="Quick navigation">
      {MOBILE_NAV.map((n) => (
        <button key={n.path} type="button" className={pathname === n.path ? 'on' : ''} onClick={() => navigate(n.path)}>
          <Icon name={n.icon} />{n.label}
        </button>
      ))}
      <button type="button" onClick={onMore}><Icon name="more" />More</button>
    </nav>
  );
}
