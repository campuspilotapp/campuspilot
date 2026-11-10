import { useState } from 'react';
import FormModal from '../common/FormModal';
import { useApp } from '../../context/useApp';
import { isPhone, isEmail } from '../../utils/validators';

export default function EditContactModal({ open, onClose }) {
  const { state, patch, toast } = useApp();
  if (!open) return null;
  return <EditContactForm profile={state.profile} patch={patch} toast={toast} onClose={onClose} />;
}

function EditContactForm({ profile, patch, toast, onClose }) {
  const [f, setF] = useState(profile);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = () => {
    if (!isPhone(f.phone)) return 'Enter a valid phone number.';
    if (!isEmail(f.email)) return 'Enter a valid email address.';
    patch((s) => { Object.assign(s.profile, { phone: f.phone.trim(), email: f.email.trim(), addr: f.addr.trim() }); });
    toast('Profile updated');
    return '';
  };
  return (
    <FormModal open title="Edit contact details" submitLabel="Save changes" onClose={onClose} onSubmit={submit}>
      <input className="fld" aria-label="Phone" value={f.phone} onChange={set('phone')} />
      <input className="fld" aria-label="Email" value={f.email} onChange={set('email')} />
      <input className="fld" aria-label="Address" value={f.addr} onChange={set('addr')} />
    </FormModal>
  );
}
