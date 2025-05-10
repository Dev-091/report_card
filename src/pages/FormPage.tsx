import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Grade, ReportCard, Student } from "@/types";
import { PlusCircle, Trash2, FileText, Send } from "lucide-react";
import { ThemeToggle } from '@/components/ThemeToggle';
import { saveStudent, saveGrades, GradeFormData } from '@/services/supabaseService';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  studentId: z.string().min(3, { message: "Student ID must be at least 3 characters" }),
  year: z.string().min(1, { message: "Year is required" }),
  semester: z.string().min(1, { message: "Semester is required" }),
  program: z.string().min(2, { message: "Program must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  remarks: z.string(),
  signature: z.string().min(2, { message: "Signature is required" }),
  grades: z.array(z.object({
    courseCode: z.string().min(2, { message: "Course code is required" }),
    courseName: z.string().min(2, { message: "Course name is required" }),
    creditHours: z.coerce.number().min(1, { message: "Credit hours must be at least 1" }),
    grade: z.string().min(1, { message: "Grade is required" }),
  })).min(1, { message: "At least one course is required" })
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_GRADE: Omit<Grade, "points" | "courseId"> = {
  courseCode: "",
  courseName: "",
  creditHours: 3,
  grade: ""
};

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

const calculateGPA = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;
  
  const totalPoints = grades.reduce((sum, grade) => sum + (grade.points * grade.creditHours), 0);
  const totalCredits = grades.reduce((sum, grade) => sum + grade.creditHours, 0);
  
  return totalPoints / totalCredits;
};

const FormPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useNumericSemester, setUseNumericSemester] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      studentId: "",
      year: "1",
      semester: "Fall",
      program: "",
      email: "",
      remarks: "",
      signature: "",
      grades: [{ ...DEFAULT_GRADE }]
    }
  });

  // Use useFieldArray hook correctly as a separate hook, not as a method of form
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "grades"
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Save student data to Supabase
      const studentId = await saveStudent({
        firstName: data.firstName,
        lastName: data.lastName,
        studentId: data.studentId,
        year: data.year,
        semester: data.semester,
        program: data.program,
        email: data.email
      });
      
      if (!studentId) {
        toast({
          title: "Error",
          description: "Failed to save student information to database.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Save grades to Supabase - Fix #1: Ensure all required fields are present
      const gradesData: GradeFormData[] = data.grades.map(grade => ({
        courseCode: grade.courseCode,
        courseName: grade.courseName,
        creditHours: grade.creditHours,
        grade: grade.grade
      }));
      
      const gradesSuccess = await saveGrades(studentId, gradesData);
      
      if (!gradesSuccess) {
        toast({
          // Fix #2: Use a valid variant value
          variant: "destructive",
          title: "Warning",
          description: "Some grades may not have been saved correctly."
        });
      }
      
      // Process the form data to create a ReportCard object for local display
      const gradesWithPoints: Grade[] = data.grades.map((grade, index) => ({
        courseId: `course-${index + 1}`,
        courseCode: grade.courseCode,
        courseName: grade.courseName,
        creditHours: grade.creditHours,
        grade: grade.grade,
        points: getPointsForGrade(grade.grade)
      }));
      
      const student: Student = {
        id: studentId || `student-${Date.now()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        studentId: data.studentId,
        year: data.year,
        semester: data.semester,
        program: data.program
      };
      
      const totalCredits = gradesWithPoints.reduce((sum, grade) => sum + grade.creditHours, 0);
      const gpa = calculateGPA(gradesWithPoints);
      
      const reportCard: ReportCard = {
        student,
        grades: gradesWithPoints,
        issueDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        remarks: data.remarks,
        totalCredits,
        gpa,
        signature: data.signature
      };
      
      // Store in localStorage to access from report page
      localStorage.setItem('reportCardData', JSON.stringify(reportCard));
      
      toast({
        title: "Report Card Generated",
        description: "Redirecting to view the report card."
      });
      
      // Navigate to the report card view page
      navigate('/report');
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-college-dark dark:text-college-light mb-2 font-serif">Report Card Generator</h1>
          <p className="text-gray-600 dark:text-gray-300">Fill in the student information and grades to generate a report card</p>
        </div>
        <div className="flex justify-center mt-4 md:mt-0">
          <ThemeToggle />
        </div>
      </header>
      
      <Card className="max-w-4xl mx-auto dark:border-gray-700">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>Enter the student's personal and academic information</CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Info Section */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input placeholder="S12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="student@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program/Major</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">First Year</SelectItem>
                          <SelectItem value="2">Second Year</SelectItem>
                          <SelectItem value="3">Third Year</SelectItem>
                          <SelectItem value="4">Fourth Year</SelectItem>
                          <SelectItem value="5">Fifth Year</SelectItem>
                          <SelectItem value="6">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between">
                        <span>Semester</span>
                        <Button 
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setUseNumericSemester(!useNumericSemester)}
                          className="h-6 text-xs"
                        >
                          {useNumericSemester ? "Use Text" : "Use Numbers"}
                        </Button>
                      </FormLabel>
                      {useNumericSemester ? (
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="8" 
                            placeholder="Semester number" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      ) : (
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fall">Fall</SelectItem>
                            <SelectItem value="Spring">Spring</SelectItem>
                            <SelectItem value="Summer">Summer</SelectItem>
                            <SelectItem value="Winter">Winter</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Grades Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Course Grades</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => append({ ...DEFAULT_GRADE })}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle size={16} />
                    Add Course
                  </Button>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="border p-4 rounded-md dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Course {index + 1}</h4>
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`grades.${index}.courseCode`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Code</FormLabel>
                            <FormControl>
                              <Input placeholder="CS101" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`grades.${index}.courseName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Introduction to Programming" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`grades.${index}.creditHours`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credit Hours</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="6" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`grades.${index}.grade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">A (4.0)</SelectItem>
                                <SelectItem value="A-">A- (3.7)</SelectItem>
                                <SelectItem value="B+">B+ (3.3)</SelectItem>
                                <SelectItem value="B">B (3.0)</SelectItem>
                                <SelectItem value="B-">B- (2.7)</SelectItem>
                                <SelectItem value="C+">C+ (2.3)</SelectItem>
                                <SelectItem value="C">C (2.0)</SelectItem>
                                <SelectItem value="C-">C- (1.7)</SelectItem>
                                <SelectItem value="D+">D+ (1.3)</SelectItem>
                                <SelectItem value="D">D (1.0)</SelectItem>
                                <SelectItem value="F">F (0.0)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Additional Information */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional comments about the student's performance..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Optional comments about the student's performance.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="signature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Director's Signature</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="reset" 
                variant="outline"
                onClick={() => form.reset()}
              >
                Clear Form
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? "Generating..." : (
                  <>
                    <FileText size={16} />
                    Generate Report Card
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default FormPage;
