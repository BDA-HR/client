import { useState, useEffect } from 'react';
import { Edit, Trash2, BadgePlus, Settings } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import PositionRequirementsModal from './PositionRequirementsModal';
import DeletePositionRequirementsModal from './DeletePositionRequirementsModal';
import type { PositionReqListDto, PositionReqAddDto, PositionReqModDto, UUID, ProfessionTypeDto } from '../../../../types/hr/position';
import { positionService, lookupService } from '../../../../services/hr/positionService';
import { PositionGender, WorkOption } from '../../../../types/hr/enum';

interface PositionRequirementsProps {
  positionId: UUID;
}

function PositionRequirements({ positionId }: PositionRequirementsProps) {
  const [requirements, setRequirements] = useState<PositionReqListDto[]>([]);
  const [professionTypes, setProfessionTypes] = useState<ProfessionTypeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<PositionReqListDto | null>(null);
  const [deletingRequirement, setDeletingRequirement] = useState<PositionReqListDto | null>(null);

  useEffect(() => {
    fetchData();
  }, [positionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requirementsData, professionTypesData] = await Promise.all([
        positionService.getAllPositionReq(),
        lookupService.getAllProfessionTypes(),
      ]);
      
      const positionRequirements = requirementsData.filter(req => req.positionId === positionId);
      setRequirements(positionRequirements);
      setProfessionTypes(professionTypesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: PositionReqAddDto | PositionReqModDto) => {
    try {
      if ('id' in data) {
        await positionService.updatePositionReq(data.id, data);
      } else {
        await positionService.addPositionReq(data);
      }
      await fetchData();
    } catch (error) {
      console.error('Error saving requirement:', error);
    }
  };

  const handleAdd = () => {
    setEditingRequirement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (requirement: PositionReqListDto) => {
    setEditingRequirement(requirement);
    setIsModalOpen(true);
  };

  const handleDelete = (requirement: PositionReqListDto) => {
    setDeletingRequirement(requirement);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (requirement: PositionReqListDto) => {
    try {
      await positionService.deletePositionReq(requirement.id);
      await fetchData();
      setIsDeleteModalOpen(false);
      setDeletingRequirement(null);
    } catch (error) {
      console.error('Error deleting requirement:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRequirement(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingRequirement(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading requirements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Position Requirements</h3>
          
        </div>
        <Button onClick={handleAdd} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto cursor-pointer">
          <BadgePlus className="h-4 w-4" />
          Add Requirement
        </Button>
      </div>

      <div className="space-y-4">
        {requirements.map((requirement) => {
          const professionType = professionTypes.find(pt => pt.id === requirement.professionTypeId);
          return (
            <div key={requirement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Settings className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                    <div>
                      <p className="text-sm text-gray-500">Profession Type</p>
                      <p className="font-semibold text-gray-900">{professionType?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Working Hours</p>
                      <p className="font-semibold text-gray-900">{requirement.workingHours} hours/day</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-semibold text-gray-900">{PositionGender[requirement.gender as keyof typeof PositionGender]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Saturday Work</p>
                      <p className="font-semibold text-gray-900">{WorkOption[requirement.saturdayWorkOption as keyof typeof WorkOption]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sunday Work</p>
                      <p className="font-semibold text-gray-900">{WorkOption[requirement.sundayWorkOption as keyof typeof WorkOption]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="font-semibold text-gray-900">{requirement.position}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(requirement)}
                    className="flex items-center gap-1 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(requirement)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {requirements.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Requirements Set</h4>
            
          </div>
        )}
      </div>

      <PositionRequirementsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        positionId={positionId}
        professionTypes={professionTypes}
        editingRequirement={editingRequirement}
      />

      <DeletePositionRequirementsModal
        requirement={deletingRequirement}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default PositionRequirements;