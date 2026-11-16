import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { pipelineStages, salesReps } from '../../data/initialData';
import { useCrm } from '../../context/CrmContext';

const DealModal = ({ isOpen, onClose, dealToEdit, onSave }) => {
  const { customers } = useCrm();

  const [formData, setFormData] = useState({
    title: '',
    customerId: '',
    customerName: '',
    amount: '',
    stage: 'lead',
    probability: 50,
    expectedCloseDate: '',
    priority: 'Medium',
    assignedRep: salesReps[0],
    notes: '',
  });

  useEffect(() => {
    if (dealToEdit) {
      setFormData(dealToEdit);
    } else {
      setFormData({
        title: '',
        customerId: customers[0]?.id || '',
        customerName: customers[0]?.name || '',
        amount: '',
        stage: 'lead',
        probability: 50,
        expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'Medium',
        assignedRep: salesReps[0],
        notes: '',
      });
    }
  }, [dealToEdit, isOpen, customers]);

  const handleCustomerChange = (e) => {
    const custId = e.target.value;
    const cust = customers.find((c) => c.id === custId);
    setFormData({
      ...formData,
      customerId: custId,
      customerName: cust ? cust.name : '',
    });
  };

  const handleStageChange = (e) => {
    const newStage = e.target.value;
    let prob = formData.probability;
    if (newStage === 'lead') prob = 20;
    else if (newStage === 'qualified') prob = 40;
    else if (newStage === 'proposal') prob = 60;
    else if (newStage === 'negotiation') prob = 80;
    else if (newStage === 'won') prob = 100;
    else if (newStage === 'lost') prob = 0;

    setFormData({
      ...formData,
      stage: newStage,
      probability: prob,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dealToEdit ? 'Edit Pipeline Deal' : 'Add New Deal to Pipeline'}
      subtitle="Track deal value, stage progression, and probability"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Enterprise Cloud ERP Migration"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Related Customer Account</label>
            <select
              value={formData.customerId}
              onChange={handleCustomerChange}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Amount ($ USD) *</label>
            <input
              type="number"
              min="0"
              required
              placeholder="e.g. 50000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Stage</label>
            <select
              value={formData.stage}
              onChange={handleStageChange}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              {pipelineStages.map((stg) => (
                <option key={stg.id} value={stg.id}>{stg.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Win Probability ({formData.probability}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
              className="w-full mt-2 accent-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Close Date</label>
            <input
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Sales Representative</label>
            <select
              value={formData.assignedRep}
              onChange={(e) => setFormData({ ...formData, assignedRep: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              {salesReps.map((rep) => (
                <option key={rep} value={rep}>{rep}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Strategy & Notes</label>
          <textarea
            rows="3"
            placeholder="Key decision drivers, competitors, or closing requirements..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          ></textarea>
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
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-500/20 transition cursor-pointer"
          >
            {dealToEdit ? 'Update Deal' : 'Add Deal to Pipeline'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DealModal;
