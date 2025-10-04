import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../ui/button';
import type { AddPeriodDto, UUID } from '../../../types/core/period';
import toast from 'react-hot-toast';
import List from '../../../components/List/list';
import type { ListItem } from '../../../types/List/list';
import { listService } from '../../../services/List/listservice';
import { fiscalYearService } from '../../../services/core/fiscservice';

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
  const [loading, setLoading] = useState(false);
  const [fiscalYears, setFiscalYears] = useState<ListItem[]>([]);
  const [quarters, setQuarters] = useState<ListItem[]>([]);
  const [loadingFiscalYears, setLoadingFiscalYears] = useState(false);
  const [loadingQuarters, setLoadingQuarters] = useState(false);

  useEffect(() => {
    if (open) {
      fetchFiscalYears();
      fetchQuarters();
    }
  }, [open]);

  const fetchFiscalYears = async () => {
    try {
      setLoadingFiscalYears(true);
      const fiscalYearsData = await fiscalYearService.getAllFiscalYears();
      // Convert FiscYearListDto to ListItem
      const fiscalYearListItems: ListItem[] = fiscalYearsData.map(fy => ({
        id: fy.id,
        name: fy.name
      }));
      setFiscalYears(fiscalYearListItems);
    } catch (error) {
      console.error('Error fetching fiscal years:', error);
      toast.error('Failed to load fiscal years');
      setFiscalYears([]);
    } finally {
      setLoadingFiscalYears(false);
    }
  };

  const fetchQuarters = async () => {
    try {
      setLoadingQuarters(true);
      const quartersData = await listService.getAllQuarters();
      setQuarters(quartersData);
    } catch (error) {
      console.error('Error fetching quarters:', error);
      toast.error('Failed to load quarters');
      setQuarters([]);
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

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <BadgePlus size={20} />
            <h2 className="text-lg font-bold text-gray-800">Add New</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <form onSubmit={handleSubmit}>
            <div className="py-4 space-y-4">
              {/* Period Name */}
              <div className="space-y-2">
                <label htmlFor="periodName" className="block text-sm font-medium text-gray-700">
                  Period Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="periodName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., January 2024, Q1 Review"
                  value={newPeriod.name}
                  onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                  required
                />
              </div>

              {/* Quarter and Fiscal Year Selection - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quarter Selection */}
                <div className="space-y-2">
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
                <div className="space-y-2">
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
              </div>

              {/* Start and End Dates - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    value={newPeriod.dateStart}
                    onChange={(e) => setNewPeriod({ ...newPeriod, dateStart: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    value={newPeriod.dateEnd}
                    onChange={(e) => setNewPeriod({ ...newPeriod, dateEnd: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-2">
              <div className="mx-auto flex justify-center items-center gap-1.5">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
                  disabled={loading || loadingFiscalYears || loadingQuarters}
                >
                  {loading ? 'Adding...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer px-6"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};