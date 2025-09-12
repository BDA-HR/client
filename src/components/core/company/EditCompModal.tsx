import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import DialogOverlay from '../../ui/dialog-overlay';
import type { CompListDto } from '../../../types/core/comp';
import { amharicRegex } from '../../../utils/amharic-regex';
import { useState, useEffect } from 'react';

interface EditCompModalProps {
  company: CompListDto | null;
  onSave: (company: CompListDto) => void;
  onClose: () => void;
}

const EditCompModal: React.FC<EditCompModalProps> = ({ company, onSave, onClose }) => {
  const [nameAm, setNameAm] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (company) {
      setNameAm(company.nameAm);
      setName(company.name);
    }
  }, [company]);

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setNameAm(value);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    if (company) {
      if (!nameAm || !name) return;
      onSave({ ...company, nameAm, name });
      onClose(); 
    }
  };

  if (!company) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogOverlay>
        <DialogContent className="sm:max-w-[500px]" aria-description='Edit company'>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          <div className="grid grid-row-2 gap-4 py-4">
            <div className="flex gap-4 flex-col">
              <Label htmlFor="editNameAm">የኩባንያው ስም</Label>
              <Input id="editNameAm" value={nameAm} onChange={handleAmharicChange} />
            </div>
            <div className="flex gap-4 flex-col">
              <Label htmlFor="editName">Company Name</Label>
              <Input id="editName" value={name} onChange={handleNameChange} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default EditCompModal;