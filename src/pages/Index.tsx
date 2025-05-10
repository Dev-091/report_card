
import React, { useState, useEffect } from 'react';
import ReportCard from '@/components/ReportCard';
import ReportCardSkeleton from '@/components/ReportCardSkeleton';
import { getReportCardData } from '@/services/mockDataService';
import { ReportCard as ReportCardType } from '@/types';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [reportData, setReportData] = useState<ReportCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading from Supabase
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const data = getReportCardData();
        setReportData(data);
        toast({
          title: "Report Card Loaded",
          description: "Student data has been successfully loaded.",
        });
      } catch (error) {
        console.error('Error fetching report card data:', error);
        toast({
          title: "Error Loading Data",
          description: "Could not load the report card data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="container py-8 px-4 md:px-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-college-dark mb-2 font-serif">Report Card Generator</h1>
        <p className="text-college-gray">Generate, download and print professional academic report cards</p>
      </header>

      {loading ? (
        <ReportCardSkeleton />
      ) : reportData ? (
        <ReportCard data={reportData} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-college-dark mb-4">No Data Available</h2>
          <p className="text-college-gray">Could not load the report card data. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default Index;
