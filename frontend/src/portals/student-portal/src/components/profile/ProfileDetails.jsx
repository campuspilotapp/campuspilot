import { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import EditContactModal from './EditContactModal';
import { student, documents } from '../../data/studentData';
import { useApp } from '../../context/useApp';

const Row = ({ k, v }) => <div className="row"><div><b>{k}</b><span className="sm">{v}</span></div></div>;

export function Completeness() {
  const { state } = useApp();
  const { photo, phone, email, addr } = state.profile;
  const pct = Math.round(([photo, phone, email, addr, 1, 1, 1].filter(Boolean).length / 7) * 100);
  return (
    <Card title="Profile completeness">
      <ProgressBar value={pct} style={{ marginBottom: 8 }} />
      <div className="sm">{pct}% complete{pct < 100 ? ' · add a photo to finish' : ''}</div>
    </Card>
  );
}

export function Details() {
  const { state } = useApp();
  const [edit, setEdit] = useState(false);
  const p = state.profile;
  return (
    <Card title="Details" action={<Button small onClick={() => setEdit(true)}>Edit contact</Button>}>
      <Row k="Department" v={student.department} />
      <Row k="Programme" v={`B.Tech · Batch ${student.batch}`} />
      <Row k="Phone" v={p.phone} /><Row k="Email" v={p.email} /><Row k="Address" v={p.addr} />
      <Row k="Guardian" v={student.guardian} /><Row k="Date of birth" v={student.dob} />
      <EditContactModal open={edit} onClose={() => setEdit(false)} />
    </Card>
  );
}

export function Documents() {
  return (
    <Card title="Documents">
      {documents.map((d) => <div className="row" key={d}><div><b>{d}</b></div><Badge tone="g">Verified</Badge></div>)}
    </Card>
  );
}
