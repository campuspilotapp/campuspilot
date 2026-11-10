import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Timetable = lazy(() => import('../pages/Timetable'));
const Attendance = lazy(() => import('../pages/Attendance'));
const Courses = lazy(() => import('../pages/Courses'));
const Examinations = lazy(() => import('../pages/Examinations'));
const Results = lazy(() => import('../pages/Results'));
const FeesPayments = lazy(() => import('../pages/FeesPayments'));
const StudentRequests = lazy(() => import('../pages/StudentRequests'));
const CampusServices = lazy(() => import('../pages/CampusServices'));
const Notifications = lazy(() => import('../pages/Notifications'));
const MyProfile = lazy(() => import('../pages/MyProfile'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="courses" element={<Courses />} />
        <Route path="examinations" element={<Examinations />} />
        <Route path="results" element={<Results />} />
        <Route path="fees" element={<FeesPayments />} />
        <Route path="requests" element={<StudentRequests />} />
        <Route path="campus-services" element={<CampusServices />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
