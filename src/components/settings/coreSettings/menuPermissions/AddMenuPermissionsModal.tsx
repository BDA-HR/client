import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';
import List from '../../../List/list';
import type { ListItem } from '../../../../types/List/list';
import type { PerMenuAddDto, UUID } from '../../../../types/core/Settings/menu-permissions';
import toast from 'react-hot-toast';

// Mock module data - convert string IDs to UUID format
const mockModules = [
  { id: '1' as UUID, name: 'HR Management' },
  { id: '2' as UUID, name: 'Finance' },
  { id: '3' as UUID, name: 'CRM' },
  { id: '4' as UUID, name: 'Inventory' },
  { id: '5' as UUID, name: 'Procurement' },
  { id: '6' as UUID, name: 'Core' },
  { id: '7' as UUID, name: 'File' },
];

interface AddMenuPermissionModalProps {
  onAddPermission: (permission: PerMenuAddDto) => Promise<any>;
}

const AddMenuPermissionModal: React.FC<AddMenuPermissionModalProps> = ({ onAddPermission }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPermission, setNewPermission] = useState<PerMenuAddDto>({
    perModuleId: '' as UUID,
    key: '',
    desc: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<UUID | undefined>(undefined);
  const [errors, setErrors] = useState<{
    perModuleId?: string;
    key?: string;
    desc?: string;
  }>({});

  // Prepare list items for the List component
  const moduleListItems: ListItem[] = mockModules.map(module => ({
    id: module.id,
    name: module.name
  }));

  const handleSelectModule = (item: ListItem) => {
    setSelectedModule(item.id);
    setNewPermission(prev => ({ ...prev, perModuleId: item.id as UUID }));
    if (errors.perModuleId) setErrors(prev => ({ ...prev, perModuleId: undefined }));
  };

  const validateForm = () => {
    const newErrors: {
      perModuleId?: string;
      key?: string;
      desc?: string;
    } = {};

    if (!newPermission.perModuleId) {
      newErrors.perModuleId = 'Please select a module';
    }

    if (!newPermission.key.trim()) {
      newErrors.key = 'Menu key is required';
    } else if (!newPermission.key.includes('menu.')) {
      newErrors.key = 'Menu key must start with "menu."';
    }

    if (!newPermission.desc.trim()) {
      newErrors.desc = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const response = await onAddPermission({
        ...newPermission,
        key: newPermission.key.trim(),
        desc: newPermission.desc.trim(),
      });

      const successMessage = 
        response?.data?.message || 
        response?.message || 
        'Menu permission added successfully!';
      
      toast.success(successMessage);
      
      // Reset form and close modal
      setNewPermission({ perModuleId: '' as UUID, key: '', desc: '' });
      setSelectedModule(undefined);
      setErrors({});
      setIsOpen(false);
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add menu permission';
      toast.error(errorMessage);
      console.error('Error adding menu permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      // Reset form when closing
      setNewPermission({ perModuleId: '' as UUID, key: '', desc: '' });
      setSelectedModule(undefined);
      setErrors({});
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const isFormValid = newPermission.perModuleId && newPermission.key.trim() && newPermission.desc.trim();

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer transition-colors duration-200"
      >
        <BadgePlus size={18} className="mr-2" />
        Add Menu Permission
      </Button>

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isLoading) {
              handleClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto"
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                  <BadgePlus size={20} className="text-emerald-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Add Menu Permission</h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                disabled={isLoading}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Module Selection using List Component */}
              <div className="space-y-3">
                <List
                  items={moduleListItems}
                  selectedValue={selectedModule}
                  onSelect={handleSelectModule}
                  label="Select Module"
                  placeholder="Select a module"
                  required
                  disabled={isLoading}
                />
                {errors.perModuleId && (
                  <p className="text-sm text-red-500 mt-1">{errors.perModuleId}</p>
                )}
              </div>

              {/* Menu Key */}
              <div className="space-y-3">
                <Label htmlFor="key" className="text-sm font-medium text-gray-700">
                  Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="key"
                  value={newPermission.key}
                  onChange={(e) => {
                    setNewPermission(prev => ({ ...prev, key: e.target.value }));
                    if (errors.key) setErrors(prev => ({ ...prev, key: undefined }));
                  }}
                  placeholder="menu.module.feature (e.g., menu.hr.dashboard)"
                  className={`w-full ${errors.key ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  disabled={isLoading}
                  aria-invalid={!!errors.key}
                  aria-describedby={errors.key ? "key-error" : undefined}
                />
                {errors.key && (
                  <p id="key-error" className="text-sm text-red-500">{errors.key}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="desc" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="desc"
                  value={newPermission.desc}
                  onChange={(e) => {
                    setNewPermission(prev => ({ ...prev, desc: e.target.value }));
                    if (errors.desc) setErrors(prev => ({ ...prev, desc: undefined }));
                  }}
                  placeholder="Enter permission description"
                  className={`w-full ${errors.desc ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  disabled={isLoading}
                  aria-invalid={!!errors.desc}
                  aria-describedby={errors.desc ? "desc-error" : undefined}
                />
                {errors.desc && (
                  <p id="desc-error" className="text-sm text-red-500">{errors.desc}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl">
              <div className="flex justify-center items-center gap-3">
                <Button
                  variant="outline"
                  className="cursor-pointer px-6 min-w-[100px]"
                  onClick={handleClose}
                  disabled={isLoading}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6 min-w-[100px] shadow-sm hover:shadow transition-shadow duration-200"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isLoading}
                  type="button"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    'Add Permission'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default AddMenuPermissionModal;