import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import DialogOverlay from '../ui/dialog-overlay';
import type { Company } from '../../data/company-branches';

interface EditCompModalProps {
  company: Company | null;
  onSave: (company: Company) => void;
  onClose: () => void;
}

const EditCompModal: React.FC<EditCompModalProps> = ({ company, onSave, onClose }) => {
  if (!company) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogOverlay>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          <div className="grid grid-row-2 gap-4 py-4">
            <div className='flex gap-4 flex-col'>
              <Label htmlFor="editNameAm">የኩባንያው ስም</Label>
              <Input
                id="editNameAm"
                value={company.nameAm}
                onChange={(e) =>
                  onSave({ ...company, nameAm: e.target.value })
                }
              />
            </div>
            <div className='flex gap-4 flex-col'>
              <Label htmlFor="editName">Company Name</Label>
              <Input
                id="editName"
                value={company.name}
                onChange={(e) =>
                  onSave({ ...company, name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => onSave(company)}
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