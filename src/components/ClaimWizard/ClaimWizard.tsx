import React, { useState } from 'react';
import { Shield, FileText, CheckCircle2, Sparkles, Download, Layers } from 'lucide-react';
import { Language, PolicyData, MedicalDocument, ClaimReadinessSummary } from '../../types';
import { getTranslation } from '../../translations';
import { PolicyUploadStep } from './PolicyUploadStep';
import { DocumentUploadStep } from './DocumentUploadStep';
import { ReviewStep } from './ReviewStep';
import { EngineAnalysisView } from './EngineAnalysisView';
import { ReportStep } from './ReportStep';
import { runIntelligenceEngine } from '../../services/intelligenceEngine';

interface ClaimWizardProps {
  currentLang: Language;
  policy: PolicyData | null;
  documents: MedicalDocument[];
  summary: ClaimReadinessSummary | null;
  onPolicyChange: (policy: PolicyData) => void;
  onDocumentsChange: (docs: MedicalDocument[]) => void;
  onSummaryChange: (summary: ClaimReadinessSummary) => void;
  onStartNewClaim: () => void;
  onGoToWorkspace: () => void;
}

export const ClaimWizard: React.FC<ClaimWizardProps> = ({
  currentLang,
  policy,
  documents,
  summary,
  onPolicyChange,
  onDocumentsChange,
  onSummaryChange,
  onStartNewClaim,
  onGoToWorkspace,
}) => {
  const t = getTranslation(currentLang);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // When proceeding from Review (Step 3) to Engine (Step 4), automatically run the engine
  const handleRunEngine = () => {
    if (policy) {
      const generatedSummary = runIntelligenceEngine(policy, documents);
      onSummaryChange(generatedSummary);
      setCurrentStep(4);
    }
  };

  const steps = [
    { num: 1, label: t.wizard.step1 },
    { num: 2, label: t.wizard.step2 },
    { num: 3, label: t.wizard.step3 },
    { num: 4, label: t.wizard.step4 },
    { num: 5, label: t.wizard.step5 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Progress Tracker */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px]">
          {steps.map((st, idx) => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;

            return (
              <React.Fragment key={st.num}>
                <button
                  onClick={() => {
                    if (isCompleted || (st.num <= 3 && policy)) {
                      setCurrentStep(st.num);
                    }
                  }}
                  className={`flex items-center space-x-2 text-xs font-bold transition ${
                    isActive
                      ? 'text-blue-600'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : st.num}
                  </span>
                  <span className="hidden sm:inline">{st.label}</span>
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 ${
                      currentStep > idx + 1 ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Views */}
      {currentStep === 1 && (
        <PolicyUploadStep
          currentLang={currentLang}
          policy={policy}
          onPolicyReady={(p) => {
            onPolicyChange(p);
          }}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <DocumentUploadStep
          currentLang={currentLang}
          documents={documents}
          onDocumentsChange={onDocumentsChange}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && policy && (
        <ReviewStep
          currentLang={currentLang}
          policy={policy}
          documents={documents}
          onNext={handleRunEngine}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && summary && (
        <EngineAnalysisView
          currentLang={currentLang}
          summary={summary}
          onNext={() => setCurrentStep(5)}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && summary && policy && (
        <ReportStep
          currentLang={currentLang}
          summary={summary}
          policy={policy}
          documents={documents}
          onStartNewClaim={onStartNewClaim}
          onGoToWorkspace={onGoToWorkspace}
        />
      )}
    </div>
  );
};
