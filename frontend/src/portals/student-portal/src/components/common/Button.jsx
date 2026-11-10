import Icon from './Icon';

export default function Button({ variant = '', small = false, icon, children, className = '', ...rest }) {
  const cls = ['btn', variant === 'primary' ? 'p' : '', small ? 's' : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}
