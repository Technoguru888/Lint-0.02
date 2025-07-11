import jsPDF from 'jspdf';
import { AnalysisResult } from './gemini';

export function generateAnalysisReport(
  projectName: string,
  analysis: AnalysisResult,
  userEmail: string
): jsPDF {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Set default font to Helvetica for better compatibility
  doc.setFont('helvetica', 'normal');

  // Helper function to safely encode text and remove problematic characters
  const safeText = (text: string): string => {
    if (!text) return '';
    return text
      .toString()
      .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, '') // Keep only basic Latin and Latin-1 supplement
      .replace(/[""]/g, '"') // Replace smart quotes
      .replace(/['']/g, "'") // Replace smart apostrophes
      .replace(/[–—]/g, '-') // Replace em/en dashes
      .replace(/…/g, '...') // Replace ellipsis
      .replace(/[^\x00-\xFF]/g, '') // Remove any remaining non-Latin characters
      .trim();
  };

  // Helper function to add new page if needed
  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - margin - 25) {
      doc.addPage();
      yPosition = 25;
      addWatermark();
    }
  };

  // Add watermark to each page
  const addWatermark = () => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 160, 160);
    doc.text('Generated by Lint - Professional Code Analysis', pageWidth / 2, pageHeight - 8, { align: 'center' });
  };

  // Add header with modern design and Lint branding
  const addHeader = () => {
    // Header background with gradient effect
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Gradient simulation
    doc.setFillColor(147, 51, 234);
    doc.rect(pageWidth * 0.65, 0, pageWidth * 0.35, 45, 'F');
    
    // Modern logo design
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 12, 28, 8, 'F');
    doc.setFillColor(59, 130, 246);
    doc.circle(margin + 12, 28, 6, 'F');
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 12, 28, 3, 'F');
    
    // Main title with Lint branding
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Lint', margin + 28, 25);
    
    // Subtitle
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Code Analysis Report', margin + 28, 33);
    
    // Modern accent line
    doc.setDrawColor(255, 255, 255, 0.3);
    doc.setLineWidth(0.5);
    doc.line(margin + 28, 36, margin + 120, 36);
    
    yPosition = 55;
  };

  // Add section header with modern styling
  const addSectionHeader = (title: string, color: [number, number, number] = [59, 130, 246]) => {
    checkPageBreak(25);
    
    yPosition += 8;
    
    // Modern section background
    doc.setFillColor(color[0], color[1], color[2], 0.08);
    doc.rect(margin, yPosition - 6, contentWidth, 18, 'F');
    
    // Section accent line
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(margin, yPosition - 6, 3, 18, 'F');
    
    // Section title
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(safeText(title), margin + 8, yPosition + 4);
    
    yPosition += 25;
  };

  // Add modern info box
  const addInfoBox = (label: string, value: string, color: [number, number, number] = [75, 85, 99]) => {
    checkPageBreak(16);
    
    // Modern card design
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, yPosition, contentWidth, 14, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, contentWidth, 14);
    
    // Left accent
    doc.setFillColor(59, 130, 246);
    doc.rect(margin, yPosition, 2, 14, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(safeText(label) + ':', margin + 8, yPosition + 9);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(safeText(value), margin + 50, yPosition + 9);
    
    yPosition += 18;
  };

  // Add modern score card
  const addScoreCard = (score: number, title: string) => {
    checkPageBreak(40);
    
    const scoreColor = score > 70 ? [239, 68, 68] : 
                     score > 40 ? [245, 158, 11] : 
                     [34, 197, 94];
    
    // Modern score card with shadow effect
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, yPosition, contentWidth, 35, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.4);
    doc.rect(margin, yPosition, contentWidth, 35);
    
    // Score visualization
    const circleX = margin + 25;
    const circleY = yPosition + 17;
    const radius = 12;
    
    // Outer ring
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.1);
    doc.circle(circleX, circleY, radius, 'F');
    
    // Progress ring
    doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.setLineWidth(2);
    doc.circle(circleX, circleY, radius);
    
    // Score text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(score.toString(), circleX, circleY + 3, { align: 'center' });
    
    // Title and description
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(safeText(title), margin + 45, yPosition + 14);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Lower scores indicate better code quality', margin + 45, yPosition + 24);
    
    yPosition += 45;
  };

  // Start document
  addHeader();
  addWatermark();

  // Project Information Section
  addSectionHeader('Project Information', [59, 130, 246]);
  addInfoBox('Project Name', safeText(projectName));
  addInfoBox('Generated On', new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));
  addInfoBox('Generated For', safeText(userEmail));
  addInfoBox('Analysis Engine', 'Gemini 2.0 Flash AI');
  yPosition += 12;

  // Overall Score Section
  addSectionHeader('Overall Assessment', [147, 51, 234]);
  addScoreCard(analysis.overall_debt_score, 'Technical Debt Score');

  // Executive Summary
  if (analysis.summary) {
    addSectionHeader('Executive Summary', [16, 185, 129]);
    checkPageBreak(35);
    
    const cleanSummary = safeText(analysis.summary);
    const summaryLines = doc.splitTextToSize(cleanSummary, contentWidth - 25);
    const summaryHeight = summaryLines.length * 6 + 20;
    
    // Modern summary card
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPosition, contentWidth, summaryHeight, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, contentWidth, summaryHeight);
    
    // Left accent
    doc.setFillColor(16, 185, 129);
    doc.rect(margin, yPosition, 3, summaryHeight, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    
    summaryLines.forEach((line: string, index: number) => {
      checkPageBreak(8);
      doc.text(safeText(line), margin + 12, yPosition + 12 + (index * 6));
    });
    
    yPosition += summaryHeight + 18;
  }

  // File Analysis Section
  if (analysis.file_analyses.length > 0) {
    addSectionHeader('Detailed File Analysis', [245, 158, 11]);
    
    analysis.file_analyses.slice(0, 8).forEach((fileAnalysis, index) => {
      checkPageBreak(40);
      
      // Modern file card
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, yPosition, contentWidth, 25, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.4);
      doc.rect(margin, yPosition, contentWidth, 25);
      
      // File type indicator
      doc.setFillColor(59, 130, 246);
      doc.rect(margin + 8, yPosition + 8, 10, 10, 'F');
      doc.setFillColor(255, 255, 255);
      doc.rect(margin + 9, yPosition + 9, 8, 8, 'F');
      
      // File name with modern typography
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      const fileName = fileAnalysis.file_path.length > 38 ? 
        '...' + fileAnalysis.file_path.slice(-35) : 
        fileAnalysis.file_path;
      doc.text(safeText(fileName), margin + 25, yPosition + 12);
      
      // File score with modern styling
      const fileScoreColor = fileAnalysis.debt_score > 70 ? [239, 68, 68] :
                            fileAnalysis.debt_score > 40 ? [245, 158, 11] :
                            [34, 197, 94];
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(fileScoreColor[0], fileScoreColor[1], fileScoreColor[2]);
      doc.text(`Score: ${fileAnalysis.debt_score}/100`, margin + 25, yPosition + 20);
      
      yPosition += 30;
      
      // Issues with modern formatting
      if (fileAnalysis.issues && fileAnalysis.issues.length > 0) {
        fileAnalysis.issues.slice(0, 2).forEach((issue: any) => {
          checkPageBreak(28);
          
          const severityColor = issue.severity === 'high' ? [239, 68, 68] :
                               issue.severity === 'medium' ? [245, 158, 11] :
                               [156, 163, 175];
          
          // Modern issue card
          doc.setFillColor(248, 250, 252);
          doc.rect(margin + 5, yPosition, contentWidth - 10, 22, 'F');
          doc.setDrawColor(severityColor[0], severityColor[1], severityColor[2]);
          doc.setLineWidth(0.3);
          doc.rect(margin + 5, yPosition, contentWidth - 10, 22);
          
          // Severity indicator
          doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
          doc.circle(margin + 15, yPosition + 8, 3, 'F');
          
          // Issue type and severity
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
          const issueType = safeText(issue.type || 'Code Issue');
          const severity = safeText(issue.severity || 'medium');
          doc.text(`${issueType} (${severity})`, margin + 22, yPosition + 8);
          
          // Issue description
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(75, 85, 99);
          const cleanDescription = safeText(issue.description || 'No description available');
          const descLines = doc.splitTextToSize(cleanDescription, contentWidth - 30);
          descLines.slice(0, 1).forEach((line: string, lineIndex: number) => {
            checkPageBreak(6);
            doc.text(safeText(line), margin + 22, yPosition + 15 + (lineIndex * 5));
          });
          
          yPosition += 25;
          
          // Suggestion with modern styling
          if (issue.suggestion) {
            checkPageBreak(10);
            doc.setFontSize(8);
            doc.setTextColor(59, 130, 246);
            doc.setFont('helvetica', 'bold');
            doc.text('💡 ', margin + 22, yPosition);
            
            doc.setFont('helvetica', 'normal');
            const cleanSuggestion = safeText(issue.suggestion);
            const suggestionLines = doc.splitTextToSize(cleanSuggestion, contentWidth - 35);
            suggestionLines.slice(0, 1).forEach((line: string, lineIndex: number) => {
              checkPageBreak(5);
              doc.text(safeText(line), margin + 28, yPosition + (lineIndex * 5));
            });
            
            yPosition += 8;
          }
          
          yPosition += 8;
        });
      }
      
      yPosition += 12;
    });
  }

  // Recommendations Section
  if (analysis.recommendations.length > 0) {
    addSectionHeader('Priority Recommendations', [34, 197, 94]);
    
    analysis.recommendations.forEach((rec: any, index: number) => {
      checkPageBreak(35);
      
      const priorityColor = rec.priority === 'high' ? [239, 68, 68] :
                           rec.priority === 'medium' ? [245, 158, 11] :
                           [34, 197, 94];
      
      // Modern recommendation card
      const cardHeight = 28;
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, yPosition, contentWidth, cardHeight, 'F');
      doc.setDrawColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPosition, contentWidth, cardHeight);
      
      // Priority indicator bar
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.rect(margin, yPosition, 4, cardHeight, 'F');
      
      // Priority badge
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2], 0.1);
      doc.rect(margin + 12, yPosition + 6, 25, 8, 'F');
      
      // Category and priority
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      const category = safeText(rec.category || 'General');
      doc.text(category, margin + 45, yPosition + 10);
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      const priority = safeText(rec.priority || 'medium').toUpperCase();
      doc.text(priority, margin + 14, yPosition + 11);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text('PRIORITY', margin + 14, yPosition + 18);
      
      yPosition += cardHeight + 6;
      
      // Description with modern typography
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      const cleanDescription = safeText(rec.description || 'No description available');
      const descLines = doc.splitTextToSize(cleanDescription, contentWidth - 15);
      descLines.slice(0, 2).forEach((line: string, lineIndex: number) => {
        checkPageBreak(6);
        doc.text(safeText(line), margin + 8, yPosition + (lineIndex * 6));
      });
      yPosition += Math.min(descLines.length, 2) * 6 + 6;
      
      // Impact with modern styling
      if (rec.impact) {
        checkPageBreak(12);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(107, 114, 128);
        doc.text('Impact: ', margin + 8, yPosition);
        
        doc.setFont('helvetica', 'normal');
        const cleanImpact = safeText(rec.impact);
        const impactLines = doc.splitTextToSize(cleanImpact, contentWidth - 30);
        impactLines.slice(0, 1).forEach((line: string, lineIndex: number) => {
          checkPageBreak(5);
          doc.text(safeText(line), margin + 28, yPosition + (lineIndex * 5));
        });
        yPosition += 10;
      }
      
      yPosition += 12;
    });
  }

  // Modern footer with Lint branding
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(249, 250, 252);
    doc.rect(0, pageHeight - 22, pageWidth, 22, 'F');
    
    // Footer accent line
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(0, pageHeight - 22, pageWidth, pageHeight - 22);
    
    // Footer content with Lint branding
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Generated by Lint | Professional Code Analysis Platform', 
             margin, pageHeight - 14);
    
    doc.setTextColor(156, 163, 175);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 14, { align: 'right' });
    
    // Powered by with modern styling
    doc.setFontSize(6);
    doc.setTextColor(59, 130, 246);
    doc.text('Powered by Walmart Innovation - Sparkathon', 
             pageWidth / 2, pageHeight - 6, { align: 'center' });
  }

  return doc;
}