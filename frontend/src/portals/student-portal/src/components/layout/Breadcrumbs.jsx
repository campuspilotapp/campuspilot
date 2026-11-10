import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';

// Visually hidden (keeps the design clean) but available to screen readers.
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const page = NAV_ITEMS.find((n) => n.path === pathname);
  return (
    <nav className="sr" aria-label="Breadcrumb">
      <Link to="/">Dashboard</Link>{page && pathname !== '/' ? ` / ${page.label}` : ''}
    </nav>
  );
}
