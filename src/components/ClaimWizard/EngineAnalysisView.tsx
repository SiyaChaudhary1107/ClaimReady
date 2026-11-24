import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  Filter,
  Eye,
  ShieldCheck,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { Language, ClaimReadinessSummary, IntelligenceFinding, EngineStatus } from '../../types';
import { getTranslation } from '../../translations';
import { SourceViewerModal } from '../SourceViewerModal';

interface EngineAnalysisViewProps {
  currentLang: Language;
  summary: ClaimReadinessSummary;
  onNext: () => void;
  onBack: () => void;
}

export const EngineAnalysisView: React.FC<EngineAnalysisViewProps> = ({
  currentLang,
  summary,
  onNext,
  onBack,
}) => {
  const t = getTranslation(currentLang);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | EngineStatus>('ALL');
  const [activeFindingForModal, setActiveFindingForModal] = useState<IntelligenceFinding | null>(null);

  const findings = summary.findings;

  const filteredFindings = selectedFilter === 'ALL'
    ? findings
    : findings.filter((f) => f.status === selectedFilter);

  const getStatusBadge = (status: EngineStatus) => {
    switch (status) {
      case 'EVIDENCE_FOUND':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t.engineStatuses.EVIDENCE_FOUND}</span>
          </span>
        );
      case 'UNCLEAR':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{t.engineStatuses.UNCLEAR}</span>
          </span>
        );
      case 'CONFLICT':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{t.engineStatuses.CONFLICT}</span>
          </span>
        );
      case 'NOT_FOUND':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <AlertCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span>{t.engineStatuses.NOT_FOUND}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Explainable Guarantee */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-600 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>CORE INNOVATION • EXPLAINABLE MATCHING</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {t.engineStep.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {t.engineStep.subtitle}
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-center shrink-0 min-w-[140px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Paperwork Score
            </span>
            <span className="text-3xl font-extrabold text-white block my-0.5">
              {summary.readinessScore}%
            </span>
            <span className="text-[10px] font-semibold text-blue-300 uppercase">
              {summary.overallReadiness.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Explainability Banner */}
        <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center space-x-2 text-xs text-blue-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.engineStep.explainableGuarantee}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            selectedFilter === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {t.engineStep.filterAll} ({findings.length})
        </button>

        <button
          onClick={() => setSelectedFilter('EVIDENCE_FOUND')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            selectedFilter === 'EVIDENCE_FOUND'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t.engineStep.filterFound} ({summary.evidenceFoundCount})</span>
        </button>

        <button
          onClick={() => setSelectedFilter('UNCLEAR')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            selectedFilter === 'UNCLEAR'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.engineStep.filterUnclear} ({summary.unclearCount})</span>
        </button>

        <button
          onClick={() => setSelectedFilter('CONFLICT')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            selectedFilter === 'CONFLICT'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{t.engineStep.filterConflict} ({summary.conflictCount})</span>
        </button>

        <button
          onClick={() => setSelectedFilter('NOT_FOUND')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            selectedFilter === 'NOT_FOUND'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{t.engineStep.filterNotFound} ({summary.notFoundCount})</span>
        </button>
      </div>

      {/* Findings Cards List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
          >
            {/* Top Row: Category, Title & Status */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>Category: {finding.category}</span>
                  {finding.differenceAmount && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono font-bold">
                      Diff: ₹{finding.differenceAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {finding.requirement}
                </h3>
                <p className="text-xs text-slate-500">
                  <strong>Policy Condition:</strong> {finding.policyCondition}
                </p>
              </div>

              <div className="shrink-0">
                {getStatusBadge(finding.status)}
              </div>
            </div>

            {/* Middle Row: Supporting Evidence & Document Excerpt */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              {/* Supporting Evidence */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-slate-700">Supporting Evidence</span>
                  <span className="font-mono text-[11px] text-blue-700 font-semibold truncate max-w-[200px]">
                    {finding.documentName}
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed font-normal">
                  {finding.supportingEvidence}
                </p>
              </div>

              {/* Exact Text Excerpt */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between text-blue-800">
                  <span className="font-semibold">Extracted Source Excerpt</span>
                  <button
                    onClick={() => setActiveFindingForModal(finding)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{t.engineStep.viewSourceBtn}</span>
                  </button>
                </div>
                <p className="font-mono text-[11px] text-blue-950 italic line-clamp-2">
                  "{finding.pageOrExcerpt}"
                </p>
              </div>
            </div>

            {/* Bottom Row: Explanation & Recommended Action */}
            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
                  Engine Explanation:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {finding.explanation}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] block mb-1">
                  Recommended Next Action:
                </span>
                <p className="text-emerald-950 font-medium leading-relaxed">
                  👉 {finding.recommendedAction}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.wizard.back}</span>
        </button>

        <button
          onClick={onNext}
          className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
        >
          <span>{t.wizard.finish}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Source Viewer Modal */}
      <SourceViewerModal
        finding={activeFindingForModal}
        onClose={() => setActiveFindingForModal(null)}
      />
    </div>
  );
};
