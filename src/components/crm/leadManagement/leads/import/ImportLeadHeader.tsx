import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { useNavigate } from 'react-router-dom';

export default function ImportLeadHeader() {
  const navigate = useNavigate();

  const handleDownloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = `First Name,Last Name,Email,Phone,Company,Job Title,Source,Status,Industry,Budget,Notes
John,Doe,john.doe@example.com,555-0123,Acme Corp,Sales Manager,Website,New,Technology,50000,Sample lead
Jane,Smith,jane.smith@example.com,555-0124,Tech Solutions,Marketing Director,Email Campaign,Contacted,Software,75000,Another sample lead`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/crm/leads')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leads</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Leads</h1>
          <p className="text-gray-600 mt-1">Upload a CSV file to import multiple leads</p>
        </div>
      </div>
      
      <Button
        variant="outline"
        onClick={handleDownloadTemplate}
        className="flex items-center space-x-2"
      >
        <Download className="w-4 h-4" />
        <span>Download Template</span>
      </Button>
    </div>
  );
}