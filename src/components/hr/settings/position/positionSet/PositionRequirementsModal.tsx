import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Loader2 } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Label } from '../../../../ui/label';
import { Input } from '../../../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../ui/select';
import type { PositionReqAddDto, PositionReqModDto, PositionReqListDto, UUID } from '../../../../../types/hr/position';
import type { ListItem } from '../../../../../types/List/list';
import { PositionGender, WorkOption } from '../../../../../types/hr/enum';
import { listService } from '../../../../../services/List/listservice';

interface PositionRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PositionReqAddDto | PositionReqModDto) => void;
  positionId: UUID;
  editingRequirement?: PositionReqListDto | null;
}

const PositionRequirementsModal: React.FC<PositionRequirementsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  positionId,
  editingRequirement
}) => {
  // Initialize with default values - using "3" (None) for work options
  const [formData, setFormData] = useState<PositionReqAddDto>({
    positionId,
    gender: '2', // Default to "Both"
    saturdayWorkOption: '3', // Default to "None"
    sundayWorkOption: '3', // Default to "None"
    workingHours: 8,
    professionTypeId: '' as UUID,
  });

  const [professionTypes, setProfessionTypes] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfessionType, setSelectedProfessionType] = useState<UUID | undefined>(undefined);

  // Wrap handleClose in useCallback to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    setFormData({
      positionId,
      gender: '2',
      saturdayWorkOption: '3',
      sundayWorkOption: '3',
      workingHours: 8,
      professionTypeId: '' as UUID,
    });
    setSelectedProfessionType(undefined);
    onClose();
  }, [onClose, positionId]);

  // Fetch profession types when modal opens
  useEffect(() => {
    const fetchProfessionTypes = async () => {
      if (!isOpen) return;

      setLoading(true);
      try {
        const types = await listService.getAllProfessionTypes();
        setProfessionTypes(types);

        // Set first profession type as default if none selected and not editing
        if (types.length > 0 && !selectedProfessionType && !editingRequirement) {
          setSelectedProfessionType(types[0].id);
          setFormData((prev) => ({ ...prev, professionTypeId: types[0].id }));
        }
      } catch (err) {
        console.error("Error fetching profession types:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionTypes();
  }, [isOpen, selectedProfessionType, editingRequirement]);

  // Reset form when modal opens or editing requirement changes
  useEffect(() => {
    if (isOpen) {
      if (editingRequirement) {
        setFormData({
          positionId: editingRequirement.positionId,
          gender: editingRequirement.gender,
          saturdayWorkOption: editingRequirement.saturdayWorkOption,
          sundayWorkOption: editingRequirement.sundayWorkOption,
          workingHours: editingRequirement.workingHours,
          professionTypeId: editingRequirement.professionTypeId,
        });
        setSelectedProfessionType(editingRequirement.professionTypeId);
      } else {
        setFormData({
          positionId,
          gender: '2',
          saturdayWorkOption: '3',
          sundayWorkOption: '3',
          workingHours: 8,
          professionTypeId: professionTypes.length > 0 ? professionTypes[0].id : ('' as UUID),
        });
        setSelectedProfessionType(
          professionTypes.length > 0 ? professionTypes[0].id : undefined
        );
      }
    }
  }, [isOpen, editingRequirement, positionId, professionTypes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'workingHours' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectProfessionType = (value: string) => {
    const selectedId = value as UUID;
    setSelectedProfessionType(selectedId);
    setFormData((prev) => ({ ...prev, professionTypeId: selectedId }));
  };

  const handleSubmit = () => {
    if (!formData.professionTypeId || formData.workingHours <= 0) return;

    if (editingRequirement) {
      const modData: PositionReqModDto = {
        ...formData,
        id: editingRequirement.id,
        rowVersion: editingRequirement.rowVersion,
      };
      onSave(modData);
    } else {
      onSave(formData);
    }

    handleClose();
  };

  // Gender options based on your backend enum
  const genderOptions: ListItem[] = [
    { id: '0' as UUID, name: PositionGender['0'] }, // Male
    { id: '1' as UUID, name: PositionGender['1'] }, // Female
    { id: '2' as UUID, name: PositionGender['2'] }  // Both
  ];

  // Work options including "None" (3) option
  const workOptions: ListItem[] = [
    { id: '0' as UUID, name: WorkOption['0'] }, // Morning
    { id: '1' as UUID, name: WorkOption['1'] }, // Afternoon
    { id: '2' as UUID, name: WorkOption['2'] }, // Both
    { id: '3' as UUID, name: WorkOption['3'] }  // None
  ];

  // Add escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h2 className="text-lg font-bold text-gray-800">
              {editingRequirement ? 'Edit Requirements' : 'Add Requirements'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-4">
            {/* Profession Type */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Select Profession Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedProfessionType || ""}
                onValueChange={handleSelectProfessionType}
                disabled={loading}
                required
              >
                <SelectTrigger className={`
                  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500
                  text-sm transition-colors
                  ${loading ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
                `}>
                  <SelectValue placeholder="Choose a profession type" />
                </SelectTrigger>
                <SelectContent>
                  {professionTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id} className="text-gray-900">
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loading && (
                <p className="text-sm text-gray-500">
                  Loading profession types...
                </p>
              )}
            </div>

            {/* Working Hours */}
            <div className="space-y-2">
              <Label htmlFor="workingHours" className="text-sm text-gray-500">
                Working Hours (per day) <span className="text-red-500"> *</span>
              </Label>
              <Input
                id="workingHours"
                name="workingHours"
                type="number"
                step="0.5"
                value={formData.workingHours}
                onChange={handleInputChange}
                placeholder="8"
                min="0"
                max="24"
                className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Gender Preference
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white text-gray-900">
                  <SelectValue placeholder="Select gender preference" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id} className="text-gray-900">
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Work Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-700">
                  Saturday Work
                </Label>
                <Select
                  value={formData.saturdayWorkOption}
                  onValueChange={(value) => handleSelectChange('saturdayWorkOption', value)}
                >
                  <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white text-gray-900">
                    <SelectValue placeholder="Select Saturday work" />
                  </SelectTrigger>
                  <SelectContent>
                    {workOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id} className="text-gray-900">
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-700">
                  Sunday Work
                </Label>
                <Select
                  value={formData.sundayWorkOption}
                  onValueChange={(value) => handleSelectChange('sundayWorkOption', value)}
                >
                  <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white text-gray-900">
                    <SelectValue placeholder="Select Sunday work" />
                  </SelectTrigger>
                  <SelectContent>
                    {workOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id} className="text-gray-900">
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!formData.professionTypeId || formData.workingHours <= 0 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                editingRequirement ? 'Update' : 'Save'
              )}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PositionRequirementsModal;