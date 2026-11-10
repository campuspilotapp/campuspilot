import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Building2, CircleCheck, Plus, Send, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import api, { getErrorMessage, mutate } from '../../app/api.js'

const collegeTypes = [
  ['ENGINEERING', 'Engineering'],
  ['ARTS_SCIENCE', 'Arts & Science'],
  ['BED_MED', 'B.Ed / M.Ed'],
  ['MANAGEMENT_STUDIES', 'Management Studies'],
]

export function TenantManagementPage() {
  const [tenants, setTenants] = useState([])
  const [emails, setEmails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadTenants() {
    try {
      const { data } = await api.get('/platform/tenants')
      setTenants(data)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    api.get('/platform/tenants')
      .then(({ data }) => { if (active) setTenants(data) })
      .catch((requestError) => { if (active) setError(getErrorMessage(requestError)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function inviteAdmin(tenantId) {
    setError('')
    setNotice('')
    try {
      await mutate('post', `/platform/tenants/${tenantId}/admin-invitations`, { email: emails[tenantId] })
      setNotice('Invitation email sent.')
      setEmails((current) => ({ ...current, [tenantId]: '' }))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  async function activateTenant(tenantId) {
    setError('')
    setNotice('')
    try {
      await mutate('post', `/platform/tenants/${tenantId}/activate`)
      setNotice('College activated.')
      await loadTenants()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">PLATFORM MANAGEMENT</span>
          <h1>College tenants</h1>
          <p>Onboard institutions and grant their first administrator access.</p>
        </div>
        <Link className="primary-button" to="/platform/tenants/new"><Plus size={18} /> Add college</Link>
      </div>
      {error && <p className="form-error page-message" role="alert">{error}</p>}
      {notice && <p className="form-success page-message" role="status">{notice}</p>}
      {loading ? <div className="empty-panel">Loading colleges…</div> : tenants.length === 0 ? (
        <div className="empty-panel">
          <Building2 size={26} />
          <h2>No colleges onboarded yet</h2>
          <p>Create a tenant, invite its first administrator, then activate access.</p>
          <Link className="secondary-button" to="/platform/tenants/new">Create first college</Link>
        </div>
      ) : (
        <div className="tenant-list">
          {tenants.map((tenant) => (
            <article className="tenant-card" key={tenant.id}>
              <div className="tenant-card-top">
                <div className="tenant-avatar"><Building2 size={20} /></div>
                <div className="tenant-info">
                  <h2>{tenant.name}</h2>
                  <p>{tenant.slug} <span>·</span> {collegeTypes.find(([value]) => value === tenant.collegeType)?.[1] || tenant.collegeType}</p>
                </div>
                <span className={`status-pill status-${tenant.status.toLowerCase()}`}>{tenant.status}</span>
              </div>
              <div className="tenant-meta">
                <span>{tenant.contactEmail}</span>
                {tenant.registrationNumber && <span>Registration: {tenant.registrationNumber}</span>}
              </div>
              <div className="tenant-actions">
                <label className="invite-field">
                  <span className="sr-only">Administrator email for {tenant.name}</span>
                  <input
                    type="email"
                    placeholder="College admin email"
                    maxLength={254}
                    value={emails[tenant.id] || ''}
                    onChange={(event) => setEmails((current) => ({ ...current, [tenant.id]: event.target.value }))}
                  />
                </label>
                <button className="secondary-button" type="button" disabled={!emails[tenant.id]} onClick={() => inviteAdmin(tenant.id)}>
                  <Send size={15} /> Invite admin
                </button>
                {tenant.status === 'PENDING' && (
                  <button className="primary-button" type="button" onClick={() => activateTenant(tenant.id)}>
                    <CircleCheck size={16} /> Activate
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export function TenantCreatePage() {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    collegeType: 'ENGINEERING',
    registrationNumber: '',
    contactEmail: '',
    phone: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await mutate('post', '/platform/tenants', form)
      setNotice('College created. Continue to the tenant list to invite its first administrator and activate it.')
      setForm((current) => ({ ...current, name: '', slug: '', registrationNumber: '', contactEmail: '', phone: '', address: '' }))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="form-page">
      <Link className="back-link" to="/platform/tenants"><ArrowLeft size={16} /> All colleges</Link>
      <div className="page-heading compact">
        <div>
          <span className="eyebrow">NEW TENANT</span>
          <h1>College details</h1>
          <p>Set up the institution profile before inviting its administrator.</p>
        </div>
      </div>
      {error && <p className="form-error page-message" role="alert">{error}</p>}
      {notice && (
        <p className="form-success page-message" role="status">
          {notice} <Link to="/platform/tenants">Go to college tenants</Link>
        </p>
      )}
      <form className="panel form-stack" onSubmit={submit}>
        <div className="form-grid">
          <label>
            College name
            <input required maxLength={160} value={form.name} onChange={(event) => update('name', event.target.value)} />
          </label>
          <label>
            URL slug
            <input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={80} placeholder="north-campus-college" value={form.slug} onChange={(event) => update('slug', event.target.value)} />
            <span className="field-hint">Lowercase letters, numbers, and hyphens.</span>
          </label>
          <label>
            College type
            <select value={form.collegeType} onChange={(event) => update('collegeType', event.target.value)}>
              {collegeTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
          <label>
            Registration number <span className="optional">(optional)</span>
            <input maxLength={100} value={form.registrationNumber} onChange={(event) => update('registrationNumber', event.target.value)} />
          </label>
          <label>
            Institution contact email
            <input type="email" required maxLength={254} value={form.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} />
          </label>
          <label>
            Phone <span className="optional">(optional)</span>
            <input type="tel" maxLength={40} value={form.phone} onChange={(event) => update('phone', event.target.value)} />
          </label>
        </div>
        <label>
          Address <span className="optional">(optional)</span>
          <textarea rows="3" maxLength={500} value={form.address} onChange={(event) => update('address', event.target.value)} />
        </label>
        <div className="form-footer">
          <span className="field-hint"><ShieldCheck size={14} /> Tenant starts pending until activated.</span>
          <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create tenant'} <ArrowUpRight size={17} /></button>
        </div>
      </form>
    </section>
  )
}
