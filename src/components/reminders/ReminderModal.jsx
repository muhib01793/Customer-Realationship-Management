import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { salesReps } from '../../data/initialData';
import { useCrm } from '../../context/CrmContext';

const reminderTypes = [
  'Call',
  'Meeting',
  'Email',
  'Follow-up',
  'Task',
  'Contract Review'
];

const ReminderModal = ({ isOpen, onClose, reminderToEdit, onSave }) => {
  const { customers, deals, leads } = useCrm();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Call',
    relatedTo: customers[0]?.name || '',
    relatedType: 'Customer',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '11:00',
    priority: 'High',
    assignedRep: salesReps[0],
    notes: '',
  });

  useEffect(() => {
    if (reminderToEdit) {
      setFormData(reminderToEdit);
    } else {
      setFormData({
        title: '',
        type: 'Call',
        relatedTo: customers[0]?.name || '',
        relatedType: 'Customer',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '11:00',
        priority: 'High',
        assignedRep: salesReps[0],
        notes: '',
      });
    }
  }, [reminderToEdit, isOpen, customers]);

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
      title={reminderToEdit ? 'Edit Follow-up Reminder' : 'Schedule New Follow-up'}
      subtitle="Ensure timely client engagement and task completion"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder / Task Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Contract Review Call with Alpha Corp"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              {reminderTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              <option value="High">High (Urgent)</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date *</label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Due Time</label>
            <input
              type="time"
              value={formData.dueTime}
              onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Related Entity Type</label>
            <select
              value={formData.relatedType}
              onChange={(e) => setFormData({ ...formData, relatedType: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              <option value="Customer">Customer Account</option>
              <option value="Deal">Pipeline Deal</option>
              <option value="Lead">Marketing Lead</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Related To (Name)</label>
            <input
              type="text"
              placeholder="e.g. Alpha Corp Solutions"
              value={formData.relatedTo}
              onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Sales Agent</label>
            <select
              value={formData.assignedRep}
              onChange={(e) => setFormData({ ...formData, assignedRep: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              {salesReps.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Instructions</label>
          <textarea
            rows="3"
            placeholder="Meeting agendas, talking points, files to send..."
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
            {reminderToEdit ? 'Update Reminder' : 'Set Reminder'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReminderModal;
