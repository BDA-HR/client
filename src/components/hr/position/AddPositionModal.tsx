import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, BadgePlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import type { PositionAddDto } from '../../../types/hr/position';
import type { NameListDto, UUID } from '../../../types/hr/NameListDto';
import { departmentService } from '../../../services/core/deptservice';

interface AddPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPosition: (position: PositionAddDto) => void;
}

const AddPositionModal: React.FC<AddPositionModalProps> = ({
  isOpen,
  onClose,
  onAddPosition,
}) => {
  const [formData, setFormData] = useState<PositionAddDto>({
    name: '',
    nameAm: '',
    noOfPosition: 1,
    isVacant: '1',
    departmentId: '' as UUID,
  });

  const [departments, setDepartments] = useState<NameListDto[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch departments when modal opens
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const depts = await departmentService.getAllDepartments();
        setDepartments(depts);
        
        if (depts.length > 0 && !formData.departmentId) {
          setFormData(prev => ({ ...prev, departmentId: depts[0].id }));
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        nameAm: '',
        noOfPosition: 1,
        isVacant: '1',
        departmentId: departments.length > 0 ? departments[0].id : '' as UUID,
      });
    }
  }, [isOpen, departments]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'noOfPosition' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!formData.name.trim() || !formData.nameAm.trim() || formData.noOfPosition <= 0) return;

    onAddPosition(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      nameAm: '',
      noOfPosition: 1,
      isVacant: '1',
      departmentId: '' as UUID,
    });
    onClose();
  };

  // Add click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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

  if (!isOpen) return null; // UNCOMMENTED THIS LINE

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen"
      onClick={handleBackdropClick} // Added backdrop click
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <BadgePlus className="h-5 w-5" />
            <h2 className="text-lg font-bold text-gray-800">Add New Position</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            type="button" // Explicitly set button type
          >
            <X size={20} />
          </button>
        </div>

        {/* Body - Wrap in form for better submission handling */}
        <form onSubmit={handleSubmit}>
          <div className="px-6">
            <div className="py-4 space-y-4">
              {/* Position Name (English) */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-gray-700 font-medium">
                  Position Name (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="1">Vacant</option>
                    <option value="0">Filled</option>
                  </select>
                </div>
              </div>

              {/* Position Preview */}
              {(formData.name || formData.nameAm) && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-green-800 font-medium mb-2">Position Preview:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">English Name:</span>
                      <span className="font-semibold">{formData.name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amharic Name:</span>
                      <span className="font-semibold">{formData.nameAm || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Positions:</span>
                      <span className="font-semibold">{formData.noOfPosition}</span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span className={`font-bold ${formData.isVacant === '1' ? 'text-green-600' : 'text-gray-600'}`}>
                        {formData.isVacant === '1' ? 'Vacant' : 'Filled'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 rounded-b-xl">
            <div className="flex flex-row-reverse justify-center items-center gap-3">
              <Button
                variant="outline"
                className="cursor-pointer px-6 border-gray-300 hover:bg-gray-100"
                onClick={handleClose}
                type="button" // Explicitly set button type
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
                type="submit" // Use submit type for form
                disabled={
                  !formData.name.trim() || 
                  !formData.nameAm.trim() || 
                  formData.noOfPosition <= 0
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddPositionModal;