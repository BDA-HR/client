import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { useNavigate } from 'react-router-dom';

export default function AddLeadHeader() {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
          <p className="text-gray-600 mt-1">Create a new lead record</p>
        </div>
      </div>
    </div>
  );
}