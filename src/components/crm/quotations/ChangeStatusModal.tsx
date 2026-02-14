import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newStatus: string) => void;
  quotation: any;
}

const statusOptions = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Sent',
  'Accepted',
  'Rejected'
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Draft': 'text-gray-600',
    'Pending Approval': 'text-yellow-600',
    'Approved': 'text-orange-600',
    'Sent': 'text-orange-600',
    'Accepted': 'text-purple-600',
    'Rejected': 'text-red-600',
  };
  return colors[status] || 'text-gray-600';
};

export default function ChangeStatusModal({
  isOpen,
  onClose,
  onSubmit,
  quotation
}: ChangeStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (quotation) {
      setSelectedStatus(quotation.status);
    }
  }, [quotation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStatus || selectedStatus === quotation?.status) {
      return;
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
    setSelectedStatus(quotation?.status || '');
    onClose();
  };

  if (!quotation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Change Quotation Status</span>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >

          {/* Status Selection */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="status">New Status *</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem 
                      key={status} 
                      value={status}
                      className={status === quotation.status ? 'opacity-50' : ''}
                    >
                      <span className={getStatusColor(status)}>
                        {status}
                        {status === quotation.status && ' (Current)'}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            {/* Action Buttons */}
            <div className="flex justify-center space-x-3 pt-4 ">
              <Button type="button" variant="outline" onClick={handleClose}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
                disabled={isSubmitting || !selectedStatus || selectedStatus === quotation?.status}
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