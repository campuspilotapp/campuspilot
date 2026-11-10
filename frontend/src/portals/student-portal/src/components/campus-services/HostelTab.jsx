import { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import FormModal from '../common/FormModal';
import { hostel } from '../../data/servicesData';
import { useApp } from '../../context/useApp';
import { minLength } from '../../utils/validators';

export default function HostelTab() {
  const { patch, toast } = useApp();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  return (
    <div className="g g2">
      <div>
        <Card title="Allocation"><div className="row"><div><b>{hostel.allocation}</b><span className="sm">{hostel.sharing}</span></div><Badge tone="g">Allocated</Badge></div>
          <div className="row"><div><b>Hostel fee</b><span className="sm">{hostel.fee}</span></div><Badge tone="w">Partial</Badge></div></Card>
        <div style={{ height: 20 }} />
        <Card title="Notice"><div className="sm">{hostel.notice}</div></Card>
      </div>
      <Card title="Maintenance complaints"><div className="sm" style={{ marginBottom: 14 }}>Report a problem in your room or block.</div><Button variant="primary" onClick={() => setOpen(true)}>Raise complaint</Button>
        <FormModal open={open} title="Raise complaint" hint="Tell us what needs fixing." onClose={() => setOpen(false)}
          onSubmit={() => { if (!minLength(text, 10)) return 'Please enter at least 10 characters.'; patch((s) => { s.tickets.unshift({ id: `t${Date.now()}`, title: `HD-${2053 + s.tickets.length} Hostel maintenance`, sub: 'Hostel', status: 'Pending' }); }); setText(''); toast('Complaint submitted'); return ''; }}>
          <textarea className="fld" placeholder="Details (at least 10 characters)" value={text} onChange={(e) => setText(e.target.value)} />
        </FormModal>
      </Card>
    </div>
  );
}
