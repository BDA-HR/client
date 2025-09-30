import { BadgePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../ui/dialog';
import type { AddPeriodDto, UUID } from '../../../types/core/period';
import React from 'react';
import { Button } from '../../ui/button';
import toast from 'react-hot-toast';
import List from '../../../components/List/list';
import type { ListItem } from '../../../types/List/list';

interface AddPeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPeriod: AddPeriodDto;
  setNewPeriod: (period: AddPeriodDto) => void;
  onAddPeriod: () => Promise<void>;
}

export const AddPeriodModal = ({
  open,
  onOpenChange,
  newPeriod,
  setNewPeriod,
  onAddPeriod
}: AddPeriodModalProps) => {
  const [loading, setLoading] = React.useState(false);
  const [fiscalYears, setFiscalYears] = React.useState<ListItem[]>([]);
  const [quarters, setQuarters] = React.useState<ListItem[]>([]);
  const [loadingFiscalYears, setLoadingFiscalYears] = React.useState(false);
  const [loadingQuarters, setLoadingQuarters] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      fetchFiscalYears();
      fetchQuarters();
    }
  }, [open]);

  // TODO: Replace with your actual fiscal year service
  const fetchFiscalYears = async () => {
    try {
      setLoadingFiscalYears(true);
      // const fiscalYearsData = await fiscalYearService.getFiscalYearList();
      // const fiscalYearListItems: ListItem[] = fiscalYearsData.map(fy => ({
      //   id: fy.id,
      //   name: fy.name
      // }));
      // setFiscalYears(fiscalYearListItems);
      
      // Temporary mock data - replace with actual API call
      const mockFiscalYears: ListItem[] = [
        { id: '1' as UUID, name: 'FY 2024' },
        { id: '2' as UUID, name: 'FY 2025' },
        { id: '3' as UUID, name: 'FY 2026' },
      ];
      setFiscalYears(mockFiscalYears);
    } catch (error) {
      console.error('Error fetching fiscal years:', error);
      toast.error('Failed to load fiscal years');
    } finally {
      setLoadingFiscalYears(false);
    }
  };

  // TODO: Replace with your actual quarter service
  const fetchQuarters = async () => {
    try {
      setLoadingQuarters(true);
      const mockQuarters: ListItem[] = [
        { id: '1' as UUID, name: 'Q1' },
        { id: '2' as UUID, name: 'Q2' },
        { id: '3' as UUID, name: 'Q3' },
        { id: '4' as UUID, name: 'Q4' },
      ];
      setQuarters(mockQuarters);
    } catch (error) {
      console.error('Error fetching quarters:', error);
      toast.error('Failed to load quarters');
    } finally {
      setLoadingQuarters(false);
    }
  };

  const handleSelectFiscalYear = (item: ListItem) => {
    setNewPeriod({ ...newPeriod, fiscalYearId: item.id });
  };

  const handleSelectQuarter = (item: ListItem) => {
    setNewPeriod({ ...newPeriod, quarterId: item.id });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPeriod.name || !newPeriod.dateStart || !newPeriod.dateEnd) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!newPeriod.quarterId || !newPeriod.fiscalYearId) {
      toast.error('Please select a quarter and fiscal year');
      return;
    }

    // Date validation
    const startDate = new Date(newPeriod.dateStart);
    const endDate = new Date(newPeriod.dateEnd);
    
    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      await onAddPeriod();
    } catch (error) {
      console.error('Error adding period:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewPeriod({
      name: '',
      dateStart: '',
      dateEnd: '',
      isActive: '0',
      quarterId: '' as UUID,
      fiscalYearId: '' as UUID
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className='border-b pb-3'>
          <DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
            <BadgePlus size={18} />
            Add New
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Period Name - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="periodName" className="block text-sm font-medium text-gray-700 mb-2">
                Period Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="periodName"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="e.g., January 2024, Q1 Review"
                value={newPeriod.name}
                onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                required
              />
            </div>

            {/* Quarter Selection */}
            <div>
              <List
                items={quarters}
                selectedValue={newPeriod.quarterId}
                onSelect={handleSelectQuarter}
                label="Quarter"
                placeholder="Select a quarter"
                required
                disabled={loadingQuarters}
              />
              {loadingQuarters && <p className="text-sm text-gray-500 mt-1">Loading quarters...</p>}
            </div>

            {/* Fiscal Year Selection */}
            <div>
              <List
                items={fiscalYears}
                selectedValue={newPeriod.fiscalYearId}
                onSelect={handleSelectFiscalYear}
                label="Fiscal Year"
                placeholder="Select a fiscal year"
                required
                disabled={loadingFiscalYears}
              />
              {loadingFiscalYears && <p className="text-sm text-gray-500 mt-1">Loading fiscal years...</p>}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={newPeriod.dateStart}
                onChange={(e) => setNewPeriod({ ...newPeriod, dateStart: e.target.value })}
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={newPeriod.dateEnd}
                onChange={(e) => setNewPeriod({ ...newPeriod, dateEnd: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row justify-center items-center gap-3 mt-6 border-t pt-4">
            <Button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white cursor-pointer transition-colors"
              disabled={loading || loadingFiscalYears || loadingQuarters}
            >
              {loading ? 'Adding...' : 'Save'}
            </Button>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="cursor-pointer px-6 border-gray-300 hover:bg-gray-50"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};