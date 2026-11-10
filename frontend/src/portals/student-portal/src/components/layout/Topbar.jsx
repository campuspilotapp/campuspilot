import { useNavigate } from 'react-router-dom';
import Avatar from '../profile/Avatar';
import NotificationPopover from '../notifications/NotificationPopover';
import college from '../../assets/logos/college.png';
import { student } from '../../data/studentData';

export default function Topbar() {
  const navigate = useNavigate();
  return (
    <header className="top">
      <div className="col">
        <img src={college} alt="" />
        <div><b>{student.university}</b><span>Student portal</span></div>
      </div>
      <div className="sp">
        <NotificationPopover />
        {/* Clicking the profile chip opens the My Profile page */}
        <button type="button" className="me" aria-label="Open my profile" onClick={() => navigate('/profile')}>
          <Avatar />
          <span>{student.name}</span>
        </button>
      </div>
    </header>
  );
}
