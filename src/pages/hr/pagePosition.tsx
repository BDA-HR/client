import { useState } from 'react';
import { Users } from 'lucide-react';
import PositionHeader from '../../components/hr/position/PositionHeader';
import PositionSearchFilters from '../../components/hr/position/PositonSearchFilter';
import PositionCard from '../../components/hr/position/PositionCard';
import AddPositionModal from '../../components/hr/position/AddPositionModal';
import EditPositionModal from '../../components/hr/position/EditPositionModal';
import DeletePositionModal from '../../components/hr/position/DeletePositionModal';
import type { PositionListDto, UUID, PositionAddDto, PositionModDto } from '../../types/hr/position';

function PagePosition() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionListDto | null>(null);
  const [positionToDelete, setPositionToDelete] = useState<PositionListDto | null>(null);
  
  // Mock data using PositionListDto - in real app, this would come from API
  const [positionData, setPositionData] = useState<PositionListDto[]>([
    {
      id: '1' as UUID,
      departmentId: 'dept-1' as UUID,
      isVacant: '1',
      name: 'Software Engineer',
      nameAm: 'ሶፍትዌር ኢንጂነር',
      noOfPosition: 5,
      isVacantStr: 'Yes',
      department: 'IT Department',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: '1'
    },
    {
      id: '2' as UUID,
      departmentId: 'dept-2' as UUID,
      isVacant: '0',
      name: 'HR Manager',
      nameAm: 'ሰው ሀብት አስተዳዳሪ',
      noOfPosition: 1,
      isVacantStr: 'No',
      department: 'Human Resources',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: '1'
    }
  ]);

  const handleAddPositionClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddPosition = (newPositionData: PositionAddDto) => {
    console.log('Adding new position:', newPositionData);
    
    // Create a new position with mock ID and additional fields
    const newPosition: PositionListDto = {
      id: `position-${Date.now()}` as UUID,
      departmentId: newPositionData.departmentId,
      isVacant: newPositionData.isVacant,
      name: newPositionData.name,
      nameAm: newPositionData.nameAm,
      noOfPosition: newPositionData.noOfPosition,
      isVacantStr: newPositionData.isVacant === '1' ? 'Yes' : 'No',
      department: 'New Department', // This would come from department service
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: '1'
    };

    // Update the positions state with the new position
    setPositionData(prev => [...prev, newPosition]);
  };

  const handleEdit = (position: PositionListDto) => {
    console.log('Edit position:', position);
    setSelectedPosition(position);
    setIsEditModalOpen(true);
  };

  const handleDelete = (position: PositionListDto) => {
    console.log('Request to delete position:', position);
    setPositionToDelete(position);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (position: PositionListDto) => {
    console.log('Confirming delete for position:', position);
    // Remove the position from the state
    setPositionData(prev => prev.filter(p => p.id !== position.id));
    setIsDeleteModalOpen(false);
    setPositionToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPositionToDelete(null);
  };

  const handleSavePosition = (updatedPosition: PositionModDto) => {
    console.log('Saving updated position:', updatedPosition);
    
    // Update the position in the state
    setPositionData(prev => 
      prev.map(position => 
        position.id === updatedPosition.id 
          ? { 
              ...position, 
              name: updatedPosition.name,
              nameAm: updatedPosition.nameAm,
              noOfPosition: updatedPosition.noOfPosition,
              isVacant: updatedPosition.isVacant,
              isVacantStr: updatedPosition.isVacant === '1' ? 'Yes' : 'No',
              updatedAt: new Date().toISOString()
            }
          : position
      )
    );
    
    setIsEditModalOpen(false);
    setSelectedPosition(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPosition(null);
  };

  const filteredData = positionData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nameAm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto space-y-6">
      <PositionHeader />

      <PositionSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        positionData={positionData}
        onAddClick={handleAddPositionClick}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div>
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No positions found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No positions match your search for "${searchTerm}"` : 'Get started by adding your first position'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredData.map((position) => (
              <PositionCard
                key={position.id}
                position={position}
                expanded={false}
                onToggleExpand={() => {}}
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Search Results Info */}
        {filteredData.length > 0 && searchTerm && (
          <div className="mt-4 text-sm text-gray-500">
            Found {filteredData.length} results for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Add Position Modal */}
      <AddPositionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPosition={handleAddPosition}
      />

      {/* Edit Position Modal */}
      <EditPositionModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSavePosition}
        position={selectedPosition}
      />

      {/* Delete Position Modal */}
      <DeletePositionModal
        position={positionToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default PagePosition;