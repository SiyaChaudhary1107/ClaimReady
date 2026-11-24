import React, { useState } from 'react';
import { X, Check, Edit3, ShieldAlert } from 'lucide-react';
import { PolicyData } from '../types';

interface ExtractedReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: PolicyData;
  onSave: (updatedPolicy: PolicyData) => void;
}

export const ExtractedReviewModal: React.FC<ExtractedReviewModalProps> = ({
  isOpen,
  onClose,
  policy,
  onSave,
}) => {
  if (!isOpen) return null;

  const [policyholderName, setPolicyholderName] = useState(policy.policyholderName);
  const [policyNumber, setPolicyNumber] = useState(policy.policyNumber);
  const [insurerName, setInsurerName] = useState(policy.insurerName);
  const [sumInsured, setSumInsured] = useState(policy.sumInsured);
  const [roomRentLimit, setRoomRentLimit] = useState(policy.roomRentLimit);
  const [icuLimit, setIcuLimit] = useState(policy.icuLimit);
  const [ambulanceCover, setAmbulanceCover] = useState(policy.ambulanceCover);

  const handleSave = () => {
    onSave({
      ...policy,
      policyholderName,
      policyNumber,
      insurerName,
      sumInsured,
      roomRentLimit,
      icuLimit,
      ambulanceCover,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Verify / Correct Extracted Policy Terms
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              If our client-side PDF parser misread any character or numbers from a scanned copy, you can update them below before running the intelligence engine.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Policyholder Name</label>
              <input
                type="text"
                value={policyholderName}
                onChange={(e) => setPolicyholderName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Policy Number</label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Insurance Company</label>
              <input
                type="text"
                value={insurerName}
                onChange={(e) => setInsurerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sum Insured (INR)</label>
              <input
                type="number"
                value={sumInsured}
                onChange={(e) => setSumInsured(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Room Rent Sub-limit</label>
              <input
                type="text"
                value={roomRentLimit}
                onChange={(e) => setRoomRentLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ICU Sub-limit</label>
              <input
                type="text"
                value={icuLimit}
                onChange={(e) => setIcuLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ambulance Coverage</label>
              <input
                type="text"
                value={ambulanceCover}
                onChange={(e) => setAmbulanceCover(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center space-x-1.5 transition"
          >
            <Check className="w-4 h-4" />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
