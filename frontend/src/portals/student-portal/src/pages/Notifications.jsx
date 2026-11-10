import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import NoticeList from '../components/notifications/NoticeList';
import NotificationPreferences from '../components/notifications/NotificationPreferences';
import useNotifications from '../hooks/useNotifications';
import { useApp } from '../context/useApp';

export default function Notifications() {
  const { unread, markAllRead } = useNotifications();
  const { toast } = useApp();
  return (
    <>
      <PageHeader title="Notices & announcements" subtitle={`${unread} unread`}>
        <Button small onClick={() => { markAllRead(); toast('All notices marked as read'); }}>Mark all as read</Button>
      </PageHeader>
      <NoticeList />
      <div style={{ height: 20 }} />
      <NotificationPreferences />
    </>
  );
}
