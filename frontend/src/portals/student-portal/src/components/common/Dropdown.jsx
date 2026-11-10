export default function Dropdown({ label, options, value, onChange }) {
  return (
    <select className="fld" aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}
