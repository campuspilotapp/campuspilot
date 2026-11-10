import Icon from '../common/Icon';
import { requestTypes } from '../../data/servicesData';

export default function RequestTypes({ onPick }) {
  return (
    <div className="rq">
      {requestTypes.map((t) => <button key={t.title} type="button" onClick={() => onPick(t.title)}><Icon name={t.icon} />{t.title}<span className="sm" style={{ fontWeight: 400 }}>Ready in 2–3 days</span></button>)}
    </div>
  );
}
