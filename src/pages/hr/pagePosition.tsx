import React, { useState } from 'react';
import { Users } from 'lucide-react';
import PositionHeader from '../../components/hr/position/PositionHeader';
import PositionSearchFilters from '../../components/hr/position/PositonSearchFilter';
import PositionCard from '../../components/hr/position/PositionCard';
import AddPositionModal from '../../components/hr/position/AddPositionModal';
import type { PositionListDto, UUID, PositionAddDto } from '../../types/hr/position';

function PagePosition() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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
    // In a real app, this would come from your API response
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
    
    // In a real app, you would call your position service here:
    // positionService.createPosition(newPositionData)
    //   .then(createdPosition => {
    //     setPositionData(prev => [...prev, createdPosition]);
    //   })
    //   .catch(error => {
    //     console.error('Error creating position:', error);
    //   });
  };

  const handleEdit = (position: PositionListDto) => {
    console.log('Edit position:', position);
    // Handle edit logic - you can create an EditPositionModal similar to AddPositionModal
  };

  const handleDelete = (position: PositionListDto) => {
    console.log('Delete position:', position);
    // Handle delete logic - show confirmation dialog and call API
    if (window.confirm(`Are you sure you want to delete "${position.name}"?`)) {
      // In a real app, you would call your position service here:
      // positionService.deletePosition(position.id)
      //   .then(() => {
      //     setPositionData(prev => prev.filter(p => p.id !== position.id));
      //   })
      //   .catch(error => {
      //     console.error('Error deleting position:', error);
      //   });
      
      // For now, just update the state
      setPositionData(prev => prev.filter(p => p.id !== position.id));
    }
  };

  const filteredData = positionData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nameAm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <PositionHeader 
        positionData={positionData}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <PositionSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        positionData={positionData}
        onAddClick={handleAddPositionClick}
      />

      <div className="mt-6">
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
            <button 
              onClick={handleAddPositionClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Add Position
            </button>
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
    </div>
  );
}

export default PagePosition;