// tone: 'v' (violet) | 'o' (orange) | 'g' (green)
export default function ProgressBar({ value, tone = 'v', threshold = false, style }) {
  return (
    <div className={`pb${threshold ? ' th' : ''}`} style={style}>
      <i className={tone} style={{ width: `${value}%` }} />
    </div>
  );
}
