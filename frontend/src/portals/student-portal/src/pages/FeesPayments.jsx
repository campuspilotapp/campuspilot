import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import FeeSummary from '../components/fees/FeeSummary';
import InstallmentsTable from '../components/fees/InstallmentsTable';
import ScholarshipCard, { PaymentHistory } from '../components/fees/ScholarshipCard';
import PaymentModal from '../components/fees/PaymentModal';
import { useApp } from '../context/useApp';
import { student } from '../data/studentData';

export default function FeesPayments() {
  const { state } = useApp();
  const [paying, setPaying] = useState(null);
  return (
    <>
      <PageHeader title="Fees" subtitle={`Semester ${student.semester} · Academic year 2026–27`} />
      <FeeSummary fees={state.fees} />
      <InstallmentsTable fees={state.fees} onPay={setPaying} />
      <div className="g g2" style={{ marginTop: 20 }}><PaymentHistory fees={state.fees} /><ScholarshipCard /></div>
      <PaymentModal fee={paying} onClose={() => setPaying(null)} />
    </>
  );
}
