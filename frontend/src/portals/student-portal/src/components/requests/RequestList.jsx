import { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { statusTone } from '../../utils/statusTone';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useApp } from '../../context/useApp';

export default function RequestList() {
  const { state, patch, toast } = useApp();
  const [cancelId, setCancelId] = useState(null);
  const target = state.requests.find((r) => r.id === cancelId);
  return (
    <Card title="My requests">
      {state.requests.map((r) => (
        <div className="row" key={r.id}>
          <div><b>{r.title}</b><span className="sm">Applied {r.applied} · {r.note}</span></div>
          <Badge tone={statusTone(r.status)}>{r.status}</Badge>
          {r.status === 'Under Review' && <Button small onClick={() => setCancelId(r.id)}>Cancel</Button>}
        </div>
      ))}
      <Modal open={!!target} onClose={() => setCancelId(null)}>
        <h3>Cancel this request?</h3><div className="sm">{target && target.title}</div>
        <div className="a"><Button onClick={() => setCancelId(null)}>Keep</Button>
          <Button variant="primary" onClick={() => { patch((s) => { const r = s.requests.find((x) => x.id === cancelId); r.status = 'Cancelled'; r.note = 'Cancelled by you'; }); setCancelId(null); toast('Request cancelled'); }}>Cancel request</Button></div>
      </Modal>
    </Card>
  );
}
