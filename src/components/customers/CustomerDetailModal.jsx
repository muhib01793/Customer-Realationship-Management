import React from 'react';
import Modal from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { useCrm } from '../../context/CrmContext';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  DollarSign,
  Calendar,
  Briefcase,
  Layers,
  ExternalLink
} from 'lucide-react';

const CustomerDetailModal = ({ isOpen, onClose, customer, onEdit }) => {
  const { deals, contacts, reminders } = useCrm();

  if (!customer) return null;

  const customerDeals = deals.filter((d) => d.customerId === customer.id);
  const customerContacts = contacts.filter((c) => c.customerId === customer.id);
  const customerReminders = reminders.filter(
    (r) => r.relatedTo === customer.name || customerDeals.some((d) => d.title === r.relatedTo)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer.name}
      subtitle={`Account ID: ${customer.id} • Added on ${customer.createdDate}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Top Header summary card */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 rounded-2xl text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-1.5">
                <h4 className="text-xl font-bold">{customer.name}</h4>
                <StatusBadge status={customer.status} />
              </div>
              <p className="text-xs text-indigo-200 flex items-center space-x-2">
                <span>{customer.industry}</span>
                <span>•</span>
                <span>Assigned to {customer.assignedRep}</span>
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onEdit(customer);
              }}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition cursor-pointer"
            >
              Edit Account
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Primary Contact</span>
              <span className="font-semibold text-white">{customer.contactPerson || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Estimated Revenue</span>
              <span className="font-semibold text-emerald-400">{customer.revenue}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Active Deals</span>
              <span className="font-semibold text-white">{customerDeals.length} Deal(s)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Location</span>
              <span className="font-semibold text-white">{customer.location || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Contact Info Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {customer.email && (
            <a
              href={`mailto:${customer.email}`}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 text-xs text-slate-700 transition"
            >
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">{customer.email}</span>
            </a>
          )}
          {customer.phone && (
            <a
              href={`tel:${customer.phone}`}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 text-xs text-slate-700 transition"
            >
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{customer.phone}</span>
            </a>
          )}
          {customer.website && (
            <a
              href={customer.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 text-xs text-slate-700 transition"
            >
              <Globe className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{customer.website}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
            </a>
          )}
        </div>

        {/* Notes */}
        {customer.notes && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900">
            <span className="font-bold block mb-1">Internal Relationship Notes:</span>
            <p className="leading-relaxed">{customer.notes}</p>
          </div>
        )}

        {/* Associated Deals Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Associated Deals ({customerDeals.length})</span>
            </h5>
          </div>

          {customerDeals.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
              No active pipeline deals linked to this account yet.
            </p>
          ) : (
            <div className="space-y-2">
              {customerDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-indigo-300 transition"
                >
                  <div>
                    <span className="font-semibold text-slate-800 block">{deal.title}</span>
                    <span className="text-[11px] text-slate-500">Stage: <strong className="capitalize">{deal.stage}</strong> • Expected: {deal.expectedCloseDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">${deal.amount?.toLocaleString()}</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">{deal.probability}% win probability</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Associated Contacts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Key Stakeholders & Contacts ({customerContacts.length})</span>
            </h5>
          </div>

          {customerContacts.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
              No individual contacts listed.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {customerContacts.map((c) => (
                <div key={c.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{c.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{c.role}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{c.title} • {c.department}</p>
                  <p className="text-[11px] text-slate-600 truncate">{c.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetailModal;
