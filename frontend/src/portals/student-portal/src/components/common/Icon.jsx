import { ICONS } from '../../assets/icons/icons';

export default function Icon({ name }) {
  return (
    <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}
