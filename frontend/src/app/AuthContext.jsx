import { useEffect, useMemo, useState } from 'react'
import api, { getErrorMessage, mutate } from './api.js'
import { AuthContext } from './auth.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState('')

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch((error) => {
        setUser(null)
        if (error.response?.status !== 401) {
          setConnectionError(getErrorMessage(error, 'Could not connect to CampusPilot. Check the API service and try again.'))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    connectionError,
    setUser,
    async logout() {
      if (user?.demo) {
        setUser(null)
        return
      }
      await mutate('post', '/auth/logout')
      setUser(null)
    },
  }), [user, loading, connectionError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
