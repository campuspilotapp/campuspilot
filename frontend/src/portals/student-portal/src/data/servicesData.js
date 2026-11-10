export const requestTypes = [
  { title: 'Bonafide certificate', icon: 'shield' }, { title: 'Course request', icon: 'courses' }, { title: 'Academic correction', icon: 'results' },
  { title: 'Leave application', icon: 'timetable' }, { title: 'Document request', icon: 'requests' }, { title: 'General request', icon: 'notices' },
];
export const requests = [
  { id: 'r1', title: 'Bonafide certificate', applied: '12 Oct', note: 'Certificate issued. Download it from the vault.', status: 'Completed' },
  { id: 'r2', title: 'Transcript (Sem 1–6)', applied: '28 Oct', note: 'Awaiting registrar approval.', status: 'Under Review' },
  { id: 'r3', title: 'Leave application', applied: '3 Nov', note: 'Approved for 5–6 Nov.', status: 'Approved' },
  { id: 'r4', title: 'Academic correction', applied: '20 Oct', note: 'Marks card is correct. See remark from the Exam Cell.', status: 'Rejected' },
];
export const vault = ['Offer letter', 'Marksheet · Sem 6', 'Fee receipt R-2026-1182', 'Student ID card'];
export const catalogue = [
  { title: 'Introduction to Algorithms', author: 'Cormen', shelf: 'CS-12', available: 3 }, { title: 'Deep Learning', author: 'Goodfellow', shelf: 'AI-04', available: 2 },
  { title: 'Computer Networks', author: 'Tanenbaum', shelf: 'CN-07', available: 0 }, { title: 'Operating System Concepts', author: 'Silberschatz', shelf: 'OS-02', available: 5 },
  { title: 'Pattern Recognition', author: 'Bishop', shelf: 'AI-11', available: 0 },
];
export const issuedBooks = [{ id: 'b1', title: 'Introduction to Algorithms', due: '18 Nov', renewed: false }, { id: 'b2', title: 'Let Us C', due: '14 Nov', renewed: false }];
export const hostel = { allocation: 'Kaveri Block · Room 214', sharing: 'Double sharing', fee: '₹60,000 · ₹30,000 paid', notice: 'Water supply maintenance on 12 Nov' };
export const transport = { route: 'Route 12 · Tambaram', bus: 'Bus TN-22-AB-4521 · Stop: Lake View · 7:40 AM', fee: '₹18,000 per year', others: [['Route 5 · Velachery', '8 stops'], ['Route 8 · Adyar', '6 stops']] };
export const drives = [
  { id: 'd1', company: 'Zoho', pay: '₹7 LPA', role: 'Software developer', branches: 'CSE, ECE', eligible: true, applied: false },
  { id: 'd2', company: 'TCS', pay: '₹3.6 LPA', role: 'Ninja developer', branches: 'All B.Tech branches', eligible: true, applied: false },
  { id: 'd3', company: 'Bosch', pay: '₹6.2 LPA', role: 'Graduate engineer trainee', branches: 'Mechanical, ECE', eligible: false, applied: false },
];
export const clubs = ['Coding Club', 'Robotics Club', 'NSS', 'Photography Club'];
export const events = [['Tech fest', '24 Nov'], ['Hackathon', '2 Dec'], ['Sports meet', '10 Dec']];
export const moreServices = ['Health & counselling', 'Sports', 'Student welfare', 'Gate pass', 'Grievance', 'IT helpdesk', 'Facilities'];
export const tickets = [{ id: 't1', title: 'HD-2052 Library card reissue', sub: 'Library', status: 'Resolved' }];
