import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { PenBox } from 'lucide-react';
import type { EditPeriodDto, PeriodListDto, UUID } from '../../../types/core/period';
import toast from 'react-hot-toast';

interface EditPeriodModalProps {
  period: PeriodListDto;
  onEditPeriod: (period: EditPeriodDto) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditPeriodModal: React.FC<EditPeriodModalProps> = ({ 
  period, 
  onEditPeriod, 
  isOpen,
  onClose 
}) => {
  const [editedPeriod, setEditedPeriod] = useState<EditPeriodDto>({
    id: period.id,
    name: period.name,
    dateStart: period.dateStart,
    dateEnd: period.dateEnd,
    isActive: period.isActive,
    quarterId: '' as UUID,
    fiscalYearId: '' as UUID,
    rowVersion: period.rowVersion || ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedPeriod({
      id: period.id,
      name: period.name,
      dateStart: period.dateStart,
      dateEnd: period.dateEnd,
      isActive: period.isActive,
      quarterId: '' as UUID,
      fiscalYearId: '' as UUID,
      rowVersion: period.rowVersion || ''
    });
  }, [period]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPeriod((prev) => ({ ...prev, name: value }));
  };

  const handleDateStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPeriod((prev) => ({ ...prev, dateStart: value }));
  };

  const handleDateEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPeriod((prev) => ({ ...prev, dateEnd: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditedPeriod((prev) => ({ ...prev, isActive: value }));
  };

  const handleSubmit = async () => {
    if (!editedPeriod.name || !editedPeriod.dateStart || !editedPeriod.dateEnd) {
      toast.error('Please fill all required fields');
      return;
    }

    // Date validation
    const startDate = new Date(editedPeriod.dateStart);
    const endDate = new Date(editedPeriod.dateEnd);
    
    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      await onEditPeriod(editedPeriod);
    } catch (error) {
      console.error('Error updating period:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className='border-b pb-3 flex flex-row justify-between items-center'>
          <div>
            <DialogTitle className='flex items-center gap-2'>
              <PenBox size={20} /> Edit
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name">Period Name </Label>
            <input
              id="edit-name"
              value={editedPeriod.name}
              onChange={handleNameChange}
              placeholder="Q1 2024"
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-dateStart">Start Date </Label>
              <input
                id="edit-dateStart"
                type="date"
                value={editedPeriod.dateStart}
                onChange={handleDateStartChange}
                className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-dateEnd">End Date </Label>
              <input
                id="edit-dateEnd"
                type="date"
                value={editedPeriod.dateEnd}
                onChange={handleDateEndChange}
                className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-isActive">Status</Label>
            <select
              id="edit-isActive"
              value={editedPeriod.isActive}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center items-center gap-1.5 border-t pt-6">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
            onClick={handleSubmit}
            disabled={!editedPeriod.name || !editedPeriod.dateStart || 
                     !editedPeriod.dateEnd || loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
          <Button variant={'outline'} className='cursor-pointer' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPeriodModal;