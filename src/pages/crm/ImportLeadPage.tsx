import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import LeadImportContent from '../../components/crm/leadManagement/components/LeadImportContent';
import { showToast } from '../../layout/layout';
import type { LeadImportResult } from '../../types/crm';
import LeadImportHeader from '../../components/crm/leadManagement/components/leadImportHeader';

export default function ImportLeadPage() {
  const navigate = useNavigate();

  const handleImportComplete = (result: LeadImportResult) => {
    showToast.success(`Successfully imported ${result.successfulImports} leads`);
    navigate('/crm/leads');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div >
        {/* Header */}
        <LeadImportHeader/>

        {/* Import Component - No Dialog wrapper */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <LeadImportContent
            onClose={() => navigate('/crm/leads')}
            onImportComplete={handleImportComplete}
          />
        </div>
      </div>
    </div>
  );
}
