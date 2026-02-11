import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImportLeadHeader from '../../../components/crm/leadManagement/leadGeneration/ImportLeadHeader';
import ImportLeadContent from '../../../components/crm/leadManagement/leadGeneration/ImportLeadContent';
import { showToast } from '../../../layout/layout';
import type { LeadImportResult } from '../../../types/crm';

export default function ImportLeadPage() {
  const navigate = useNavigate();

  const handleImportComplete = (result: LeadImportResult) => {
    showToast.success(`Successfully imported ${result.successfulImports} leads`);
    navigate('/crm/leads/generation');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="space-y-6">
        <ImportLeadHeader />
        <ImportLeadContent
          onClose={() => navigate('/crm/leads/generation')}
          onImportComplete={handleImportComplete}
        />
      </div>
    </motion.div>
  );
}

