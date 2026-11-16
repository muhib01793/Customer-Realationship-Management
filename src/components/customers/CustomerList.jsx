import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { StatusBadge } from '../common/Badge';
import StatCard from '../common/StatCard';
import CustomerModal from './CustomerModal';
import CustomerDetailModal from './CustomerDetailModal';
import { industriesList } from '../../data/initialData';
import {
  Users,
  Building2,
  Mail,
  Phone,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Briefcase,
  LayoutGrid,
  List,
  MapPin
} from 'lucide-react';

const CustomerList = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, searchQuery } = useCrm();

  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchIndustry =
        selectedIndustry === 'All' || c.industry === selectedIndustry;

      const matchStatus =
        selectedStatus === 'All' || c.status === selectedStatus;

      return matchSearch && matchIndustry && matchStatus;
    });
  }, [customers, searchQuery, selectedIndustry, selectedStatus]);

  // Summary Metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'Active').length;
  const prospects = customers.filter((c) => c.status === 'Prospect').length;

  const handleOpenAdd = () => {
    setCustomerToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setCustomerToEdit(customer);
    setIsAddEditOpen(true);
  };

  const handleOpenDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleSaveCustomer = (formData) => {
    if (customerToEdit) {
      updateCustomer(customerToEdit.id, formData);
    } else {
      addCustomer(formData);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove customer account "${name}"?`)) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Accounts"
          value={totalCustomers}
          change="+12% from last month"
          isPositive={true}
          icon={Building2}
          color="indigo"
        />
        <StatCard
          title="Active Clients"
          value={activeCustomers}
          change={`${Math.round((activeCustomers / (totalCustomers || 1)) * 100)}% retention`}
          isPositive={true}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Prospect Pipeline"
          value={prospects}
          change="Warm opportunities"
          isPositive={true}
          icon={Briefcase}
          color="amber"
        />
        <StatCard
          title="Enterprise Verticals"
          value={new Set(customers.map((c) => c.industry)).size}
          change="Diverse industries"
          isPositive={true}
          icon={Building2}
          color="purple"
        />
      </div>

      {/* Control Bar: Filters, Search, View switch, Add button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
          </div>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Industries</option>
            {industriesList.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Prospect">Prospect</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto">
          {/* View mode toggle */}
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

          {/* Add Customer Button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Content Display */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No Customers Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new customer account to your CRM.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Add New Customer
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-xs">
                      {cust.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4
                        onClick={() => handleOpenDetail(cust)}
                        className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition cursor-pointer line-clamp-1"
                      >
                        {cust.name}
                      </h4>
                      <span className="text-[11px] text-slate-500">{cust.industry}</span>
                    </div>
                  </div>
                  <StatusBadge status={cust.status} />
                </div>

                <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Primary Contact:</span>
                    <span className="font-medium text-slate-800">{cust.contactPerson || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Est. Value:</span>
                    <span className="font-semibold text-emerald-600">{cust.revenue}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Owner:</span>
                    <span className="font-medium text-slate-700">{cust.assignedRep}</span>
                  </div>
                  {cust.location && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Location:</span>
                      <span className="text-slate-700 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[150px]">{cust.location}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleOpenDetail(cust)}
                  className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>360° View</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(cust)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cust.id, cust.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete"
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
                  <th className="py-3 px-4">Account Name</th>
                  <th className="py-3 px-4">Primary Contact</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Annual Value</th>
                  <th className="py-3 px-4">Assigned Rep</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer" onClick={() => handleOpenDetail(cust)}>
                        {cust.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{cust.location}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <div>{cust.contactPerson || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400">{cust.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{cust.industry}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={cust.status} />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600">{cust.revenue}</td>
                    <td className="py-3.5 px-4 text-slate-600">{cust.assignedRep}</td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenDetail(cust)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(cust)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cust.id, cust.name)}
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

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        customerToEdit={customerToEdit}
        onSave={handleSaveCustomer}
      />

      {/* 360 Detail View Modal */}
      <CustomerDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        customer={selectedCustomer}
        onEdit={(c) => handleOpenEdit(c)}
      />
    </div>
  );
};

export default CustomerList;
