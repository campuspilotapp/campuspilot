import { useState } from 'react';
import Card from '../common/Card';
import Segmented from '../common/Segmented';
import Badge from '../common/Badge';
import DataTable from '../common/DataTable';
import { examSchedule } from '../../data/examinationData';

export default function ExamSchedule() {
  const [type, setType] = useState('Internal');
  const rows = examSchedule[type].map(([subject, date, time, venue]) => ({ subject, date, time, venue }));
  return (
    <Card title="Schedule" action={<Segmented options={Object.keys(examSchedule)} value={type} onChange={setType} />}>
      <DataTable rows={rows} columns={[{ key: 'subject', label: 'Subject' }, { key: 'date', label: 'Date' }, { key: 'time', label: 'Time' }, { key: 'venue', label: 'Venue & seat' },
        { key: 'type', label: 'Type', render: () => <Badge>{type === 'Practical' ? 'Practical' : 'Theory'}</Badge> }]} />
    </Card>
  );
}
