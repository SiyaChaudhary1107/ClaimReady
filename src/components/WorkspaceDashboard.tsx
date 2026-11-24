import React from 'react';
import {
  FolderKanban,
  PlusCircle,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Download,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Language, ClaimReadinessSummary, PolicyData, MedicalDocument } from '../types';
import { getTranslation } from '../translations';

interface WorkspaceDashboardProps {
  currentLang: Language;
  summary: ClaimReadinessSummary | null;
  policy: PolicyData | null;
  documents: MedicalDocument[];
  onStartNewClaim: () => void;
  onLoadDemo: () => void;
  onContinueWorkflow: () => void;
  onDownloadReport: () => void;
  onReset: () => void;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  currentLang,
  summary,
  policy,
  documents,
  onStartNewClaim,
  onLoadDemo,
  onContinueWorkflow,
  onDownloadReport,
  onReset,
}) => {
  const t = getTranslation(currentLang);

  if (!summary && !policy && documents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto shadow-sm">
          <FolderKanban className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          {t.dashboard.welcome}
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {t.dashboard.noClaimYet}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onStartNewClaim}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.dashboard.newClaimBtn}</span>
          </button>
          <button
            onClick={onLoadDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{t.dashboard.sampleBtn}</span>
          </button>
        </div>
      </div>
    );
  }

  const score = summary?.readinessScore || 70;
  const scoreBadgeColor =
    score >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-300' :
    score >= 60 ? 'text-amber-700 bg-amber-50 border-amber-300' :
    'text-rose-700 bg-rose-50 border-rose-300';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Active Claim Workspace
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Ref: {summary?.claimReference || 'CR-DRAFT'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            {summary?.patientName || policy?.policyholderName || 'Claim In Progress'}
          </h1>
          <p className="text-xs text-slate-500">
            {summary?.hospitalName || 'Sanjeevani Community Hospital'} • {policy?.insurerName || 'Micro Health Insurance'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onDownloadReport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>{t.dashboard.viewReport}</span>
          </button>
          <button
            onClick={onContinueWorkflow}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5"
          >
            <span>{t.dashboard.continueWorkflow}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Readiness Meter Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.readinessScore}
            </span>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${scoreBadgeColor}`}>
              {summary?.overallReadiness.replace(/_/g, ' ') || 'REVIEW RECOMMENDED'}
            </span>
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-slate-900">{score}%</span>
            <span className="text-xs text-slate-500">/ 100 Paperwork Ready</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Claimed vs Paid
          </span>
          <div className="my-2">
            <p className="text-2xl font-extrabold text-slate-900">
              ₹{(summary?.totalClaimedAmount || 57100).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>₹{(summary?.totalReceiptsAmount || 57100).toLocaleString('en-IN')} Verified in Receipts</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Policy Sum Insured: ₹{(policy?.sumInsured || 150000).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Documents Processed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.dashboard.documentsUploaded}
          </span>
          <div className="my-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{documents.length}</span>
            <span className="text-xs text-slate-500">Files Scanned & Parsed</span>
          </div>
          <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            100% Client-Side OCR & Text Extraction
          </p>
        </div>

        {/* Verification Status Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.dashboard.statusSummary}
          </span>
          <div className="grid grid-cols-2 gap-2 my-2 text-xs">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900 font-bold flex items-center justify-between">
              <span>{t.dashboard.evidenceFound}:</span>
              <span>{summary?.evidenceFoundCount || 0}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center justify-between">
              <span>{t.dashboard.notFound}:</span>
              <span>{summary?.notFoundCount || 0}</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-900 font-bold flex items-center justify-between">
              <span>{t.dashboard.unclear}:</span>
              <span>{summary?.unclearCount || 0}</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-900 font-bold flex items-center justify-between">
              <span>{t.dashboard.conflict}:</span>
              <span>{summary?.conflictCount || 0}</span>
            </div>
          </div>
          <button
            onClick={onContinueWorkflow}
            className="text-[11px] text-blue-600 font-semibold hover:underline text-left"
          >
            Inspect Findings Table →
          </button>
        </div>
      </div>

      {/* Two Column Section: Documents & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Uploaded Documents Inventory */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Document Inventory ({documents.length})
            </h3>
            <button
              onClick={onContinueWorkflow}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Add Document
            </button>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {doc.fileName}
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                      <span className="font-semibold text-blue-700">
                        {doc.classifiedType.replace(/_/g, ' ')}
                      </span>
                      <span>•</span>
                      <span>{Math.round(doc.confidence * 100)}% confidence</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  {doc.manualReviewFlag ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      Needs Review
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recommended Next Steps */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.dashboard.recentActions}
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Prioritized by Engine
            </span>
          </div>

          <div className="space-y-2.5">
            {(summary?.nextSteps || [
              'Review itemized charges with hospital billing counter.',
              'Verify doctor signature and registration stamp on discharge card.',
              'Ensure payment slips match invoice totals before submission.'
            ]).map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start space-x-3 text-xs text-slate-700"
              >
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-medium">
                  {step}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={onDownloadReport}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Download Claim Readiness Report PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
