import { useApp } from '../context/useApp';

export default function useNotifications() {
  const { state, patch } = useApp();
  const notices = state.notices;
  const unread = notices.filter((n) => !n.read).length;
  const markRead = (id) => patch((s) => { const n = s.notices.find((x) => x.id === id); if (n) n.read = true; });
  const markAllRead = () => patch((s) => s.notices.forEach((n) => { n.read = true; }));
  return { notices, unread, markRead, markAllRead };
}
