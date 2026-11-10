import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useApp } from '../../context/useApp';

export default function ExamEligibility({ overall, lowCourse }) {
  const { toast } = useApp();
  return (
    <Card title="Exam eligibility">
      <div className="row"><div><b>Overall {overall.toFixed(1)}%</b><span className="sm">Minimum 75%</span></div><Badge tone="g">Eligible</Badge></div>
      <div className="row"><div><b>{lowCourse} is below 75%</b><span className="sm">Apply for condonation to sit the exam</span></div><Button small onClick={() => toast('Condonation request submitted (demo)')}>Apply for condonation</Button></div>
      <div style={{ marginTop: 12 }}><Badge tone="w">Action needed</Badge></div>
    </Card>
  );
}
