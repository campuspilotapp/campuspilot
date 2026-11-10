import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNavigation from './MobileNavigation';
import Breadcrumbs from './Breadcrumbs';
import LoadingState from '../common/LoadingState';
import Toast from '../common/Toast';
import { NAV_ITEMS } from '../../utils/constants';

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const label = (NAV_ITEMS.find((n) => n.path === pathname) || {}).label || 'Page not found';
  useEffect(() => { window.scrollTo(0, 0); document.title = `Campus Pilot – ${label}`; }, [pathname, label]);
  return (
    <>
      <a className="skip" href="#v">Skip to content</a>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className={`ov${open ? ' on' : ''}`} onClick={() => setOpen(false)} />
      <div className="main">
        <Topbar />
        {/* key = pathname remounts the page so the enter animation (page transition) replays on every navigation */}
        <main className="wrap enter" id="v" key={pathname} tabIndex={-1} style={{ outline: 0 }}>
          <Breadcrumbs />
          <Suspense fallback={<LoadingState />}><Outlet /></Suspense>
        </main>
      </div>
      <MobileNavigation onMore={() => setOpen(true)} />
      <div className="sr" aria-live="polite">{label}</div>
      <Toast />
    </>
  );
}
