import { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Segmented from '../common/Segmented';
import SearchBar from '../common/SearchBar';
import EmptyState from '../common/EmptyState';
import { noticeCategories } from '../../data/notificationsData';
import useNotifications from '../../hooks/useNotifications';

export default function NoticeList() {
  const { notices, markRead } = useNotifications();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null);
  const list = notices.filter((n) => (cat === 'All' || n.category === cat) && n.title.toLowerCase().includes(q.toLowerCase()));
  const show = (n) => { markRead(n.id); setOpen(n); };
  return (
    <Card>
      <SearchBar value={q} onChange={setQ} placeholder="Search notices" />
      <Segmented options={noticeCategories} value={cat} onChange={setCat} style={{ marginBottom: 8 }} />
      {list.length ? list.map((n) => (
        <div className="row" key={n.id} role="button" tabIndex={0} style={{ cursor: 'pointer' }} onClick={() => show(n)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), show(n))}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', flex: 'none', background: n.read ? 'transparent' : '#F26A1B' }} />
          <div><b style={{ fontWeight: n.read ? 600 : 800 }}>{n.title}</b><span className="sm">{n.source} · {n.when}</span></div>
          <Badge>{n.category}</Badge>
        </div>
      )) : <EmptyState title="No notices found" hint="Try a different keyword or clear the filter." />}
      <Modal open={!!open} onClose={() => setOpen(null)}>
        {open && <><h3>{open.title}</h3><div className="sm">{open.source} · {open.when} · {open.category}</div>
          <p>Please read this notice carefully and contact the office if you have questions. This is demo content.</p>
          <div className="a"><Button variant="primary" onClick={() => setOpen(null)}>Close</Button></div></>}
      </Modal>
    </Card>
  );
}
