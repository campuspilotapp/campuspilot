import { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import SearchBar from '../common/SearchBar';
import { catalogue } from '../../data/servicesData';
import { useApp } from '../../context/useApp';

export default function LibraryTab() {
  const { state, patch, toast } = useApp();
  const [q, setQ] = useState('');
  const list = catalogue.filter((b) => (b.title + b.author).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="g g2">
      <Card title="Search catalogue">
        <SearchBar value={q} onChange={setQ} placeholder="Search catalogue" />
        {list.length ? list.map((b) => (
          <div className="row" key={b.title}>
            <div><b>{b.title}</b><span className="sm">{b.author} · Shelf {b.shelf}</span></div>
            {b.available ? <Badge tone="g">{b.available} available</Badge>
              : state.reserved.includes(b.title) ? <Badge>Reserved</Badge>
              : <Button small onClick={() => { patch((s) => { s.reserved.push(b.title); }); toast('Reservation requested (demo)'); }}>Reserve</Button>}
          </div>
        )) : <EmptyState title="No books found" hint="Try a different title or author." />}
      </Card>
      <div>
        <Card title="Issued books">
          {state.books.map((b) => (
            <div className="row" key={b.id}>
              <div><b>{b.title}</b><span className="sm">Due {b.due}</span></div>
              {b.renewed ? <Badge tone="g">Renewed</Badge> : <Button small onClick={() => { patch((s) => { s.books.find((x) => x.id === b.id).renewed = true; }); toast('Book renewed'); }}>Renew</Button>}
            </div>
          ))}
        </Card>
        <div style={{ height: 20 }} />
        <Card title="Fines & clearance">
          <div className="row"><div><b>Fines</b><span className="sm">₹0</span></div><Badge tone="g">Clear</Badge></div>
          <div className="row"><div><b>Library clearance</b><span className="sm">No dues</span></div><Badge tone="g">Cleared</Badge></div>
        </Card>
      </div>
    </div>
  );
}
