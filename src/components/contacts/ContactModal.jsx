import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useCrm } from '../../context/CrmContext';

const departmentsList = [
  'Executive / C-Suite',
  'Engineering & Tech',
  'Operations',
  'Procurement',
  'Finance & Accounting',
  'Sales & Marketing',
  'Legal & Compliance'
];

const rolesList = [
  'Decision Maker',
  'Signatory',
  'Influencer',
  'Champion / Advocate',
  'Technical Evaluator',
  'Billing Contact'
];

const ContactModal = ({ isOpen, onClose, contactToEdit, onSave }) => {
  const { customers } = useCrm();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: customers[0]?.name || '',
    customerId: customers[0]?.id || '',
    email: '',
    phone: '',
    department: departmentsList[0],
    role: rolesList[0],
    status: 'Active',
    tags: '',
    notes: '',
  });

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        ...contactToEdit,
        tags: Array.isArray(contactToEdit.tags) ? contactToEdit.tags.join(', ') : contactToEdit.tags || '',
      });
    } else {
      setFormData({
        name: '',
        title: '',
        company: customers[0]?.name || '',
        customerId: customers[0]?.id || '',
        email: '',
        phone: '',
        department: departmentsList[0],
        role: rolesList[0],
        status: 'Active',
        tags: 'VIP, Key Contact',
        notes: '',
      });
    }
  }, [contactToEdit, isOpen, customers]);

  const handleCompanyChange = (e) => {
    const custId = e.target.value;
    const cust = customers.find((c) => c.id === custId);
    setFormData({
      ...formData,
      customerId: custId,
      company: cust ? cust.name : '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const formattedTags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : formData.tags;

    onSave({
      ...formData,
      tags: formattedTags,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contactToEdit ? 'Edit Contact Person' : 'Add New Contact'}
      subtitle="Directory of account stakeholders and decision makers"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kamran Ahmed"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              placeholder="e.g. VP of Engineering"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Linked Customer Account</label>
            <select
              value={formData.customerId}
              onChange={handleCompanyChange}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              {departmentsList.map((dep) => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="contact@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+92 300 0000000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Organizational Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            >
              {rolesList.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="VIP, Technical, Decision Maker"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Preferences & Notes</label>
          <textarea
            rows="3"
            placeholder="Communication preferences, best time to reach, background notes..."
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
            {contactToEdit ? 'Save Changes' : 'Add Contact'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactModal;
