import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import HallTicketCard from '../components/examinations/HallTicketCard';
import ExamSchedule from '../components/examinations/ExamSchedule';
import PaymentModal from '../components/fees/PaymentModal';
import { examInstructions } from '../data/examinationData';

export default function Examinations() {
  const [paying, setPaying] = useState(null);
  return (
    <>
      <PageHeader title="Examinations" subtitle="Schedules, hall tickets and registration" />
      <div className="g g2">
        <HallTicketCard onPay={setPaying} />
        <Card title="Instructions">
          <div className="row"><div><b>Before the exam</b><span className="sm">{examInstructions.before}</span></div></div>
          <div className="row"><div><b>Not allowed</b><span className="sm">{examInstructions.notAllowed}</span></div></div>
        </Card>
      </div>
      <ExamSchedule />
      <PaymentModal fee={paying} onClose={() => setPaying(null)} />
    </>
  );
}
