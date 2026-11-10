import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { ArrowRight, MailCheck } from 'lucide-react'
import { getErrorMessage, mutate } from '../../app/api.js'

export function InvitationAcceptancePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [token] = useState(() => searchParams.get('token') || '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (token) navigate('/invitation/accept', { replace: true })
  }, [navigate, token])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await mutate('post', '/auth/invitations/accept', { token, password })
      setMessage('Your invitation was accepted. Sign in to continue.')
      window.setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-icon"><MailCheck size={22} /></div>
        <div className="auth-heading">
          <span className="eyebrow">SECURE INVITATION</span>
          <h1>Set up your account</h1>
          <p>Choose a password to accept your CampusPilot invitation.</p>
        </div>
        {!token ? (
          <p className="form-error" role="alert">This invitation link is missing its token.</p>
        ) : (
          <form className="form-stack" onSubmit={submit}>
            <label>
              Password
              <input autoComplete="new-password" type="password" minLength={12} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} />
              <span className="field-hint">Use at least 12 characters.</span>
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            {message && <p className="form-success" role="status">{message}</p>}
            <button className="primary-button full-width" type="submit" disabled={busy}>{busy ? 'Accepting…' : 'Accept invitation'} <ArrowRight size={17} /></button>
          </form>
        )}
        <Link className="back-link" to="/login">Back to sign in</Link>
      </section>
    </main>
  )
}
