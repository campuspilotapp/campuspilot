import { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { statusTone } from '../../utils/statusTone';
import Button from '../common/Button';
import FormModal from '../common/FormModal';
import { moreServices } from '../../data/servicesData';
import { useApp } from '../../context/useApp';
import { minLength } from '../../utils/validators';

export default function MoreTab() {
  const { state, patch, toast } = useApp();
  const [svc, setSvc] = useState(null);
  const [text, setText] = useState('');
  return (
    <div className="g g2">
      <Card title="Campus services">
        <div className="fl" style={{ gap: 10 }}>{moreServices.map((s) => <Button key={s} onClick={() => setSvc(s)}>{s}</Button>)}</div>
      </Card>
      <Card title="My service requests">
        {state.tickets.map((t) => <div className="row" key={t.id}><div><b>{t.title}</b><span className="sm">{t.sub}</span></div><Badge tone={statusTone(t.status)}>{t.status}</Badge></div>)}
      </Card>
      <FormModal open={!!svc} title={svc || ''} hint="Tell us what you need. This is a demo request." onClose={() => setSvc(null)}
        onSubmit={() => { if (!minLength(text, 10)) return 'Please enter at least 10 characters.'; patch((s) => { s.tickets.unshift({ id: `t${Date.now()}`, title: `${svc} request`, sub: svc, status: 'Pending' }); }); toast(`${svc} submitted`); setText(''); return ''; }}>
        <textarea className="fld" placeholder="Details (at least 10 characters)" value={text} onChange={(e) => setText(e.target.value)} />
      </FormModal>
    </div>
  );
}
