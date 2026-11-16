import React, { useState, useRef, useEffect } from 'react';
import { useCrm } from '../../context/CrmContext';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Target,
  Kanban,
  BellRing
} from 'lucide-react';

const Navbar = ({ onOpenSidebar, onOpenCreateModal }) => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    urgentReminders,
    toggleReminderComplete,
  } = useCrm();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const notificationRef = useRef(null);
  const quickAddRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target)) {
        setShowQuickAdd(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'customers':
        return { title: 'Customer Management', desc: 'Manage client accounts, industries, and relationships' };
      case 'pipeline':
        return { title: 'Sales Pipelines', desc: 'Visual stage tracking, probability, and deal flows' };
      case 'leads':
        return { title: 'Lead Tracking', desc: 'Capture, qualify, and convert prospect opportunities' };
      case 'contacts':
        return { title: 'Contact Management', desc: 'Directory of decision makers and account stakeholders' };
      case 'reminders':
        return { title: 'Follow-ups & Reminders', desc: 'Never miss client calls, meetings, and deadlines' };
      case 'reports':
        return { title: 'Sales Reports & Analytics', desc: 'Revenue forecasting, conversion metrics, and agent KPIs' };
      default:
        return { title: 'Dashboard', desc: 'Welcome back' };
    }
  };

  const { title, desc } = getPageTitle();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">{desc}</p>
        </div>
      </div>

      {/* Right side: Search, Quick Add, Notifications */}
      <div className="flex items-center space-x-3">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Quick Add Dropdown */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm shadow-indigo-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {showQuickAdd && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  onOpenCreateModal('deal');
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-2.5"
              >
                <Kanban className="w-4 h-4 text-indigo-500" />
                <span>New Sales Deal</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  onOpenCreateModal('lead');
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-2.5"
              >
                <Target className="w-4 h-4 text-blue-500" />
                <span>New Lead</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  onOpenCreateModal('customer');
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-2.5"
              >
                <Users className="w-4 h-4 text-emerald-500" />
                <span>New Customer</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  onOpenCreateModal('reminder');
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-2.5"
              >
                <BellRing className="w-4 h-4 text-amber-500" />
                <span>New Follow-up Task</span>
              </button>
            </div>
          )}
        </div>

        {/* Reminders / Notifications Alert Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl relative transition cursor-pointer"
            title="Follow-ups and overdue alerts"
          >
            <Bell className="w-5 h-5" />
            {urgentReminders.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-800">Due Reminders & Tasks</span>
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-700">
                    {urgentReminders.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('reminders');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All
                </button>
              </div>

              <div className="py-2 max-h-72 overflow-y-auto divide-y divide-slate-100">
                {urgentReminders.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-70" />
                    <p className="text-xs font-medium">All caught up!</p>
                    <p className="text-[11px] text-slate-400">No overdue or pending tasks for today.</p>
                  </div>
                ) : (
                  urgentReminders.map((rem) => (
                    <div key={rem.id} className="py-2.5 flex items-start justify-between group">
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-semibold text-slate-800 line-clamp-1">{rem.title}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded">
                            {rem.dueDate}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <span className="font-medium text-slate-600">{rem.relatedTo}</span>
                          <span>•</span>
                          <span>{rem.type}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => toggleReminderComplete(rem.id)}
                        className="text-xs text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                        title="Mark Done"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
