import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../ui/dialog';
import { Button } from '../../../../ui/button';
import { Badge } from '../../../../ui/badge';
import type { Opportunity } from '../../../../../types/crm';

interface DeleteOpportunityModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const stageColors = {
  'Qualification': 'bg-blue-100 text-blue-800',
  'Needs Analysis': 'bg-yellow-100 text-yellow-800',
  'Proposal': 'bg-orange-100 text-orange-800',
  'Negotiation': 'bg-purple-100 text-purple-800',
  'Closed Won': 'bg-green-100 text-green-800',
  'Closed Lost': 'bg-red-100 text-red-800'
};

export default function DeleteOpportunityModal({
  opportunity,
  isOpen,
  onClose,
  onConfirm
}: DeleteOpportunityModalProps) {
  if (!opportunity) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Delete Opportunity</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 mb-3">
              Are you sure you want to delete this opportunity? This action cannot be undone.
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-red-700">Name:</span>
                <span className="text-xs text-red-800 font-semibold">{opportunity.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-red-700">Amount:</span>
                <span className="text-xs text-red-800 font-semibold">{formatCurrency(opportunity.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-red-700">Stage:</span>
                <Badge className={`${stageColors[opportunity.stage]} text-xs`}>
                  {opportunity.stage}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-red-700">Assigned To:</span>
                <span className="text-xs text-red-800">{opportunity.assignedTo}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Delete Opportunity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}