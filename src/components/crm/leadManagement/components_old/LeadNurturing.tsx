import React from 'react';
import { NurturingCampaigns } from '../nurturing';

interface LeadNurturingProps {
  // Add props as needed
}

export default function LeadNurturing(props: LeadNurturingProps) {
  // Mock data for nurturing campaigns
  const mockCampaigns = [
    {
      id: '1',
      name: 'Welcome Series',
      description: 'Automated welcome email sequence for new leads',
      status: 'Active' as const,
      type: 'Email Sequence' as const,
      totalLeads: 450,
      activeLeads: 320,
      completedLeads: 130,
      openRate: 68.5,
      clickRate: 24.3,
      conversionRate: 12.8,
      createdAt: '2024-01-01T00:00:00Z',
      lastActivity: '2024-01-20T15:30:00Z'
    },
    {
      id: '2',
      name: 'Product Demo Follow-up',
      description: 'Follow-up sequence after product demonstrations',
      status: 'Active' as const,
      type: 'Drip Campaign' as const,
      totalLeads: 180,
      activeLeads: 95,
      completedLeads: 85,
      openRate: 72.1,
      clickRate: 31.2,
      conversionRate: 18.5,
      createdAt: '2024-01-10T00:00:00Z',
      lastActivity: '2024-01-19T11:20:00Z'
    }
  ];

  const handleAddCampaign = () => {
    console.log('Add campaign');
  };

  const handleEditCampaign = (campaign: any) => {
    console.log('Edit campaign', campaign);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    console.log('Delete campaign', campaignId);
  };

  const handleToggleCampaign = (campaignId: string, action: 'play' | 'pause') => {
    console.log('Toggle campaign', campaignId, action);
  };

  return (
    <NurturingCampaigns
      campaigns={mockCampaigns}
      onAddCampaign={handleAddCampaign}
      onEditCampaign={handleEditCampaign}
      onDeleteCampaign={handleDeleteCampaign}
      onToggleCampaign={handleToggleCampaign}
    />
  );
}