import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Icon from '../common/Icon';
import { useApp } from '../../context/useApp';
import { paymentMethods } from '../../data/feesData';
import { inr } from '../../utils/formatters';

export default function PaymentModal({ fee, onClose }) {
  return (
    <Modal open={!!fee} onClose={onClose}>
      {fee && <PaymentDetails key={fee.id} fee={fee} onClose={onClose} />}
    </Modal>
  );
}

function PaymentDetails({ fee, onClose }) {
  const { patch, toast } = useApp();
  const [method, setMethod] = useState('UPI');
  const [done, setDone] = useState(null);
  const pay = () => {
    const receipt = `R-2026-${1200 + Math.floor(Math.random() * 90)}`;
    patch((s) => {
      const f = s.fees.find((x) => x.id === fee.id);
      f.status = 'Paid'; f.receipt = receipt;
      s.requests.unshift({ id: `r${Date.now()}`, title: `Fee receipt ${receipt}`, applied: 'Today', note: 'Receipt issued.', status: 'Completed' });
    });
    setDone(receipt);
  };
  return (
    <>
      {!done && (
        <>
          <h3>Pay {fee.title}</h3>
          <div className="sm">Amount {inr(fee.amount)} · due {fee.due}</div>
          <div className="pm">
            {paymentMethods.map((m) => <button key={m} type="button" className={m === method ? 'on' : ''} onClick={() => setMethod(m)}>{m}<span>{m === method ? 'Selected' : ''}</span></button>)}
          </div>
          <div className="a"><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={pay}>Pay {inr(fee.amount)}</Button></div>
        </>
      )}
      {done && (
        <>
          <div className="ok"><div className="tick"><Icon name="check" /></div><h3>Payment successful</h3>
            <div className="sm" style={{ marginTop: 4 }}>{inr(fee.amount)} paid via {method}<br />Receipt {done}</div></div>
          <div className="a"><Button icon="dl" onClick={() => { toast('Receipt downloaded'); onClose(); }}>Receipt</Button><Button variant="primary" onClick={onClose}>Done</Button></div>
        </>
      )}
    </>
  );
}
