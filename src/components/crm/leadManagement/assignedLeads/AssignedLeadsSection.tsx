import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockLeads } from '../../../../data/crmMockData';
import AssignedLeadsHeader from './AssignedLeadsHeader';
import AssignedLeadsTable from './AssignedLeadsTable';
import type { Lead } from '../../../../types/crm';

export default function AssignedLeadsSection() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const loadLeads = () => {
      const storedLeads = localStorage.getItem('leads');
      if (storedLeads) {
        try {
          const parsedLeads = JSON.parse(storedLeads);
          const assignedLeads = parsedLeads.filter((lead: Lead) => lead.assignedTo);
          setLeads(assignedLeads);
        } catch (error) {
          console.error('Error parsing stored leads:', error);
          const assignedLeads = mockLeads.filter(lead => lead.assignedTo);
          setLeads(assignedLeads);
        }
      } else {
        const assignedLeads = mockLeads.filter(lead => lead.assignedTo);
        setLeads(assignedLeads);
      }
    };

    loadLeads();
    window.addEventListener('storage', loadLeads);
    window.addEventListener('focus', loadLeads);

    return () => {
      window.removeEventListener('storage', loadLeads);
      window.removeEventListener('focus', loadLeads);
    };
  }, []);

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
        : lead
    );
    setLeads(updatedLeads);

    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      const allLeads = JSON.parse(storedLeads);
      const updatedAllLeads = allLeads.map((lead: Lead) => 
        lead.id === leadId 
          ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
          : lead
      );
      localStorage.setItem('leads', JSON.stringify(updatedAllLeads));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <AssignedLeadsHeader />

      <AssignedLeadsTable leads={leads} onStatusChange={handleStatusChange} />
    </motion.div>
  );
}
