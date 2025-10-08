import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import type { AddCompDto } from '../../../types/core/comp';
import { amharicRegex } from '../../../utils/amharic-regex';

interface AddCompModalProps {
  onAddCompany: (company: AddCompDto) => void;
}

const AddCompModal: React.FC<AddCompModalProps> = ({ onAddCompany }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
      >
        <BadgePlus size={18} />
        Add Company
      </Button>

      {/* Modal */}
      {isOpen && (
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
                <BadgePlus size={20} />
                <h2 className="text-lg font-bold text-gray-800">Add New</h2>
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
                  <Label htmlFor="companyNameAm" className="text-sm text-gray-500">
                    የኩባንያው ስም <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyNameAm"
                    value={newCompany.nameAm}
                    onChange={handleAmharicChange}
                    placeholder="ምሳሌ፡ አክሜ ኢንት 1"
                    className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm text-gray-500">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={newCompany.name}
                    onChange={(e) =>
                      setNewCompany((prev) => ({ ...prev, name: e.target.value }))
                    }
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
                  disabled={!newCompany.name.trim() || !newCompany.nameAm.trim()}
                >
                  Save
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
      )}
    </>
  );
};

export default AddCompModal;