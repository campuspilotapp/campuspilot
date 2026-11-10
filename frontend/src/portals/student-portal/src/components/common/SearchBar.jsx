// In-page filter input (used on the Notices page). There is no global search.
export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <div className="fl" style={{ marginBottom: 12 }}>
      <input className="fld" type="search" placeholder={placeholder} aria-label={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
