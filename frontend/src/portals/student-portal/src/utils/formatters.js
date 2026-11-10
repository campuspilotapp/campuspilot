export const inr = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const pct = (a, b) => (b ? (a / b) * 100 : 0);

export const sgpa = (rows) => {
  const credits = rows.reduce((a, r) => a + r.credits, 0);
  return credits ? rows.reduce((a, r) => a + r.credits * r.points, 0) / credits : 0;
};

export const cgpa = (semesters) => sgpa(Object.values(semesters).flat());

export const greeting = (d = new Date()) => {
  const h = d.getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

// Timetable uses 2:00 / 3:00 for the afternoon, so anything before 8 is PM.
export const minutesFromTime = (s) => {
  const m = /(\d+):(\d+)/.exec(s);
  if (!m) return null;
  let h = +m[1];
  if (h < 8) h += 12;
  return h * 60 + +m[2];
};
