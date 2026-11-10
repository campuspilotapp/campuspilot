import { useEffect } from 'react';

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <div className={`mo${open ? ' on' : ''}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      {open && <div className="md" role="dialog" aria-modal="true">{children}</div>}
    </div>
  );
}
