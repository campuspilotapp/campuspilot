import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Avatar from './Avatar';
import { student } from '../../data/studentData';
import { useApp } from '../../context/useApp';

export default function ProfileSummary() {
  const { state, patch, toast } = useApp();
  const [preview, setPreview] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const photo = state.profile.photo;
  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type) || f.size > 2e6) { toast('Choose an image under 2 MB'); return; }
    const r = new FileReader();
    r.onload = () => { patch((s) => { s.profile.photo = r.result; }); toast('Profile photo updated'); };
    r.readAsDataURL(f);
  };
  return (
    <>
      <Card>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar className="ph" onClick={() => photo && setPreview(true)} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ fontSize: 20 }}>{student.name}</h3>
            <div className="sm">{student.reg} · {student.programme} · {student.section}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <label className="btn s"><input type="file" accept="image/*" hidden onChange={onFile} />{photo ? 'Replace photo' : 'Upload photo'}</label>
              {photo && <Button small onClick={() => setPreview(true)}>Preview</Button>}
              {photo && <Button small icon="trash" onClick={() => setConfirm(true)}>Remove</Button>}
            </div>
          </div>
        </div>
      </Card>
      <Modal open={preview} onClose={() => setPreview(false)}>
        <img alt="Profile preview" src={photo} style={{ width: '100%', borderRadius: 16 }} />
        <div className="a"><Button variant="primary" onClick={() => setPreview(false)}>Close</Button></div>
      </Modal>
      <Modal open={confirm} onClose={() => setConfirm(false)}>
        <h3>Remove profile photo?</h3><div className="sm">Your default avatar will be restored.</div>
        <div className="a"><Button onClick={() => setConfirm(false)}>Keep</Button>
          <Button variant="primary" onClick={() => { patch((s) => { s.profile.photo = ''; }); setConfirm(false); toast('Photo removed'); }}>Remove</Button></div>
      </Modal>
    </>
  );
}
