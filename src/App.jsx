import React, { useState, useEffect } from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Toast from './components/layout/Toast';

// Modules
import CustomerList from './components/customers/CustomerList';
import CustomerModal from './components/customers/CustomerModal';
import PipelineBoard from './components/pipeline/PipelineBoard';
import DealModal from './components/pipeline/DealModal';
import LeadList from './components/leads/LeadList';
import LeadModal from './components/leads/LeadModal';
import ContactList from './components/contacts/ContactList';
import ReminderList from './components/reminders/ReminderList';
import ReminderModal from './components/reminders/ReminderModal';
import SalesReport from './components/reports/SalesReport';

const MainLayout = () => {
  const { activeTab, resetToSampleData, addCustomer, addDeal, addLead, addReminder } = useCrm();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Quick Add Global Modals
  const [quickAddType, setQuickAddType] = useState(null); // 'customer' | 'deal' | 'lead' | 'reminder' | null

  // Listen for reset events from sidebar
  useEffect(() => {
    const handleReset = () => resetToSampleData();
    window.addEventListener('crm-reset', handleReset);
    return () => window.removeEventListener('crm-reset', handleReset);
  }, [resetToSampleData]);

  const handleOpenCreateModal = (type) => {
    setQuickAddType(type);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Navbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenCreateModal={handleOpenCreateModal}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'pipeline' && <PipelineBoard />}
          {activeTab === 'customers' && <CustomerList />}
          {activeTab === 'leads' && <LeadList />}
          {activeTab === 'contacts' && <ContactList />}
          {activeTab === 'reminders' && <ReminderList />}
          {activeTab === 'reports' && <SalesReport />}
        </main>

        <footer className="py-4 px-8 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
          NexCRM Platform • Customer Relationship Management System Frontend • Built with React & Tailwind CSS
        </footer>
      </div>

      {/* Global Quick Add Modals */}
      <CustomerModal
        isOpen={quickAddType === 'customer'}
        onClose={() => setQuickAddType(null)}
        customerToEdit={null}
        onSave={(data) => addCustomer(data)}
      />

      <DealModal
        isOpen={quickAddType === 'deal'}
        onClose={() => setQuickAddType(null)}
        dealToEdit={null}
        onSave={(data) => addDeal(data)}
      />

      <LeadModal
        isOpen={quickAddType === 'lead'}
        onClose={() => setQuickAddType(null)}
        leadToEdit={null}
        onSave={(data) => addLead(data)}
      />

      <ReminderModal
        isOpen={quickAddType === 'reminder'}
        onClose={() => setQuickAddType(null)}
        reminderToEdit={null}
        onSave={(data) => addReminder(data)}
      />

      {/* Toast Feedback */}
      <Toast />
    </div>
  );
};

function App() {
  return (
    <CrmProvider>
      <MainLayout />
    </CrmProvider>
  );
}

export default App;
