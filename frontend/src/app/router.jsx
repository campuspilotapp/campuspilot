import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './auth.js'
import { PortalShell } from '../shared/PortalShell.jsx'

const InvitationAcceptancePage = lazy(() => import('../portals/public/InvitationAcceptancePage.jsx').then((module) => ({ default: module.InvitationAcceptancePage })))
const LoginPage = lazy(() => import('../portals/public/LoginPage.jsx').then((module) => ({ default: module.LoginPage })))
const PasswordResetPage = lazy(() => import('../portals/public/PasswordResetPage.jsx').then((module) => ({ default: module.PasswordResetPage })))
const CollegeDashboard = lazy(() => import('../portals/college/CollegeDashboard.jsx').then((module) => ({ default: module.CollegeDashboard })))
const TenantManagementPage = lazy(() => import('../portals/super-admin/TenantManagementPage.jsx').then((module) => ({ default: module.TenantManagementPage })))
const TenantCreatePage = lazy(() => import('../portals/super-admin/TenantManagementPage.jsx').then((module) => ({ default: module.TenantCreatePage })))
const StudentPortal = lazy(() => import('../portals/student-portal/StudentPortal.jsx').then((module) => ({ default: module.StudentPortal })))

function ProtectedRoute({ permission, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="page-loading" role="status">Loading CampusPilot…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (permission && !user.authorities.includes(permission)) return <Navigate to="/unauthorized" replace />
  return children
}

function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading" role="status">Loading CampusPilot…</div>
  if (!user) return <Navigate to="/login" replace />
  return <StudentPortal />
}

export function AppRouter() {
  return (
    <Suspense fallback={<div className="page-loading" role="status">Loading CampusPilot…</div>}>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/invitation/accept" element={<InvitationAcceptancePage />} />
        <Route
          path="/platform/tenants"
          element={(
            <ProtectedRoute permission="ROLE_SUPER_ADMIN">
              <PortalShell portal="Super Admin"><TenantManagementPage /></PortalShell>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/platform/tenants/new"
          element={(
            <ProtectedRoute permission="ROLE_SUPER_ADMIN">
              <PortalShell portal="Super Admin"><TenantCreatePage /></PortalShell>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/college"
          element={(
            <ProtectedRoute permission="college:setup:read">
              <PortalShell portal="Institution Admin"><CollegeDashboard /></PortalShell>
            </ProtectedRoute>
          )}
        />
        <Route path="/unauthorized" element={<main className="public-page"><h1>Access denied</h1><p>Your account does not have permission to view this page.</p></main>} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </Suspense>
  )
}
