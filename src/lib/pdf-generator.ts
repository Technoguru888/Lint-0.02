

function addCoverPage(): void {
  // Background header section
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 70, 'F');

  // Title (white on blue header)
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.white);
  doc.text('Technical Debt Analysis Report', margin, 30);

  // Score circle (right corner)
  const scoreX = pageWidth - margin - 25;
  const scoreY = 30;
  const scoreRadius = 20;
  const scoreColor =
    analysis.overall_debt_score > 70 ? colors.danger :
    analysis.overall_debt_score > 40 ? colors.warning :
    colors.success;

  doc.setFillColor(...scoreColor);
  doc.circle(scoreX, scoreY, scoreRadius, 'F');

  doc.setFontSize(14);
  doc.setTextColor(...colors.white);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analysis.overall_debt_score}`, scoreX, scoreY + 5, { align: 'center' });
  doc.setFontSize(8);
  doc.text('/100', scoreX, scoreY + 12, { align: 'center' });

  // Assessment Label
  doc.setFontSize(8);
  doc.setTextColor(...colors.white);
  const qualityText =
    analysis.overall_debt_score > 70 ? 'High Technical Debt' :
    analysis.overall_debt_score > 40 ? 'Moderate Technical Debt' : 'Low Technical Debt';
  doc.text(qualityText, scoreX, scoreY + 22, { align: 'center' });

  // Project info section
  const infoYStart = 80;
  const rowHeight = 10;
  doc.setFontSize(10);

  const info = [
    ['Project:', safeText(projectName, 40)],
    ['Generated:', new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
    ['Engine:', 'Gemini 2.0 Flash AI'],
    ['Files Analyzed:', `${analysis.file_analyses?.length || 0} files`],
    ['Generated For:', safeText(userEmail, 40)]
  ];

  info.forEach(([label, value], index) => {
    const y = infoYStart + index * rowHeight;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray[700]);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray[600]);
    doc.text(value, margin + 40, y);
  });

  // Footer
  const footerY = pageHeight - 25;
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(1);
  doc.line(0, footerY - 5, pageWidth, footerY - 5);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text('Powered by Lint', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.gray[500]);
  doc.text('Professional Code Analysis Platform', pageWidth / 2, footerY + 12, { align: 'center' });

  doc.addPage();
  yPosition = 25;
}