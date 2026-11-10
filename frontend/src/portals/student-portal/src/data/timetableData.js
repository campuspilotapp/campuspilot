export const TIMES = ['9:00', '10:00', '11:15', '12:15', '2:00', '3:00'];
export const SUBJECTS = {
  ML: { name: 'Machine Learning', type: 1, teacher: 'Dr. Ritish', room: 202 },
  CC: { name: 'Cloud Computing', type: 1, teacher: 'Prof. Rohit', room: 205 },
  CS: { name: 'Cyber Security', type: 1, teacher: 'Dr. Praveen', room: 201 },
  BDA: { name: 'Big Data Analytics', type: 1, teacher: 'Prof. Shefaoudeen', room: 204 },
  PW: { name: 'Project Work', type: 1, teacher: 'Dr. Shashwin', room: 203 },
  LAB: { name: 'ML Lab', type: 2, teacher: 'Lab 3', room: null },
  X: { name: 'Free period', type: 0, teacher: '', room: null },
};
export const WEEK = [
  { day: 'Mon', slots: ['ML', 'CC', 'CS', 'BDA', 'LAB', 'LAB'] },
  { day: 'Tue', slots: ['CS', 'ML', 'PW', 'BDA', 'X', 'X'] },
  { day: 'Wed', slots: ['CC', 'PW', 'ML', 'CS', 'LAB', 'LAB'] },
  { day: 'Thu', slots: ['BDA', 'ML', 'CC', 'PW', 'X', 'X'] },
  { day: 'Fri', slots: ['PW', 'CS', 'BDA', 'CC', 'ML', 'X'] },
];
