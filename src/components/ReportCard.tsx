
import React, { useRef } from 'react';
import { ReportCard as ReportCardType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { generatePDF, printReportCard } from '@/services/pdfService';
import { Download, Printer } from 'lucide-react';

interface ReportCardProps {
  data: ReportCardType;
}

const getGradeColor = (grade: string): string => {
  const firstChar = grade.charAt(0);
  if (firstChar === 'A') return 'text-green-600 dark:text-green-400';
  if (firstChar === 'B') return 'text-blue-600 dark:text-blue-400';
  if (firstChar === 'C') return 'text-yellow-600 dark:text-yellow-400';
  if (firstChar === 'D') return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

const ReportCard: React.FC<ReportCardProps> = ({ data }) => {
  const reportCardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (reportCardRef.current) {
      await generatePDF(reportCardRef.current, data);
    }
  };

  const handlePrint = () => {
    printReportCard();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex gap-4 no-print">
        <Button 
          variant="default" 
          className="bg-college-purple text-white hover:bg-college-dark flex items-center gap-2"
          onClick={handleDownloadPDF}
        >
          <Download size={18} />
          Download Report Card
        </Button>
        <Button 
          variant="outline" 
          className="border-college-purple text-college-purple hover:bg-college-light/20 flex items-center gap-2 dark:border-college-light dark:text-college-light"
          onClick={handlePrint}
        >
          <Printer size={18} />
          Print Report Card
        </Button>
      </div>
      
      <Card 
        className="p-8 shadow-lg report-card bg-white dark:bg-gray-800" 
        ref={reportCardRef}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-college-purple pb-6 mb-6">
          <h1 className="text-3xl font-bold text-college-dark dark:text-white">State University</h1>
          <p className="text-xl text-college-gray dark:text-gray-300 mt-1">College of Technology</p>
          <h2 className="text-2xl font-bold mt-4 text-college-purple">STUDENT REPORT CARD</h2>
          <p className="text-sm text-college-gray dark:text-gray-300 mt-1">Academic Year 2024-2025</p>
        </div>
        
        {/* Student Information */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/4 flex justify-center">
            {data.student.imageUrl ? (
              <img 
                src={data.student.imageUrl} 
                alt={`${data.student.firstName} ${data.student.lastName}`} 
                className="w-32 h-32 rounded-full object-cover border-4 border-college-purple"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-college-soft-gray dark:bg-gray-700 flex items-center justify-center border-4 border-college-purple">
                <span className="text-2xl font-bold text-college-purple">
                  {data.student.firstName.charAt(0)}{data.student.lastName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-college-gray dark:text-gray-300">Student Name</p>
                <p className="text-lg font-bold dark:text-white">{data.student.firstName} {data.student.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-college-gray dark:text-gray-300">Student ID</p>
                <p className="text-lg dark:text-white">{data.student.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-college-gray dark:text-gray-300">Program</p>
                <p className="text-lg dark:text-white">{data.student.program}</p>
              </div>
              <div>
                <p className="text-sm text-college-gray dark:text-gray-300">Year & Semester</p>
                <p className="text-lg dark:text-white">Year {data.student.year}, {data.student.semester}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Grades */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-college-dark dark:text-white border-b pb-2">Course Grades</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-college-soft-gray dark:bg-gray-700">
                  <th className="py-3 px-4 text-left dark:text-white">Course Code</th>
                  <th className="py-3 px-4 text-left dark:text-white">Course Name</th>
                  <th className="py-3 px-4 text-center dark:text-white">Credit Hours</th>
                  <th className="py-3 px-4 text-center dark:text-white">Grade</th>
                  <th className="py-3 px-4 text-center dark:text-white">Grade Points</th>
                </tr>
              </thead>
              <tbody>
                {data.grades.map((grade) => (
                  <tr key={grade.courseId} className="border-b dark:border-gray-600">
                    <td className="py-3 px-4 dark:text-white">{grade.courseCode}</td>
                    <td className="py-3 px-4 dark:text-white">{grade.courseName}</td>
                    <td className="py-3 px-4 text-center dark:text-white">{grade.creditHours}</td>
                    <td className={`py-3 px-4 text-center font-bold ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </td>
                    <td className="py-3 px-4 text-center dark:text-white">{grade.points.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-college-soft-gray/50 dark:bg-gray-700/50">
                  <td className="py-3 px-4 font-bold text-right dark:text-white" colSpan={2}>Total</td>
                  <td className="py-3 px-4 text-center font-bold dark:text-white">{data.totalCredits}</td>
                  <td className="py-3 px-4 text-center font-bold dark:text-white">GPA</td>
                  <td className="py-3 px-4 text-center font-bold dark:text-white">{data.gpa.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* GPA Scale Reference */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-college-dark dark:text-white border-b pb-2">GPA Scale Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm dark:text-gray-200">
            <div><span className="font-bold">A</span> = 4.0 points</div>
            <div><span className="font-bold">A-</span> = 3.7 points</div>
            <div><span className="font-bold">B+</span> = 3.3 points</div>
            <div><span className="font-bold">B</span> = 3.0 points</div>
            <div><span className="font-bold">B-</span> = 2.7 points</div>
            <div><span className="font-bold">C+</span> = 2.3 points</div>
            <div><span className="font-bold">C</span> = 2.0 points</div>
            <div><span className="font-bold">F</span> = 0.0 points</div>
          </div>
        </div>
        
        {/* Remarks */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-college-dark dark:text-white border-b pb-2">Remarks</h3>
          <p className="italic dark:text-gray-200">{data.remarks}</p>
        </div>
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="dark:text-white">Issue Date: {data.issueDate}</p>
            </div>
            <div className="text-center mt-4 md:mt-0">
              <div className="border-b border-black dark:border-white inline-block min-w-[200px] pb-1 mb-1">
                <span className="dark:text-white">{data.signature}</span>
              </div>
              <p className="text-sm text-college-gray dark:text-gray-300">Program Director</p>
            </div>
          </div>
        </div>
        
        {/* Watermark (only for PDF/Print) */}
        <div className="fixed inset-0 flex items-center justify-center z-[-1] opacity-10 pointer-events-none">
          <h1 className="text-9xl font-bold text-college-purple dark:text-purple-700 rotate-[-30deg]">OFFICIAL</h1>
        </div>
      </Card>
    </div>
  );
};

export default ReportCard;
