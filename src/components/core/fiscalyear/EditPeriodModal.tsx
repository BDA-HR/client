import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import type { EditPeriodDto, PeriodListDto, UUID } from '../../../types/core/period';
import toast from 'react-hot-toast';
import { PeriodStat } from '../../../types/core/enum';
import List from '../../../components/List/list';
import type { ListItem } from '../../../types/List/list';
import { listService } from '../../../services/List/listservice';
import { fiscalYearService } from '../../../services/core/fiscservice';

interface EditPeriodModalProps {
  period: PeriodListDto;
  onEditPeriod: (period: EditPeriodDto) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditPeriodModal: React.FC<EditPeriodModalProps> = ({ 
  period, 
  onEditPeriod, 
  isOpen,
  onClose 
}) => {
  const [editedPeriod, setEditedPeriod] = useState<EditPeriodDto>({
    id: period.id,
    name: period.name,
    dateStart: period.dateStart,
    dateEnd: period.dateEnd,
    isActive: period.isActive,
    quarterId: '' as UUID,
    fiscalYearId: '' as UUID,
    rowVersion: period.rowVersion || ''
  });

  const [loading, setLoading] = useState(false);
  const [fiscalYears, setFiscalYears] = useState<ListItem[]>([]);
  const [quarters, setQuarters] = useState<ListItem[]>([]);
  const [loadingFiscalYears, setLoadingFiscalYears] = useState(false);
  const [loadingQuarters, setLoadingQuarters] = useState(false);

  const periodStatusOptions = Object.entries(PeriodStat);

  useEffect(() => {
    if (isOpen) {
      setEditedPeriod({
        id: period.id,
        name: period.name,
        dateStart: period.dateStart,
        dateEnd: period.dateEnd,
        isActive: period.isActive,
        quarterId: '' as UUID,
        fiscalYearId: '' as UUID,
        rowVersion: period.rowVersion || ''
      });
      fetchFiscalYears();
      fetchQuarters();
    }
  }, [period, isOpen]);

  const fetchFiscalYears = async () => {
    try {
      setLoadingFiscalYears(true);
      const fiscalYearsData = await fiscalYearService.getAllFiscalYears();
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
    setEditedPeriod((prev) => ({ ...prev, fiscalYearId: item.id }));
  };

  const handleSelectQuarter = (item: ListItem) => {
    setEditedPeriod((prev) => ({ ...prev, quarterId: item.id }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPeriod((prev) => ({ ...prev, name: value }));
  };

  const handleDateStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPeriod((prev) => ({ ...prev, dateStart: value }));
  };

  const handleDateEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedPeriod((prev) => ({ ...prev, dateEnd: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditedPeriod((prev) => ({ ...prev, isActive: value }));
  };

  const handleSubmit = async () => {
    if (!editedPeriod.name || !editedPeriod.dateStart || !editedPeriod.dateEnd) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!editedPeriod.quarterId || !editedPeriod.fiscalYearId) {
      toast.error('Please select a quarter and fiscal year');
      return;
    }

    // Date validation
    const startDate = new Date(editedPeriod.dateStart);
    const endDate = new Date(editedPeriod.dateEnd);
    
    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      await onEditPeriod(editedPeriod);
    } catch (error) {
      console.error('Error updating period:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
            <PenBox size={20} />
            <h2 className="text-lg font-bold text-gray-800">Edit</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-4">
            {/* Period Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm text-gray-500">
                Period Name <span className="text-red-500">*</span>
              </Label>
              <input
                id="edit-name"
                value={editedPeriod.name}
                onChange={handleNameChange}
                placeholder="Q1 2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Quarter and Fiscal Year Selection - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quarter Selection */}
              <div className="space-y-2">
                <List
                  items={quarters}
                  selectedValue={editedPeriod.quarterId}
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
                  selectedValue={editedPeriod.fiscalYearId}
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
                <Label htmlFor="edit-dateStart" className="text-sm text-gray-500">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <input
                  id="edit-dateStart"
                  type="date"
                  value={editedPeriod.dateStart}
                  onChange={handleDateStartChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dateEnd" className="text-sm text-gray-500">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <input
                  id="edit-dateEnd"
                  type="date"
                  value={editedPeriod.dateEnd}
                  onChange={handleDateEndChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-isActive" className="text-sm text-gray-500">
                Status <span className="text-red-500">*</span>
              </Label>
              <select
                id="edit-isActive"
                value={editedPeriod.isActive}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              >
                {periodStatusOptions.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!editedPeriod.name || !editedPeriod.dateStart || 
                       !editedPeriod.dateEnd || !editedPeriod.quarterId ||
                       !editedPeriod.fiscalYearId || loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditPeriodModal;