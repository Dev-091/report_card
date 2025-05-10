
import { supabase } from "@/integrations/supabase/client";
import { Student, Grade, ReportCard } from "@/types";
import { toast } from "sonner";

export interface StudentFormData {
  firstName: string;
  lastName: string;
  studentId: string;
  year: string;
  semester: string;
  program: string;
  email: string;
}

export interface GradeFormData {
  courseCode: string;
  courseName: string;
  creditHours: number;
  grade: string;
}

export const saveStudent = async (studentData: StudentFormData): Promise<string | null> => {
  try {
    // Insert student record into the 'students' table
    const { data, error } = await supabase
      .from('students')
      .insert([
        { 
          first_name: studentData.firstName,
          last_name: studentData.lastName,
          student_id: studentData.studentId,
          program: studentData.program,
          email: studentData.email,
          enrollment_date: new Date().toISOString().split('T')[0],
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving student:', error);
      toast.error('Failed to save student data');
      return null;
    }

    // Find or create term
    const termName = studentData.semester === 'Fall' || studentData.semester === 'Spring' || 
                     studentData.semester === 'Summer' || studentData.semester === 'Winter' 
                     ? studentData.semester 
                     : 'Fall';
                     
    const academicYear = new Date().getFullYear().toString();
    const semesterNumber = parseInt(studentData.semester);
    
    const { data: termData, error: termError } = await supabase
      .from('terms')
      .select('*')
      .eq('term_name', termName)
      .eq('academic_year', academicYear)
      .maybeSingle();
      
    let termId;
      
    if (termError || !termData) {
      // Create new term if not found
      const { data: newTerm, error: newTermError } = await supabase
        .from('terms')
        .insert([
          {
            term_name: termName,
            academic_year: academicYear,
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
            semester_number: semesterNumber || null
          }
        ])
        .select()
        .single();
        
      if (newTermError) {
        console.error('Error creating term:', newTermError);
        toast.error('Failed to create academic term');
        return null;
      }
      
      termId = newTerm.id;
    } else {
      termId = termData.id;
      
      // Update semester number if needed
      if (semesterNumber && (!termData.semester_number || termData.semester_number !== semesterNumber)) {
        await supabase
          .from('terms')
          .update({ semester_number: semesterNumber })
          .eq('id', termId);
      }
    }
    
    // Link student to term
    if (data.id && termId) {
      await supabase
        .from('student_terms')
        .insert([
          {
            student_id: data.id,
            term_id: termId
          }
        ]);
    }

    toast.success('Student data saved successfully');
    return data.id;
  } catch (error) {
    console.error('Unexpected error saving student:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

export const saveGrades = async (studentId: string, grades: GradeFormData[]): Promise<boolean> => {
  try {
    // Get the latest term for this student
    const { data: studentTerm, error: termError } = await supabase
      .from('student_terms')
      .select('term_id')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (termError) {
      console.error('Error retrieving student term:', termError);
      toast.error('Failed to retrieve student term');
      return false;
    }
    
    const termId = studentTerm.term_id;
    
    // Process each grade
    for (const grade of grades) {
      // Check if course exists
      let courseId;
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('course_code', grade.courseCode)
        .maybeSingle();
        
      if (courseError || !courseData) {
        // Create course if it doesn't exist
        const { data: newCourse, error: newCourseError } = await supabase
          .from('courses')
          .insert([
            {
              course_code: grade.courseCode,
              course_name: grade.courseName,
              credit_hours: grade.creditHours,
              department: grade.courseName.split(' ')[0] // Simple department extraction
            }
          ])
          .select()
          .single();
          
        if (newCourseError) {
          console.error('Error creating course:', newCourseError);
          continue;
        }
        
        courseId = newCourse.id;
      } else {
        courseId = courseData.id;
      }
      
      // Convert letter grade to points
      const gradePoints = getPointsForGrade(grade.grade);
      
      // Insert grade
      await supabase
        .from('grades')
        .insert([
          {
            student_id: studentId,
            course_id: courseId,
            term_id: termId,
            grade_letter: grade.grade,
            grade_points: gradePoints,
            percentage: getPercentageFromGrade(grade.grade)
          }
        ]);
    }
    
    toast.success('Grades saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving grades:', error);
    toast.error('Failed to save grades');
    return false;
  }
};

// Helper functions
const getPointsForGrade = (grade: string): number => {
  switch (grade) {
    case 'A': return 4.0;
    case 'A-': return 3.7;
    case 'B+': return 3.3;
    case 'B': return 3.0;
    case 'B-': return 2.7;
    case 'C+': return 2.3;
    case 'C': return 2.0;
    case 'C-': return 1.7;
    case 'D+': return 1.3;
    case 'D': return 1.0;
    case 'F': return 0.0;
    default: return 0.0;
  }
};

const getPercentageFromGrade = (grade: string): number => {
  switch (grade) {
    case 'A': return 95;
    case 'A-': return 90;
    case 'B+': return 87;
    case 'B': return 83;
    case 'B-': return 80;
    case 'C+': return 77;
    case 'C': return 73;
    case 'C-': return 70;
    case 'D+': return 67;
    case 'D': return 63;
    case 'F': return 55;
    default: return 0;
  }
};
