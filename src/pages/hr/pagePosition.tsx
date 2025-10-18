import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import PositionHeader from '../../components/hr/position/PositionHeader';
import PositionSearchFilters from '../../components/hr/position/PositonSearchFilter';
import PositionCard from '../../components/hr/position/PositionCard';
import AddPositionModal from '../../components/hr/position/AddPositionModal';
import EditPositionModal from '../../components/hr/position/EditPositionModal';
import DeletePositionModal from '../../components/hr/position/DeletePositionModal';
import type { PositionListDto, PositionAddDto, PositionModDto } from '../../types/hr/position';
import { positionService } from '../../services/hr/positionService';

function PagePosition() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionListDto | null>(null);
  const [positionToDelete, setPositionToDelete] = useState<PositionListDto | null>(null);
  const [positionData, setPositionData] = useState<PositionListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch positions on component mount
  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      // Commented out service call - using dummy data directly
      // const positions = await positionService.getAllPositions();
      // setPositionData(positions);
      
      // Using dummy data directly for testing
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      const positions = await positionService.getAllPositions(); // This now returns dummy data
      setPositionData(positions);
      setError(null);
    } catch (err) {
      setError('Failed to fetch positions');
      console.error('Error fetching positions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPositionClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddPosition = async (newPositionData: PositionAddDto) => {
    try {
      // Commented out service call - using dummy data directly
      // await positionService.addPosition(newPositionData);
      
      // Using dummy data directly for testing
      await positionService.addPosition(newPositionData); // This now uses dummy data
      await fetchPositions(); // Refresh the list
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Failed to add position');
      console.error('Error adding position:', err);
    }
  };

  const handleEdit = (position: PositionListDto) => {
    setSelectedPosition(position);
    setIsEditModalOpen(true);
  };

  const handleDelete = (position: PositionListDto) => {
    setPositionToDelete(position);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (position: PositionListDto) => {
    try {
      // Commented out service call - using dummy data directly
      // await positionService.deletePosition(position.id);
      
      // Using dummy data directly for testing
      await positionService.deletePosition(position.id); // This now uses dummy data
      await fetchPositions(); // Refresh the list
      setIsDeleteModalOpen(false);
      setPositionToDelete(null);
    } catch (err) {
      setError('Failed to delete position');
      console.error('Error deleting position:', err);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPositionToDelete(null);
  };

  const handleSavePosition = async (updatedPosition: PositionModDto) => {
    try {
      // Commented out service call - using dummy data directly
      // await positionService.updatePosition(updatedPosition.id, updatedPosition);
      
      // Using dummy data directly for testing
      await positionService.updatePosition(updatedPosition.id, updatedPosition); // This now uses dummy data
      await fetchPositions(); // Refresh the list
      setIsEditModalOpen(false);
      setSelectedPosition(null);
    } catch (err) {
      setError('Failed to update position');
      console.error('Error updating position:', err);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchPositions}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

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