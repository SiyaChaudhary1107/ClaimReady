import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, currentLang }) => {
  if (!isOpen) return null;
  const t = getTranslation(currentLang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/50 flex items-center justify-center text-blue-300 border border-blue-400/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.privacyModal.title}
              </h3>
              <p className="text-xs text-blue-200">
                {t.privacyModal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-600">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {t.privacyModal.p1}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start space-x-3">
            <EyeOff className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              {t.privacyModal.p2}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
            <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              {t.privacyModal.p3}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-800 leading-relaxed font-semibold">
              {t.privacyModal.p4}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">Architecture Highlights for Hackathon Jury:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>WebAssembly client extraction via PDF.js worker in browser memory.</li>
              <li>Pure client-side Tesseract.js engine for OCR of image receipts and prescriptions.</li>
              <li>Explainable, deterministic rule engine (no black-box or hallucinated responses).</li>
              <li>All session data is easily wiped with the 1-click Reset button.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            {t.privacyModal.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
