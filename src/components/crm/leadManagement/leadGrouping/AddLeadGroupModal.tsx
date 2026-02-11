import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import type { LeadGroup } from './LeadGroupingSection';

interface AddLeadGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: Omit<LeadGroup, 'id' | 'leadCount' | 'createdAt' | 'updatedAt'>) => void;
  editingGroup: LeadGroup | null;
}

export default function AddLeadGroupModal({
  isOpen,
  onClose,
  onSubmit,
  editingGroup
}: AddLeadGroupModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  useEffect(() => {
    if (editingGroup) {
      setName(editingGroup.name);
      setCode(editingGroup.code);
      setStatus(editingGroup.status);
    } else {
      resetForm();
    }
  }, [editingGroup, isOpen]);

  const resetForm = () => {
    setName('');
    setCode('');
    setStatus('Active');
  };

  const handleSubmit = () => {
    if (!name.trim() || !code.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit({
      name,
      code,
      status
    });

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingGroup ? 'Edit Lead Group' : 'Add Lead Group'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., High Value Prospects"
            />
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., HVP"
              maxLength={10}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: 'Active' | 'Inactive') => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {editingGroup ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
