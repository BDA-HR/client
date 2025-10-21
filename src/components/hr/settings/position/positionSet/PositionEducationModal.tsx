import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, GraduationCap, BookOpen, School, University, Building2, Users, Loader2 } from 'lucide-react';
import { Button } from '../../../../ui/button';
import List from '../../../../List/list';
import type { PositionEduAddDto, PositionEduModDto, PositionEduListDto, UUID, EducationLevelDto } from '../../../../../types/hr/position';
import type { ListItem } from '../../../../../types/List/list';
import { listService } from '../../../../../services/List/listservice';

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
  const [educationLevels, setEducationLevels] = useState<EducationLevelDto[]>([]);
  const [loading, setLoading] = useState(false);

  // Wrap handleClose in useCallback to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    setSelectedEducationLevel(undefined);
    onClose();
  }, [onClose]);

  // Fetch education levels when modal opens
  useEffect(() => {
    const fetchEducationLevels = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const educationLevelsData = await listService.getAllEducationLevels();
        // Transform ListItem[] to EducationLevelDto[]
        const transformedData: EducationLevelDto[] = educationLevelsData.map(item => ({
          id: item.id as UUID,
          name: item.name,
        }));
        setEducationLevels(transformedData);
        
        // Set first education level as default if none selected and not editing
        if (transformedData.length > 0 && !selectedEducationLevel && !editingEducation) {
          setSelectedEducationLevel(transformedData[0].id);
        }
      } catch (err) {
        console.error('Error fetching education levels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationLevels();
  }, [isOpen, selectedEducationLevel, editingEducation]);

  // Reset form when modal opens and set editing data
  useEffect(() => {
    if (isOpen) {
      if (editingEducation) {
        setSelectedEducationLevel(editingEducation.educationLevelId);
      } else if (educationLevels.length > 0) {
        setSelectedEducationLevel(educationLevels[0].id);
      } else {
        setSelectedEducationLevel(undefined);
      }
    }
  }, [isOpen, editingEducation, educationLevels]);

  // Convert education levels to ListItem format
  const educationLevelListItems: ListItem[] = educationLevels.map(level => ({
    id: level.id,
    name: level.name,
  }));

  const handleSelectEducationLevel = (item: ListItem) => {
    setSelectedEducationLevel(item.id);
  };

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

    handleClose();
  };

  const selectedEducation = educationLevels.find(el => el.id === selectedEducationLevel);
  
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
                items={educationLevelListItems}
                selectedValue={selectedEducationLevel}
                onSelect={handleSelectEducationLevel}
                label="Select Education Level"
                placeholder="Choose an education level"
                required
                disabled={loading}
              />
              {loading && <p className="text-sm text-gray-500">Loading education levels...</p>}
            </div>

            {/* Current Selection Info */}
            {selectedEducation && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  {editingEducation ? 'Currently Selected:' : 'Selected Education:'}
                </p>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getEducationIcon(selectedEducation.name)}
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-700 font-medium">{selectedEducation.name}</p>
                  </div>
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!selectedEducationLevel || loading}
            >
              {loading ? (
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