import { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Segmented from '../common/Segmented';
import DataTable from '../common/DataTable';
import { semesterResults } from '../../data/resultsData';
import { sgpa } from '../../utils/formatters';

export default function SemesterResults({ initial = 2 }) {
  const [sem, setSem] = useState(initial);
  const rows = semesterResults[sem];
  return (
    <Card title={null} action={null}>
      <div className="ch">
        <Segmented style={{ margin: 0 }} options={Object.keys(semesterResults).map((k) => ({ value: +k, label: `Sem ${k}` }))} value={sem} onChange={setSem} />
      </div>
      <div style={{ marginBottom: 12 }}><Badge tone="g">Published · SGPA {sgpa(rows).toFixed(2)}</Badge></div>
      <DataTable rows={rows} columns={[{ key: 'course', label: 'Course' }, { key: 'credits', label: 'Credits' }, { key: 'grade', label: 'Grade', render: (r) => <span className="gr">{r.grade}</span> }, { key: 'points', label: 'Points' }]} />
    </Card>
  );
}
