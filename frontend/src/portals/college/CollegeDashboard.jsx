import { useEffect, useState } from 'react'
import { Building2, CircleCheck, ShieldCheck, ArrowRight } from 'lucide-react'
import api, { getErrorMessage, mutate } from '../../app/api.js'
import { useAuth } from '../../app/auth.js'

export function CollegeDashboard() {
  const [setup, setSetup] = useState(null)
  const [error, setError] = useState('')
  const [needsSelection, setNeedsSelection] = useState(false)
  const [selecting, setSelecting] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    api.get('/college/setup-status')
      .then(({ data }) => setSetup(data))
      .catch((requestError) => {
        if (requestError.response?.data?.code === 'TENANT_SELECTION_REQUIRED') {
          setNeedsSelection(true)
        } else {
          setError(getErrorMessage(requestError))
        }
      })
  }, [])

  async function selectTenant(tenantId) {
    setSelecting(tenantId)
    setError('')
    try {
      await mutate('post', '/auth/tenant-selection', { tenantId })
      const { data } = await api.get('/college/setup-status')
      setSetup(data)
      setNeedsSelection(false)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSelecting('')
    }
  }

  if (error) return <p className="form-error page-message" role="alert">{error}</p>
  if (needsSelection) {
    const activeMemberships = user.memberships.filter(
      (membership) => membership.tenantStatus === 'ACTIVE' && membership.membershipStatus === 'ACTIVE',
    )
    return (
      <section>
        <div className="page-heading">
          <div>
            <span className="eyebrow">CHOOSE WORKSPACE</span>
            <h1>Select your institution</h1>
            <p>Your account has access to more than one college. Choose the tenant for this session.</p>
          </div>
        </div>
        <div className="tenant-list">
          {activeMemberships.map((membership) => (
            <article className="tenant-card tenant-selection" key={membership.tenantId}>
              <div className="tenant-card-top">
                <div className="tenant-avatar"><Building2 size={20} /></div>
                <div className="tenant-info"><h2>{membership.collegeName}</h2></div>
                <button className="primary-button" type="button" disabled={Boolean(selecting)} onClick={() => selectTenant(membership.tenantId)}>
                  {selecting === membership.tenantId ? 'Opening…' : 'Open workspace'} <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }
  if (!setup) return <div className="empty-panel">Loading institution workspace…</div>

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">INSTITUTION ADMIN</span>
          <h1>Welcome to {setup.collegeName}</h1>
          <p>Your institution workspace is active. Continue with the shared platform setup.</p>
        </div>
        <div className="dashboard-emblem"><Building2 size={25} /></div>
      </div>
      <div className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-icon"><CircleCheck size={20} /></div>
          <h2>Institution profile</h2>
          <p>Your college profile has been created and activated by the CampusPilot platform team.</p>
          <span className="status-pill status-active">Complete</span>
        </article>
        <article className="dashboard-card">
          <div className="card-icon"><ShieldCheck size={20} /></div>
          <h2>Tenant access</h2>
          <p>This workspace is scoped to your institution. Your permissions are managed by its administrators.</p>
          <span className="dashboard-tenant-id">Tenant ID · {setup.tenantId}</span>
        </article>
      </div>
    </section>
  )
}
