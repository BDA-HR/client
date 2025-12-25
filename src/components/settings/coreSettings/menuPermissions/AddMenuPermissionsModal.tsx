import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';
import type { PerMenuAddDto } from '../../../../types/core/Settings/menu-permissions';

interface AddMenuPermissionModalProps {
  onAddPermission: (permission: PerMenuAddDto) => Promise<any>;
}

const AddMenuPermissionModal: React.FC<AddMenuPermissionModalProps> = ({ onAddPermission }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPermission, setNewPermission] = useState<Omit<PerMenuAddDto, 'perModuleId'>>({
    key: '',
    desc: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newPermission.key.trim() || !newPermission.desc.trim()) {
      console.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Generate a mock perModuleId for the API (you can modify this as needed)
      const mockPerModuleId = '00000000-0000-0000-0000-000000000000' as const;
      
      const response = await onAddPermission({
        perModuleId: mockPerModuleId,
        key: newPermission.key.trim(),
        desc: newPermission.desc.trim(),
      });

      console.log('Menu Permission added successfully!', response);
      
      // Reset form and close modal
      setNewPermission({ key: '', desc: '' });
      setIsOpen(false);
      
    } catch (error: any) {
      console.error('Error adding menu permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setNewPermission({ key: '', desc: '' });
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
      >
        <BadgePlus size={18} className="mr-2" />
        Add Menu Permission
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
                <BadgePlus size={20} className="text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-800">Add New</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                disabled={isLoading}
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Menu Key */}
                <div className="space-y-2">
                  <Label htmlFor="key" className="text-sm text-gray-500">
                    Menu Key <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="key"
                    value={newPermission.key}
                    onChange={(e) =>
                      setNewPermission((prev) => ({ ...prev, key: e.target.value }))
                    }
                    placeholder="Enter menu key (e.g., menu.hr.dashboard)"
                    className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="desc" className="text-sm text-gray-500">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="desc"
                    value={newPermission.desc}
                    onChange={(e) =>
                      setNewPermission((prev) => ({ ...prev, desc: e.target.value }))
                    }
                    placeholder="Enter permission description"
                    className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    disabled={isLoading}
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer px-6"
                  onClick={handleClose}
                  disabled={isLoading}
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

export default AddMenuPermissionModal;