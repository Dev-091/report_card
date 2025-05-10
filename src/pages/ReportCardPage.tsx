
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportCard from '@/components/ReportCard';
import ReportCardSkeleton from '@/components/ReportCardSkeleton';
import { ReportCard as ReportCardType } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const ReportCardPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      try {
        const storedData = localStorage.getItem('reportCardData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setReportData(parsedData);
          toast({
            title: "Report Card Loaded",
            description: "Student report card has been successfully loaded.",
          });
        } else {
          toast({
            title: "No Report Data",
            description: "No report card data found. Please generate a report first.",
            variant: "destructive",
          });
          // Redirect back to form page if no data is found
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading report card data:', error);
        toast({
          title: "Error Loading Data",
          description: "Could not load the report card data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [toast, navigate]);

  const handleBackToForm = () => {
    navigate('/');
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-college-dark dark:text-college-light mb-2 font-serif">Student Report Card</h1>
          <p className="text-gray-600 dark:text-gray-300">View, download or print the generated report card</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <ThemeToggle />
          <Button 
            variant="outline" 
            className="self-start md:self-auto flex items-center gap-2"
            onClick={handleBackToForm}
          >
            <ArrowLeft size={16} />
            Back to Form
          </Button>
        </div>
      </header>

      {loading ? (
        <ReportCardSkeleton />
      ) : reportData ? (
        <ReportCard data={reportData} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-college-dark dark:text-college-light mb-4">No Data Available</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Could not load the report card data. Please generate a new report.</p>
          <Button onClick={handleBackToForm}>Create New Report</Button>
        </div>
      )}
    </div>
  );
};

export default ReportCardPage;
