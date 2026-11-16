import React from 'react';

export const StatusBadge = ({ status }) => {
  const getColors = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'won':
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'prospect':
      case 'qualified':
      case 'proposal':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'contacted':
      case 'negotiation':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'new':
      case 'lead':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'inactive':
      case 'lost':
      case 'unqualified':
      case 'overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'converted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getColors()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const styles = {
    High: 'bg-rose-50 text-rose-600 border-rose-200',
    Medium: 'bg-amber-50 text-amber-600 border-amber-200',
    Low: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${styles[priority] || styles.Low}`}>
      {priority}
    </span>
  );
};
