// options: array of strings or { value, label }
export default function Segmented({ options, value, onChange, style }) {
  return (
    <div className="seg" style={style}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        return <button key={v} type="button" className={v === value ? 'on' : ''} onClick={() => onChange(v)}>{l}</button>;
      })}
    </div>
  );
}
