import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '../../components/ui/dialog';
import { PubHolidayHeader } from '../../components/core/publicHoliday/PubHolidayHeader';
import { AddPubHolidayModal } from '../../components/core/publicHoliday/AddPubHolidayModal';
import { EditPubHolidayModal } from '../../components/core/publicHoliday/EditPubHolidayModal';
import { DeletePubHolidayModal } from '../../components/core/publicHoliday/DeletePubHolidayModal';
import { PubHolidayList } from '../../components/core/publicHoliday/PubHolidayList';
import type { AddPubHolidayDto, PubHolidayDto, EditPubHolidayDto } from '../../types/core/pubHoliday';

// Mock data for demonstration - replace with actual API calls
const mockHolidays: PubHolidayDto[] = [
  {
    id: '1',
    name: "New Year's Day",
    nameAm: "አዲስ አመት",
    date: '2024-01-01T00:00:00.000Z',
    description: 'Celebration of the new year marking the first day of the year in the Gregorian calendar. Offices and businesses are closed nationwide.',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isActive: true,
    fiscalYearId: 'fy-2024',
    rowVersion: '1'
  },
  {
    id: '2',
    name: 'Christmas Day',
    nameAm: 'ገና',
    date: '2024-12-25T00:00:00.000Z',
    description: 'Annual festival commemorating the birth of Jesus Christ. A widely celebrated religious and cultural holiday observed by billions around the world.',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isActive: true,
    fiscalYearId: 'fy-2024',
    rowVersion: '1'
  },
  {
    id: '3',
    name: 'Independence Day',
    nameAm: 'የነጻነት ቀን',
    date: '2024-07-04T00:00:00.000Z',
    description: 'National holiday commemorating the Declaration of Independence of the United States on July 4, 1776.',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isActive: true,
    fiscalYearId: 'fy-2024',
    rowVersion: '1'
  }
];

const getDefaultHoliday = (): AddPubHolidayDto => ({
  name: '',
  nameAm: '',
  date: new Date().toISOString(),
});

export default function PagePublicHoliday() {
  const navigate = useNavigate();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState<AddPubHolidayDto>(getDefaultHoliday());
  const [selectedHoliday, setSelectedHoliday] = useState<PubHolidayDto | null>(null);
  const [holidays, setHolidays] = useState<PubHolidayDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Load holidays on component mount
  useEffect(() => {
    const loadHolidays = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await pubHolidayService.getHolidays();
        // setHolidays(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setHolidays(mockHolidays);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading holidays:', error);
        setLoading(false);
      }
    };

    loadHolidays();
  }, []);

  const handleViewHistory = () => {
    navigate('/core/public-holiday/history');
  };

  const handleAddPubHoliday = async (): Promise<void> => {
    try {
      // TODO: Replace with your actual API call
      console.log('Adding public holiday:', newHoliday);
      
      // Mock API call - replace with actual implementation
      const newHolidayWithId: PubHolidayDto = {
        id: Math.random().toString(36).substr(2, 9), // Generate random ID for mock
        name: newHoliday.name,
        nameAm: newHoliday.nameAm,
        date: newHoliday.date,
        description: '', // You can add description field to your form if needed
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        fiscalYearId: 'fy-2024',
        rowVersion: '1'
      };

      // Add to local state (replace with actual API response)
      setHolidays(prev => [newHolidayWithId, ...prev]);
      
      // Reset form after successful addition
      setNewHoliday(getDefaultHoliday());
    } catch (error) {
      console.error('Error adding public holiday:', error);
      throw error;
    }
  };

  const handleEditPubHoliday = async (holidayData: EditPubHolidayDto): Promise<void> => {
    try {
      // TODO: Replace with your actual API call
      console.log('Updating public holiday:', holidayData);
      
      // Mock API call - replace with actual implementation
      const updatedHoliday: PubHolidayDto = {
        ...holidayData,
        name: holidayData.name || '',
        nameAm: holidayData.nameAm || '',
        date: holidayData.date || '',
        description: holidayData.description || '',
        updatedAt: new Date().toISOString(),
        isActive: true,
        fiscalYearId: 'fy-2024'
      };

      // Update local state (replace with actual API response)
      setHolidays(prev => prev.map(h => 
        h.id === holidayData.id ? { ...h, ...updatedHoliday } : h
      ));
      
      setEditModalOpen(false);
      setSelectedHoliday(null);
    } catch (error) {
      console.error('Error updating public holiday:', error);
      throw error;
    }
  };

  const handleDeletePubHoliday = async (holidayId: string): Promise<void> => {
    try {
      // TODO: Replace with your actual API call
      console.log('Deleting public holiday:', holidayId);
      
      // Mock API call - replace with actual implementation
      // await pubHolidayService.deletePubHoliday(holidayId);

      // Update local state (replace with actual API response)
      setHolidays(prev => prev.filter(h => h.id !== holidayId));
      
      setDeleteModalOpen(false);
      setSelectedHoliday(null);
    } catch (error) {
      console.error('Error deleting public holiday:', error);
      throw error;
    }
  };

  const handleAddModalOpenChange = (open: boolean) => {
    setAddModalOpen(open);
    if (!open) {
      setNewHoliday(getDefaultHoliday());
    }
  };

  // Handler for editing holiday
  const handleEdit = (holiday: PubHolidayDto) => {
    setSelectedHoliday(holiday);
    setEditModalOpen(true);
  };

  // Handler for deleting holiday
  const handleDelete = (holiday: PubHolidayDto) => {
    setSelectedHoliday(holiday);
    setDeleteModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedHoliday(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedHoliday(null);
  };

  return (
    <div className="bg-gray-50  -mt-6 py-4 -mx-2">
      <Dialog>
        <PubHolidayHeader 
          setDialogOpen={setAddModalOpen}
          onViewHistory={handleViewHistory}
        />
        
        {/* Main Content */}
        <div className="w-full mx-auto px-4 py-6">
          <PubHolidayList
            holidays={holidays}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentFiscalYear="2024"
          />
        </div>

        <AddPubHolidayModal
          open={addModalOpen}
          onOpenChange={handleAddModalOpenChange}
          newHoliday={newHoliday}
          setNewHoliday={setNewHoliday}
          onAddPubHoliday={handleAddPubHoliday}
        />
      </Dialog>

      {/* Edit Modal - Outside Dialog to work independently */}
      <EditPubHolidayModal
        isOpen={editModalOpen}
        onClose={handleEditModalClose}
        onSave={handleEditPubHoliday}
        holiday={selectedHoliday}
      />

      {/* Delete Modal - Outside Dialog to work independently */}
      <DeletePubHolidayModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeletePubHoliday}
        holiday={selectedHoliday}
      />
    </div>
  );
}