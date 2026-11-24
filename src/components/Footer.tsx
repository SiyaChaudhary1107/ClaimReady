import React from 'react';
import { Shield, Lock, FileCheck, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface FooterProps {
  currentLang: Language;
  onOpenPrivacy: () => void;
  onNavigate: (view: 'landing' | 'workspace' | 'wizard' | 'assistant') => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onOpenPrivacy, onNavigate }) => {
  const t = getTranslation(currentLang);

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                CLAIM<span className="text-blue-400">READY</span>
              </span>
            </div>
            <p className="text-slate-300 text-sm max-w-md leading-relaxed">
              {t.brand.tagline}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Designed for low-income households, platform gig workers, rural families, and first-time policyholders under the Microsoft Hackathon problem statement: <span className="text-slate-200 font-medium">Micro-Insurance Claim Settlement Assistance</span>.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Server Transmission • 100% Client-Side Sandbox</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('workspace')} className="hover:text-white transition">
                  {t.nav.dashboard}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition">
                  Evidence-to-Policy Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assistant')} className="hover:text-white transition">
                  {t.nav.assistant}
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-white transition">
                  {t.nav.privacy}
                </button>
              </li>
            </ul>
          </div>

          {/* Responsible AI Notice */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Responsible AI Guarantee
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              CLAIMREADY never invents policy clauses, document fields, or fake findings. If information cannot be confidently extracted, it is flagged as Unclear for manual review.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800">
              <p className="text-[11px] text-slate-500">
                Does NOT predict claim approval or replace official TPA assessment.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} CLAIMREADY. Built with React, TypeScript & Tailwind CSS for Microsoft Hackathon.
          </p>
          <div className="flex items-center space-x-4 mt-3 md:mt-0">
            <span className="text-slate-400">English • हिंदी • ਪੰਜਾਬੀ • বাংলা</span>
            <button onClick={onOpenPrivacy} className="hover:text-slate-300 underline">
              Privacy & Safeguards
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
