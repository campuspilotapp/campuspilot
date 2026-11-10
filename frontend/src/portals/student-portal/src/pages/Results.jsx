import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Segmented from '../components/common/Segmented';
import Button from '../components/common/Button';
import SemesterResults from '../components/results/SemesterResults';
import GpaTrend from '../components/results/GpaTrend';
import InternalMarks from '../components/results/InternalMarks';
import RevaluationPanel from '../components/results/RevaluationPanel';
import { useApp } from '../context/useApp';

export default function Results() {
  const { toast } = useApp();
  const [tab, setTab] = useState('Semester results');
  return (
    <>
      <PageHeader title="Results" subtitle="Credit-weighted GPA on a 10-point scale">
        <Button variant="primary" icon="dl" onClick={() => toast('Transcript download started')}>Download transcript</Button>
      </PageHeader>
      <Segmented options={['Semester results', 'Internal marks', 'Revaluation']} value={tab} onChange={setTab} style={{ marginBottom: 24 }} />
      {tab === 'Semester results' && <div className="g g2"><SemesterResults /><GpaTrend /></div>}
      {tab === 'Internal marks' && <InternalMarks />}
      {tab === 'Revaluation' && <RevaluationPanel />}
    </>
  );
}
