import Icon from './Icon';

export default function EmptyState({ title = 'Nothing here yet', hint, icon = 'search' }) {
  return (
    <div className="sm empty">
      <Icon name={icon} />
      <b style={{ color: 'var(--ink)' }}>{title}</b>
      {hint && <span>{hint}</span>}
    </div>
  );
}
