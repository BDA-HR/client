import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Edit, Trash2, Award } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import PositionBenefitsModal from './PositionBenefitsModal';
import DeletePositionBenefitsModal from './DeletePositionBenefitsModal';
import type { PositionBenefitListDto, PositionBenefitAddDto, PositionBenefitModDto, UUID, BenefitSettingDto } from '../../../../types/hr/position';
import { positionService, lookupService } from '../../../../services/hr/positionService';

interface PositionBenefitsProps {
  positionId: UUID;
  onEdit: (benefit: PositionBenefitListDto) => void;
}

export interface PositionBenefitsRef {
  fetchBenefits: () => Promise<void>;
}

const PositionBenefits = forwardRef<PositionBenefitsRef, PositionBenefitsProps>(({ positionId, onEdit }, ref) => {
  const [benefits, setBenefits] = useState<PositionBenefitListDto[]>([]);
  const [benefitSettings, setBenefitSettings] = useState<BenefitSettingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<PositionBenefitListDto | null>(null);
  const [deletingBenefit, setDeletingBenefit] = useState<PositionBenefitListDto | null>(null);

  useImperativeHandle(ref, () => ({
    fetchBenefits: fetchData
  }));

  useEffect(() => {
    fetchData();
  }, [positionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [benefitsData, benefitSettingsData] = await Promise.all([
        positionService.getAllPositionBenefit(),
        lookupService.getAllBenefitSettings(),
      ]);
      
      const positionBenefits = benefitsData.filter(benefit => benefit.positionId === positionId);
      setBenefits(positionBenefits);
      setBenefitSettings(benefitSettingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: PositionBenefitAddDto | PositionBenefitModDto) => {
    try {
      if ('id' in data) {
        await positionService.updatePositionBenefit(data.id, data);
      } else {
        await positionService.addPositionBenefit(data);
      }
      await fetchData();
    } catch (error) {
      console.error('Error saving benefit:', error);
    }
  };

  const handleEdit = (benefit: PositionBenefitListDto) => {
    setEditingBenefit(benefit);
    onEdit(benefit);
  };

  const handleDelete = (benefit: PositionBenefitListDto) => {
    setDeletingBenefit(benefit);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (benefit: PositionBenefitListDto) => {
    try {
      await positionService.deletePositionBenefit(benefit.id);
      await fetchData();
      setIsDeleteModalOpen(false);
      setDeletingBenefit(null);
    } catch (error) {
      console.error('Error deleting benefit:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBenefit(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingBenefit(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading benefits...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {benefits.map((benefit) => {
          const benefitSetting = benefitSettings.find(bs => bs.id === benefit.benefitSettingId);
          return (
            <div key={benefit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{benefitSetting?.name || 'Unknown Benefit'}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {benefitSetting?.nameAm || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">{benefit.position}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(benefit)}
                    className="flex items-center gap-1 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(benefit)}
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
        {benefits.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Benefits Assigned</h4>
            <p className="text-gray-600 mb-4">Add benefits and allowances for this position</p>
          </div>
        )}
      </div>

      <PositionBenefitsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        positionId={positionId}
        benefitSettings={benefitSettings}
        editingBenefit={editingBenefit}
      />

      <DeletePositionBenefitsModal
        benefit={deletingBenefit}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
});

export default PositionBenefits;