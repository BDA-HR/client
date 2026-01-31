import React from 'react';
import { AnalyticsDashboard } from '../analytics';

interface LeadAnalyticsProps {
  // Add props as needed
}

export default function LeadAnalytics(props: LeadAnalyticsProps) {
  // Mock data for analytics
  const mockData = {
    totalLeads: 1250,
    newLeads: 85,
    qualifiedLeads: 320,
    conversionRate: 25.6,
    averageScore: 72,
    totalValue: 2500000,
    leadsBySource: [
      { source: 'Website', count: 450, percentage: 36 },
      { source: 'Email Campaign', count: 320, percentage: 25.6 },
      { source: 'Social Media', count: 280, percentage: 22.4 },
      { source: 'Referral', count: 200, percentage: 16 }
    ],
    leadsByStatus: [
      { status: 'New', count: 380, color: 'bg-blue-500' },
      { status: 'Contacted', count: 290, color: 'bg-yellow-500' },
      { status: 'Qualified', count: 320, color: 'bg-green-500' },
      { status: 'Proposal Sent', count: 160, color: 'bg-purple-500' },
      { status: 'Closed Won', count: 100, color: 'bg-emerald-500' }
    ],
    monthlyTrend: [
      { month: 'January', leads: 120, conversions: 30 },
      { month: 'February', leads: 135, conversions: 34 },
      { month: 'March', leads: 150, conversions: 38 }
    ]
  };

  return <AnalyticsDashboard data={mockData} />;
}