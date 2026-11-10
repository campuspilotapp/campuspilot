export const attendanceCourses = [
  { name: 'Machine Learning', attended: 31, total: 33 },
  { name: 'Cloud Computing', attended: 22, total: 25 },
  { name: 'Cyber Security', attended: 18, total: 25 },
  { name: 'Big Data Analytics', attended: 19, total: 21 },
  { name: 'Project Work', attended: 20, total: 21 },
  { name: 'ML Lab', attended: 12, total: 12 },
];
export const monthlyAttendance = [['Jul', 92], ['Aug', 88], ['Sep', 85], ['Oct', 90], ['Nov', 89]];
export const attendanceTrend = [84, 86, 85, 88, 87, 89];
export const attendanceHistory = [
  ['Machine Learning', '9 Nov', 'Present'], ['Cloud Computing', '8 Nov', 'Present'], ['Cyber Security', '7 Nov', 'Absent'],
  ['Big Data Analytics', '6 Nov', 'Present'], ['Project Work', '5 Nov', 'Present'], ['ML Lab', '4 Nov', 'Present'],
  ['Machine Learning', '3 Nov', 'Present'], ['Cloud Computing', '2 Nov', 'Absent'], ['Cyber Security', '1 Nov', 'Present'],
  ['Big Data Analytics', '31 Oct', 'Present'], ['Project Work', '30 Oct', 'Present'], ['ML Lab', '29 Oct', 'Absent'],
  ['Machine Learning', '28 Oct', 'Present'], ['Cloud Computing', '27 Oct', 'Present'],
].map(([course, date, status]) => ({ course, date, status }));
