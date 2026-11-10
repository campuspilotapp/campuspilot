import { useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon';
import Button from '../common/Button';
import useNotifications from '../../hooks/useNotifications';

export default function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { notices, unread, markAllRead } = useNotifications();
  useEffect(() => {
    const off = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, []);
  const items = notices.filter((n) => !n.read).slice(0, 4);
  const today = items.filter((n) => /ago/.test(n.when));
  const earlier = items.filter((n) => !/ago/.test(n.when));
  const group = (label, list) => list.length > 0 && (
    <>
      <div className="pg-lb">{label}</div>
      {list.map((n) => <div className="row" key={n.id}><div><b>{n.title}</b><span className="sm">{n.source} · {n.when}</span></div></div>)}
    </>
  );
  return (
    <div ref={ref} style={{ display: 'contents' }}>
      <button type="button" className="ib" aria-label="Notifications" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon name="bell" />
        {unread > 0 && <em>{unread}</em>}
      </button>
      <div className={`pop${open ? ' on' : ''}`}>
        <div className="ch" style={{ margin: '4px 6px 6px' }}>
          <h3>Notifications</h3>
          <Button small onClick={() => { markAllRead(); setOpen(false); }}>Mark all read</Button>
        </div>
        {items.length ? <>{group('Today', today)}{group('Earlier', earlier)}</> : <div className="sm" style={{ padding: 16 }}>You’re all caught up.</div>}
      </div>
    </div>
  );
}
