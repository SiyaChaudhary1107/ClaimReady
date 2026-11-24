import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  Bot,
  HelpCircle
} from 'lucide-react';
import { Language, PolicyData, MedicalDocument, IntelligenceFinding, AssistantMessage } from '../types';
import { getTranslation } from '../translations';
import { answerUserQuestion } from '../services/assistantService';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  policy: PolicyData | null;
  documents: MedicalDocument[];
  findings: IntelligenceFinding[];
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentLang,
  policy,
  documents,
  findings,
}) => {
  if (!isOpen) return null;
  const t = getTranslation(currentLang);

  const initialWelcome: AssistantMessage = {
    id: 'welcome',
    sender: 'assistant',
    text:
      currentLang === 'hi'
        ? 'नमस्ते! मैं आपका CLAIMREADY सहायक हूँ। आप अपनी पॉलिसी की शर्तों, अस्पताल के बिलों की विसंगतियों या गायब दस्तावेजों के बारे में मुझसे पूछ सकते हैं। मैं केवल आपके दस्तावेज़ों के आधार पर जवाब दूंगा।'
        : currentLang === 'pa'
        ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ CLAIMREADY ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਆਪਣੀ ਪਾਲਿਸੀ ਨਿਯਮਾਂ, ਹਸਪਤਾਲ ਦੇ ਬਿੱਲਾਂ ਜਾਂ ਗਾਇਬ ਕਾਗਜ਼ਾਂ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।'
        : currentLang === 'bn'
        ? 'নমস্কার! আমি আপনার CLAIMREADY সহকারী। আপনার পলিসির শর্তাবলী, হাসপাতালের বিলের অসঙ্গতি বা অনুপস্থিত নথি সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞাসা করতে পারেন।'
        : 'Hello! I am your CLAIMREADY assistant. I can answer questions regarding your policy clauses, hospital bills, date inconsistencies, or missing documents strictly grounded in your uploaded records.',
    timestamp: 'Just now',
    suggestedQuestions: [
      t.assistant.chip1,
      t.assistant.chip2,
      t.assistant.chip3,
      t.assistant.chip4,
      t.assistant.chip5,
    ],
  };

  const [messages, setMessages] = useState<AssistantMessage[]>([initialWelcome]);
  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend?: string) => {
    const question = (textToSend || inputText).trim();
    if (!question) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantAnswer = answerUserQuestion(question, policy, documents, findings, currentLang);

    setMessages((prev) => [...prev, userMsg, assistantAnswer]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.assistant.title}
              </h3>
              <p className="text-[10px] text-slate-300">
                Grounded in your policy & documents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsible AI Notice Header */}
        <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center space-x-2 text-[11px] text-indigo-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{t.assistant.noHallucinationNote}</span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Grounded Sources */}
                {msg.groundedSources && msg.groundedSources.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 text-[10px] space-y-1">
                    <span className="font-bold text-indigo-700 block uppercase tracking-wider">
                      Grounded Citations:
                    </span>
                    {msg.groundedSources.map((src, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-slate-600">
                        <FileText className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="font-mono">{src.documentName}: {src.pageOrExcerpt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>

              {/* Suggested Follow-ups */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-2 space-y-1.5 w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Suggested Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[11px] font-medium transition text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.assistant.inputPlaceholder}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
