import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Trash2, Award } from 'lucide-react';
import { Button } from '../../../../ui/button';
import PositionBenefitsModal from './PositionBenefitsModal';
import DeletePositionBenefitsModal from './DeletePositionBenefitsModal';
import type { PositionBenefitListDto, PositionBenefitAddDto, PositionBenefitModDto, UUID, BenefitSettingDto } from '../../../../../types/hr/position';
import { positionService, lookupService } from '../../../../../services/hr/settings/positionService';

interface PositionBenefitsProps {
  positionId: UUID;
  onEdit: (benefit: PositionBenefitListDto) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export interface PositionBenefitsRef {
  fetchBenefits: () => Promise<void>;
}

const PositionBenefits = forwardRef<PositionBenefitsRef, PositionBenefitsProps>(({ 
  positionId, 
  onEdit, 
  viewMode, 
  
}, ref) => {
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
        positionService.getAllPositionBenefits(),
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
        await positionService.updatePositionBenefit(data);
      } else {
        await positionService.createPositionBenefit(data);
      }
      await fetchData();
    } catch (error) {
      console.error('Error saving benefit:', error);
    }
  };

  const handleEdit = (benefit: PositionBenefitListDto) => {
    setEditingBenefit(benefit);
    setIsModalOpen(true);
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

  // Generate random monetary values for demonstration
  const getRandomAmount = () => {
    const amounts = [1500, 2000, 3000, 4500, 6000, 7500, 8500, 10000];
    return amounts[Math.floor(Math.random() * amounts.length)];
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
      {/* Benefits Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {benefits.map((benefit) => {
          const benefitSetting = benefitSettings.find(bs => bs.id === benefit.benefitSettingId);
          const amount = getRandomAmount();
          
          if (viewMode === 'grid') {
            // Grid View Layout
            return (
              <div 
                key={benefit.id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
                onClick={() => handleEdit(benefit)}
              >
                <div className="flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div className="p-3 bg-green-100 rounded-lg mb-4">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  
                  {/* Benefit Name */}
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">
                    {benefitSetting?.name || 'Unknown Benefit'}
                  </h4>
                  
                  {/* Amharic Name */}
                  <p className="text-sm text-gray-500 mb-3">
                    {benefitSetting?.nameAm || 'N/A'}
                  </p>
                  
                  {/* Position */}
                  <p className="text-sm text-gray-600 mb-4">
                    {benefit.position}
                  </p>
                  
                  {/* Amount */}
                  <div className="mt-auto">
                    <span className="text-xl font-bold text-green-600">{amount.toLocaleString()} ETB</span>
                    <span className="text-sm text-gray-500 ml-2">/month</span>
                  </div>
                  
                  {/* Delete Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(benefit);
                      }}
                      className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          } else {
            // List View Layout
            return (
              <div 
                key={benefit.id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
                onClick={() => handleEdit(benefit)}
              >
                <div className="flex justify-between items-start">
                  {/* Left Content */}
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Icon */}
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      {/* Benefit Name */}
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">
                        {benefitSetting?.name || 'Unknown Benefit'}
                      </h4>
                      
                      {/* Amharic Name */}
                      <p className="text-sm text-gray-500 mb-2">
                        {benefitSetting?.nameAm || 'N/A'}
                      </p>
                      
                      {/* Position */}
                      <p className="text-sm text-gray-600 font-medium">
                        {benefit.position}
                      </p>
                      
                      {/* Amount */}
                      <div className="mt-3">
                        <span className="text-xl font-bold text-green-600">{amount.toLocaleString()} ETB</span>
                        <span className="text-sm text-gray-500 ml-2">/month</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Content - Delete Button */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(benefit);
                      }}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          }
        })}
        
        {benefits.length === 0 && (
          <div className="text-center py-12 col-span-full">
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2 text-lg">No Benefits Assigned for this position</p>
              <p className="text-sm text-gray-500">Click the "Add Benefit" button to get started</p>
            </div>
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