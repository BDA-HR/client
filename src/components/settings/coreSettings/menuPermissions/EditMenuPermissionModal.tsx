import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';
import List from '../../../List/list';
import type { 
  PerMenuModDto, 
  PerMenuListDto,
  UUID 
} from '../../../../types/core/Settings/menu-permissions';
import type { NameListItem } from '../../../../types/NameList/nameList';
import { menuPermissionService } from '../../../../services/core/settings/ModCore/menu-permissionservice';
import toast from 'react-hot-toast';

interface EditMenuPermissionModalProps {
  permission: PerMenuListDto | null;
  onEditPermission: (permission: PerMenuModDto) => Promise<any>;
  onClose?: () => void;
}

const EditMenuPermissionModal: React.FC<EditMenuPermissionModalProps> = ({ 
  permission, 
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
  
  // State for module names
  const [moduleNames, setModuleNames] = useState<NameListItem[]>([]);
  const [isFetchingModules, setIsFetchingModules] = useState(false);
  const [moduleError, setModuleError] = useState<string | null>(null);

  // Fetch module names when modal opens
  const fetchModuleNames = async () => {
    if (isOpen) {
      setIsFetchingModules(true);
      setModuleError(null);
      try {
        const modules = await menuPermissionService.getAllModuleNames();
        
        if (Array.isArray(modules)) {
          setModuleNames(modules);
        } else {
          console.error('Modules is not an array:', modules);
          setModuleError('Invalid response format from server');
          setModuleNames([]);
        }
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to load modules';
        console.error('Error fetching module names:', error);
        setModuleError(errorMessage);
        setModuleNames([]);
      } finally {
        setIsFetchingModules(false);
      }
    }
  };

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

  useEffect(() => {
    if (isOpen && moduleNames.length === 0 && !isFetchingModules && !moduleError) {
      fetchModuleNames();
    }
  }, [isOpen]);

  // Prepare list items for the List component
  const moduleListItems = moduleNames
    .filter(module => module && module.id && module.name)
    .map(module => ({
      id: module.id,
      name: module.name
    }));

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, key: value }));
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, desc: value }));
  };

  const handleModuleSelect = (item: { id: UUID; name: string }) => {
    setEditedPermission((prev) => ({ ...prev, perModuleId: item.id as UUID }));
  };

  const handleSubmit = async () => {
    if (!editedPermission.key.trim() || !editedPermission.desc.trim() || !editedPermission.perModuleId) {
      toast.error('Please fill all required fields');
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
      
      // Show success message
      const successMessage = response?.data?.message || 
                            response?.message || 
                            'Menu permission updated successfully!';
      toast.success(successMessage);
      
      handleClose();
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update permission';
      toast.error(errorMessage);
      console.error('Error updating menu permission:', error);
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
      setModuleError(null);
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
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
            <PenBox size={20} className="text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-800">Edit Menu Permission</h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Module Selection using List Component */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Select Module <span className="text-red-500">*</span>
            </Label>
            
            {isFetchingModules ? (
              <div className="flex items-center justify-center p-4 border rounded-lg bg-gray-50">
                <div className="h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-sm text-gray-600">Loading modules...</span>
              </div>
            ) : moduleError ? (
              <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">{moduleError}</p>
              </div>
            ) : (
              <>
                <List
                  items={moduleListItems}
                  selectedValue={editedPermission.perModuleId}
                  onSelect={handleModuleSelect}
                  label=""
                  placeholder="Select a module"
                  required
                  disabled={isSubmitting}
                />
                {moduleListItems.length === 0 && !moduleError && (
                  <p className="text-sm text-amber-600 mt-1">
                    No modules available
                  </p>
                )}
              </>
            )}
          </div>

          {/* Menu Key */}
          <div className="space-y-3">
            <Label htmlFor="edit-key" className="text-sm font-medium text-gray-700">
              Menu Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-key"
              value={editedPermission.key}
              onChange={handleKeyChange}
              placeholder="menu.module.feature (e.g., menu.hr.dashboard)"
              className="w-full"
              disabled={isSubmitting || isFetchingModules}
              aria-invalid={!editedPermission.key.trim()}
            />
          </div>

          {/* Menu Name */}
          <div className="space-y-3">
            <Label htmlFor="edit-desc" className="text-sm font-medium text-gray-700">
              Menu Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-desc"
              value={editedPermission.desc}
              onChange={handleDescChange}
              placeholder="Enter menu name"
              className="w-full"
              disabled={isSubmitting || isFetchingModules}
              aria-invalid={!editedPermission.desc.trim()}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-center items-center gap-3">
            <Button
              variant="outline"
              className="cursor-pointer px-6 min-w-[100px]"
              onClick={handleClose}
              disabled={isSubmitting || isFetchingModules}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6 min-w-[100px] shadow-sm hover:shadow transition-shadow duration-200"
              onClick={handleSubmit}
              disabled={isSubmitting || 
                       isFetchingModules || 
                       moduleError !== null || 
                       moduleListItems.length === 0 ||
                       !editedPermission.key.trim() || 
                       !editedPermission.desc.trim() || 
                       !editedPermission.perModuleId}
              type="button"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditMenuPermissionModal;