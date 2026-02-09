import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, AlertCircle } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Textarea } from '../../../ui/textarea';
import type { SupportTicket } from '../../../../types/crm';

const statusOptions: SupportTicket['status'][] = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

interface ChangeTicketStatusModalProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (ticketId: string, newStatus: SupportTicket['status'], note?: string) => void;
}

export default function ChangeTicketStatusModal({
  ticket,
  isOpen,
  onClose,
  onConfirm
}: ChangeTicketStatusModalProps) {
  const [newStatus, setNewStatus] = useState<SupportTicket['status']>('Open');
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    if (ticket && newStatus) {
      onConfirm(ticket.id, newStatus, note);
      setNote('');
      onClose();
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span>Change Ticket Status</span>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Ticket ID:</span>
              <span className="ml-2 text-gray-900">#{ticket.id}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Title:</span>
              <span className="ml-2 text-gray-900">{ticket.title}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Current Status:</span>
              <span className="ml-2 text-gray-900">{ticket.status}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="newStatus">New Status *</Label>
            <Select 
              value={newStatus} 
              onValueChange={(value) => setNewStatus(value as SupportTicket['status'])}
              defaultValue={ticket.status}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this status change..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!newStatus || newStatus === ticket.status}
            >
              <Save className="w-4 h-4 mr-2" />
              Update Status
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
