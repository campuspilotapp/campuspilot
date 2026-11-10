import Card from '../common/Card';
import { notificationPrefs } from '../../data/notificationsData';
import { useApp } from '../../context/useApp';

export default function NotificationPreferences() {
  const { state, patch, toast } = useApp();
  return (
    <Card title="Notification preferences">
      {notificationPrefs.map((label, i) => (
        <label className="tgl" key={label}>{label}
          <input type="checkbox" checked={!!state.prefs[i]} onChange={(e) => { patch((s) => { s.prefs[i] = e.target.checked; }); toast('Preference saved'); }} />
        </label>
      ))}
    </Card>
  );
}
