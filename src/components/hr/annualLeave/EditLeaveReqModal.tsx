import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import type { LeaveRequestListDto, LeaveRequestModDto } from '../../../types/hr/leaverequest';
import type { UUID } from 'crypto';
import useToast from '../../../hooks/useToast';

interface EditLeaveReqModalProps {
  leave: LeaveRequestListDto;
  onEditLeave: (leave: LeaveRequestModDto) => Promise<any>;
  leaveTypes: Array<{ id: UUID; name: string }>;
  leaveTypesLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

const EditLeaveReqModal: React.FC<EditLeaveReqModalProps> = ({ 
  leave, 
  onEditLeave, 
  leaveTypes,
  leaveTypesLoading,
  isOpen,
  onClose,
  isLoading
}) => {
  const toast = useToast();
  const [editedLeave, setEditedLeave] = useState<LeaveRequestModDto>({
    id: '' as UUID,
    leaveTypeId: '' as UUID,
    startDate: '',
    endDate: '',
    isHalfDay: false,
    comments: '',
    rowVersion: ''
  });

  // Calculate total days and determine if it's single day
  const calculateDays = () => {
    if (!editedLeave.startDate || !editedLeave.endDate) return 0;
    
    const start = new Date(editedLeave.startDate);
    const end = new Date(editedLeave.endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    return dayDiff > 0 ? dayDiff : 0;
  };

  const totalDays = calculateDays();
  const isSingleDay = totalDays === 1;

  // Initialize form when leave prop changes
  useEffect(() => {
    if (leave) {
      // Convert isHalfDayStr to boolean
      const isHalfDayBoolean = leave.isHalfDayStr?.toLowerCase() === 'yes' || 
                              leave.isHalfDayStr?.toLowerCase() === 'true' ||
                              leave.isHalfDayStr?.toLowerCase() === 'half day';
      
      setEditedLeave({
        id: leave.id,
        leaveTypeId: leave.leaveTypeId,
        startDate: leave.startDate as string,
        endDate: leave.endDate as string,
        isHalfDay: isHalfDayBoolean,
        comments: leave.comments,
        rowVersion: leave.rowVersion
      });
    }
  }, [leave]);

  // Reset isHalfDay when date range changes from single day to multiple days
  useEffect(() => {
    if (!isSingleDay && editedLeave.isHalfDay) {
      setEditedLeave(prev => ({
        ...prev,
        isHalfDay: false
      }));
    }
  }, [isSingleDay, editedLeave.isHalfDay]);

  const handleSubmit = async () => {
    // Validation
    if (!editedLeave.leaveTypeId) {
      toast.error('Please select a leave type');
      return;
    }
    
    if (!editedLeave.startDate || !editedLeave.endDate) {
      toast.error('Please select start and end dates');
      return;
    }
    
    const startDate = new Date(editedLeave.startDate);
    const endDate = new Date(editedLeave.endDate);
    
    if (endDate < startDate) {
      toast.error('End date cannot be before start date');
      return;
    }
    
    if (!editedLeave.comments.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    // Validate half day logic
    if (editedLeave.isHalfDay && !isSingleDay) {
      toast.error('Half day leave is only allowed for single day requests');
      return;
    }

    // Show loading toast
    const loadingToastId = toast.loading('Updating leave request...');

    try {
      const response = await onEditLeave({
        ...editedLeave,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        // isHalfDay is already boolean in state
      });

      toast.dismiss(loadingToastId);

      const successMessage = 
        response?.data?.message || 
        response?.message || 
        'Leave request updated successfully!';
      
      toast.success(successMessage);
      
      onClose();
      
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      
      const errorMessage = 
        error.response?.data?.message ||
        error.message || 
        'Failed to update leave request. Please try again.';
      
      toast.error(errorMessage);
      console.error('Error updating leave request:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const formatDateForInput = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setEditedLeave(prev => ({
      ...prev,
      [field]: value
    }));
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
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <PenBox className="h-4 w-4 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Edit Leave Request</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-4">
            {/* Leave Type */}
            <div className="space-y-2">
              <Label htmlFor="edit-leaveType" className="text-sm text-gray-700 font-medium">
                Leave Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editedLeave.leaveTypeId}
                onValueChange={(value) => setEditedLeave(prev => ({ ...prev, leaveTypeId: value as UUID }))}
                disabled={isLoading || leaveTypesLoading}
              >
                <SelectTrigger 
                  id="edit-leaveType" 
                  className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                >
                  <SelectValue placeholder={
                    leaveTypesLoading ? "Loading leave types..." : "Select leave type"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypesLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading leave types...
                    </div>
                  ) : leaveTypes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No leave types available
                    </div>
                  ) : (
                    leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {!leaveTypesLoading && leaveTypes.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  Unable to load leave types. Please contact administrator.
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate" className="text-sm text-gray-700 font-medium">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formatDateForInput(editedLeave.startDate)}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="w-full pl-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-endDate" className="text-sm text-gray-700 font-medium">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formatDateForInput(editedLeave.endDate)}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="w-full pl-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                    min={editedLeave.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Days Calculation Display */}
            {(editedLeave.startDate && editedLeave.endDate) && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  Total days: <span className="font-semibold">{totalDays}</span>
                  {totalDays > 0 && ` (${isSingleDay ? 'Single day' : 'Multiple days'})`}
                </p>
              </div>
            )}

            {/* Half Day Option - Only show for single day leaves */}
            {isSingleDay && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-halfDay"
                    checked={editedLeave.isHalfDay}
                    onCheckedChange={(checked) => 
                      setEditedLeave(prev => ({ ...prev, isHalfDay: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="edit-halfDay" className="text-sm text-gray-700 font-medium">
                    Half Day Leave
                  </Label>
                </div>
                {editedLeave.isHalfDay && (
                  <p className="text-sm text-blue-600 ml-6">
                    ✓ Half day leave selected. Only half of a working day will be deducted.
                  </p>
                )}
              </div>
            )}

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="edit-comments" className="text-sm text-gray-700 font-medium">
                Reason/Comment <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Textarea
                  id="edit-comments"
                  value={editedLeave.comments}
                  onChange={(e) => setEditedLeave(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Please provide a reason for your leave request..."
                  className="w-full pl-10 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Please provide a detailed reason for your leave request.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <div className="flex justify-center items-center gap-3">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={isLoading || leaveTypesLoading || leaveTypes.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Update Leave Request'}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
          {leaveTypes.length === 0 && !leaveTypesLoading && (
            <p className="text-center text-sm text-red-600 mt-2">
              Cannot update leave request: Leave types not available
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EditLeaveReqModal;