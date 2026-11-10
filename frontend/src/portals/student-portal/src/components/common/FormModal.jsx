import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

// Generic form dialog. children = fields; onSubmit() returns an error string or nothing.
export default function FormModal({ open, title, hint, submitLabel = 'Submit', onClose, onSubmit, children }) {
  const [formState, setFormState] = useState({ open, error: '' });
  if (formState.open !== open) setFormState({ open, error: '' });
  const submit = () => {
    const error = onSubmit();
    if (error) setFormState({ open: true, error });
    else onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <h3>{title}</h3>
      {hint && <div className="sm">{hint}</div>}
      {children}
      {formState.open && formState.error && <div className="sm" role="alert" style={{ color: 'var(--err)', marginTop: 10 }}>{formState.error}</div>}
      <div className="a">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={submit}>{submitLabel}</Button>
      </div>
    </Modal>
  );
}
