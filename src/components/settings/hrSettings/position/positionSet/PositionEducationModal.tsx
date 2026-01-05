import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, GraduationCap, BookOpen, School, University, Building2, Users, Loader2 } from 'lucide-react';
import { Button } from '../../../../ui/button';
import List from '../../../../List/list';
import type { PositionEduAddDto, PositionEduModDto, PositionEduListDto, UUID, EducationLevelDto } from '../../../../../types/hr/position';
import type { ListItem } from '../../../../../types/List/list';
import { listService } from '../../../../../services/hr/listservice';
import { nameListService } from '../../../../../services/List/HrmmNameListService'; 

interface PositionEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PositionEduAddDto | PositionEduModDto) => void;
  positionId: UUID;
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
  editingEducation
}) => {
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<UUID | undefined>();
  const [selectedEducationQual, setSelectedEducationQual] = useState<UUID | undefined>();
  const [educationLevels, setEducationLevels] = useState<EducationLevelDto[]>([]);
  const [educationQualNames, setEducationQualNames] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuals, setLoadingQuals] = useState(false);

  // Wrap handleClose in useCallback to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    setSelectedEducationLevel(undefined);
    setSelectedEducationQual(undefined);
    onClose();
  }, [onClose]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (editingEducation) {
        // Set editing values
        setSelectedEducationLevel(editingEducation.educationLevelId);
        setSelectedEducationQual(editingEducation.educationQualId);
      } else {
        // Reset to empty for new education
        setSelectedEducationLevel(undefined);
        setSelectedEducationQual(undefined);
      }
    }
  }, [isOpen, editingEducation]);

  // Fetch education levels and qualification names when modal opens
  useEffect(() => {
    const fetchEducationData = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      setLoadingQuals(true);
      try {
        // Fetch education levels from listService and qualification names from nameListService
        const [levelsData, qualNamesData] = await Promise.all([
          listService.getAllEducationLevels(),
          nameListService.getAllEducationQualNames() // Use nameListService here
        ]);

        // Transform ListItem[] to EducationLevelDto[]
        const transformedLevels: EducationLevelDto[] = levelsData.map(item => ({
          id: item.id,
          name: item.name,
        }));
        setEducationLevels(transformedLevels);
        setEducationQualNames(qualNamesData);
        
        // Only set defaults if we're NOT editing and no selection has been made
        if (!editingEducation) {
          if (transformedLevels.length > 0 && !selectedEducationLevel) {
            setSelectedEducationLevel(transformedLevels[0].id);
          }
          if (qualNamesData.length > 0 && !selectedEducationQual) {
            setSelectedEducationQual(qualNamesData[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching education data:', err);
      } finally {
        setLoading(false);
        setLoadingQuals(false);
      }
    };

    fetchEducationData();
  }, [isOpen, editingEducation]); // Removed selectedEducationLevel and selectedEducationQual from dependencies

  const handleSelectEducationLevel = (item: ListItem) => {
    setSelectedEducationLevel(item.id);
  };

  const handleSelectEducationQual = (item: ListItem) => {
    setSelectedEducationQual(item.id);
  };

  const handleSubmit = () => {
    if (!selectedEducationLevel || !selectedEducationQual) return;

    const formData: PositionEduAddDto = {
      positionId,
      educationQualId: selectedEducationQual,
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

    handleClose();
  };

  const selectedEducation = educationLevels.find(el => el.id === selectedEducationLevel);
  const selectedQual = educationQualNames.find(qual => qual.id === selectedEducationQual);
  
  // Get appropriate icon for the selected education level
  const getEducationIcon = (levelName: string) => {
    const IconComponent = educationIcons[levelName] || educationIcons.default;
    return <IconComponent className="h-5 w-5" />;
  };

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
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">
              {editingEducation ? 'Edit Education' : 'Add Education'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-4">
            {/* Education Level Selection using List Component */}
            <div className="space-y-2">
              <List
                items={educationLevels.map(level => ({ id: level.id, name: level.name }))}
                selectedValue={selectedEducationLevel}
                onSelect={handleSelectEducationLevel}
                label="Select Education Level"
                placeholder="Choose an education level"
                required
                disabled={loading}
              />
              {loading && <p className="text-sm text-gray-500">Loading education levels...</p>}
            </div>

            {/* Education Qualification Selection using List Component */}
            <div className="space-y-2">
              <List
                items={educationQualNames}
                selectedValue={selectedEducationQual}
                onSelect={handleSelectEducationQual}
                label="Select Education Qualification"
                placeholder="Choose an education qualification"
                required
                disabled={loadingQuals}
              />
              {loadingQuals && <p className="text-sm text-gray-500">Loading education qualifications...</p>}
            </div>

            {/* Current Selection Info */}
            {(selectedEducation || selectedQual) && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  {editingEducation ? 'Currently Selected:' : 'Selected Education:'}
                </p>
                <div className="space-y-3">
                  {selectedEducation && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getEducationIcon(selectedEducation.name)}
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-700 font-medium">{selectedEducation.name}</p>
                        <p className="text-blue-600 text-xs">Education Level</p>
                      </div>
                    </div>
                  )}
                  {selectedQual && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-700 font-medium">{selectedQual.name}</p>
                        <p className="text-blue-600 text-xs">Education Qualification</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 rounded-b-xl">
          <div className="flex flex-row-reverse justify-center items-center gap-3">
            <Button
              variant="outline"
              className="cursor-pointer px-6 border-gray-300 hover:bg-gray-100"
              onClick={handleClose}
              type="button"
              disabled={loading || loadingQuals}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!selectedEducationLevel || !selectedEducationQual || loading || loadingQuals}
            >
              {(loading || loadingQuals) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : editingEducation ? (
                'Update'
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PositionEducationModal;