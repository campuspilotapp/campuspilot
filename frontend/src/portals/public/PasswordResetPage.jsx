import { useState } from 'react'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getErrorMessage, mutate } from '../../app/api.js'

export function PasswordResetPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [requested, setRequested] = useState(false)
  const [verified, setVerified] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function requestCode(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { data } = await mutate('post', '/auth/forgot-password', { email })
      setMessage(data.message)
      setRequested(true)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await mutate('post', '/auth/verify-reset-otp', { email, code })
      setVerified(true)
      setMessage('Code verified. Choose a new password.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function resetPassword(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await mutate('post', '/auth/reset-password', { email, code, newPassword })
      setMessage('Password updated. Your existing sessions have been signed out.')
      setRequested(false)
      setVerified(false)
      setCode('')
      setNewPassword('')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-icon"><KeyRound size={22} /></div>
        <div className="auth-heading">
          <span className="eyebrow">ACCOUNT RECOVERY</span>
          <h1>Reset password</h1>
          <p>We’ll send a one-time code to your registered email address.</p>
        </div>
        {!requested ? (
          <form className="form-stack" onSubmit={requestCode}>
            <label>
              Work email
              <input autoComplete="email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            {message && <p className="form-success" role="status">{message}</p>}
            <button className="primary-button full-width" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send reset code'}</button>
          </form>
        ) : !verified ? (
          <form className="form-stack" onSubmit={verifyCode}>
            {message && <p className="form-success" role="status">{message}</p>}
            <label>
              Six-digit code
              <input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(event) => setCode(event.target.value)} />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button full-width" type="submit" disabled={busy}>{busy ? 'Verifying…' : 'Verify code'}</button>
          </form>
        ) : (
          <form className="form-stack" onSubmit={resetPassword}>
            {message && <p className="form-success" role="status">{message}</p>}
            <label>
              New password
              <input autoComplete="new-password" type="password" minLength={12} maxLength={128} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
              <span className="field-hint">Use at least 12 characters.</span>
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button full-width" type="submit" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button>
          </form>
        )}
        <Link className="back-link" to="/login"><ArrowLeft size={16} /> Back to sign in</Link>
      </section>
    </main>
  )
}
