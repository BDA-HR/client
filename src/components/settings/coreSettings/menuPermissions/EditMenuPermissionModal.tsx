import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import type { 
  PerMenuModDto, 
  PerMenuListDto, 
  ModPerMenuListDto,
  UUID 
} from '../../../../types/core/Settings/menu-permissions';

interface EditMenuPermissionModalProps {
  permission: PerMenuListDto | null;
  modules: ModPerMenuListDto[];
  onEditPermission: (permission: PerMenuModDto) => Promise<any>;
  onClose?: () => void;
}

const EditMenuPermissionModal: React.FC<EditMenuPermissionModalProps> = ({ 
  permission, 
  modules, 
  onEditPermission, 
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedPermission, setEditedPermission] = useState<PerMenuModDto>({
    id: '' as UUID,
    perModuleId: '' as UUID,
    key: '',
    desc: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (permission) {
      console.log('Modal received permission:', permission);
      setEditedPermission({
        id: permission.id,
        perModuleId: permission.perModuleId,
        key: permission.key,
        desc: permission.name
      });
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [permission]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, key: value }));
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, desc: value }));
  };

  const handleModuleChange = (value: string) => {
    setEditedPermission((prev) => ({ ...prev, perModuleId: value as UUID }));
  };

  const selectedModule = modules.find(module => module.perModuleId === editedPermission.perModuleId);
  const modulePlaceholder = selectedModule ? selectedModule.perModule : "Select a module";

  const handleSubmit = async () => {
    if (!editedPermission.key.trim() || !editedPermission.desc.trim() || !editedPermission.perModuleId) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await onEditPermission({
        ...editedPermission,
        key: editedPermission.key.trim(),
        desc: editedPermission.desc.trim(),
      });

      console.log('Menu Permission updated successfully!', response);
      
      handleClose();
      
    } catch (error: any) {
      console.error('Error updating menu permission:', error);
      alert(error.message || 'Failed to update permission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEditedPermission({
        id: '' as UUID,
        perModuleId: '' as UUID,
        key: '',
        desc: ''
      });
      setIsOpen(false);
      if (onClose) onClose();
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
            <h2 className="text-lg font-bold text-gray-800">Edit Menu Permission</h2>
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
            {/* Module Selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-perModuleId" className="text-sm text-gray-500">
                Module <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editedPermission.perModuleId}
                onValueChange={handleModuleChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                  <SelectValue placeholder={modulePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.perModuleId} value={module.perModuleId}>
                      {module.perModule}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Menu Key */}
            <div className="space-y-2">
              <Label htmlFor="edit-key" className="text-sm text-gray-500">
                Menu Key <span className="text-red-500">*</span>
              </Label>
              <input
                id="edit-key"
                value={editedPermission.key}
                onChange={handleKeyChange}
                placeholder="menu.hr.dashboard"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Menu Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-desc" className="text-sm text-gray-500">
                Menu Name <span className="text-red-500">*</span>
              </Label>
              <input
                id="edit-desc"
                value={editedPermission.desc}
                onChange={handleDescChange}
                placeholder="HR Dashboard"
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
              disabled={isSubmitting || !editedPermission.key.trim() || !editedPermission.desc.trim() || !editedPermission.perModuleId}
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

export default EditMenuPermissionModal;