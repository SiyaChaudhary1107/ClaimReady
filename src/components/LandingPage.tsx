import React from 'react';
import {
  Shield,
  ArrowRight,
  Sparkles,
  Lock,
  FileCheck2,
  FileSearch,
  Scale,
  Clock,
  AlertCircle,
  FileText,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Building2,
  UserCheck
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface LandingPageProps {
  currentLang: Language;
  onStartClaim: () => void;
  onLoadDemo: () => void;
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLang,
  onStartClaim,
  onLoadDemo,
  onOpenPrivacy,
}) => {
  const t = getTranslation(currentLang);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {t.hero.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                onClick={onStartClaim}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
              >
                <span>{t.hero.startBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLoadDemo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm flex items-center justify-center space-x-2 transition"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{t.hero.demoBtn}</span>
              </button>
            </div>

            {/* Trust Metrics Ribbon */}
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">{t.hero.stat1}</p>
                  <p className="text-[11px] text-slate-500">{t.hero.stat1Label}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">{t.hero.stat2}</p>
                  <p className="text-[11px] text-slate-500">{t.hero.stat2Label}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">{t.hero.stat3}</p>
                  <p className="text-[11px] text-slate-500">{t.hero.stat3Label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {t.problemSection.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            {t.problemSection.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            {t.problemSection.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {t.problemSection.item1Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.problemSection.item1Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {t.problemSection.item2Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.problemSection.item2Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {t.problemSection.item3Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.problemSection.item3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
              {t.howItWorks.tag}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
              {t.howItWorks.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <span className="text-3xl font-extrabold text-blue-500">01</span>
              <h3 className="text-base font-bold text-white mt-3 mb-2">
                {t.howItWorks.step1Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.howItWorks.step1Desc}
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <span className="text-3xl font-extrabold text-indigo-400">02</span>
              <h3 className="text-base font-bold text-white mt-3 mb-2">
                {t.howItWorks.step2Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.howItWorks.step2Desc}
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <span className="text-3xl font-extrabold text-emerald-400">03</span>
              <h3 className="text-base font-bold text-white mt-3 mb-2">
                {t.howItWorks.step3Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.howItWorks.step3Desc}
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <span className="text-3xl font-extrabold text-purple-400">04</span>
              <h3 className="text-base font-bold text-white mt-3 mb-2">
                {t.howItWorks.step4Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.howItWorks.step4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE INNOVATION & 4 STATUSES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            {t.features.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            {t.features.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Every analysis result is categorized into four distinct, explainable statuses with exact source citations:
          </p>
        </div>

        {/* 4 Statuses Visual Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. EVIDENCE FOUND</span>
              </div>
              <p className="text-[11px] text-emerald-950 leading-relaxed">
                Clear documentary support identified in bills or discharge summary matching the policy clause.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs uppercase mb-1">
                <AlertCircle className="w-4 h-4 text-slate-600" />
                <span>2. NOT FOUND</span>
              </div>
              <p className="text-[11px] text-slate-900 leading-relaxed">
                Required document (such as ultrasound report) missing from reviewed records. Not grounds for rejection.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase mb-1">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>3. UNCLEAR REVIEW</span>
              </div>
              <p className="text-[11px] text-amber-950 leading-relaxed">
                Handwritten prescription or acute emergency clause requiring human verification from the treating doctor.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>4. CONFLICT / INCONSISTENCY</span>
              </div>
              <p className="text-[11px] text-rose-950 leading-relaxed">
                Date difference (e.g. 15-Oct discharge vs 16-Oct cashier receipt) or room rent exceeding 1% cap.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>{t.features.f1Title}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.f1Desc}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{t.features.f2Title}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.f2Desc}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{t.features.f3Title}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.f3Desc}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>{t.features.f4Title}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.f4Desc}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>{t.features.f5Title}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.f5Desc}
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold mb-2">
                1-Click Fictional Sample Case
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Test the complete pipeline instantly with the real-world gig worker case of Ravi Kumar & Shanti Devi.
              </p>
            </div>
            <button
              onClick={onLoadDemo}
              className="mt-4 px-4 py-2 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition w-full text-center"
            >
              Load Demo Case Now
            </button>
          </div>
        </div>
      </section>

      {/* SAMPLE DEMO STORY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700 relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-700">
              SAMPLE DEMONSTRATION STORY
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-4 mb-3">
              Ravi Kumar's Mother's Hospitalization Case
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Ravi is a food delivery gig worker covered under Star Micro Health Shield (₹1.5 Lakh sum insured). His 58-year-old mother Shanti Devi underwent emergency cholecystectomy at Sanjeevani Community Hospital.
            </p>
            <div className="space-y-2 text-xs text-slate-300 mb-8">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Billed: ₹57,100 • Total Paid: ₹57,100 (Advance + Final UPI)</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Engine flags room rent capping: ₹2,200 charged vs ₹1,500 allowed daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-rose-400" />
                <span>Identifies date mismatch: 15-Oct discharge vs 16-Oct billing receipt</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onLoadDemo}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
              >
                Inspect This Sample Case
              </button>
              <button
                onClick={onStartClaim}
                className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition"
              >
                Upload Your Own Documents
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Ready to Prepare Your Insurance Claim?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Upload your policy and hospital papers. See clear findings, verify documents, and download your preparation dossier.
          </p>
          <button
            onClick={onStartClaim}
            className="px-8 py-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/25 transition inline-flex items-center space-x-2"
          >
            <span>Start Claim Preparation Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
