import { useState } from 'react';
import { Dialog } from '../../../components/ui/dialog';
import { FiscalYearManagementHeader } from '../../../components/core/FiscYearHeader';
import { FiscalYearTable } from '../../../components/core/FiscYearTable';
import { FiscalYearModal } from '../../../components/core/FiscYearModal';
import { AddFiscalYearModal } from '../../../components/core/AddFiscYearModal';
import { initialFiscalYears, convertToEthiopianDate } from '../../../data/fiscalYear';
import type { FiscYearListDto, NewFiscalYear } from '../../../types/fiscalYear';

export default function FiscalYearOverview() {
  const [years, setYears] = useState<FiscYearListDto[]>(initialFiscalYears);
  const [newYear, setNewYear] = useState<NewFiscalYear>({
    name: '',
    dateStart: new Date().toISOString().split('T')[0],
    dateEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: 'Yes'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'status' | 'delete' | 'add' | null>(null);
  const [selectedYear, setSelectedYear] = useState<FiscYearListDto | null>(null);

  const itemsPerPage = 10;
  const totalItems = years.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedYears = years.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleYearUpdate = (updatedYear: FiscYearListDto) => {
    setYears(years.map(year => year.id === updatedYear.id ? updatedYear : year));
    setModalType(null);
  };

  const handleYearStatusChange = (yearId: string, newStatus: string) => {
    setYears(years.map(year => 
      year.id === yearId ? { ...year, isActive: newStatus as 'Yes' | 'No' } : year
    ));
    setModalType(null);
  };

  const handleYearDelete = (yearId: string) => {
    setYears(years.filter(year => year.id !== yearId));
    setModalType(null);
    if (paginatedYears.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddFiscalYear = () => {
    if (!newYear.name || !newYear.dateStart || !newYear.dateEnd) {
      alert('Please fill all required fields');
      return;
    }

    const newFiscalYear: FiscYearListDto = {
      id: Math.random().toString(),
      name: newYear.name,
      isActive: newYear.isActive,
      startDate: newYear.dateStart,
      endDate: newYear.dateEnd,
      startDateAm: convertToEthiopianDate(newYear.dateStart),
      endDateAm: convertToEthiopianDate(newYear.dateEnd),
      createdAt: new Date().toISOString(),
      createdAtAm: convertToEthiopianDate(new Date().toISOString()),
      modifiedAt: new Date().toISOString(),
      modifiedAtAm: convertToEthiopianDate(new Date().toISOString()),
      rowVersion: '1'
    };

    setYears([newFiscalYear, ...years]);
    setNewYear({
      name: '',
      dateStart: new Date().toISOString().split('T')[0],
      dateEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: 'Yes'
    });
    setDialogOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <FiscalYearManagementHeader setDialogOpen={setDialogOpen} />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Fiscal Years</h2>
            <p className="text-sm text-gray-600">
              {totalItems} fiscal year{totalItems !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <FiscalYearTable
            years={paginatedYears}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onYearUpdate={handleYearUpdate}
            onYearStatusChange={handleYearStatusChange}
            onYearDelete={handleYearDelete}
            onViewDetails={(year) => {
              setSelectedYear(year);
              setModalType('view');
            }}
            onEdit={(year) => {
              setSelectedYear(year);
              setModalType('edit');
            }}
          />
        </div>

        <AddFiscalYearModal
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          newYear={newYear}
          setNewYear={setNewYear}
          onAddFiscalYear={handleAddFiscalYear}
        />

        <FiscalYearModal
          modalType={modalType}
          selectedYear={selectedYear}
          newYear={newYear}
          setNewYear={setNewYear}
          onClose={() => setModalType(null)}
          onYearUpdate={handleYearUpdate}
          onYearStatusChange={handleYearStatusChange}
          onYearDelete={handleYearDelete}
          onAddFiscalYear={handleAddFiscalYear}
        />
      </Dialog>
    </div>
  );
}