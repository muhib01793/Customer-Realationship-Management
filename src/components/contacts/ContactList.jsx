import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import ContactModal from './ContactModal';
import StatCard from '../common/StatCard';
import {
  Contact2,
  Mail,
  Phone,
  Building2,
  Plus,
  Filter,
  Search,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  ShieldCheck,
  Tag,
  MessageSquare
} from 'lucide-react';

const ContactList = () => {
  const { contacts, addContact, updateContact, deleteContact, customers, searchQuery } = useCrm();

  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCompany = selectedCompany === 'All' || c.company === selectedCompany;
      const matchDept = selectedDepartment === 'All' || c.department === selectedDepartment;

      return matchSearch && matchCompany && matchDept;
    });
  }, [contacts, searchQuery, selectedCompany, selectedDepartment]);

  // Analytics
  const totalContacts = contacts.length;
  const decisionMakers = contacts.filter((c) => c.role === 'Decision Maker' || c.role === 'Signatory').length;
  const companiesCovered = new Set(contacts.map((c) => c.company)).size;

  const handleOpenAdd = () => {
    setContactToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact) => {
    setContactToEdit(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = (formData) => {
    if (contactToEdit) {
      updateContact(contactToEdit.id, formData);
    } else {
      addContact(formData);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove contact "${name}"?`)) {
      deleteContact(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Directory Contacts"
          value={totalContacts}
          change="+8% this quarter"
          isPositive={true}
          icon={Contact2}
          color="indigo"
        />
        <StatCard
          title="Decision Makers / C-Suite"
          value={decisionMakers}
          change="Key stakeholders"
          isPositive={true}
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Accounts Represented"
          value={companiesCovered}
          change="Organizations engaged"
          isPositive={true}
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Avg Contacts per Account"
          value={(totalContacts / (companiesCovered || 1)).toFixed(1)}
          change="Depth of coverage"
          isPositive={true}
          icon={Contact2}
          color="blue"
        />
      </div>

      {/* Control Bar: Filters, Search, View switch, Add button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Companies</option>
            {customers.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Departments</option>
            <option value="Executive / C-Suite">Executive / C-Suite</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
            <option value="Medical Board">Medical Board</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Contacts display */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <Contact2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No Contacts Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add new stakeholders to your address book.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {contact.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {contact.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{contact.title}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {contact.role}
                  </span>
                </div>

                <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{contact.company}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:text-indigo-600 transition truncate">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${contact.phone}`} className="hover:text-indigo-600 transition">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {contact.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Quick Contact & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <a
                    href={`mailto:${contact.email}`}
                    className="p-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-lg transition"
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {contact.phone && (
                    <a
                      href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-lg transition"
                      title="WhatsApp Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(contact)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id, contact.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Company Account</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{c.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{c.title}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{c.company}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{c.department}</div>
                      <div className="text-[11px] font-semibold text-indigo-600">{c.role}</div>
                    </td>
                    <td className="py-3.5 px-4 text-indigo-600 hover:underline">
                      <a href={`mailto:${c.email}`}>{c.email}</a>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{c.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {c.tags?.map((t, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contactToEdit={contactToEdit}
        onSave={handleSaveContact}
      />
    </div>
  );
};

export default ContactList;
