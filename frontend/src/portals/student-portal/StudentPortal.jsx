import { useEffect, useState } from 'react'
import { AppProvider } from './src/context/AppContext.jsx'
import AppRoutes from './src/routes/AppRoutes.jsx'
import stylesUrl from './src/index.css?url'

export function StudentPortal() {
  const [stylesReady, setStylesReady] = useState(false)
  const [stylesFailed, setStylesFailed] = useState(false)

  useEffect(() => {
    let mounted = true
    const stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.href = stylesUrl
    stylesheet.onload = () => {
      if (mounted) setStylesReady(true)
    }
    stylesheet.onerror = () => {
      if (mounted) setStylesFailed(true)
    }
    document.head.append(stylesheet)

    return () => {
      mounted = false
      stylesheet.remove()
    }
  }, [])

  if (stylesFailed) {
    return <main role="alert">Could not load the student portal. Refresh the page and try again.</main>
  }
  if (!stylesReady) return <div className="page-loading" role="status">Loading student portal…</div>

  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
