import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileSearch,
  Plus
} from 'lucide-react';
import { Language, MedicalDocument, DocumentType } from '../../types';
import { getTranslation } from '../../translations';
import { extractTextFromPdf } from '../../services/pdfExtractor';
import { extractTextFromImage } from '../../services/ocrService';
import { parseMedicalDocument } from '../../services/medicalDocParser';
import { sampleMedicalDocuments } from '../../sampleData/fictionalClaim';

interface DocumentUploadStepProps {
  currentLang: Language;
  documents: MedicalDocument[];
  onDocumentsChange: (docs: MedicalDocument[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  currentLang,
  documents,
  onDocumentsChange,
  onNext,
  onBack,
}) => {
  const t = getTranslation(currentLang);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [ocrProgress, setOcrProgress] = useState<number>(0);

  // Handle Multi-file Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newDocs: MedicalDocument[] = [...documents];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      const isImage = /\.(jpe?g|png)$/i.test(file.name);

      setProcessingStatus(`Analyzing ${file.name} (${i + 1}/${files.length})...`);

      try {
        let extractedText = '';
        let isHandwritten = false;

        if (isPdf) {
          const pdfRes = await extractTextFromPdf(file);
          extractedText = pdfRes.fullText;
        } else if (isImage) {
          setProcessingStatus(`Running OCR on image ${file.name}...`);
          const ocrRes = await extractTextFromImage(file, (prog, stat) => {
            setOcrProgress(prog);
            setProcessingStatus(`OCR: ${stat} (${prog}%)`);
          });
          extractedText = ocrRes.text;
          isHandwritten = ocrRes.isLikelyHandwritten;
        } else {
          extractedText = await file.text();
        }

        const docId = `doc-${Date.now()}-${i}`;
        const parsedDoc = parseMedicalDocument(
          docId,
          file.name,
          file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
          file.size,
          extractedText,
          isHandwritten
        );

        newDocs.push(parsedDoc);
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
      }
    }

    onDocumentsChange(newDocs);
    setIsProcessing(false);
    setProcessingStatus('');
    setOcrProgress(0);
  };

  // Remove a document
  const handleRemove = (id: string) => {
    onDocumentsChange(documents.filter((d) => d.id !== id));
  };

  // Load sample documents
  const handleLoadSampleDocs = () => {
    setIsProcessing(true);
    setProcessingStatus('Loading sample hospital records...');
    setTimeout(() => {
      onDocumentsChange(sampleMedicalDocuments);
      setIsProcessing(false);
      setProcessingStatus('');
    }, 400);
  };

  const getDocTypeColor = (type: DocumentType) => {
    switch (type) {
      case 'DISCHARGE_SUMMARY':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'HOSPITAL_BILL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PAYMENT_RECEIPT':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'PRESCRIPTION':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'DIAGNOSTIC_REPORT':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.docsStep.title}
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          {t.docsStep.desc}
        </p>
      </div>

      {/* Upload Zone & Demo Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Dropzone */}
        <div className="lg:col-span-2">
          <label className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition text-center group">
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            {isProcessing ? (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-xs font-bold text-slate-800">{processingStatus}</p>
                {ocrProgress > 0 && (
                  <div className="w-48 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${ocrProgress}%` }}
                    ></div>
                  </div>
                )}
                <p className="text-[11px] text-slate-500">Extracting text & classifying document type in browser...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {t.docsStep.dropzone}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Upload Hospital Bill, Discharge Summary, Prescription, Receipts (PDF, JPG, PNG)
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Demo Documents Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Sample Medical Records</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Sanjeevani Hospital Records
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Load 4 fictional hospital records for Shanti Devi: Discharge summary, ₹57,100 itemized bill, advance & settlement receipts, and doctor prescription note.
            </p>
          </div>
          <button
            onClick={handleLoadSampleDocs}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.docsStep.loadDemoDocs}</span>
          </button>
        </div>
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              {t.docsStep.uploadedList} ({documents.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Classified via Client-Side Intelligence
            </span>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
              >
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {doc.fileName}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                      <span className={`px-2 py-0.5 rounded-full font-bold border ${getDocTypeColor(doc.classifiedType)}`}>
                        {doc.classifiedType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-500">
                        {Math.round(doc.confidence * 100)}% confidence
                      </span>
                      {doc.billAmount && (
                        <span className="font-semibold text-slate-800">
                          • Billed: ₹{doc.billAmount.toLocaleString('en-IN')}
                        </span>
                      )}
                      {doc.paymentAmount && (
                        <span className="font-semibold text-emerald-700">
                          • Paid: ₹{doc.paymentAmount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Review warning if handwritten or low confidence */}
                    {doc.manualReviewFlag && (
                      <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-amber-700 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Handwriting or low confidence detected. Flagged for review.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 shrink-0">
                  <button
                    onClick={() => handleRemove(doc.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title={t.docsStep.remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {documents.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t.docsStep.noDocsWarning}</span>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.wizard.back}</span>
        </button>

        <button
          onClick={onNext}
          disabled={documents.length === 0}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{t.wizard.continue}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
