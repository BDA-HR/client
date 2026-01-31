import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImportLeadHeader, ImportLeadContent } from '../../components/crm/leadManagement/leads';
import { showToast } from '../../layout/layout';
import type { LeadImportResult } from '../../types/crm';

export default function ImportLeadPage() {
  const navigate = useNavigate();

  const handleImportComplete = (result: LeadImportResult) => {
    showToast.success(`Successfully imported ${result.successfulImports} leads`);
    navigate('/crm/leads');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <ImportLeadHeader />
        <ImportLeadContent
          onClose={() => navigate('/crm/leads')}
          onImportComplete={handleImportComplete}
        />
      </div>
    </motion.div>
  );
}
