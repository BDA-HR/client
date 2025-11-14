import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '../../components/ui/dialog';
import { HolidayHeader } from '../../components/core/holiday/HolidayHeader';
import { AddHolidayModal } from '../../components/core/holiday/AddHolidayModal';
import { EditHolidayModal } from '../../components/core/holiday/EditHolidayModal';
import { DeleteHolidayModal } from '../../components/core/holiday/DeleteHolidayModal';
import { HolidayList } from '../../components/core/holiday/HolidayList';
import type { AddHolidayDto, HolidayListDto, EditHolidayDto } from '../../types/core/holiday';

// Mock data for demonstration - replace with actual API calls
const mockHolidays: HolidayListDto[] = [
  {
    id: '1',
    name: "New Year's Day",
    date: '2024-01-01T00:00:00.000Z',
    dateStr: 'January 01, 2024',
    dateStrAm: 'ጥር 22, 2016', // Ethiopian date example
    description: 'Celebration of the new year marking the first day of the year in the Gregorian calendar. Offices and businesses are closed nationwide.',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isActive: true,
    fiscalYearId: 'fy-2024',
    fiscalYearName: '2023/2024',
    isPublic: true,
    isPublicStr: 'Public',
    fiscYear: '2023/2024',
    rowVersion: '1'
  },
  {
    id: '2',
    name: 'Christmas Day',
    date: '2024-12-25T00:00:00.000Z',
    dateStr: 'December 25, 2024',
    dateStrAm: 'ጥር 16, 2017', // Ethiopian date example
    description: 'Annual festival commemorating the birth of Jesus Christ. A widely celebrated religious and cultural holiday observed by billions around the world.',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isActive: true,
    fiscalYearId: 'fy-2024',
    fiscalYearName: '2023/2024',
    isPublic: true,
    isPublicStr: 'Public',
    fiscYear: '2023/2024',
    rowVersion: '1'
  },
  {
    id: '3',
    name: 'Company Foundation Day',
    date: '2024-07-04T00:00:00.000Z',
    dateStr: 'July 04, 2024',
    dateStrAm: 'ሰኔ 27, 2016', // Ethiopian date example
    description: 'Celebrating the founding of our company. Office closed for all employees.',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isActive: true,
    fiscalYearId: 'fy-2024',
    fiscalYearName: '2023/2024',
    isPublic: false,
    isPublicStr: 'Private',
    fiscYear: '2023/2024',
    rowVersion: '1'
  }
];

// Mock fiscal years data - you would fetch this from your API
const mockFiscalYears = [
  { id: 'fy-2024', name: '2023/2024' },
  { id: 'fy-2025', name: '2024/2025' },
  { id: 'fy-2026', name: '2025/2026' }
];

const getDefaultHoliday = (): AddHolidayDto => ({
  name: '',
  date: new Date().toISOString(),
  isPublic: true,
  fiscalYearId: 'fy-2024', // Add default fiscal year ID
});

