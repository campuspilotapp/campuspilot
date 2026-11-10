import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Segmented from '../components/common/Segmented';
import CourseCard from '../components/courses/CourseCard';
import AssignmentList from '../components/courses/AssignmentList';
import AcademicInfo from '../components/courses/AcademicInfo';
import { courses } from '../data/coursesData';
import { student } from '../data/studentData';

export default function Courses() {
  const [tab, setTab] = useState('Subjects');
  const credits = courses.reduce((a, c) => a + c.credits, 0);
  return (
    <>
      <PageHeader title="Courses & academics" subtitle={`Semester ${student.semester} · ${credits} credits · Batch ${student.batch}`} />
      <Segmented options={['Subjects', 'Assignments', 'Academic info']} value={tab} onChange={setTab} style={{ marginBottom: 24 }} />
      {tab === 'Subjects' && <div className="g g3">{courses.map((c) => <CourseCard key={c.code} course={c} />)}</div>}
      {tab === 'Assignments' && <AssignmentList />}
      {tab === 'Academic info' && <AcademicInfo />}
    </>
  );
}
