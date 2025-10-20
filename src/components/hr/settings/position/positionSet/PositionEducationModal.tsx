import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, GraduationCap, BookOpen, School, University, Building2, Users } from 'lucide-react';
import { Button } from '../../../../ui/button';
import List from '../../../../List/list';
import type { PositionEduAddDto, PositionEduModDto, PositionEduListDto, UUID, EducationLevelDto } from '../../../../../types/hr/position';
import type { ListItem } from '../../../../../types/List/list';

interface PositionEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PositionEduAddDto | PositionEduModDto) => void;
  positionId: UUID;
  educationLevels: EducationLevelDto[];
  editingEducation?: PositionEduListDto | null;
}

// Icon mapping for different education levels
const educationIcons: { [key: string]: React.ComponentType<any> } = {
  'Preparatory': BookOpen,
  'College': School,
  'TVT': Users,
  'High School': GraduationCap,
  'University': University,
  'Elementary': Building2,
  'default': GraduationCap
};

const PositionEducationModal: React.FC<PositionEducationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  positionId,
  educationLevels,
  editingEducation
}) => {
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<UUID | undefined>();

  useEffect(() => {
    if (editingEducation) {
      setSelectedEducationLevel(editingEducation.educationLevelId);
    } else {
      setSelectedEducationLevel(undefined);
    }
  }, [editingEducation]);

  const handleSubmit = () => {
    if (!selectedEducationLevel) return;

    const formData: PositionEduAddDto = {
      positionId,
      educationQualId: selectedEducationLevel,
      educationLevelId: selectedEducationLevel,
    };

    if (editingEducation) {
      const modData: PositionEduModDto = {
        ...formData,
        id: editingEducation.id,
        rowVersion: editingEducation.rowVersion,
      };
      onSave(modData);
    } else {
      onSave(formData);
    }

    onClose();
  };

  const educationLevelListItems: ListItem[] = educationLevels.map(level => ({
    id: level.id,
    name: level.name,
  }));

  const selectedEducation = educationLevels.find(el => el.id === selectedEducationLevel);
  
  // Get appropriate icon for the selected education level
  const getEducationIcon = (levelName: string) => {
    const IconComponent = educationIcons[levelName] || educationIcons.default;
    return <IconComponent className="h-5 w-5" />;
  };

  // Get education level description
  // const getEducationDescription = (levelName: string) => {
  //   const descriptions: { [key: string]: string } = {
  //     'Preparatory': 'Pre-university preparation program',
  //     'College': 'College-level education and training',
  //     'TVT': 'Technical and Vocational Training',
  //     'High School': 'Secondary education completion',
  //     'University': 'University degree or higher education',
  //     'Elementary': 'Basic primary education'
  //   };
  //   return descriptions[levelName] || 'Educational qualification requirement';
  // };

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
            <GraduationCap size={20} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">
              {editingEducation ? 'Edit Education' : 'Add Education'}
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
            {/* Education Level Selection */}
            <div className="space-y-2">
              {/* <Label className="text-sm text-gray-500">
                Education Level <span className="text-red-500">*</span>
              </Label> */}
              <List
                items={educationLevelListItems}
                selectedValue={selectedEducationLevel}
                onSelect={(item) => setSelectedEducationLevel(item.id)}
                label="Select Education Level"
                placeholder="Choose an education level"
                required
              />
            </div>

            {/* Education Preview */}
            {/* {selectedEducation && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-medium mb-3">Education Preview:</p>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-lg border border-green-200">
                    {getEducationIcon(selectedEducation.name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedEducation.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedEducation.nameAm}</p>
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        Required
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {getEducationDescription(selectedEducation.name)}
                    </p>
                  </div>
                </div>
                
                {/* Additional Information */}
                {/* <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Level:</span>
                      <span className="ml-1">
                        {['University', 'College'].includes(selectedEducation.name) ? 'Higher' : 
                         ['Preparatory', 'High School'].includes(selectedEducation.name) ? 'Secondary' : 
                         ['TVT'].includes(selectedEducation.name) ? 'Technical' : 'Basic'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <span className="ml-1">
                        {['TVT'].includes(selectedEducation.name) ? 'Vocational' : 'Academic'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )} */} 

            {/* Current Selection Info */}
            {editingEducation && selectedEducation && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 font-medium mb-2">Currently Selected:</p>
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-blue-100 rounded">
                    {getEducationIcon(selectedEducation.name)}
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">{selectedEducation.name}</p>
                    <p className="text-blue-600 text-xs">{selectedEducation.nameAm}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Education Level Guide */}
            {/* <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Education Levels Guide:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Elementary → High School → Preparatory → University</span>
                </div>
                <div className="flex justify-between">
                  <span>TVT → Technical and Vocational Training</span>
                </div>
                <div className="flex justify-between">
                  <span>College → Higher Education Institution</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!selectedEducationLevel}
            >
              {editingEducation ? 'Update' : 'Save'}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6 border-green-300 text-green-700 hover:bg-green-50"
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

export default PositionEducationModal;