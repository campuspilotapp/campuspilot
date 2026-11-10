const r = (course, credits, grade, points) => ({ course, credits, grade, points });
export const semesterResults = {
  1: [r('Engineering Maths I', 4, 'A', 8), r('Physics', 3, 'B+', 7), r('Problem Solving', 4, 'A+', 9), r('Chemistry', 3, 'A', 8), r('Graphics', 2, 'A', 8)],
  2: [r('Engineering Maths II', 4, 'A', 8), r('Engineering Physics', 3, 'A+', 9), r('Programming in C', 4, 'A+', 9), r('Basic Electrical Engg', 3, 'B+', 7), r('C Programming Lab', 2, 'O', 10), r('Communication Skills', 2, 'A', 8)],
  3: [r('Data Structures', 3, 'A', 8), r('Discrete Maths', 3, 'A+', 9), r('OOP with Java', 3, 'A', 8), r('Digital Logic', 3, 'A', 8)],
  4: [r('Algorithms', 3, 'A', 8), r('Operating Systems', 3, 'A+', 9), r('Database Systems', 3, 'A', 8), r('Computer Networks', 3, 'A+', 9)],
  5: [r('Software Engineering', 3, 'A', 8), r('Compiler Design', 3, 'A', 8), r('Theory of Computation', 3, 'A+', 9), r('Web Technologies', 3, 'A', 8)],
  6: [r('Artificial Intelligence', 3, 'A+', 9), r('Data Mining', 3, 'A+', 9), r('Mobile Computing', 3, 'A', 8), r('Information Security', 3, 'A+', 9)],
};
export const internalMarks = [
  { course: 'Machine Learning', ia1: 18, ia2: 17, assignment: 9 }, { course: 'Cloud Computing', ia1: 16, ia2: 18, assignment: 8 },
  { course: 'Cyber Security', ia1: 14, ia2: 15, assignment: 7 }, { course: 'Big Data Analytics', ia1: 17, ia2: 16, assignment: 9 },
];
export const revaluationCourses = ['Cyber Security', 'Cloud Computing', 'Machine Learning', 'Big Data Analytics'];
