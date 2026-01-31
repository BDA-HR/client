import React from 'react';
import { RoutingRules } from '../routing';

interface LeadRoutingProps {
  // Add props as needed
}

export default function LeadRouting(props: LeadRoutingProps) {
  // Mock data for now
  const mockRules = [
    {
      id: '1',
      name: 'Enterprise Leads',
      conditions: ['Company Size > 1000', 'Budget > $50k'],
      assignTo: 'Sarah Johnson',
      priority: 1,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastModified: '2024-01-15T10:00:00Z'
    }
  ];

  const handleAddRule = () => {
    console.log('Add rule');
  };

  const handleEditRule = (rule: any) => {
    console.log('Edit rule', rule);
  };

  const handleDeleteRule = (ruleId: string) => {
    console.log('Delete rule', ruleId);
  };

  const handleToggleRule = (ruleId: string, isActive: boolean) => {
    console.log('Toggle rule', ruleId, isActive);
  };

  return (
    <RoutingRules
      rules={mockRules}
      onAddRule={handleAddRule}
      onEditRule={handleEditRule}
      onDeleteRule={handleDeleteRule}
      onToggleRule={handleToggleRule}
    />
  );
}