export default function PageHoliday() {
  const navigate = useNavigate();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState<AddHolidayDto>(getDefaultHoliday());
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayListDto | null>(null);
  const [holidays, setHolidays] = useState<HolidayListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [fiscalYears] = useState(mockFiscalYears); // You might want to fetch this from API

  // Load holidays on component mount
  useEffect(() => {
    const loadHolidays = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await holidayService.getHolidays();
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
    navigate('/core/fiscal-year/holiday-history');
  };

  const handleAddHoliday = async (): Promise<void> => {
    try {
      // TODO: Replace with your actual API call
      console.log('Adding holiday:', newHoliday);
      
      // Mock API call - replace with actual implementation
      const newHolidayWithId: HolidayListDto = {
        id: Math.random().toString(36).substr(2, 9), // Generate random ID for mock
        name: newHoliday.name,
        date: newHoliday.date,
        dateStr: new Date(newHoliday.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        dateStrAm: 'አዲስ ቀን', // This would come from backend Ethiopian calendar conversion
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        fiscalYearId: newHoliday.fiscalYearId,
        fiscalYearName: fiscalYears.find(fy => fy.id === newHoliday.fiscalYearId)?.name || '2023/2024',
        isPublic: newHoliday.isPublic,
        isPublicStr: newHoliday.isPublic ? 'Public' : 'Private',
        fiscYear: fiscalYears.find(fy => fy.id === newHoliday.fiscalYearId)?.name || '2023/2024',
        rowVersion: '1'
      };

      // Add to local state (replace with actual API response)
      setHolidays(prev => [newHolidayWithId, ...prev]);
      
      // Reset form after successful addition
      setNewHoliday(getDefaultHoliday());
    } catch (error) {
      console.error('Error adding holiday:', error);
      throw error;
    }
  };

  const handleEditHoliday = async (holidayData: EditHolidayDto): Promise<void> => {
    try {
      // TODO: Replace with your actual API call
      console.log('Updating holiday:', holidayData);
      
      // Mock API call - replace with actual implementation
      const updatedHoliday: HolidayListDto = {
        ...holidayData,
        name: holidayData.name,
        date: holidayData.date,
        dateStr: new Date(holidayData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        dateStrAm: 'የተሻሻለ ቀን', // This would come from backend
        updatedAt: new Date().toISOString(),
        isActive: true,
        fiscalYearId: 'fy-2024', // This should come from the original holiday or be editable
        fiscalYearName: '2023/2024',
        isPublic: holidayData.isPublic,
        isPublicStr: holidayData.isPublic ? 'Public' : 'Private',
        fiscYear: '2023/2024',
        // Remove description since it's not in EditHolidayDto
      };

      // Update local state (replace with actual API response)
      setHolidays(prev => prev.map(h => 
        h.id === holidayData.id ? { ...h, ...updatedHoliday } : h
      ));
      
      setEditModalOpen(false);
      setSelectedHoliday(null);
    } catch (error) {
      console.error('Error updating holiday:', error);
      throw error;
    }
  };

  const handleDeleteHoliday = async (holidayId: string): Promise<void> => {
    try {
      // TODO: Replace with your actual API call
      console.log('Deleting holiday:', holidayId);
      
      // Mock API call - replace with actual implementation
      // await holidayService.deleteHoliday(holidayId);

      // Update local state (replace with actual API response)
      setHolidays(prev => prev.filter(h => h.id !== holidayId));
      
      setDeleteModalOpen(false);
      setSelectedHoliday(null);
    } catch (error) {
      console.error('Error deleting holiday:', error);
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
  const handleEdit = (holiday: HolidayListDto) => {
    setSelectedHoliday(holiday);
    setEditModalOpen(true);
  };

  // Handler for deleting holiday
  const handleDelete = (holiday: HolidayListDto) => {
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
    <div className="bg-gray-50 -mt-6 py-4 -mx-2">
      <Dialog>
        <HolidayHeader 
          setDialogOpen={setAddModalOpen}
          onViewHistory={handleViewHistory}
        />
        
        {/* Main Content */}
        <div className="w-full mx-auto px-4 py-6">
          <HolidayList
            holidays={holidays}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentFiscalYear="2024"
          />
        </div>

        <AddHolidayModal
          open={addModalOpen}
          onOpenChange={handleAddModalOpenChange}
          newHoliday={newHoliday}
          setNewHoliday={setNewHoliday}
          onAddHoliday={handleAddHoliday}
          fiscalYears={fiscalYears} // Pass fiscal years to the modal
        />
      </Dialog>

      {/* Edit Modal - Outside Dialog to work independently */}
      <EditHolidayModal
        isOpen={editModalOpen}
        onClose={handleEditModalClose}
        onSave={handleEditHoliday}
        holiday={selectedHoliday}
      />

      {/* Delete Modal - Outside Dialog to work independently */}
      <DeleteHolidayModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteHoliday}
        holiday={selectedHoliday}
      />
    </div>
  );
}