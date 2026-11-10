import Card from '../common/Card';
import CountUp from '../common/CountUp';
import { semesterResults } from '../../data/resultsData';
import { sgpa, cgpa } from '../../utils/formatters';

export default function GpaTrend() {
  const sems = Object.keys(semesterResults);
  const credits = Object.values(semesterResults).flat().reduce((a, r) => a + r.credits, 0);
  return (
    <Card title="Performance">
      <div style={{ font: '800 38px var(--sans)' }}><CountUp value={cgpa(semesterResults)} decimals={2} /></div>
      <div className="sm">CGPA · {credits} credits completed</div>
      <div className="bars" style={{ marginBottom: 30 }}>
        {sems.map((k, i) => { const v = sgpa(semesterResults[k]); return <div key={k} className={i === sems.length - 1 ? 'on' : ''} style={{ height: `${v * 10}%` }}><b>{v.toFixed(1)}</b><span>S{k}</span></div>; })}
      </div>
    </Card>
  );
}
