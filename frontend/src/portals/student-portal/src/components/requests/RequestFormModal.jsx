import { useState } from 'react';
import FormModal from '../common/FormModal';
import { minLength } from '../../utils/validators';

export default function RequestFormModal({ title, onClose, onSubmit }) {
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  return (
    <FormModal open={!!title} title={title} hint="Describe what you need. The office will respond within 2–3 days." submitLabel="Submit request" onClose={() => { onClose(); setDesc(''); }}
      onSubmit={() => { if (!minLength(desc, 10)) return 'Please describe your request in at least 10 characters.'; onSubmit(title, desc, file); setDesc(''); return ''; }}>
      <textarea className="fld" placeholder="Description (at least 10 characters)" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <label className="sm" style={{ display: 'block', marginTop: 12 }}>Supporting document (optional)</label>
      <input type="file" className="fld" style={{ paddingTop: 10 }} onChange={(e) => setFile(e.target.files[0] || null)} />
    </FormModal>
  );
}
