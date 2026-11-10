import { useState } from 'react'
import { Building2, GraduationCap, LogOut, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/auth.js'
import { getErrorMessage } from '../app/api.js'

export function PortalShell({ portal, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [logoutError, setLogoutError] = useState('')
  const isPlatformAdmin = portal === 'Super Admin'

  async function handleLogout() {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutError(getErrorMessage(error, 'Unable to sign out. Please try again.'))
    }
  }

  return (
    <div className="portal-frame">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark"><GraduationCap size={21} /></span>
          <span>CampusPilot</span>
        </Link>
        <div className="topbar-actions">
          <span className="portal-label">
            {isPlatformAdmin ? <ShieldCheck size={16} /> : <Building2 size={16} />}
            {portal}
          </span>
          <span className="user-email">{user?.email}</span>
          <button className="icon-button" type="button" onClick={handleLogout} aria-label="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      {logoutError && <p className="form-error page-message" role="alert">{logoutError}</p>}
      <main className="portal-content">{children}</main>
    </div>
  )
}
