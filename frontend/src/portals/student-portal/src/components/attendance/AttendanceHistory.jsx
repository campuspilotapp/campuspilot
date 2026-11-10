import { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { statusTone } from '../../utils/statusTone';
import Dropdown from '../common/Dropdown';
import DataTable from '../common/DataTable';
import { attendanceHistory, attendanceCourses } from '../../data/attendanceData';

export default function AttendanceHistory() {
  const [course, setCourse] = useState('All');
  const rows = attendanceHistory.filter((h) => course === 'All' || h.course === course);
  return (
    <Card title="Attendance history" action={<div style={{ minWidth: 180 }}><Dropdown label="Filter by course" value={course} onChange={setCourse} options={['All', ...attendanceCourses.map((c) => c.name)]} /></div>}>
      <DataTable columns={[{ key: 'course', label: 'Course' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> }]} rows={rows} />
    </Card>
  );
}
