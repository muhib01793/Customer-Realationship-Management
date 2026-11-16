import React, { useState } from 'react';
import Modal from '../common/Modal';
import { ArrowRight, CheckCircle2, Building2, Briefcase, UserCheck } from 'lucide-react';

const ConvertLeadModal = ({ isOpen, onClose, lead, onConvert }) => {
  if (!lead) return null;

  const [dealTitle, setDealTitle] = useState(`${lead.company || lead.fullName} - Project Agreement`);
  const [dealAmount, setDealAmount] = useState(lead.estimatedValue || 25000);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConvert(lead.id, Number(dealAmount), dealTitle);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Convert Lead to Customer & Deal"
      subtitle={`Transforming "${lead.fullName}" into an active client relationship`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Conversion steps preview */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs space-y-2.5">
          <span className="font-bold text-indigo-950 block">This action will automatically:</span>
          
          <div className="flex items-center space-x-2 text-indigo-900">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Create new Customer: <strong>{lead.company || `${lead.fullName}'s Company`}</strong></span>
          </div>

          <div className="flex items-center space-x-2 text-indigo-900">
            <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Add Contact stakeholder: <strong>{lead.fullName} ({lead.title || 'Lead'})</strong></span>
          </div>

          <div className="flex items-center space-x-2 text-indigo-900">
            <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Open Pipeline Deal in <strong>"Qualified"</strong> stage</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Title</label>
          <input
            type="text"
            required
            value={dealTitle}
            onChange={(e) => setDealTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Deal Value ($ USD)</label>
          <input
            type="number"
            min="0"
            required
            value={dealAmount}
            onChange={(e) => setDealAmount(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 flex items-center space-x-1.5 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Conversion</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ConvertLeadModal;
