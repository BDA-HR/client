import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import type { CompListDto } from '../../../types/core/comp';
import { amharicRegex } from '../../../utils/amharic-regex';

interface EditCompModalProps {
  company: CompListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: CompListDto) => void;
}

const EditCompModal: React.FC<EditCompModalProps> = ({ 
  company, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [editedCompany, setEditedCompany] = useState({ name: '', nameAm: '' });

  useEffect(() => {
    if (company) {
      setEditedCompany({
        name: company.name || '',
        nameAm: company.nameAm || ''
      });
    }
  }, [company]);

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setEditedCompany(prev => ({ ...prev, nameAm: value }));
    }
  };

  const handleSubmit = () => {
    if (!editedCompany.name || !editedCompany.nameAm || !company) return;

    onSave({
      ...company,
      name: editedCompany.name,
      nameAm: editedCompany.nameAm
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className='border-b pb-3 flex flex-row justify-between items-center'>
          <div>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription className='hidden'>Edit Company Details</DialogDescription>
          </div>
        </DialogHeader>
        <div className="grid grid-row-2 gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="editNameAm">የኩባንያው ስም</Label>
            <input
              id="editNameAm"
              value={editedCompany.nameAm}
              onChange={handleAmharicChange}
              placeholder="ምሳሌ፡ አክሜ ኢንት 1"
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="editName">Company Name</Label>
            <input
              id="editName"
              value={editedCompany.name}
              onChange={(e) => setEditedCompany(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
              placeholder="Eg. Acme int 1"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-1.5 border-t pt-6">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
            onClick={handleSubmit}
            disabled={!editedCompany.name || !editedCompany.nameAm}
          >
            Edit/Modify
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'} className='cursor-pointer'>Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompModal;