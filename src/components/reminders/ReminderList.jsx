import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { PriorityBadge } from '../common/Badge';
import StatCard from '../common/StatCard';
import ReminderModal from './ReminderModal';
import {
  BellRing,
  Calendar,
  Clock,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  CheckSquare,
  Square,
  Edit2,
  Trash2,
  AlertTriangle,
  Building2,
  Briefcase
} from 'lucide-react';

const ReminderList = () => {
  const {
    reminders,
    addReminder,
    updateReminder,
    toggleReminderComplete,
    deleteReminder,
    searchQuery,
  } = useCrm();

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Overdue' | 'Today' | 'Upcoming' | 'Completed'
  const [selectedType, setSelectedType] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter logic
  const filteredReminders = useMemo(() => {
    return reminders.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.relatedTo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = selectedType === 'All' || r.type === selectedType;

      let matchFilter = true;
      if (activeFilter === 'Completed') {
        matchFilter = r.status === 'Completed';
      } else if (activeFilter === 'Overdue') {
        matchFilter = r.status !== 'Completed' && r.dueDate < todayStr;
      } else if (activeFilter === 'Today') {
        matchFilter = r.status !== 'Completed' && r.dueDate === todayStr;
      } else if (activeFilter === 'Upcoming') {
        matchFilter = r.status !== 'Completed' && r.dueDate > todayStr;
      }

      return matchSearch && matchType && matchFilter;
    });
  }, [reminders, searchQuery, activeFilter, selectedType, todayStr]);

  // Analytics
  const overdueCount = reminders.filter((r) => r.status !== 'Completed' && r.dueDate < todayStr).length;
  const todayCount = reminders.filter((r) => r.status !== 'Completed' && r.dueDate === todayStr).length;
  const upcomingCount = reminders.filter((r) => r.status !== 'Completed' && r.dueDate > todayStr).length;
  const completedCount = reminders.filter((r) => r.status === 'Completed').length;

  const handleOpenAdd = () => {
    setReminderToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rem) => {
    setReminderToEdit(rem);
    setIsModalOpen(true);
  };

  const handleSaveReminder = (formData) => {
    if (reminderToEdit) {
      updateReminder(reminderToEdit.id, formData);
    } else {
      addReminder(formData);
    }
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete reminder "${title}"?`)) {
      deleteReminder(id);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-4 h-4 text-emerald-500" />;
      case 'Meeting':
        return <Users className="w-4 h-4 text-indigo-500" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckSquare className="w-4 h-4 text-amber-500" />;
    }
  };

  const getDueBadge = (dueDate, status) => {
    if (status === 'Completed') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Completed
        </span>
      );
    }
    if (dueDate < todayStr) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1 animate-pulse">
          <AlertCircle className="w-3 h-3" />
          <span>Overdue</span>
        </span>
      );
    }
    if (dueDate === todayStr) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Due Today</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        Upcoming
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overdue Tasks"
          value={overdueCount}
          change={overdueCount > 0 ? "Immediate follow-up required" : "No overdue items"}
          isPositive={overdueCount === 0}
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Due Today"
          value={todayCount}
          change="Scheduled for action"
          isPositive={true}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Upcoming Follow-ups"
          value={upcomingCount}
          change="Next 7-30 days"
          isPositive={true}
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Completed Tasks"
          value={completedCount}
          change={`${Math.round((completedCount / (reminders.length || 1)) * 100)}% closure rate`}
          isPositive={true}
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {[
              { id: 'All', label: 'All Tasks', count: reminders.length },
              { id: 'Overdue', label: 'Overdue', count: overdueCount, highlight: 'text-rose-600' },
              { id: 'Today', label: 'Due Today', count: todayCount, highlight: 'text-amber-600' },
              { id: 'Upcoming', label: 'Upcoming', count: upcomingCount },
              { id: 'Completed', label: 'Completed', count: completedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeFilter === tab.id ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200/70 text-slate-600'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Types</option>
            <option value="Call">Calls</option>
            <option value="Meeting">Meetings</option>
            <option value="Email">Emails</option>
            <option value="Follow-up">Follow-ups</option>
            <option value="Task">Tasks</option>
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-500/20 transition cursor-pointer self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Follow-up</span>
        </button>
      </div>

      {/* Reminders List Table / Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredReminders.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Reminders in this category</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You are all caught up! Schedule a new follow-up reminder to keep prospects warm.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReminders.map((rem) => {
              const isDone = rem.status === 'Completed';

              return (
                <div
                  key={rem.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition ${
                    isDone ? 'bg-slate-50/40 opacity-70' : ''
                  }`}
                >
                  {/* Left: Checkbox, Icon, Title, Related */}
                  <div className="flex items-start space-x-3.5">
                    <button
                      onClick={() => toggleReminderComplete(rem.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                    >
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getTypeIcon(rem.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-bold text-slate-900 ${
                            isDone ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {rem.title}
                        </span>
                        {getDueBadge(rem.dueDate, rem.status)}
                        <PriorityBadge priority={rem.priority} />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Related to: <strong className="text-slate-700">{rem.relatedTo}</strong> ({rem.relatedType})</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rem.dueDate}</span>
                        </span>
                        {rem.dueTime && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{rem.dueTime}</span>
                          </span>
                        )}
                        <span>•</span>
                        <span>Assigned to: <strong className="text-slate-700">{rem.assignedRep}</strong></span>
                      </div>

                      {rem.notes && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1 max-w-xl">
                          "{rem.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => toggleReminderComplete(rem.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        isDone
                          ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {isDone ? 'Reopen' : 'Mark Done'}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(rem)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(rem.id, rem.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Reminder Modal */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reminderToEdit={reminderToEdit}
        onSave={handleSaveReminder}
      />
    </div>
  );
};

export default ReminderList;
