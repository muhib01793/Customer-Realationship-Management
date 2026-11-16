import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { StatusBadge } from '../common/Badge';
import StatCard from '../common/StatCard';
import LeadModal from './LeadModal';
import ConvertLeadModal from './ConvertLeadModal';
import { leadSources, salesReps } from '../../data/initialData';
import {
  Target,
  UserPlus,
  Mail,
  Phone,
  Flame,
  Plus,
  Filter,
  CheckCircle,
  ArrowRightCircle,
  Edit2,
  Trash2,
  Building2,
  Sparkles
} from 'lucide-react';

const LeadList = () => {
  const { leads, addLead, updateLead, deleteLead, convertLeadToCustomer, searchQuery } = useCrm();

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState(null);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.source?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'All' || l.status === selectedStatus;
      const matchSource = selectedSource === 'All' || l.source === selectedSource;

      return matchSearch && matchStatus && matchSource;
    });
  }, [leads, searchQuery, selectedStatus, selectedSource]);

  // Lead Analytics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const qualifiedLeads = leads.filter((l) => l.status === 'Qualified').length;
  const totalEstimatedValue = leads
    .filter((l) => l.status !== 'Converted' && l.status !== 'Unqualified')
    .reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0);

  const handleOpenAdd = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const handleOpenConvert = (lead) => {
    setLeadToConvert(lead);
    setIsConvertOpen(true);
  };

  const handleSaveLead = (formData) => {
    if (leadToEdit) {
      updateLead(leadToEdit.id, formData);
    } else {
      addLead(formData);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove lead "${name}"?`)) {
      deleteLead(id);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inbound Leads"
          value={totalLeads}
          change="+18% growth"
          isPositive={true}
          icon={Target}
          color="indigo"
        />
        <StatCard
          title="Fresh Uncontacted"
          value={newLeads}
          change="Action required"
          isPositive={false}
          icon={UserPlus}
          color="blue"
        />
        <StatCard
          title="Sales Qualified Leads"
          value={qualifiedLeads}
          change="Ready to convert"
          isPositive={true}
          icon={Flame}
          color="emerald"
        />
        <StatCard
          title="Pipeline Lead Potential"
          value={`$${totalEstimatedValue.toLocaleString()}`}
          change="Active pipeline opportunities"
          isPositive={true}
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Control Bar: Filters, Source, Status, Add button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
          </div>

          {/* Status filter pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {['All', 'New', 'Contacted', 'Qualified', 'Converted'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Source dropdown */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Acquisition Channels</option>
            {leadSources.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-500/20 transition cursor-pointer self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Capture Lead</span>
        </button>
      </div>

      {/* Leads Table / Card list */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Target className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Leads Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No prospect matches the current criteria. Add new marketing leads or reset filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Lead Name & Company</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Lead Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Est. Value</th>
                  <th className="py-3 px-4">Assigned Rep</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{lead.fullName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{lead.company || 'Individual'}</span>
                        {lead.title && <span>• {lead.title}</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-medium">{lead.email}</div>
                      <div className="text-[11px] text-slate-400">{lead.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700 text-[11px] font-medium border border-slate-200">
                        {lead.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-lg border ${getScoreColor(lead.score)}`}>
                          {lead.score}/100
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={lead.status} />
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      ${lead.estimatedValue?.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{lead.assignedRep}</td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {lead.status !== 'Converted' ? (
                        <button
                          onClick={() => handleOpenConvert(lead)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-xs inline-flex items-center space-x-1 border border-emerald-200 transition cursor-pointer"
                          title="Convert to Deal & Customer"
                        >
                          <ArrowRightCircle className="w-3.5 h-3.5" />
                          <span>Convert</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-purple-600 font-bold px-2 py-1 bg-purple-50 rounded-lg inline-flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Converted</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenEdit(lead)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Lead"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id, lead.fullName)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leadToEdit={leadToEdit}
        onSave={handleSaveLead}
      />

      {/* Convert Lead Modal */}
      <ConvertLeadModal
        isOpen={isConvertOpen}
        onClose={() => setIsConvertOpen(false)}
        lead={leadToConvert}
        onConvert={convertLeadToCustomer}
      />
    </div>
  );
};

export default LeadList;
