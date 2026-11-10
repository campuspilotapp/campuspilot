# CampusPilot

CampusPilot is a React and Spring Boot college ERP platform. The current milestone establishes tenant onboarding, local account authentication, permissions, and the initial college administrator workspace in one frontend and one modular Spring Boot backend.

## Requirements

- JDK 25, matching `backend/pom.xml`
- Node.js 20 or newer
- MySQL 8
- SMTP credentials for invitation and password-reset email

The backend reads environment variables supplied by the shell, IDE, or deployment platform. Spring Boot does not load `.env` files by default. Keep credential values out of source control.

## Backend configuration

Set these variables in the process environment before starting the API:

| Variable | Purpose |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` | MySQL connection |
| `DB_SSL_MODE` | MySQL SSL mode; defaults to `REQUIRED` |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated exact frontend origins; defaults to `http://localhost:5173` |
| `APP_PUBLIC_URL` | Frontend URL used in invitation links |
| `SESSION_COOKIE_SECURE` | Leave `true` in production; set `false` only for local HTTP development |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` | SMTP mail delivery |
| `MAIL_SMTP_AUTH`, `MAIL_STARTTLS` | SMTP authentication and STARTTLS settings |

Flyway applies versioned schema migrations at backend startup. Hibernate schema creation remains disabled.

## Authentication

The React app uses Spring Security sessions stored through Spring Session JDBC. Login, logout, and
authentication-status checks use `/api/v1/auth/login`, `/api/v1/auth/logout`, and `/api/v1/auth/me`.
The optional “Keep me signed in” choice extends session inactivity to 14 days; normal sessions
expire after 30 minutes. Password recovery uses `/api/v1/auth/forgot-password`,
`/api/v1/auth/verify-reset-otp`, and `/api/v1/auth/reset-password`. Recovery codes are hashed,
expire after five minutes, and are limited to five verification attempts.

## Local development

In PowerShell, set the database and mail environment variables for your local session, then run:

```powershell
.\backend\mvnw.cmd -f .\backend\pom.xml spring-boot:run
```

For local HTTP development only, set `SESSION_COOKIE_SECURE=false`. Keep the frontend origin in `APP_CORS_ALLOWED_ORIGINS`.
For a local MySQL instance without TLS, set `DB_SSL_MODE=DISABLED`; use an appropriate TLS mode in deployed environments.

Start the frontend in a second terminal:

```powershell
Set-Location frontend
npm run dev
```

Set `VITE_API_BASE_URL` only when the API is not at `http://localhost:8080/api/v1`.

## First platform administrator

There are no default users or passwords. Provision the first platform administrator through the operator-only bootstrap configuration:

1. Configure working SMTP delivery and set `BOOTSTRAP_SUPER_ADMIN_EMAIL`.
2. Set `BOOTSTRAP_SUPER_ADMIN_ENABLED=true` only for the controlled first startup.
3. Start the backend. It sends a single-use, expiring invitation to that address; the recipient sets their password through the invitation page.
4. Disable `BOOTSTRAP_SUPER_ADMIN_ENABLED` after the invitation is issued.

The bootstrap operation is not exposed as an HTTP endpoint. The application serializes bootstrap and invitation acceptance around the Super Admin role, preventing duplicate initial assignments.

## Verification

```powershell
.\backend\mvnw.cmd -f .\backend\pom.xml test
Set-Location frontend
npm run lint
npm run build
```

The backend test suite includes unit coverage for hashed tokens and tenant membership checks. Running the application and verifying the Flyway migration additionally requires a configured MySQL database.
