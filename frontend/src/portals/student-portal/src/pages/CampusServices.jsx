import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Segmented from '../components/common/Segmented';
import LibraryTab from '../components/campus-services/LibraryTab';
import HostelTab from '../components/campus-services/HostelTab';
import TransportTab from '../components/campus-services/TransportTab';
import PlacementTab from '../components/campus-services/PlacementTab';
import ActivitiesTab from '../components/campus-services/ActivitiesTab';
import MoreTab from '../components/campus-services/MoreTab';

const TABS = { Library: LibraryTab, Hostel: HostelTab, Transport: TransportTab, Placement: PlacementTab, Activities: ActivitiesTab, More: MoreTab };

export default function CampusServices() {
  const [tab, setTab] = useState('Library');
  const Tab = TABS[tab];
  return (
    <>
      <PageHeader title="Campus services" subtitle="Library, hostel, transport, placements and activities" />
      <Segmented options={Object.keys(TABS)} value={tab} onChange={setTab} style={{ marginBottom: 24 }} />
      <Tab />
    </>
  );
}
