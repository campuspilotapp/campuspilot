export default function LoadingState() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="skel" style={{ minHeight: 56, width: '40%' }} />
      <div className="skel" style={{ minHeight: 160 }} />
      <div className="skel" style={{ minHeight: 220 }} />
    </div>
  );
}
