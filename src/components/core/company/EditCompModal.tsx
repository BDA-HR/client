import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
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

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-1/3 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <PenBox size={20} />
            <h2 className="text-lg font-bold text-gray-800">Edit</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Company Names */}
            <div className="space-y-2">
              <Label htmlFor="editCompanyNameAm" className="text-sm text-gray-500">
                የኩባንያው ስም <span className="text-red-500">*</span>
              </Label>
              <Input
                id="editCompanyNameAm"
                value={editedCompany.nameAm}
                onChange={handleAmharicChange}
                placeholder="ምሳሌ፡ አክሜ ኢንት 1"
                className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCompanyName" className="text-sm text-gray-500">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="editCompanyName"
                value={editedCompany.name}
                onChange={(e) => setEditedCompany(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Eg. Acme int 1"
                className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="flex justify-center items-center gap-3">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!editedCompany.name.trim() || !editedCompany.nameAm.trim()}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditCompModal;