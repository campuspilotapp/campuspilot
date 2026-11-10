export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="pgh">
      <div>
        <h2>{title}</h2>
        {subtitle && <div className="sm">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}
