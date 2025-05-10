
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportCard } from '@/types';

export const generatePDF = async (reportCardElement: HTMLElement, reportData: ReportCard): Promise<void> => {
  try {
    // Create a clone of the element to avoid modifying the visible one
    const element = reportCardElement.cloneNode(true) as HTMLElement;
    document.body.appendChild(element);
    
    // Apply print styles to the clone
    element.style.width = '800px';
    element.style.padding = '40px';
    element.style.position = 'fixed';
    element.style.left = '-9999px';
    
    // Convert the element to an image
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    document.body.removeChild(element);
    
    // Initialize PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Calculate dimensions to fit the page
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Save the PDF
    pdf.save(`${reportData.student.lastName}_${reportData.student.firstName}_ReportCard.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const printReportCard = (): void => {
  window.print();
};
