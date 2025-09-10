import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Plus } from 'lucide-react';
import type { AddCompDto } from '../../../types/core/comp'; //changed import

interface AddCompModalProps {
  onAddCompany: (company: AddCompDto) => void;
}

const AddCompModal: React.FC<AddCompModalProps> = ({ onAddCompany }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', nameAm: '' });

  const amharicRegex = /^[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\s0-9]*$/;

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setNewCompany((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleSubmit = () => {
    if (!newCompany.name || !newCompany.nameAm) return;

    onAddCompany({
      name: newCompany.name,
      nameAm: newCompany.nameAm,
    });

    setNewCompany({ name: '', nameAm: '' });
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <div className="grid grid-row-2 gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nameAm">የኩባንያው ስም</Label>
            <input
              id="nameAm"
              value={newCompany.nameAm}
              onChange={handleAmharicChange}
              placeholder="ምሳሌ፡ አክሜ ኢንት 1"
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Company Name</Label>
            <input
              id="name"
              value={newCompany.name}
              onChange={(e) =>
                setNewCompany((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
              placeholder="Eg. Acme int 1"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompModal;