import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  Eye,
  EyeSlash,
  ShieldCheck,
  SpinnerGap,
  WarningCircle,
} from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import '@fontsource-variable/manrope'
import campusPilotLogo from '../../assets/campuspilot-logo.png'
import { useAuth } from '../../app/auth.js'
import { getErrorMessage, mutate } from '../../app/api.js'
import './login.css'

/* ------------------------------------------------------------------
   Tokens
   ink #14142B · muted #6A6D8A · line #E4E5F3
   indigo #5B5BF7 → violet #A855F7 · pink #F472B6 · mint #A7F3D0
   Font: Manrope (variable)
------------------------------------------------------------------- */
const font = { fontFamily: "'Manrope Variable', system-ui, sans-serif" }
const ease = [0.22, 1, 0.36, 1]

const aurora = {
  background: [
    'radial-gradient(60% 55% at 12% 8%, #C7D2FE 0, transparent 70%)',
    'radial-gradient(50% 50% at 95% 18%, #FBCFE8 0, transparent 70%)',
    'radial-gradient(60% 60% at 75% 100%, #FDE68A 0, transparent 68%)',
    'radial-gradient(50% 50% at 0 100%, #A7F3D0 0, transparent 70%)',
    '#F1EEFF',
  ].join(','),
}

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
})

/* ------------------------------ helpers ----------------------------- */

function CountUp({ to, delay = 0.7 }) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)

  useEffect(() => {
    if (reduce) return undefined
    const controls = animate(0, to, {
      delay,
      duration: 1.7,
      ease,
      onUpdate: (latest) => setValue(Math.round(latest)),
    })
    return () => controls.stop()
  }, [to, delay, reduce])

  return <>{value.toLocaleString('en-US')}</>
}

