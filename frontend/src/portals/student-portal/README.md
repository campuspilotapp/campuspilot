# Campus Pilot – Student Portal (React)

Vite + React 18 + React Router 6 + Tailwind CSS 3.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

- Design tokens, layout and animations live in `src/index.css` (Tailwind preflight is off so the original look is preserved).
- State persists in `localStorage` via `src/context/AppContext.jsx`.
- Page transitions: `AppLayout` re-keys `<main>` on each route so the CSS enter animation replays.
- Clicking the profile chip in the top bar opens `/profile`. There is no global search.
