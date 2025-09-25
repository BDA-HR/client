import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Plus } from 'lucide-react';
import { AddPeriodModal } from './AddPeriodModal';
import { PeriodTable } from './PeriodTable';
import { EditPeriodModal } from './EditPeriodModal';
import { DeletePeriodModal } from './DeletePeriodModal';
import type { AddPeriodDto, PeriodListDto, EditPeriodDto } from '../../../types/core/period';

function PeriodSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5);
  const [totalItems] = useState(48);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodListDto | null>(null);
  
  const [newPeriod, setNewPeriod] = useState<AddPeriodDto>({
    name: '',
    dateStart: new Date().toISOString(),
    dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: '0',
    quarterId: '00000000-0000-0000-0000-000000000000',
    fiscalYearId: '00000000-0000-0000-0000-000000000000'
  });

  // TEMPORARY MOCK DATA - Replace this with your actual API data
  const [periods, setPeriods] = useState<PeriodListDto[]>([
    {
      id: '1',
      name: 'January 2024',
      quarter: 'Q1',
      fiscYear: 'FY 2024',
      isActive: 'Yes',
      dateStart: '2024-01-01T00:00:00',
      dateEnd: '2024-01-31T23:59:59',
      startDate: 'January 01, 2024',
      startDateAm: 'Tir 22, 2016',
      endDate: 'January 31, 2024',
      endDateAm: 'Yekatit 22, 2016',
      createdBy: 'Admin',
      createdAt: '2023-12-15T10:30:00',
      modifiedBy: 'Admin',
      modifiedAt: '2023-12-15T10:30:00'
    },
    {
      id: '2',
      name: 'February 2024',
      quarter: 'Q1',
      fiscYear: 'FY 2024',
      isActive: 'Yes',
      dateStart: '2024-02-01T00:00:00',
      dateEnd: '2024-02-29T23:59:59',
      startDate: 'February 01, 2024',
      startDateAm: 'Yekatit 23, 2016',
      endDate: 'February 29, 2024',
      endDateAm: 'Megabit 20, 2016',
      createdBy: 'Admin',
      createdAt: '2024-01-15T14:20:00',
      modifiedBy: 'Admin',
      modifiedAt: '2024-01-15T14:20:00'
    },
    {
      id: '3',
      name: 'March 2024',
      quarter: 'Q1',
      fiscYear: 'FY 2024',
      isActive: 'No',
      dateStart: '2024-03-01T00:00:00',
      dateEnd: '2024-03-31T23:59:59',
      startDate: 'March 01, 2024',
      startDateAm: 'Megabit 21, 2016',
      endDate: 'March 31, 2024',
      endDateAm: 'Miyazya 21, 2016',
      createdBy: 'Admin',
      createdAt: '2024-02-15T09:15:00',
      modifiedBy: 'Admin',
      modifiedAt: '2024-02-15T09:15:00'
    }
  ]);

  const mockQuarters = [
    { id: '1', name: 'Q1 2024' },
    { id: '2', name: 'Q2 2024' },
    { id: '3', name: 'Q3 2024' },
    { id: '4', name: 'Q4 2024' }
  ];

  const mockFiscalYears = [
    { id: '1', name: 'FY 2024' },
    { id: '2', name: 'FY 2025' },
    { id: '3', name: 'FY 2026' }
  ];

  const handleAddPeriod = async () => {
    console.log('Adding period:', newPeriod);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Add your API call logic here
  };

  const handleEditPeriod = async (periodData: EditPeriodDto) => {
    console.log('Editing period:', periodData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Add your API call logic here
  };

  const handleDeletePeriod = async (periodId: string) => {
    console.log('Deleting period with ID:', periodId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Remove the period from the local state
    setPeriods(prev => prev.filter(p => p.id !== periodId));
    setIsDeleteModalOpen(false);
  };

  const handleViewDetails = (period: PeriodListDto) => {
    console.log('View details:', period);
  };

  const handleEdit = (period: PeriodListDto) => {
    setSelectedPeriod(period);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = (period: PeriodListDto) => {
    console.log('Toggle status for period:', period);
    // Update the period status in the local state
    setPeriods(prev => prev.map(p => 
      p.id === period.id 
        ? { ...p, isActive: p.isActive === 'Yes' ? 'No' : 'Yes' }
        : p
    ));
  };

  const handleDelete = (period: PeriodListDto) => {
    setSelectedPeriod(period);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Period Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your fiscal periods, quarters, and date ranges
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Period
        </Button>
      </div>

      {/* Periods Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <PeriodTable
          periods={periods}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Period Modal */}
      <AddPeriodModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        newPeriod={newPeriod}
        setNewPeriod={setNewPeriod}
        onAddPeriod={handleAddPeriod}
        quarters={mockQuarters}
        fiscalYears={mockFiscalYears}
      />

      {/* Edit Period Modal */}
      <EditPeriodModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditPeriod}
        period={selectedPeriod}
        quarters={mockQuarters}
        fiscalYears={mockFiscalYears}
      />

      {/* Delete Period Modal */}
      <DeletePeriodModal
        period={selectedPeriod}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePeriod}
      />
    </div>
  );
}

export default PeriodSection;