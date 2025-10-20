import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Edit } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import List from '../../List/list';
import type { PositionListDto, PositionModDto } from '../../../types/hr/position';
import type { NameListDto, UUID } from '../../../types/hr/NameListDto';
import type { ListItem } from '../../../types/List/list';
import { departmentService } from '../../../services/core/deptservice';
import { amharicRegex } from '../../../utils/amharic-regex';

interface EditPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (position: PositionModDto) => void;
  position: PositionListDto | null;
}

const EditPositionModal: React.FC<EditPositionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  position
}) => {
  const [formData, setFormData] = useState<PositionModDto>({
    id: '' as UUID,
    name: '',
    nameAm: '',
    noOfPosition: 0,
    isVacant: '1',
    departmentId: '' as UUID,
    rowVersion: ''
  });

  const [departments, setDepartments] = useState<NameListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<UUID | undefined>(undefined);

  // Create a proper close handler
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Fetch departments when modal opens
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const depts = await departmentService.getAllDepartments();
        setDepartments(depts);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [isOpen]);

  // Initialize form when position changes
  useEffect(() => {
    if (position) {
      setFormData({
        id: position.id,
        name: position.name,
        nameAm: position.nameAm,
        noOfPosition: position.noOfPosition,
        isVacant: position.isVacant,
        departmentId: position.departmentId,
        rowVersion: position.rowVersion || ''
      });
      setSelectedDepartment(position.departmentId);
    }
  }, [position]);

  // Convert departments to ListItem format
  const departmentListItems: ListItem[] = departments.map(dept => ({
    id: dept.id,
    name: dept.name
  }));

  const handleSelectDepartment = (item: ListItem) => {
    setSelectedDepartment(item.id);
    setFormData(prev => ({ ...prev, departmentId: item.id }));
  };

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setFormData(prev => ({ ...prev, nameAm: value }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'noOfPosition' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.nameAm.trim() || formData.noOfPosition <= 0 || !formData.departmentId) {
      return;
    }

    onSave(formData);
    handleClose();
  };

  // REMOVED: handleBackdropClick function

  // Add escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen || !position) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen"
      // REMOVED: onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        // REMOVED: onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Edit size={20} className="" />
            <h2 className="text-lg font-bold text-gray-800">Edit</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6">
            <div className="py-4 space-y-4">
              {/* Department Selection using List Component */}
              <div className="space-y-2">
                <List
                  items={departmentListItems}
                  selectedValue={selectedDepartment}
                  onSelect={handleSelectDepartment}
                  label="Select Department"
                  placeholder="Select a department"
                  required
                  disabled={loading}
                />
                {loading && <p className="text-sm text-gray-500">Loading departments...</p>}
                {selectedDepartment && (
                  <p className="text-sm text-green-600">
                    Currently selected: {departments.find(d => d.id === selectedDepartment)?.name}
                  </p>
                )}
              </div>

              {/* Position Name (English) */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-gray-700 font-medium">
                  Position Name (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Eg. Software Engineer"
                  className="w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Position Name (Amharic) */}
              <div className="space-y-2">
                <Label htmlFor="nameAm" className="text-sm text-gray-700 font-medium">
                  Position Name (Amharic) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameAm"
                  name="nameAm"
                  value={formData.nameAm}
                  onChange={handleAmharicChange}
                  placeholder="Eg. ሶፍትዌር ኢንጂነር"
                  className="w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Number of Positions and Vacancy Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noOfPosition" className="text-sm text-gray-700 font-medium">
                    Number of Positions <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="noOfPosition"
                    name="noOfPosition"
                    type="number"
                    value={formData.noOfPosition}
                    onChange={handleChange}
                    placeholder="1"
                    min="1"
                    className="w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isVacant" className="text-sm text-gray-700 font-medium">
                    Vacancy Status <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="isVacant"
                    name="isVacant"
                    value={formData.isVacant}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="1">Vacant</option>
                    <option value="0">Filled</option>
                  </select>
                </div>
              </div>



              {/* Original Values for Reference */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-2">Original Values:</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">English Name</p>
                    <p className="font-medium">{position.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amharic Name</p>
                    <p className="font-medium">{position.nameAm}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Number of Positions</p>
                    <p className="font-medium">{position.noOfPosition}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vacancy Status</p>
                    <p className="font-medium">{position.isVacantStr}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Department</p>
                    <p className="font-medium">{position.department}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-2 rounded-b-xl">
            <div className="flex flex-row-reverse justify-center items-center gap-3">
              <Button
                variant="outline"
                className="cursor-pointer px-6 border-gray-300 hover:bg-gray-100"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
                type="submit"
                disabled={
                  !formData.name.trim() || 
                  !formData.nameAm.trim() || 
                  formData.noOfPosition <= 0 ||
                  !formData.departmentId
                }
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditPositionModal;