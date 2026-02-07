import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, RefreshCw } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import type { Lead } from '../../../../types/crm';

interface ChangeLeadStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newStatus: Lead['status']) => void;
  lead: Lead | null;
}

const statusOptions: Lead['status'][] = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Closed Won',
  'Closed Lost'
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'New': 'text-blue-600',
    'Contacted': 'text-yellow-600',
    'Qualified': 'text-green-600',
    'Proposal Sent': 'text-purple-600',
    'Closed Won': 'text-emerald-600',
    'Closed Lost': 'text-red-600',
  };
  return colors[status] || 'text-gray-600';
};

export default function ChangeLeadStatusModal({
  isOpen,
  onClose,
  onSubmit,
  lead
}: ChangeLeadStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Lead['status']>('New');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setSelectedStatus(lead.status);
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStatus || selectedStatus === lead?.status) {
      return;
    }

    // Show confirmation for final statuses
    if (selectedStatus === 'Closed Won' || selectedStatus === 'Closed Lost') {
      const confirmed = window.confirm(
        `Are you sure you want to mark this lead as "${selectedStatus}"? This action will be logged in the audit trail.`
      );
      if (!confirmed) return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(selectedStatus);
      onClose();
    } catch (error) {
      console.error('Error changing status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus(lead?.status || 'New');
    onClose();
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <span>Change Lead Status</span>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Lead Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-900">
              {lead.firstName} {lead.lastName}
            </div>
            <div className="text-sm text-gray-600">
              {lead.company}
            </div>
            <div className="text-sm text-gray-600">
              Current Status: <span className={`font-medium ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>
          </div>

          {/* Status Selection */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="status">New Status *</Label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Lead['status'])}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem 
                      key={status} 
                      value={status}
                      className={status === lead.status ? 'opacity-50' : ''}
                    >
                      <span className={getStatusColor(status)}>
                        {status}
                        {status === lead.status && ' (Current)'}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Change Info */}
            {selectedStatus && selectedStatus !== lead.status && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Status will change from:</strong>
                </div>
                <div className="text-sm">
                  <span className={getStatusColor(lead.status)}>
                    {lead.status}
                  </span>
                  {' → '}
                  <span className={getStatusColor(selectedStatus)}>
                    {selectedStatus}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || !selectedStatus || selectedStatus === lead?.status}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}