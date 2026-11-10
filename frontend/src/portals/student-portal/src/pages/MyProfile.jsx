import PageHeader from '../components/common/PageHeader';
import ProfileSummary from '../components/profile/ProfileSummary';
import { Completeness, Details, Documents } from '../components/profile/ProfileDetails';
import DigitalIdCard from '../components/profile/DigitalIdCard';

export default function MyProfile() {
  return (
    <>
      <PageHeader title="My profile" subtitle="Your details and digital student ID" />
      <div className="g g2">
        <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
          <ProfileSummary /><Completeness /><Details /><Documents />
        </div>
        <DigitalIdCard />
      </div>
    </>
  );
}
