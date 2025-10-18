import { useState, useEffect } from 'react';
import { Edit, Trash2, BadgePlus, Briefcase } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import PositionExperienceModal from './PositionExperianceModal';
import DeletePositionExperienceModal from './DeletePositionExperianceModal';
import type { PositionExpListDto, PositionExpAddDto, PositionExpModDto, UUID } from '../../../../types/hr/position';
import { positionService } from '../../../../services/hr/positionService';

interface PositionExperienceProps {
  positionId: UUID;
}

function PositionExperience({ positionId }: PositionExperienceProps) {
  const [experiences, setExperiences] = useState<PositionExpListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Separate state for delete modal
  const [editingExperience, setEditingExperience] = useState<PositionExpListDto | null>(null);
  const [deletingExperience, setDeletingExperience] = useState<PositionExpListDto | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, [positionId]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await positionService.getAllPositionExp();
      const positionExperiences = data.filter(exp => exp.positionId === positionId);
      setExperiences(positionExperiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: PositionExpAddDto | PositionExpModDto) => {
    try {
      if ('id' in data) {
        await positionService.updatePositionExp(data.id, data);
      } else {
        await positionService.addPositionExp(data);
      }
      await fetchExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleAdd = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const handleEdit = (experience: PositionExpListDto) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
  };

  const handleDelete = (experience: PositionExpListDto) => {
    setDeletingExperience(experience);
    setIsDeleteModalOpen(true); // Use separate delete modal state
  };

  const handleConfirmDelete = async (experience: PositionExpListDto) => {
    try {
      await positionService.deletePositionExp(experience.id);
      await fetchExperiences();
      setIsDeleteModalOpen(false); // Close delete modal
      setDeletingExperience(null);
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingExperience(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading experiences...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Experience Requirements</h3>
          <p className="text-sm text-gray-600 mt-1">Set experience requirements and age limits</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto cursor-pointer">
          <BadgePlus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-sm text-gray-500">Same Position Exp</p>
                    <p className="font-semibold text-gray-900">{experience.samePosExp} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Other Position Exp</p>
                    <p className="font-semibold text-gray-900">{experience.otherPosExp} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age Range</p>
                    <p className="font-semibold text-gray-900">{experience.minAge} - {experience.maxAge} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Experience</p>
                    <p className="font-semibold text-green-600">{experience.samePosExp + experience.otherPosExp} years</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(experience)}
                  className="flex items-center gap-1 border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(experience)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Experience Requirements</h4>
            <p className="text-gray-600 mb-4">Add experience requirements for this position</p>
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              <BadgePlus className="h-4 w-4 mr-2" />
              Add First Requirement
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <PositionExperienceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        positionId={positionId}
        editingExperience={editingExperience}
      />

      {/* Delete Modal */}
      <DeletePositionExperienceModal
        experience={deletingExperience}
        isOpen={isDeleteModalOpen} // Use separate state
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default PositionExperience;