import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import RequestTypes from '../components/requests/RequestTypes';
import RequestList from '../components/requests/RequestList';
import DocumentVault from '../components/requests/DocumentVault';
import RequestFormModal from '../components/requests/RequestFormModal';
import { useApp } from '../context/useApp';

export default function StudentRequests() {
  const { patch, toast } = useApp();
  const [type, setType] = useState(null);
  const submit = (title, _desc, file) => {
    patch((s) => { s.requests.unshift({ id: `r${Date.now()}`, title, applied: 'Today', note: file ? `File: ${file.name}` : 'Submitted.', status: 'Under Review' }); });
    toast(`${title} submitted`);
  };
  return (
    <>
      <PageHeader title="Student requests" subtitle="Submit a request and track its progress." />
      <RequestTypes onPick={setType} />
      <div className="g g2"><RequestList /><DocumentVault /></div>
      <RequestFormModal title={type} onClose={() => setType(null)} onSubmit={submit} />
    </>
  );
}
