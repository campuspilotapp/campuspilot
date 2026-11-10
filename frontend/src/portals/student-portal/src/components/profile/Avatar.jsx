import Icon from '../common/Icon';
import { useApp } from '../../context/useApp';

export default function Avatar({ className = '', onClick }) {
  const { state } = useApp();
  const photo = state.profile.photo;
  return (
    <span className={`av ${className}`.trim()} onClick={onClick}>
      {photo ? <img alt="Profile" src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : <Icon name="profile" />}
    </span>
  );
}
