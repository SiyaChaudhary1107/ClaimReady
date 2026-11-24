import React from 'react';
import { Shield, Globe, Lock, RotateCcw, Sparkles, FolderKanban, MessageSquare } from 'lucide-react';
import { Language } from '../types';
import { getTranslation, languageNames } from '../translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: 'landing' | 'workspace' | 'wizard' | 'assistant';
  onNavigate: (view: 'landing' | 'workspace' | 'wizard' | 'assistant') => void;
  onOpenPrivacy: () => void;
  onLoadSample: () => void;
  onReset: () => void;
  isDemoActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeView,
  onNavigate,
  onOpenPrivacy,
  onLoadSample,
  onReset,
  isDemoActive,
}) => {
  const t = getTranslation(currentLang);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro-banner for privacy and hackathon statement */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
              MICRO-INSURANCE HACKATHON
            </span>
            <span className="hidden sm:inline text-slate-400">
              • {t.brand.privacyNotice}
            </span>
          </div>
          {isDemoActive && (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950 text-amber-300 border border-amber-800">
                ⭐ {t.demoBanner.active} (Ravi Kumar)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                CLAIM<span className="text-blue-600">READY</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              {t.brand.tagline}
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeView === 'landing'
                ? 'text-blue-600 bg-blue-50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
              activeView === 'workspace'
                ? 'text-blue-600 bg-blue-50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>{t.nav.dashboard}</span>
          </button>
          <button
            onClick={() => onNavigate('assistant')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
              activeView === 'assistant'
                ? 'text-blue-600 bg-blue-50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span>{t.nav.assistant}</span>
          </button>
          <button
            onClick={onOpenPrivacy}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center space-x-1"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.nav.privacy}</span>
          </button>
        </nav>

        {/* Actions & Language Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Load Demo Claim Button */}
          <button
            onClick={onLoadSample}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
            title="Load fictional gig-worker claim for live demonstration"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.nav.loadSample}</span>
          </button>

          {/* Start New Claim Action */}
          <button
            onClick={() => onNavigate('wizard')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <span>{t.nav.newClaim}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative inline-block text-left">
            <div className="flex items-center border border-slate-200 rounded-lg bg-white px-2 py-1 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="text-xs font-medium bg-transparent text-slate-800 focus:outline-none cursor-pointer pr-1"
                aria-label={t.nav.language}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>

          {/* Reset Workspace Button */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title={t.nav.reset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
