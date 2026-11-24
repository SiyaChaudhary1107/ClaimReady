import React from 'react';
import {
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  Calendar,
  CreditCard,
  User,
  Activity,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Language, PolicyData, MedicalDocument } from '../../types';
import { getTranslation } from '../../translations';

interface ReviewStepProps {
  currentLang: Language;
  policy: PolicyData;
  documents: MedicalDocument[];
  onNext: () => void;
  onBack: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  currentLang,
  policy,
  documents,
  onNext,
  onBack,
}) => {
  const t = getTranslation(currentLang);

  const dischargeDoc = documents.find((d) => d.classifiedType === 'DISCHARGE_SUMMARY');
  const billDoc = documents.find((d) => d.classifiedType === 'HOSPITAL_BILL');
  const receiptDocs = documents.filter((d) => d.classifiedType === 'PAYMENT_RECEIPT');
  const rxDoc = documents.find((d) => d.classifiedType === 'PRESCRIPTION');

  const patientName = dischargeDoc?.patientName || billDoc?.patientName || 'Shanti Devi';
  const hospitalName = dischargeDoc?.hospitalName || billDoc?.hospitalName || 'Sanjeevani Community Hospital';
  const admissionDate = dischargeDoc?.admissionDate || billDoc?.admissionDate || '12-Oct-2024';
  const dischargeDate = dischargeDoc?.dischargeDate || billDoc?.dischargeDate || '15-Oct-2024';
  const diagnosis = dischargeDoc?.diagnosis || 'Acute Calculous Cholecystitis with Sepsis';
  const doctorName = dischargeDoc?.doctorName || rxDoc?.doctorName || 'Dr. Anand Verma, MS';

  const totalBilled = documents
    .filter((d) => d.classifiedType === 'HOSPITAL_BILL')
    .reduce((sum, d) => sum + (d.billAmount || 0), 0) || 57100;

  const totalPaid = documents
    .filter((d) => d.classifiedType === 'PAYMENT_RECEIPT')
    .reduce((sum, d) => sum + (d.paymentAmount || 0), 0) || 57100;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.reviewStep.title}
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          {t.reviewStep.desc}
        </p>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Patient & Hospital Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {t.reviewStep.patientHospital}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Patient Name:</span>
              <span className="font-bold text-slate-900">{patientName}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Hospital Name:</span>
              <span className="font-bold text-slate-900 text-right">{hospitalName}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium block">Admission:</span>
                <span className="font-bold text-slate-900">{admissionDate}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium block">Discharge:</span>
                <span className="font-bold text-slate-900">{dischargeDate}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium block mb-1">Diagnosed Ailment:</span>
              <span className="font-bold text-slate-900 leading-relaxed block">{diagnosis}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Treating Doctor:</span>
              <span className="font-bold text-slate-900 ml-2">{doctorName}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Financial & Billing Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {t.reviewStep.financialDetails}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Final Invoice Total:</span>
              <span className="font-extrabold text-slate-900 text-sm">
                ₹{totalBilled.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-800 font-medium">Payment Proof Total:</span>
              <span className="font-extrabold text-emerald-900 text-sm">
                ₹{totalPaid.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-700 font-bold block">Policy Caps to Check Against:</span>
              <div className="flex justify-between text-slate-600">
                <span>Sum Insured:</span>
                <span className="font-semibold text-slate-800">₹{policy.sumInsured.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Room Rent Cap (1%):</span>
                <span className="font-semibold text-slate-800">{policy.roomRentLimit}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ambulance Capping:</span>
                <span className="font-semibold text-slate-800">{policy.ambulanceCover}</span>
              </div>
            </div>

            {/* Inconsistency note preview */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-2 text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Room tariff in bill (₹2,200/day) exceeds 1% policy cap (₹1,500/day). The Intelligence Engine will analyze proportionate deductions.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription / Clinical Notes Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
          <Activity className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-900">
            {t.reviewStep.medicalDetails}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-700 block mb-1">Prescription Legibility</span>
            {rxDoc?.manualReviewFlag ? (
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Handwritten notes detected on prescription (Line 3: pain medication). Flagged for human review.
              </p>
            ) : (
              <p className="text-emerald-700 text-[11px] leading-relaxed">
                Prescription medications read with high confidence.
              </p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-700 block mb-1">Investigation Reports</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Discharge summary references an Ultrasound done on 12-Oct-2024. Engine will verify if the standalone film/report is uploaded.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button to run engine */}
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
          className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition flex items-center space-x-2.5 transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.reviewStep.runEngineBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
