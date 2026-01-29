import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import LeadImportContent from '../../components/crm/leadManagement/components/LeadImportContent';
import { showToast } from '../../layout/layout';
import type { LeadImportResult } from '../../types/crm';

export default function ImportLeadPage() {
  const navigate = useNavigate();

  const handleImportComplete = (result: LeadImportResult) => {
    showToast.success(`Successfully imported ${result.successfulImports} leads`);
    navigate('/crm/leads');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/crm/leads')}
              className="cursor-pointer hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-gray-700">Back to Leads</span>
            </Button>
            
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-700 to-orange-800 bg-clip-text text-transparent mb-2 tracking-tight">
                Import Leads
              </h1>
            </div>
            
            <div className="w-40"></div>
          </div>
        </div>

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
