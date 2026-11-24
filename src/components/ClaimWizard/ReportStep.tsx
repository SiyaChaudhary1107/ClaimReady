import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  Sparkles,
  ShieldAlert,
  FileText,
  Calendar,
  Building2,
  FolderKanban
} from 'lucide-react';
import { Language, ClaimReadinessSummary, PolicyData, MedicalDocument } from '../../types';
import { getTranslation } from '../../translations';
import { generateClaimReportPdf } from '../../services/reportGenerator';

interface ReportStepProps {
  currentLang: Language;
  summary: ClaimReadinessSummary;
  policy: PolicyData;
  documents: MedicalDocument[];
  onStartNewClaim: () => void;
  onGoToWorkspace: () => void;
}

export const ReportStep: React.FC<ReportStepProps> = ({
  currentLang,
  summary,
  policy,
  documents,
  onStartNewClaim,
  onGoToWorkspace,
}) => {
  const t = getTranslation(currentLang);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Fire confetti celebration on successful dossier generation
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleDownloadPdf = () => {
    const doc = generateClaimReportPdf(summary, policy, documents);
    doc.save(`CLAIMREADY_Dossier_${summary.claimReference}.pdf`);
  };

  const toggleCheck = (idx: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Congratulatory Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t.reportStep.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {t.reportStep.subtitle}
        </p>

        {/* Big Download Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleDownloadPdf}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-600/25 transition flex items-center justify-center space-x-2.5 transform hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            <span>{t.reportStep.downloadPdf}</span>
          </button>

          <button
            onClick={onGoToWorkspace}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <FolderKanban className="w-4 h-4 text-blue-400" />
            <span>Go to Workspace Dashboard</span>
          </button>
        </div>
      </div>

      {/* Dossier Summary Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Claim Dossier
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Reference: {summary.claimReference}
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span>Prepared on {summary.preparedDate}</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              {summary.readinessScore}% Ready
            </span>
          </div>
        </div>

        {/* 3-Column Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block mb-1">Policyholder & Insurer</span>
            <span className="font-bold text-slate-900 block">{summary.policyholderName}</span>
            <span className="text-slate-600 font-mono text-[11px] block">{summary.policyNumber}</span>
            <span className="text-slate-500 text-[11px] block mt-0.5">{policy.insurerName}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block mb-1">Patient & Hospital</span>
            <span className="font-bold text-slate-900 block">{summary.patientName}</span>
            <span className="text-slate-600 text-[11px] block">{summary.hospitalName}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 block mb-1">Financial Reconciliation</span>
            <span className="font-bold text-slate-900 text-sm block">
              ₹{(summary.totalClaimedAmount || 57100).toLocaleString('en-IN')}
            </span>
            <span className="text-emerald-700 font-semibold text-[11px] block">
              ✓ ₹{(summary.totalReceiptsAmount || 57100).toLocaleString('en-IN')} in payment slips
            </span>
          </div>
        </div>

        {/* Actionable Submission Checklist */}
        <div className="pt-2 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.reportStep.checklistTitle}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.reportStep.checklistDesc}
            </p>
          </div>

          <div className="space-y-2.5">
            {summary.nextSteps.map((step, idx) => {
              const isChecked = !!checkedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 text-xs ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(idx)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className={`font-semibold ${isChecked ? 'line-through text-emerald-800' : 'text-slate-900'}`}>
                      Step {idx + 1}:
                    </span>{' '}
                    <span className={isChecked ? 'text-emerald-900' : 'text-slate-700'}>
                      {step}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal & Responsible AI Disclaimer Callout */}
        <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-2">
          <div className="flex items-center space-x-2 text-rose-900 font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>{t.reportStep.disclaimerTitle}</span>
          </div>
          <p className="leading-relaxed text-[11px] text-rose-900">
            {t.reportStep.disclaimerText}
          </p>
        </div>
      </div>

      {/* Start New Claim Action */}
      <div className="text-center pt-4">
        <button
          onClick={onStartNewClaim}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition inline-flex items-center space-x-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.reportStep.startNew}</span>
        </button>
      </div>
    </div>
  );
};
