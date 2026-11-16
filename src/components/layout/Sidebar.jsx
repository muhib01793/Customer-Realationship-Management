import React from 'react';
import { useCrm } from '../../context/CrmContext';
import {
  Users,
  Kanban,
  Target,
  Contact2,
  BellRing,
  BarChart3,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { activeTab, setActiveTab, urgentReminders, leads, deals } = useCrm();

  const navItems = [
    {
      id: 'pipeline',
      name: 'Sales Pipelines',
      icon: Kanban,
      badge: deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost').length,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'customers',
      name: 'Customer Management',
      icon: Users,
    },
    {
      id: 'leads',
      name: 'Lead Tracking',
      icon: Target,
      badge: leads.filter((l) => l.status === 'New').length,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'contacts',
      name: 'Contact Management',
      icon: Contact2,
    },
    {
      id: 'reminders',
      name: 'Follow-up & Reminders',
      icon: BellRing,
      badge: urgentReminders.length > 0 ? urgentReminders.length : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'reports',
      name: 'Sales Reports',
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:!translate-x-0'
        } lg:!translate-x-0`}
      >
        {/* Logo and Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/40 justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">NexCRM</span>
              <span className="block text-[10px] font-medium text-indigo-400 tracking-wider uppercase">Pro Enterprise</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            CRM Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom User & Reset Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 space-y-3">
          <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">Quick Demo Tools</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Live interactive mock data with full CRUD & localStorage sync.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset all data to default sample items?')) {
                  // Will be handled in context
                  window.dispatchEvent(new CustomEvent('crm-reset'));
                }
              }}
              className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sample Data</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-400/20">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Ali Raza</p>
              <p className="text-[11px] text-slate-400 truncate">Senior Sales Lead</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
