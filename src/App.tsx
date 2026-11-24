import React, { useState, useEffect } from 'react';
import { Language, PolicyData, MedicalDocument, ClaimReadinessSummary } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { WorkspaceDashboard } from './components/WorkspaceDashboard';
import { ClaimWizard } from './components/ClaimWizard/ClaimWizard';
import { AssistantDrawer } from './components/AssistantDrawer';
import { PrivacyModal } from './components/PrivacyModal';
import { samplePolicyData, sampleMedicalDocuments, sampleReadinessSummary } from './sampleData/fictionalClaim';
import { generateClaimReportPdf } from './services/reportGenerator';

export function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('claimready_lang') as Language) || 'en';
  });

  const [activeView, setActiveView] = useState<'landing' | 'workspace' | 'wizard' | 'assistant'>('landing');
  const [policy, setPolicy] = useState<PolicyData | null>(null);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [summary, setSummary] = useState<ClaimReadinessSummary | null>(null);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Sync language with localStorage
  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('claimready_lang', lang);
  };

  // 1-Click Load Demo Sample Claim (Ravi Kumar)
  const handleLoadSample = () => {
    setPolicy(samplePolicyData);
    setDocuments(sampleMedicalDocuments);
    setSummary(sampleReadinessSummary);
    setIsDemoActive(true);
    setActiveView('wizard');
  };

  // Start a fresh claim
  const handleStartNewClaim = () => {
    setPolicy(null);
    setDocuments([]);
    setSummary(null);
    setIsDemoActive(false);
    setActiveView('wizard');
  };

  // Reset all session data
  const handleResetAll = () => {
    setPolicy(null);
    setDocuments([]);
    setSummary(null);
    setIsDemoActive(false);
    localStorage.removeItem('claimready_lang');
    setActiveView('landing');
  };

  // Download PDF Report
  const handleDownloadReport = () => {
    if (summary && policy) {
      const doc = generateClaimReportPdf(summary, policy, documents);
      doc.save(`CLAIMREADY_Dossier_${summary.claimReference}.pdf`);
    } else {
      // If no claim is active, load demo and download
      const doc = generateClaimReportPdf(sampleReadinessSummary, samplePolicyData, sampleMedicalDocuments);
      doc.save(`CLAIMREADY_Dossier_SAMPLE.pdf`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Sticky Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'assistant') {
            setIsAssistantOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onLoadSample={handleLoadSample}
        onReset={handleResetAll}
        isDemoActive={isDemoActive}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            currentLang={currentLang}
            onStartClaim={handleStartNewClaim}
            onLoadDemo={handleLoadSample}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}

        {activeView === 'workspace' && (
          <WorkspaceDashboard
            currentLang={currentLang}
            summary={summary}
            policy={policy}
            documents={documents}
            onStartNewClaim={handleStartNewClaim}
            onLoadDemo={handleLoadSample}
            onContinueWorkflow={() => setActiveView('wizard')}
            onDownloadReport={handleDownloadReport}
            onReset={handleResetAll}
          />
        )}

        {activeView === 'wizard' && (
          <ClaimWizard
            currentLang={currentLang}
            policy={policy}
            documents={documents}
            summary={summary}
            onPolicyChange={(p) => setPolicy(p)}
            onDocumentsChange={(docs) => setDocuments(docs)}
            onSummaryChange={(s) => setSummary(s)}
            onStartNewClaim={handleStartNewClaim}
            onGoToWorkspace={() => setActiveView('workspace')}
          />
        )}
      </main>

      {/* Grounded Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentLang={currentLang}
        policy={policy}
        documents={documents}
        findings={summary?.findings || []}
      />

      {/* Privacy and Responsible AI Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        currentLang={currentLang}
      />

      {/* Persistent Footer */}
      <Footer
        currentLang={currentLang}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onNavigate={(view) => {
          if (view === 'assistant') {
            setIsAssistantOpen(true);
          } else {
            setActiveView(view);
          }
        }}
      />
    </div>
  );
}

export default App;
