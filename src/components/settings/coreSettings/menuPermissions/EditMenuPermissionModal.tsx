import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';
import { Checkbox } from '../../../ui/checkbox';
import List from '../../../List/list';
import type {
  PerMenuModDto,
  PerMenuListDto,
  UUID
} from '../../../../types/core/Settings/menu-permissions';
import type { NameListItem } from '../../../../types/NameList/nameList';
import { menuPermissionService } from '../../../../services/core/settings/ModCore/menu-permissionservice';
import toast from 'react-hot-toast';

// Helper function to safely handle null/undefined values
const safeValue = (value: any, defaultValue: any = ''): any => {
  if (value === null || value === undefined || value === 'null') {
    return defaultValue;
  }
  return value;
};

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
    label: '', // Use label directly (matches API)
    path: '', // New path field
    icon: '', // New icon field
    isChild: false, // New isChild field
    parentKey: '', // New parentKey field
    order: 0 // New order field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add errors state for field-specific validation
  const [errors, setErrors] = useState<{
    key?: string;
    label?: string;
    path?: string;
    icon?: string;
    parentKey?: string;
  }>({});

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
        key: safeValue(permission.key),
        label: safeValue(permission.label), // Map existing name to label
        path: safeValue(permission.path, ""), // New field
        icon: safeValue(permission.icon, ""), // New field
        isChild: safeValue(permission.isChild, false), // New field
        parentKey: safeValue(permission.parentKey, ""), // New field
        order: safeValue(permission.order, 0), // New field
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

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, label: value }));
    // Clear label error when user starts typing
    if (errors.label) setErrors(prev => ({ ...prev, label: undefined }));
  };

   const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     setEditedPermission((prev) => ({ ...prev, key: value }));
     // Clear key error when user starts typing
     if (errors.key) setErrors((prev) => ({ ...prev, key: undefined }));
   };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, path: value }));
    // Clear path error when user starts typing
    if (errors.path) setErrors(prev => ({ ...prev, path: undefined }));
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, icon: value }));
    // Clear icon error when user starts typing
    if (errors.icon) setErrors(prev => ({ ...prev, icon: undefined }));
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
    setEditedPermission((prev) => ({ ...prev, order: value }));
  };

  const handleParentKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPermission((prev) => ({ ...prev, parentKey: value }));
    // Clear parentKey error when user starts typing
    if (errors.parentKey) setErrors(prev => ({ ...prev, parentKey: undefined }));
  };

  const handleModuleSelect = (item: { id: UUID; name: string }) => {
    setEditedPermission((prev) => ({ ...prev, perModuleId: item.id as UUID }));
  };

  const handleSubmit = async () => {
    if (!editedPermission.label.trim() ||
      !editedPermission.path.trim() ||
      !editedPermission.icon.trim() ||
      !editedPermission.perModuleId ||
      (editedPermission.isChild && !editedPermission.parentKey.trim())) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map to the exact API structure expected by backend
      const dataToSend = {
        id: editedPermission.id,
        perModuleId: editedPermission.perModuleId,
        key: editedPermission.key.trim(),
        label: editedPermission.label.trim(), // Backend expects 'label', not 'desc'
        path: editedPermission.path.trim(),
        icon: editedPermission.icon.trim(),
        isChild: editedPermission.isChild,
        parentKey: editedPermission.parentKey.trim(),
        order: editedPermission.order
      };

      console.log('Sending edit data to API:', dataToSend);

      const response = await onEditPermission(dataToSend);

      console.log('Menu Permission updated successfully!', response);

      // Show success message
      const successMessage = response?.data?.message ||
        response?.message ||
        'Menu permission updated successfully!';
      toast.success(successMessage);

      handleClose();

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update permission';

      // Show the general error message
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
        label: '',
        path: '',
        icon: '',
        isChild: false,
        parentKey: '',
        order: 0
      });
      setErrors({}); // Clear errors
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
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <PenBox size={20} className="text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Edit Menu Permission
              </h2>
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
        <div className="p-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-2">
              {/* Module Selection */}
              <div className="space-y-2 min-h-[76px]">
                <Label className="text-sm font-medium text-gray-700">
                  Select Module <span className="text-red-500">*</span>
                </Label>

                {isFetchingModules ? (
                  <div className="flex items-center justify-center p-4 border rounded-lg bg-gray-50">
                    <div className="h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-sm text-gray-600">
                      Loading modules...
                    </span>
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
              {/* Menu key */}
              <div className="space-y-2 min-h-[76px]">
                <Label
                  htmlFor="edit-key"
                  className="text-sm font-medium text-gray-700"
                >
                  Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-key"
                  value={editedPermission.key}
                  onChange={handleKeyChange}
                  placeholder="Enter menu key"
                  className="w-full"
                  disabled={isSubmitting || isFetchingModules}
                  aria-invalid={!editedPermission.key.trim()}
                />
              </div>

              {/* Path */}
              <div className="space-y-2 min-h-[76px]">
                <Label
                  htmlFor="edit-path"
                  className="text-sm font-medium text-gray-700"
                >
                  Path <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-path"
                  value={editedPermission.path}
                  onChange={handlePathChange}
                  placeholder="Enter menu path (e.g., /dashboard)"
                  className="w-full"
                  disabled={isSubmitting || isFetchingModules}
                  aria-invalid={!editedPermission.path.trim()}
                />
              </div>
              {/* Menu Type - Is Child Checkbox */}
              <div className="space-y-2 min-h-[76px]">
                <Label className="text-sm font-medium text-gray-700">
                  Menu Type
                </Label>
                <div className="flex items-center space-x-2 h-10">
                  <Checkbox
                    id="edit-isChild"
                    checked={editedPermission.isChild}
                    onCheckedChange={(checked) => {
                      setEditedPermission((prev) => ({
                        ...prev,
                        isChild: checked as boolean,
                        parentKey: checked ? prev.parentKey : "", // Clear parent key if not child
                      }));
                    }}
                    disabled={isSubmitting || isFetchingModules}
                  />
                  <Label
                    htmlFor="edit-isChild"
                    className="text-sm font-medium text-gray-700"
                  >
                    Is Child Menu
                  </Label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              {/* Order */}
              <div className="space-y-2 min-h-[76px]">
                <Label
                  htmlFor="edit-order"
                  className="text-sm font-medium text-gray-700"
                >
                  Order <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-order"
                  type="number"
                  min="0"
                  value={
                    editedPermission.order === 0 ? "" : editedPermission.order
                  }
                  onChange={handleOrderChange}
                  placeholder="Enter display order (e.g., 1, 2, 3...)"
                  className="w-full"
                  disabled={isSubmitting || isFetchingModules}
                  aria-invalid={editedPermission.order < 0}
                />
              </div>
              {/* Menu Name/Label */}
              <div className="space-y-2 min-h-[76px]">
                <Label
                  htmlFor="edit-label"
                  className="text-sm font-medium text-gray-700"
                >
                  Label <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-label"
                  value={editedPermission.label}
                  onChange={handleLabelChange}
                  placeholder="Enter menu name/label"
                  className="w-full"
                  disabled={isSubmitting || isFetchingModules}
                  aria-invalid={!editedPermission.label.trim()}
                />
              </div>
              {/* Icon */}
              <div className="space-y-2 min-h-[76px]">
                <Label
                  htmlFor="edit-icon"
                  className="text-sm font-medium text-gray-700"
                >
                  Icon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-icon"
                  value={editedPermission.icon}
                  onChange={handleIconChange}
                  placeholder="Enter icon name (e.g., dashboard, users)"
                  className="w-full"
                  disabled={isSubmitting || isFetchingModules}
                  aria-invalid={!editedPermission.icon.trim()}
                />
              </div>

              {/* Parent Key - Always reserve space but conditionally show content */}
              <div className="space-y-2 min-h-[76px]">
                {editedPermission.isChild ? (
                  <>
                    <Label
                      htmlFor="edit-parentKey"
                      className="text-sm font-medium text-gray-700"
                    >
                      Parent Key <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-parentKey"
                      value={editedPermission.parentKey}
                      onChange={handleParentKeyChange}
                      placeholder="Enter parent menu key"
                      className="w-full"
                      disabled={isSubmitting || isFetchingModules}
                      aria-invalid={!editedPermission.parentKey.trim()}
                    />
                  </>
                ) : (
                  <div className="opacity-0 pointer-events-none">
                    <Label className="text-sm font-medium text-gray-700">
                      -
                    </Label>
                    <div className="h-10 w-full"></div>
                  </div>
                )}
              </div>
            </div>
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
              disabled={
                isSubmitting ||
                isFetchingModules ||
                moduleError !== null ||
                moduleListItems.length === 0 ||
                !editedPermission.label.trim() ||
                !editedPermission.path.trim() ||
                !editedPermission.icon.trim() ||
                !editedPermission.perModuleId ||
                (editedPermission.isChild && !editedPermission.parentKey.trim())
              }
              type="button"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditMenuPermissionModal;