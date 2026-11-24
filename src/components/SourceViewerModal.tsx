import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { IntelligenceFinding } from '../types';

interface SourceViewerModalProps {
  finding: IntelligenceFinding | null;
  onClose: () => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({ finding, onClose }) => {
  if (!finding) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EVIDENCE_FOUND':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>EVIDENCE FOUND</span>
          </span>
        );
      case 'UNCLEAR':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>UNCLEAR — HUMAN REVIEW REQUIRED</span>
          </span>
        );
      case 'CONFLICT':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>CONFLICT DETECTED — VERIFY SOURCE RECORDS</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>NOT FOUND IN REVIEWED DOCUMENTS</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold tracking-tight text-white">
              Source Evidence Inspector
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Finding Title & Status */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category: {finding.category}
              </span>
              {getStatusBadge(finding.status)}
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {finding.requirement}
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              <strong className="text-slate-800">Policy Condition:</strong> {finding.policyCondition}
            </p>
          </div>

          {/* Document & Excerpt Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Source File: {finding.documentName}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono">
                Verified Excerpt
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              "{finding.pageOrExcerpt}"
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              Intelligence Engine Explanation
            </h5>
            <p className="text-xs text-blue-950 leading-relaxed">
              {finding.explanation}
            </p>
          </div>

          {/* Recommended Next Action */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Recommended Next Action for Policyholder
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              👉 {finding.recommendedAction}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
