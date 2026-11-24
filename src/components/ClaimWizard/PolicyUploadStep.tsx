import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Sparkles, Edit3, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Language, PolicyData } from '../../types';
import { getTranslation } from '../../translations';
import { extractTextFromPdf } from '../../services/pdfExtractor';
import { parsePolicyDocument } from '../../services/policyParser';
import { samplePolicyData } from '../../sampleData/fictionalClaim';
import { ExtractedReviewModal } from '../ExtractedReviewModal';

interface PolicyUploadStepProps {
  currentLang: Language;
  policy: PolicyData | null;
  onPolicyReady: (policy: PolicyData) => void;
  onNext: () => void;
}

export const PolicyUploadStep: React.FC<PolicyUploadStepProps> = ({
  currentLang,
  policy,
  onPolicyReady,
  onNext,
}) => {
  const t = getTranslation(currentLang);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Handle Real File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please upload a PDF file for your policy schedule.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);

      const pdfResult = await extractTextFromPdf(file);
      const parsedPolicy = parsePolicyDocument(pdfResult);

      onPolicyReady(parsedPolicy);
    } catch (err: any) {
      console.error('Error parsing policy PDF:', err);
      setErrorMsg('Unable to parse this PDF. Try uploading another PDF or use the sample policy.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Load Sample Policy
  const handleLoadSample = () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setTimeout(() => {
      onPolicyReady(samplePolicyData);
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Step Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.policyStep.title}
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          {t.policyStep.desc}
        </p>
      </div>

      {/* Upload Zone & Demo Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Dropzone */}
        <div className="lg:col-span-2">
          <label className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition text-center group">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            {isProcessing ? (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-xs font-bold text-slate-800">{t.policyStep.analyzing}</p>
                <p className="text-[11px] text-slate-500">PDF.js is extracting clauses in browser memory...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {t.policyStep.dropzone}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {t.policyStep.supportedFormats}
                  </p>
                </div>
              </div>
            )}
          </label>

          {errorMsg && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Demo Policy Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Fictional Gig Worker Policy</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Star Micro Health Shield
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Explore with the pre-loaded micro-insurance schedule for Ravi Kumar (Sum Insured: ₹1,50,000, 1% room rent limit, 24-month waiting periods).
            </p>
          </div>
          <button
            onClick={handleLoadSample}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.policyStep.loadDemoPolicy}</span>
          </button>
        </div>
      </div>

      {/* Extracted Policy Results Preview */}
      {policy && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.policyStep.extractedTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.policyStep.extractedDesc}
              </p>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.policyStep.editBtn}</span>
            </button>
          </div>

          {/* Key Policy Terms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-500 block mb-1">{t.policyStep.holder}</span>
              <span className="font-bold text-slate-900 text-sm">{policy.policyholderName}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ Verified from schedule</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-500 block mb-1">{t.policyStep.policyNum}</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{policy.policyNumber}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ Verified from Page 1</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-500 block mb-1">{t.policyStep.sumInsured}</span>
              <span className="font-bold text-slate-900 text-sm">₹{policy.sumInsured.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Floater / Individual cover</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-500 block mb-1">{t.policyStep.roomRent}</span>
              <span className="font-bold text-slate-900">{policy.roomRentLimit}</span>
              <span className="text-[10px] text-amber-600 font-medium block mt-1">Sub-limit applies</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-500 block mb-1">{t.policyStep.icuLimit}</span>
              <span className="font-bold text-slate-900">{policy.icuLimit}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-500 block mb-1">{t.policyStep.ambulance}</span>
              <span className="font-bold text-slate-900">{policy.ambulanceCover}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
              <span className="font-semibold text-slate-500 block mb-1">{t.policyStep.period}</span>
              <span className="font-bold text-slate-900">
                {policy.policyPeriod.from} to {policy.policyPeriod.to}
              </span>
            </div>
          </div>

          {/* Waiting Periods & Exclusions Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                {t.policyStep.waitingPeriods} ({policy.waitingPeriods.length})
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {policy.waitingPeriods.map((wp, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <span>
                      <strong>{wp.condition}:</strong> {wp.periodMonths} month(s)
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                {t.policyStep.exclusions} ({policy.exclusions.length})
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {policy.exclusions.map((ex, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <span>{ex.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Continue Action */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
            >
              <span>{t.policyStep.verifyBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {policy && (
        <ExtractedReviewModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          policy={policy}
          onSave={(updated) => onPolicyReady(updated)}
        />
      )}
    </div>
  );
};
