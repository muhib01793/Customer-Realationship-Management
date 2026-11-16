import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCustomers,
  initialDeals,
  initialLeads,
  initialContacts,
  initialReminders,
  pipelineStages
} from '../data/initialData';

const CrmContext = createContext(null);

export const CrmProvider = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState('pipeline'); // Default to pipeline/dashboard
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State with LocalStorage fallbacks
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('crm_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('crm_deals');
    return saved ? JSON.parse(saved) : initialDeals;
  });

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('crm_contacts');
    return saved ? JSON.parse(saved) : initialContacts;
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('crm_reminders');
    return saved ? JSON.parse(saved) : initialReminders;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('crm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('crm_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('crm_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('crm_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Reset to sample initial data
  const resetToSampleData = () => {
    setCustomers(initialCustomers);
    setDeals(initialDeals);
    setLeads(initialLeads);
    setContacts(initialContacts);
    setReminders(initialReminders);
    localStorage.clear();
    addToast('Data reset to default sample values', 'info');
  };

  // ================= CUSTOMERS CRUD =================
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      dealCount: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    addToast(`Customer "${newCustomer.name}" added successfully`);
    return newCustomer;
  };

  const updateCustomer = (id, updatedData) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    addToast('Customer details updated');
  };

  const deleteCustomer = (id) => {
    const customer = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    addToast(`Customer "${customer?.name || id}" deleted`, 'warning');
  };

  // ================= DEALS / PIPELINE CRUD =================
  const addDeal = (dealData) => {
    const newDeal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      amount: Number(dealData.amount) || 0,
      probability: Number(dealData.probability) || 50,
    };
    setDeals((prev) => [newDeal, ...prev]);
    // update customer deal count if associated
    if (newDeal.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === newDeal.customerId
            ? { ...c, dealCount: (c.dealCount || 0) + 1 }
            : c
        )
      );
    }
    addToast(`Deal "${newDeal.title}" created in pipeline`);
    return newDeal;
  };

  const updateDeal = (id, updatedData) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedData, amount: Number(updatedData.amount ?? d.amount) } : d))
    );
    addToast('Deal updated');
  };

  const updateDealStage = (dealId, newStage) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const probability =
            newStage === 'won' ? 100 : newStage === 'lost' ? 0 : d.probability;
          return { ...d, stage: newStage, probability };
        }
        return d;
      })
    );
    const stageObj = pipelineStages.find((s) => s.id === newStage);
    addToast(`Deal moved to "${stageObj?.name || newStage}"`);
  };

  const deleteDeal = (id) => {
    const deal = deals.find((d) => d.id === id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
    addToast(`Deal "${deal?.title || id}" deleted`, 'warning');
  };

  // ================= LEADS CRUD =================
  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      score: Number(leadData.score) || 50,
      estimatedValue: Number(leadData.estimatedValue) || 0,
    };
    setLeads((prev) => [newLead, ...prev]);
    addToast(`Lead "${newLead.fullName}" captured`);
    return newLead;
  };

  const updateLead = (id, updatedData) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updatedData } : l))
    );
    addToast('Lead updated');
  };

  const deleteLead = (id) => {
    const lead = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    addToast(`Lead "${lead?.fullName || id}" removed`, 'warning');
  };

  // Convert Lead to Customer & Deal flow
  const convertLeadToCustomer = (leadId, dealAmount, dealTitle) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // 1. Create new customer
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: lead.company || `${lead.fullName}'s Company`,
      contactPerson: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      industry: "Information Technology",
      status: "Active",
      revenue: `$${(dealAmount || lead.estimatedValue || 0).toLocaleString()}`,
      dealCount: 1,
      assignedRep: lead.assignedRep,
      location: "Pakistan",
      notes: `Converted from lead. Original notes: ${lead.notes || 'None'}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCustomer, ...prev]);

    // 2. Create associated contact
    const newContact = {
      id: `cont-${Date.now()}`,
      name: lead.fullName,
      title: lead.title || "Key Contact",
      company: newCustomer.name,
      customerId: newCustomer.id,
      email: lead.email,
      phone: lead.phone,
      department: "General Management",
      role: "Decision Maker",
      status: "Active",
      tags: ["Converted Lead"],
      notes: "Auto-created upon lead conversion",
    };
    setContacts((prev) => [newContact, ...prev]);

    // 3. Create pipeline deal in Qualified stage
    const newDeal = {
      id: `deal-${Date.now()}`,
      title: dealTitle || `${lead.company || lead.fullName} - Service Agreement`,
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      amount: Number(dealAmount) || lead.estimatedValue || 25000,
      stage: "qualified",
      probability: 40,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "High",
      assignedRep: lead.assignedRep,
      notes: `Deal originating from converted lead (${lead.source}).`
    };
    setDeals((prev) => [newDeal, ...prev]);

    // 4. Update lead status to 'Converted'
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Converted' } : l))
    );

    addToast(`Lead "${lead.fullName}" converted into Customer & Deal!`, 'success');
  };

  // ================= CONTACTS CRUD =================
  const addContact = (contactData) => {
    const newContact = {
      ...contactData,
      id: `cont-${Date.now()}`,
    };
    setContacts((prev) => [newContact, ...prev]);
    addToast(`Contact "${newContact.name}" added`);
    return newContact;
  };

  const updateContact = (id, updatedData) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    addToast('Contact updated');
  };

  const deleteContact = (id) => {
    const contact = contacts.find((c) => c.id === id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    addToast(`Contact "${contact?.name || id}" removed`, 'warning');
  };

  // ================= REMINDERS & FOLLOW-UPS =================
  const addReminder = (reminderData) => {
    const newReminder = {
      ...reminderData,
      id: `rem-${Date.now()}`,
      status: 'Pending',
    };
    setReminders((prev) => [newReminder, ...prev]);
    addToast(`Reminder scheduled for ${newReminder.dueDate}`);
    return newReminder;
  };

  const updateReminder = (id, updatedData) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
    addToast('Reminder updated');
  };

  const toggleReminderComplete = (id) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'Completed' ? 'Pending' : 'Completed';
          addToast(nextStatus === 'Completed' ? 'Follow-up marked completed!' : 'Follow-up marked pending');
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    addToast('Reminder deleted', 'warning');
  };

  // Computed alerts: Overdue or Due Today
  const todayStr = new Date().toISOString().split('T')[0];
  const urgentReminders = reminders.filter((r) => {
    if (r.status === 'Completed') return false;
    return r.dueDate <= todayStr;
  });

  return (
    <CrmContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        // Customers
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        // Deals & Pipeline
        deals,
        addDeal,
        updateDeal,
        updateDealStage,
        deleteDeal,
        // Leads
        leads,
        addLead,
        updateLead,
        deleteLead,
        convertLeadToCustomer,
        // Contacts
        contacts,
        addContact,
        updateContact,
        deleteContact,
        // Reminders
        reminders,
        addReminder,
        updateReminder,
        toggleReminderComplete,
        deleteReminder,
        urgentReminders,
        // Helpers
        resetToSampleData,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
