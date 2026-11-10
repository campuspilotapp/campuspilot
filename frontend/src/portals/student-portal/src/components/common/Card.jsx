export default function Card({ title, subtitle, action, className = '', children, ...rest }) {
  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {(title || action) && (
        <div className="ch">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <div className="sm">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
