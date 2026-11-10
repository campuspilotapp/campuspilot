import Card from '../common/Card';
import DataTable from '../common/DataTable';
import { internalMarks } from '../../data/resultsData';

export default function InternalMarks() {
  const rows = internalMarks.map((m) => ({ ...m, total: m.ia1 + m.ia2 + m.assignment }));
  return (
    <Card title="Internal marks">
      <DataTable rows={rows} columns={[{ key: 'course', label: 'Course' }, { key: 'ia1', label: 'IA 1 /20' }, { key: 'ia2', label: 'IA 2 /20' }, { key: 'assignment', label: 'Assignment /10' }, { key: 'total', label: 'Total /50', render: (r) => <span className="gr">{r.total}</span> }]} />
    </Card>
  );
}
