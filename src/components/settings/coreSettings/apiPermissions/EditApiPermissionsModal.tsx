import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import type { 
  PerApiListDto, 
  PerApiModDto,
  UUID
} from '../../../../types/core/Settings/api-permission';
import toast from 'react-hot-toast';

interface EditApiPermissionModalProps {
  permission: PerApiListDto;
  onEditPermission: (permission: PerApiModDto) => Promise<any>;
  isOpen: boolean;
  onClose: () => void;
}

const EditApiPermissionModal: React.FC<EditApiPermissionModalProps> = ({ 
  permission, 
  onEditPermission, 
  isOpen,
  onClose 
}) => {
  const [editedPermission, setEditedPermission] = useState<PerApiModDto>({
    id: permission.id,
    perMenuId: permission.perMenuId,
    key: permission.key,
    desc: permission.name
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when permission prop changes
  useEffect(() => {
    setEditedPermission({
      id: permission.id,
      perMenuId: permission.perMenuId,
      key: permission.key,
      desc: permission.name
    });
  }, [permission]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, key: value }));
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, desc: value }));
  };

  const handleMenuChange = (value: string) => {
    setEditedPermission((prev) => ({ ...prev, perMenuId: value as UUID }));
  };

  // Mock menu options - replace with actual data from your API
  const menuOptions = [
    { id: 'menu-hr' as UUID, name: 'HR Management' },
    { id: 'menu-finance' as UUID, name: 'Finance' },
    { id: 'menu-crm' as UUID, name: 'CRM' },
    { id: 'menu-inventory' as UUID, name: 'Inventory' },
    { id: 'menu-procurement' as UUID, name: 'Procurement' },
    { id: 'menu-settings' as UUID, name: 'Settings' }
  ];

  const selectedMenuItem = menuOptions.find(menu => menu.id === editedPermission.perMenuId);
  const menuPlaceholder = selectedMenuItem ? selectedMenuItem.name : "Select a menu";

  const handleSubmit = async () => {
    if (!editedPermission.key.trim() || !editedPermission.desc.trim() || !editedPermission.perMenuId) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await onEditPermission(editedPermission);

      const successMessage = 
        response?.data?.message || 
        response?.message || 
        'API permission updated successfully!';
      
      toast.success(successMessage);
      
      onClose();
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update API permission';
      toast.error(errorMessage);
      console.error('Error updating API permission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

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
            <PenBox size={20} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">Edit Access Permission</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Menu Selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-perMenuId" className="text-sm text-gray-500">
                Menu <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editedPermission.perMenuId}
                onValueChange={handleMenuChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                  <SelectValue placeholder={menuPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {menuOptions.map((menu) => (
                    <SelectItem key={menu.id} value={menu.id}>
                      {menu.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="edit-key" className="text-sm text-gray-500">
                Key <span className="text-red-500">*</span>
              </Label>
              <input
                id="edit-key"
                value={editedPermission.key}
                onChange={handleKeyChange}
                placeholder="api.hr.employee.create"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-desc" className="text-sm text-gray-500">
                Description <span className="text-red-500">*</span>
              </Label>
              <input
                id="edit-desc"
                value={editedPermission.desc}
                onChange={handleDescChange}
                placeholder="Permission to create employees"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                disabled={isSubmitting}
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
              disabled={!editedPermission.key.trim() || !editedPermission.desc.trim() || !editedPermission.perMenuId || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditApiPermissionModal;