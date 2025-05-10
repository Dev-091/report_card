
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ReportCardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <Card className="p-8 shadow-lg">
        {/* Header */}
        <div className="text-center pb-6 mb-6">
          <Skeleton className="h-8 w-72 mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto mt-2" />
          <Skeleton className="h-7 w-64 mx-auto mt-4" />
          <Skeleton className="h-4 w-40 mx-auto mt-2" />
        </div>
        
        {/* Student Information */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/4 flex justify-center">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Grades */}
        <div className="mb-8">
          <Skeleton className="h-7 w-40 mb-4" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        
        {/* GPA Scale */}
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        
        {/* Remarks */}
        <Skeleton className="h-7 w-40 mb-4" />
        <Skeleton className="h-20 w-full mb-8" />
        
        {/* Footer */}
        <div className="mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Skeleton className="h-5 w-40" />
            <div className="text-center mt-4 md:mt-0">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32 mx-auto mt-2" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportCardSkeleton;
