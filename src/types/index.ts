
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  year: string;
  semester: string;
  program: string;
  imageUrl?: string;
}

export interface Grade {
  courseId: string;
  courseName: string;
  courseCode: string;
  creditHours: number;
  grade: string;
  points: number;
}

export interface ReportCard {
  student: Student;
  grades: Grade[];
  issueDate: string;
  remarks: string;
  totalCredits: number;
  gpa: number;
  signature: string;
}
