import { useApp } from '../../context/useApp';

export default function Toast() {
  const { toastMessage } = useApp();
  return <div className={`toast${toastMessage ? ' on' : ''}`} role="status">{toastMessage}</div>;
}
