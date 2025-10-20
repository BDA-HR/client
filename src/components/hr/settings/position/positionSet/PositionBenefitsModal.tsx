import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Award } from 'lucide-react';
import { Button } from '../../../../ui/button';
// import { Label } from '../../../../components/ui/label';
import List from '../../../../List/list';
import type { PositionBenefitAddDto, PositionBenefitModDto, PositionBenefitListDto, UUID, BenefitSettingDto } from '../../../../../types/hr/position';
import type { ListItem } from '../../../../../types/List/list';

interface PositionBenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PositionBenefitAddDto | PositionBenefitModDto) => void;
  positionId: UUID;
  benefitSettings: BenefitSettingDto[];
  editingBenefit?: PositionBenefitListDto | null;
}

const PositionBenefitsModal: React.FC<PositionBenefitsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  positionId,
  benefitSettings,
  editingBenefit
}) => {
  const [selectedBenefitSetting, setSelectedBenefitSetting] = useState<UUID | undefined>();

  useEffect(() => {
    if (editingBenefit) {
      setSelectedBenefitSetting(editingBenefit.benefitSettingId);
    } else {
      setSelectedBenefitSetting(undefined);
    }
  }, [editingBenefit]);

  const handleSubmit = () => {
    if (!selectedBenefitSetting) return;

    const formData: PositionBenefitAddDto = {
      positionId,
      benefitSettingId: selectedBenefitSetting,
    };

    if (editingBenefit) {
      const modData: PositionBenefitModDto = {
        ...formData,
        id: editingBenefit.id,
        rowVersion: editingBenefit.rowVersion,
      };
      onSave(modData);
    } else {
      onSave(formData);
    }

    onClose();
  };

  const benefitListItems: ListItem[] = benefitSettings.map(setting => ({
    id: setting.id,
    name: setting.name,
  }));

  const selectedBenefit = benefitSettings.find(bs => bs.id === selectedBenefitSetting);

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
            <Award size={20} />
            <h2 className="text-lg font-bold text-gray-800">
              {editingBenefit ? 'Edit Benefit' : 'Add Benefit'}
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
            {/* Benefit Selection */}
            <div className="space-y-2">
              {/* <Label className="text-sm text-gray-500">
                Benefit Setting <span className="text-red-500">*</span>
              </Label> */}
              <List
                items={benefitListItems}
                selectedValue={selectedBenefitSetting}
                onSelect={(item) => setSelectedBenefitSetting(item.id)}
                label="Select Benefit"
                placeholder="Choose a benefit"
                required
              />
            </div>

            {/* Benefit Preview */}
            {/* {selectedBenefit && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-800 font-medium mb-2">Benefit Preview:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Benefit Name:</span>
                    <span className="font-semibold">{selectedBenefit.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amharic Name:</span>
                    <span className="font-semibold">{selectedBenefit.nameAm}</span>
                  </div>
                </div>
              </div>
            )} */}

            {/* Current Selection Info */}
            {editingBenefit && selectedBenefit && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 font-medium mb-2">Currently Selected:</p>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-700">{selectedBenefit.name}</p>
                  <p className="text-blue-600 text-xs">{selectedBenefit.nameAm}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!selectedBenefitSetting}
            >
              {editingBenefit ? 'Update' : 'Save'}
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

export default PositionBenefitsModal;