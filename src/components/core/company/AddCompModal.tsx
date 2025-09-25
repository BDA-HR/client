import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { BadgePlus } from 'lucide-react';
import type { AddCompDto } from '../../../types/core/comp';
import { amharicRegex } from '../../../utils/amharic-regex';

interface AddCompModalProps {
  onAddCompany: (company: AddCompDto) => void;
}

const AddCompModal: React.FC<AddCompModalProps> = ({ onAddCompany }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', nameAm: '' });

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
          <BadgePlus size={18} />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()} // Prevent closing when clicking outside
      >
        <DialogHeader className='border-b pb-3 flex flex-row justify-between items-center'>
          <div>
            <DialogTitle className='flex items-center gap-2'> <BadgePlus size={20}/> Add New</DialogTitle>
            <DialogDescription className='hidden'>Add New Company</DialogDescription>
          </div>
        </DialogHeader>
        <div className="grid grid-row-2 gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nameAm">የኩባንያው ስም<span className='text-red-500'>*</span></Label>
            <input
              id="nameAm"
              value={newCompany.nameAm}
              onChange={handleAmharicChange}
              placeholder="ምሳሌ፡ አክሜ ኢንት 1"
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Company Name<span className='text-red-500'>*</span></Label>
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
        <div className="flex justify-center items-center gap-1.5 border-t pt-6">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
            onClick={handleSubmit}
          >
            Save
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'} className='cursor-pointer'>Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompModal;