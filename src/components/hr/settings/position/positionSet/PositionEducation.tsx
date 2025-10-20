import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../../ui/button';
import PositionEducationModal from './PositionEducationModal';
import type { PositionEduListDto, PositionEduAddDto, PositionEduModDto, UUID, EducationLevelDto } from '../../../../../types/hr/position';
import { positionService, lookupService } from '../../../../../services/hr/positionService';
import DeletePositionEducationModal from './DeletePositionEducationModal';

interface PositionEducationProps {
  positionId: UUID;
  onEdit: (education: PositionEduListDto) => void;
}

export interface PositionEducationRef {
  fetchEducations: () => Promise<void>;
}

const PositionEducation = forwardRef<PositionEducationRef, PositionEducationProps>(({ positionId, onEdit }, ref) => {
  const [educations, setEducations] = useState<PositionEduListDto[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevelDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<PositionEduListDto | null>(null);
  const [deletingEducation, setDeletingEducation] = useState<PositionEduListDto | null>(null);

  useImperativeHandle(ref, () => ({
    fetchEducations: fetchData
  }));

  useEffect(() => {
    fetchData();
  }, [positionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [educationsData, educationLevelsData] = await Promise.all([
        positionService.getAllPositionEdu(),
        lookupService.getAllEducationLevels(),
      ]);
      
      const positionEducations = educationsData.filter(edu => edu.positionId === positionId);
      setEducations(positionEducations);
      setEducationLevels(educationLevelsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: PositionEduAddDto | PositionEduModDto) => {
    try {
      if ('id' in data) {
        await positionService.updatePositionEdu(data.id, data);
      } else {
        await positionService.addPositionEdu(data);
      }
      await fetchData();
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleEdit = (education: PositionEduListDto) => {
    setEditingEducation(education);
    onEdit(education);
  };

  const handleDelete = (education: PositionEduListDto) => {
    setDeletingEducation(education);
  };

  const handleConfirmDelete = async (education: PositionEduListDto) => {
    try {
      await positionService.deletePositionEdu(education.id);
      await fetchData();
      setDeletingEducation(null);
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeletingEducation(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading education requirements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {educations.map((education) => {
          const educationLevel = educationLevels.find(el => el.id === education.educationLevelId);
          return (
            <div key={education.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{educationLevel?.name || 'Unknown Level'}</h4>
                                    <p className="text-sm text-gray-500">
{educationLevel?.nameAm || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">{education.position}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Qualification: {education.educationQual}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(education)}
                    className="flex items-center gap-1 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(education)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {educations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No education requirements set for this position.
          </div>
        )}
      </div>

      <PositionEducationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        positionId={positionId}
        educationLevels={educationLevels}
        editingEducation={editingEducation}
      />

      <DeletePositionEducationModal
        education={deletingEducation}
        isOpen={!!deletingEducation}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
});

export default PositionEducation;