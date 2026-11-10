import { useMemo } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Avatar from './Avatar';
import campusLogo from '../../assets/logos/campus-pilot.png';
import collegeLogo from '../../assets/logos/college.png';
import { student } from '../../data/studentData';
import { useApp } from '../../context/useApp';

// Deterministic demo QR-style pattern seeded by the register number (not a real credential).
function QrPattern({ seed }) {
  const cells = useMemo(() => {
    let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const out = [];
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      h = (h * 1664525 + 1013904223) >>> 0;
      const ring = (a, b) => { const m = Math.max(Math.abs(a - 3), Math.abs(b - 3)); return m === 3 || m <= 1; };
      const on = finder ? ring(x % 14 % 7 === x % 7 ? x % 7 : x - 14, y > 13 ? y - 14 : y) : (h >>> 16) % 2 === 0;
      if (on) out.push([x, y]);
    }
    return out;
  }, [seed]);
  return <svg viewBox="0 0 21 21" width="64" height="64" aria-label="Demo QR code">{cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#14122B" />)}</svg>;
}

export default function DigitalIdCard() {
  const { toast } = useApp();
  const print = () => { document.body.classList.add('pid'); try { window.print(); } catch { toast('Printing is not available here'); } setTimeout(() => document.body.classList.remove('pid'), 500); };
  return (
    <Card title="Digital student ID">
      <div className="idc" id="idc">
        <div className="ih"><img src={campusLogo} alt="Campus Pilot" /><img src={collegeLogo} alt="College" /></div>
        <div className="ib2">
          <Avatar />
          <dl><dt>Name</dt><dd>{student.name}</dd><dt>Register no.</dt><dd>{student.reg}</dd><dt>Programme</dt><dd>B.Tech · CSE · {student.batch}</dd></dl>
        </div>
        <div className="qr"><QrPattern seed={student.reg} /><span className="sm">Demo QR only. Not a verified credential.</span></div>
      </div>
      <Button variant="primary" icon="print" onClick={print}>Print / save ID</Button>
    </Card>
  );
}