function Blob({ className, delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
      transition={{ duration: 20, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function Brand({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="CampusPilot home"
      className={`flex h-12 w-fit items-center rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-indigo-300/60 ${className}`}
    >
      <span className="block h-12 overflow-hidden">
        <img
          src={campusPilotLogo}
          alt="CampusPilot"
          className="-translate-y-4 h-20 w-auto sm:-translate-y-6 sm:h-24"
        />
      </span>
    </Link>
  )
}

/* ------------------------------ showcase ---------------------------- */

const trendLine = 'M0 96C38 92 58 66 100 72S170 100 210 76 290 36 332 48 416 22 466 16'

function OverviewCard({ rotateX, rotateY }) {
  const reduce = useReducedMotion()
  const metrics = [
    { label: 'Students', value: 12480, suffix: '' },
    { label: 'Faculty', value: 840, suffix: '' },
    { label: 'Courses', value: 326, suffix: '' },
  ]

  return (
    <motion.div
      {...rise(0.3)}
      className="rounded-[26px] border border-white/90 bg-white/60 p-6 shadow-[0_40px_80px_-30px_rgba(70,60,200,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl"
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-bold text-[#14142B]">Campus overview</p>
        <span className="rounded-full bg-[#5B5BF7]/10 px-3 py-1 text-xs font-bold text-[#4A4AE0]">Sample data</span>
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-[#E4E5F3]">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={index === 0 ? 'pr-5' : index === metrics.length - 1 ? 'pl-5' : 'px-5'}
          >
            <p className="text-[12.5px] font-semibold text-[#6A6D8A]">{metric.label}</p>
            <p className="mt-1 text-[26px] font-extrabold tracking-tight text-[#14142B]">
              <CountUp to={metric.value} delay={0.7 + index * 0.12} />
              {metric.suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="relative mt-5">
        <svg
          viewBox="0 0 480 130"
          preserveAspectRatio="none"
          className="h-[130px] w-full overflow-visible"
          role="img"
          aria-label="Illustrative campus activity trend, rising"
        >
          <defs>
            <linearGradient id="trend-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7C5CF8" stopOpacity="0.32" />
              <stop offset="1" stopColor="#7C5CF8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="trend-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5B5BF7" />
              <stop offset="0.6" stopColor="#A855F7" />
              <stop offset="1" stopColor="#F472B6" />
            </linearGradient>
          </defs>
          <g stroke="#E4E5F3" strokeWidth="1" strokeDasharray="3 5">
            <path d="M0 30H480M0 70H480M0 110H480" />
          </g>
          <motion.path
            d={`${trendLine}V130H0Z`}
            fill="url(#trend-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.4 }}
          />
          <motion.path
            d={trendLine}
            fill="none"
            stroke="url(#trend-stroke)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.6, ease: [0.65, 0, 0.35, 1] }}
          />
          {!reduce && (
            <motion.circle
              cx="466"
              cy="16"
              r="6"
              fill="#F472B6"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 3.2], opacity: [0.5, 0] }}
              transition={{ duration: 2.2, delay: 2.4, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <motion.circle
            cx="466"
            cy="16"
            r="6.5"
            fill="#fff"
            stroke="#F472B6"
            strokeWidth="3.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          />
        </svg>
        <motion.span
          className="absolute -top-2 right-5 rounded-lg bg-[#14142B] px-2.5 py-1 text-[11.5px] font-bold text-white shadow-lg"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          This week
        </motion.span>
      </div>
    </motion.div>
  )
}

function Showcase() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 18 })
  const sy = useSpring(my, { stiffness: 120, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5])
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5])

  function onMove(event) {
    if (reduce) return
    const rect = event.currentTarget.getBoundingClientRect()
    mx.set((event.clientX - rect.left) / rect.width - 0.5)
    my.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <aside
      aria-label="CampusPilot overview"
      className="login-showcase-panel relative hidden overflow-hidden rounded-[32px] lg:block"
      style={aurora}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Blob className="-left-24 top-1/3 size-96 bg-[#818CF8]/30" />
      <Blob className="-right-24 bottom-10 size-96 bg-[#F472B6]/25" delay={10} />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(91,91,247,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(91,91,247,0.07)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
      />

      <div className="relative z-10 flex h-full min-h-[min(680px,calc(100dvh-2rem))] flex-col justify-between px-8 py-8 xl:px-10">
        <Brand />

        <div>
          <motion.h1
            {...rise(0)}
            className="max-w-[13ch] text-[44px] font-extrabold leading-[1.04] tracking-[-0.045em] text-[#14142B] xl:text-[56px]"
          >
            One campus. Every role. One place.
          </motion.h1>
          <motion.p
            {...rise(0.1)}
            className="mt-5 max-w-[420px] text-base font-medium leading-relaxed text-[#4B4E70]"
          >
            Students, faculty and campus teams can all access the tools and information they need in one shared workspace.
          </motion.p>
        </div>

        <OverviewCard rotateX={rotateX} rotateY={rotateY} />

        <p className="mt-8 text-[12.5px] font-semibold text-[#6A6D8A]">© 2026 CampusPilot</p>
      </div>
    </aside>
  )
}

/* ------------------------------- form ------------------------------- */

const fieldClasses =
  'peer h-[60px] w-full rounded-[14px] border-[1.5px] border-[#E4E5F3] bg-white px-4 pt-[22px] text-[15px] font-medium text-[#14142B] outline-none transition-[border-color,box-shadow] duration-200 hover:border-[#CDCFEA] focus:border-[#5B5BF7] focus:shadow-[0_0_0_4px_rgba(91,91,247,0.14)]'

const labelClasses =
  'pointer-events-none absolute left-[17px] top-1/2 -translate-y-1/2 text-[15px] font-medium text-[#8E90AD] transition-all duration-200 peer-focus:top-[19px] peer-focus:text-[11.5px] peer-focus:font-bold peer-focus:text-[#5B5BF7] peer-[:not(:placeholder-shown)]:top-[19px] peer-[:not(:placeholder-shown)]:text-[11.5px] peer-[:not(:placeholder-shown)]:font-bold'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { setUser, connectionError } = useAuth()
  const navigate = useNavigate()
  const reduce = useReducedMotion()

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      if (import.meta.env.DEV) {
        const demoEmail = email.trim()
        if (!demoEmail || !password) {
          setError('Enter any username and password to continue in the local demo.')
          return
        }

        setUser({
          email: demoEmail,
          authorities: ['ROLE_STUDENT'],
          demo: true,
        })
        navigate('/', { replace: true })
        return
      }

      const { data } = await mutate('post', '/auth/login', {
        email: email.trim(),
        password,
        rememberMe,
      })
      setUser(data)
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to sign in. Check your details and try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const message = import.meta.env.DEV ? error : connectionError || error

  return (
    <main
      className="login-page relative min-h-dvh overflow-x-clip bg-[#F7F7FD] p-3 text-[#14142B] antialiased sm:p-4 lg:grid lg:grid-cols-[1.12fr_0.88fr] lg:gap-4"
      style={font}
    >
      <div className="lg:hidden" aria-hidden="true">
        <Blob className="-left-24 -top-24 size-80 bg-[#C7D2FE]/70" />
        <Blob className="-right-28 top-40 size-72 bg-[#FBCFE8]/60" delay={8} />
      </div>

      <Showcase />

      <section
        aria-labelledby="login-title"
        className="relative z-10 flex min-h-[calc(100dvh-1.5rem)] flex-col items-center justify-center px-3 py-10 sm:px-8 lg:min-h-0 lg:py-4"
      >
        <div className="w-full max-w-[420px]">
          <motion.div {...rise(0)} className="mb-10 lg:hidden">
            <Brand />
          </motion.div>

          <motion.div {...rise(0.1)}>
            <h1
              id="login-title"
              className="text-[34px] font-extrabold leading-tight tracking-[-0.04em] sm:text-[40px]"
            >
              Welcome back
            </h1>
            <p className="mt-2.5 text-base font-medium text-[#6A6D8A]">
              Sign in to continue to your student portal.
            </p>
            {import.meta.env.DEV && (
              <p className="mt-2 text-sm font-semibold text-[#4A4AE0]">
                Local demo: enter any username and password.
              </p>
            )}
          </motion.div>

          <form className="mt-9 space-y-4" onSubmit={submit}>
            <motion.div {...rise(0.18)} className="relative">
              <input
                autoComplete="username"
                className={fieldClasses}
                id="login-email"
                maxLength={254}
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder=" "
                required
                type={import.meta.env.DEV ? 'text' : 'email'}
                value={email}
              />
              <label className={labelClasses} htmlFor="login-email">
                {import.meta.env.DEV ? 'Email or username' : 'Work email'}
              </label>
            </motion.div>

            <motion.div {...rise(0.25)} className="relative">
              <input
                autoComplete="current-password"
                className={`${fieldClasses} pr-14`}
                id="login-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder=" "
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <label className={labelClasses} htmlFor="login-password">Password</label>
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-2.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl text-[#8E90AD] outline-none transition hover:bg-[#F1F1FD] hover:text-[#5B5BF7] focus-visible:ring-4 focus-visible:ring-indigo-200"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={showPassword ? 'hide' : 'show'}
                    className="grid place-items-center"
                    initial={{ opacity: 0, rotate: -20, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 20, scale: 0.7 }}
                    transition={{ duration: 0.16 }}
                  >
                    {showPassword
                      ? <EyeSlash size={20} weight="duotone" aria-hidden="true" />
                      : <Eye size={20} weight="duotone" aria-hidden="true" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </motion.div>

            <motion.div
              {...rise(0.32)}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-1"
            >
              <label className="group flex cursor-pointer select-none items-center gap-3 text-sm font-semibold text-[#4B4E70]">
                <input
                  checked={rememberMe}
                  className="peer sr-only"
                  onChange={(event) => setRememberMe(event.target.checked)}
                  type="checkbox"
                />
                <span className="grid size-[22px] place-items-center rounded-[7px] border-[1.5px] border-[#CDCFEA] bg-white text-transparent transition-all group-hover:border-[#5B5BF7] peer-checked:border-transparent peer-checked:bg-gradient-to-br peer-checked:from-[#5B5BF7] peer-checked:to-[#A855F7] peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-200">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Keep me signed in for 14 days
              </label>
              <Link
                to="/password-reset"
                className="rounded-md text-sm font-bold text-[#5B5BF7] outline-none transition hover:text-[#7C3AED] focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                Forgot password?
              </Link>
            </motion.div>

            <AnimatePresence initial={false}>
              {message && (
                <motion.div
                  key={message}
                  role="alert"
                  className="overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', x: reduce ? 0 : [0, -7, 7, -7, 7, 0] }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <p className="flex items-start gap-3 rounded-xl border border-[#FFC9D6] bg-[#FFF1F5] px-4 py-3 text-sm font-semibold text-[#B4234D]">
                    <WarningCircle size={20} weight="duotone" className="mt-px shrink-0" aria-hidden="true" />
                    <span>{message}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div {...rise(0.4)} className="pt-2">
              <button
                className="group relative flex h-[58px] w-full items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-r from-[#5B5BF7] via-[#7C5CF8] to-[#A855F7] text-base font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_18px_36px_-12px_rgba(91,91,247,0.65)] outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_24px_44px_-12px_rgba(124,92,248,0.75)] focus-visible:ring-4 focus-visible:ring-indigo-300 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-85 disabled:hover:translate-y-0"
                disabled={submitting}
                type="submit"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 blur-md transition-transform duration-[900ms] ease-out group-hover:translate-x-[420%]"
                />
                <AnimatePresence mode="wait" initial={false}>
                  {submitting ? (
                    <motion.span
                      key="busy"
                      className="relative flex items-center gap-2.5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <SpinnerGap size={20} weight="bold" className="animate-spin" aria-hidden="true" />
                      Signing in…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className="relative flex items-center gap-2.5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      Sign in
                      <ArrowRight
                        size={20}
                        weight="bold"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </form>

          <motion.p
            {...rise(0.48)}
            className="mt-8 flex items-center justify-center gap-2 text-[13.5px] font-semibold text-[#6A6D8A]"
          >
            <ShieldCheck size={18} weight="duotone" className="text-[#5B5BF7]" aria-hidden="true" />
            Your account is protected with secure access.
          </motion.p>

          <p className="mt-10 text-center text-[12.5px] font-semibold text-[#9B9DB8] lg:hidden">
            © 2026 CampusPilot
          </p>
        </div>
      </section>
    </main>
  )
}