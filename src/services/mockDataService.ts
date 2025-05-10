
import { Student, Grade, ReportCard } from '@/types';

// Mock student data
export const getStudent = (): Student => {
  return {
    id: '1',
    firstName: 'Jane',
    lastName: 'Smith',
    studentId: 'ST12345',
    year: '2',
    semester: 'Spring',
    program: 'Computer Science',
    imageUrl: 'https://i.pravatar.cc/150?img=1'
  };
};

// Mock grades data
export const getGrades = (): Grade[] => {
  return [
    { courseId: '101', courseName: 'Introduction to Programming', courseCode: 'CS101', creditHours: 3, grade: 'A', points: 4.0 },
    { courseId: '102', courseName: 'Data Structures', courseCode: 'CS102', creditHours: 4, grade: 'B+', points: 3.5 },
    { courseId: '103', courseName: 'Web Development', courseCode: 'CS103', creditHours: 3, grade: 'A-', points: 3.7 },
    { courseId: '104', courseName: 'Database Systems', courseCode: 'CS104', creditHours: 3, grade: 'B', points: 3.0 },
    { courseId: '105', courseName: 'Discrete Mathematics', courseCode: 'MATH201', creditHours: 3, grade: 'A', points: 4.0 },
  ];
};

// Calculate GPA and total credits
export const calculateGPA = (grades: Grade[]): { gpa: number, totalCredits: number } => {
  let totalPoints = 0;
  let totalCredits = 0;
  
  grades.forEach(grade => {
    totalPoints += grade.points * grade.creditHours;
    totalCredits += grade.creditHours;
  });
  
  const gpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
  return { gpa, totalCredits };
};

// Get full report card data
export const getReportCardData = (): ReportCard => {
  const student = getStudent();
  const grades = getGrades();
  const { gpa, totalCredits } = calculateGPA(grades);
  
  return {
    student,
    grades,
    issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    remarks: gpa >= 3.5 
      ? 'Excellent performance. Eligible for Dean\'s List.' 
      : gpa >= 3.0 
        ? 'Good academic standing. Keep up the good work.' 
        : 'Satisfactory performance. Consider additional academic support.',
    totalCredits,
    gpa,
    signature: 'Dr. Robert Johnson'
  };
};
