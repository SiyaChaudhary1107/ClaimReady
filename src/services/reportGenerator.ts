import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClaimReadinessSummary, PolicyData, MedicalDocument } from '../types';

/**
 * Generates an official, publication-quality Claim Readiness Report as a downloadable PDF.
 */
export function generateClaimReportPdf(
  summary: ClaimReadinessSummary,
  policy: PolicyData,
  documents: MedicalDocument[]
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 14;

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // Navy Blue #0F172A
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('CLAIMREADY', 14, 12);

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(191, 219, 254); // Light blue
  doc.text('Your insurance claim, understood, checked and prepared.', 14, 18);

  // Claim Reference badge (right side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`REF: ${summary.claimReference}`, pageWidth - 14, 12, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${summary.preparedDate}`, pageWidth - 14, 18, { align: 'right' });

  currentY = 35;

  // 2. Executive Claim Snapshot (Key-Value Grid)
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(14, currentY, pageWidth - 28, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('CLAIM DOSSIER SUMMARY', 18, currentY + 6);

  doc.setFontSize(8.5);
  // Column 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Policyholder:', 18, currentY + 13);
  doc.text('Patient Name:', 18, currentY + 19);
  doc.text('Policy Number:', 18, currentY + 25);
  doc.text('Insurance Co:', 18, currentY + 31);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(summary.policyholderName || 'Ravi Kumar', 44, currentY + 13);
  doc.text(summary.patientName || 'Shanti Devi', 44, currentY + 19);
  doc.text(summary.policyNumber || 'SMH-2024-884920', 44, currentY + 25);
  doc.text((policy.insurerName || 'Star Micro Health').slice(0, 28), 44, currentY + 31);

  // Column 2
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Hospital:', 105, currentY + 13);
  doc.text('Claimed Total:', 105, currentY + 19);
  doc.text('Receipts Total:', 105, currentY + 25);
  doc.text('Documents:', 105, currentY + 31);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text((summary.hospitalName || 'Treating Hospital').slice(0, 26), 132, currentY + 13);
  doc.text(`INR ${(summary.totalClaimedAmount || 57100).toLocaleString('en-IN')}`, 132, currentY + 19);
  doc.text(`INR ${(summary.totalReceiptsAmount || 57100).toLocaleString('en-IN')}`, 132, currentY + 25);
  doc.text(`${summary.totalDocuments} Files Reviewed`, 132, currentY + 31);

  // Column 3 - Readiness Score Box
  const scoreBoxX = pageWidth - 48;
  doc.setFillColor(summary.readinessScore >= 80 ? 236 : 254, summary.readinessScore >= 80 ? 253 : 243, summary.readinessScore >= 80 ? 245 : 199);
  doc.setDrawColor(summary.readinessScore >= 80 ? 16 : 245, summary.readinessScore >= 80 ? 185 : 158, summary.readinessScore >= 80 ? 129 : 11);
  doc.roundedRect(scoreBoxX, currentY + 5, 30, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(summary.readinessScore >= 80 ? 6 : 146, summary.readinessScore >= 80 ? 95 : 64, summary.readinessScore >= 80 ? 70 : 14);
  doc.text('PAPERWORK', scoreBoxX + 15, currentY + 11, { align: 'center' });
  doc.text('READINESS', scoreBoxX + 15, currentY + 15, { align: 'center' });

  doc.setFontSize(16);
  doc.text(`${summary.readinessScore}%`, scoreBoxX + 15, currentY + 24, { align: 'center' });

  doc.setFontSize(6.5);
  doc.text(summary.overallReadiness.replace(/_/g, ' '), scoreBoxX + 15, currentY + 29, { align: 'center' });

  currentY += 44;

  // 3. Status Breakdown Ribbon
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('EVIDENCE VERIFICATION BREAKDOWN:', 14, currentY);

  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129); // Green
  doc.text(`Found: ${summary.evidenceFoundCount}`, 80, currentY);

  doc.setTextColor(245, 158, 11); // Amber
  doc.text(`Unclear: ${summary.unclearCount}`, 110, currentY);

  doc.setTextColor(239, 68, 68); // Red
  doc.text(`Inconsistencies: ${summary.conflictCount}`, 140, currentY);

  doc.setTextColor(100, 116, 139); // Slate
  doc.text(`Not Found: ${summary.notFoundCount}`, 180, currentY);

  currentY += 4;

  // 4. Evidence-to-Policy Intelligence Findings Table
  const tableRows = summary.findings.map(f => {
    let statusLabel = f.status.replace(/_/g, ' ');
    if (f.status === 'EVIDENCE_FOUND') statusLabel = 'EVIDENCE FOUND';
    else if (f.status === 'NOT_FOUND') statusLabel = 'NOT FOUND';
    else if (f.status === 'UNCLEAR') statusLabel = 'UNCLEAR / REVIEW';
    else if (f.status === 'CONFLICT') statusLabel = 'INCONSISTENCY';

    return [
      f.requirement,
      `${f.documentName}\n\n"${f.pageOrExcerpt}"`,
      statusLabel,
      `${f.explanation}\n\nRecommended: ${f.recommendedAction}`,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Requirement / Policy Clause', 'Supporting Evidence & Source Excerpt', 'Status', 'Explanation & Recommended Action']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 3,
      valign: 'top',
    },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold' },
      1: { cellWidth: 50 },
      2: { cellWidth: 32, fontStyle: 'bold' },
      3: { cellWidth: 62 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const text = String(data.cell.raw);
        if (text.includes('FOUND')) {
          data.cell.styles.textColor = [16, 185, 129];
        } else if (text.includes('UNCLEAR')) {
          data.cell.styles.textColor = [217, 119, 6];
        } else if (text.includes('INCONSISTENCY')) {
          data.cell.styles.textColor = [225, 29, 72];
        } else if (text.includes('NOT')) {
          data.cell.styles.textColor = [239, 68, 68];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Get final Y position from table
  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY + 8;

  // Check if we need a new page for Checklist and Disclaimer
  if (finalY > 220) {
    doc.addPage();
    finalY = 18;
  }

  // 5. Recommended Action Checklist for Submission
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('RECOMMENDED ACTION CHECKLIST BEFORE FILING WITH TPA / INSURER:', 14, finalY);
  finalY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  summary.nextSteps.forEach((step, idx) => {
    doc.text(`[  ]  ${idx + 1}.  ${step}`, 18, finalY);
    finalY += 5;
  });

  finalY += 4;

  // 6. Responsible AI & Legal Disclaimer Box
  if (finalY > 240) {
    doc.addPage();
    finalY = 18;
  }

  doc.setFillColor(254, 242, 242); // Light red/pink
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(14, finalY, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(153, 27, 27); // Dark red
  doc.text('IMPORTANT RESPONSIBLE AI & LEGAL DISCLAIMER', 18, finalY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(185, 28, 28);
  const disclaimerText = "CLAIMREADY is an automated claim preparation assistant designed to help policyholders organize records and identify paperwork gaps prior to claim submission. CLAIMREADY is NOT an insurance company, insurance broker, or Third-Party Administrator (TPA). This preparation report does NOT guarantee claim approval, settlement amount, or coverage determination. Final claim adjudication is subject to the sole discretion and terms of your insurance policy and its authorized claim administrator.";
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 36);
  doc.text(splitDisclaimer, 18, finalY + 10);

  // Footer on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`CLAIMREADY Micro-Insurance Claim Assistance • Page ${i} of ${totalPages}`, 14, 290);
    doc.text('Confidential Claim Preparation Dossier', pageWidth - 14, 290, { align: 'right' });
  }

  return doc;
}
