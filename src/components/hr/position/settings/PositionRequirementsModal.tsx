import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Settings } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import List from '../../../../components/List/list';
import type { PositionReqAddDto, PositionReqModDto, PositionReqListDto, UUID, ProfessionTypeDto } from '../../../../types/hr/position';
import type { ListItem } from '../../../../types/List/list';
// import { PositionGender, WorkOption } from '../../../../types/hr/enum';

interface PositionRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PositionReqAddDto | PositionReqModDto) => void;
  positionId: UUID;
  professionTypes: ProfessionTypeDto[];
  editingRequirement?: PositionReqListDto | null;
}

const PositionRequirementsModal: React.FC<PositionRequirementsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  positionId,
  professionTypes,
  editingRequirement
}) => {
  const [formData, setFormData] = useState<PositionReqAddDto>({
    positionId,
    gender: '2',
    saturdayWorkOption: '2',
    sundayWorkOption: '2',
    workingHours: 8,
    professionTypeId: '' as UUID,
  });

  useEffect(() => {
    if (editingRequirement) {
      setFormData({
        positionId: editingRequirement.positionId,
        gender: editingRequirement.gender,
        saturdayWorkOption: editingRequirement.saturdayWorkOption,
        sundayWorkOption: editingRequirement.sundayWorkOption,
        workingHours: editingRequirement.workingHours,
        professionTypeId: editingRequirement.professionTypeId,
      });
    } else {
      setFormData({
        positionId,
        gender: '2',
        saturdayWorkOption: '2',
        sundayWorkOption: '2',
        workingHours: 8,
        professionTypeId: '' as UUID,
      });
    }
  }, [editingRequirement, positionId]);

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

    onClose();
  };

  const professionTypeListItems: ListItem[] = professionTypes.map(type => ({
    id: type.id,
    name: type.name,
  }));

  // const selectedProfessionType = professionTypes.find(pt => pt.id === formData.professionTypeId);

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
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-3">
            {/* Profession Type */}
            <div className="space-y-2">
              <List
                items={professionTypeListItems}
                selectedValue={formData.professionTypeId}
                onSelect={(item) => handleSelectChange('professionTypeId', item.id)}
                label="Select Profession Type"
                placeholder="Choose a profession type"
                required
              />
            </div>

            {/* Working Hours */}
            <div className="space-y-2">
              <Label htmlFor="workingHours" className="text-sm text-gray-500">
                Working Hours (per day) <span className="text-red-500">*</span>
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
              <Label htmlFor="gender" className="text-sm text-gray-500">
                Gender Preference
              </Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => handleSelectChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
              >
                <option value="0">Male Only</option>
                <option value="1">Female Only</option>
                <option value="2">Both Genders</option>
              </select>
            </div>

            {/* Work Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saturdayWorkOption" className="text-sm text-gray-500">
                  Saturday Work
                </Label>
                <select
                  id="saturdayWorkOption"
                  name="saturdayWorkOption"
                  value={formData.saturdayWorkOption}
                  onChange={(e) => handleSelectChange('saturdayWorkOption', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="0">Morning</option>
                  <option value="1">Afternoon</option>
                  <option value="2">Both</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sundayWorkOption" className="text-sm text-gray-500">
                  Sunday Work
                </Label>
                <select
                  id="sundayWorkOption"
                  name="sundayWorkOption"
                  value={formData.sundayWorkOption}
                  onChange={(e) => handleSelectChange('sundayWorkOption', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="0">Morning</option>
                  <option value="1">Afternoon</option>
                  <option value="2">Both</option>
                </select>
              </div>
            </div>

            {/* Requirements Preview */}
            {/* {(formData.professionTypeId || formData.workingHours > 0) && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-800 font-medium mb-2">Requirements Preview:</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Profession Type</p>
                    <p className="font-semibold">{selectedProfessionType?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Working Hours</p>
                    <p className="font-semibold">{formData.workingHours} hours/day</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gender</p>
                    <p className="font-semibold">{PositionGender[formData.gender as keyof typeof PositionGender]}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Saturday Work</p>
                    <p className="font-semibold">{WorkOption[formData.saturdayWorkOption as keyof typeof WorkOption]}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sunday Work</p>
                    <p className="font-semibold">{WorkOption[formData.sundayWorkOption as keyof typeof WorkOption]}</p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!formData.professionTypeId || formData.workingHours <= 0}
            >
              {editingRequirement ? 'Update' : 'Save'}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={onClose}
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