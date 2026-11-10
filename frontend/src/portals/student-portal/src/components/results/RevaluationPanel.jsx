import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Dropdown from '../common/Dropdown';
import FormModal from '../common/FormModal';
import { revaluationCourses } from '../../data/resultsData';
import { useApp } from '../../context/useApp';
import { minLength } from '../../utils/validators';

export default function RevaluationPanel() {
  const { state, patch, toast } = useApp();
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState(revaluationCourses[0]);
  const [kind, setKind] = useState('Revaluation');
  const [reason, setReason] = useState('');
  const submit = () => {
    if (!minLength(reason, 10)) return 'Please enter a reason of at least 10 characters.';
    patch((s) => { s.revals.unshift({ course, kind, when: 'Today' }); });
    setReason(''); toast('Application submitted');
    return '';
  };
  return (
    <Card title="Revaluation & retotalling" action={<Button small onClick={() => setOpen(true)}>Apply</Button>}>
      {state.revals.length ? state.revals.map((r, i) => <div className="row" key={i}><div><b>{r.course}</b><span className="sm">{r.kind} · {r.when}</span></div><Badge tone="w">Submitted</Badge></div>)
        : <EmptyState title="No applications yet" hint="Apply within 7 days of result publication." icon="results" />}
      <FormModal open={open} title="Apply for revaluation" hint="Fee ₹300 per paper (demo). No payment is processed." onClose={() => setOpen(false)} onSubmit={submit}>
        <Dropdown label="Course" options={revaluationCourses} value={course} onChange={setCourse} />
        <Dropdown label="Type" options={['Revaluation', 'Retotalling']} value={kind} onChange={setKind} />
        <textarea className="fld" placeholder="Reason (at least 10 characters)" value={reason} onChange={(e) => setReason(e.target.value)} />
      </FormModal>
    </Card>
  );
}
