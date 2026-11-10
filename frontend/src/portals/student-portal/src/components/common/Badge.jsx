export default function Badge({ tone = '', children, style }) {
  return <span className={`tag ${tone}`.trim()} style={style}>{children}</span>;
}
