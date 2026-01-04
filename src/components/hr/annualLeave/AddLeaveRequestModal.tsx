import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import type { LeaveRequestAddDto } from '../../../types/hr/leaverequest';
import type { UUID } from 'crypto';
import useToast from '../../../hooks/useToast';

interface AddLeaveRequestModalProps {
  onAddLeave: (leave: LeaveRequestAddDto) => Promise<any>;
  leaveTypes: Array<{ id: UUID; name: string }>;
  leaveTypesLoading: boolean;
  employeeId: UUID;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

const AddLeaveRequestModal: React.FC<AddLeaveRequestModalProps> = ({ 
  onAddLeave, 
  leaveTypes,
  leaveTypesLoading,
  isOpen,
  onClose,
  isLoading
}) => {
  const toast = useToast();
  
  const [newLeave, setNewLeave] = useState<LeaveRequestAddDto>({
    leaveTypeId: '' as UUID,
    startDate: '',
    endDate: '',
    isHalfDay: false,
    comments: ''
  });

  const calculateDays = () => {
    if (!newLeave.startDate || !newLeave.endDate) return 0;
    
    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    return dayDiff > 0 ? dayDiff : 0;
  };

  const handleSubmit = async () => {
    // Validation
    if (!newLeave.leaveTypeId) {
      toast.error('Please select a leave type');
      return;
    }
    
    if (!newLeave.startDate || !newLeave.endDate) {
      toast.error('Please select start and end dates');
      return;
    }
    
    const startDate = new Date(newLeave.startDate);
    const endDate = new Date(newLeave.endDate);
    
    if (endDate < startDate) {
      toast.error('End date cannot be before start date');
      return;
    }
    
    if (!newLeave.comments.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    
    // Show loading toast
    const loadingToastId = toast.loading('Submitting leave request...');

    try {
      const response = await onAddLeave({
        ...newLeave,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      
      toast.dismiss(loadingToastId);

      // Extract success message from backend response
      const successMessage = 
        response?.data?.message || 
        response?.message || 
        'Leave request submitted successfully!';
      
      toast.success(successMessage);
      
      // Reset form and close modal
      setNewLeave({
        leaveTypeId: '' as UUID,
        startDate: '',
        endDate: '',
        isHalfDay: false,
        comments: ''
      });
      onClose();
      
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      
      const errorMessage = 
        error.response?.data?.message ||
        error.message || 
        'Failed to submit leave request. Please try again.';
      
      toast.error(errorMessage);
      console.error('Error submitting leave request:', error);
    }
  };

  const handleClose = () => {
    setNewLeave({
      leaveTypeId: '' as UUID,
      startDate: '',
      endDate: '',
      isHalfDay: false,
      comments: ''
    });
    onClose();
  };

  const totalDays = calculateDays();
  const isSingleDay = totalDays === 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header - Updated with green badge */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <BadgePlus className="h-4 w-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-green-800">Add New Leave Request</h2>
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
        <div className="p-6">
          <div className="space-y-6">
            {/* Leave Type */}
            <div className="space-y-2">
              <Label htmlFor="leaveType" className="text-sm font-medium text-gray-700">
                Leave Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newLeave.leaveTypeId}
                onValueChange={(value) => setNewLeave({...newLeave, leaveTypeId: value as UUID})}
                disabled={isLoading || leaveTypesLoading}
              >
                <SelectTrigger id="leaveType" className="w-full">
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
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="startDate"
                    type="date"
                    value={newLeave.startDate as string}
                    onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                    className="w-full pl-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="endDate"
                    type="date"
                    value={newLeave.endDate as string}
                    onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                    className="w-full pl-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    disabled={isLoading}
                    min={newLeave.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Days Calculation Display */}
            {(newLeave.startDate && newLeave.endDate) && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  Total days: <span className="font-semibold">{totalDays}</span>
                  {totalDays > 0 && ` (${isSingleDay ? 'Single day' : 'Multiple days'})`}
                </p>
              </div>
            )}

            {/* Half Day Option */}
            {isSingleDay && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="halfDay"
                  checked={newLeave.isHalfDay}
                  onCheckedChange={(checked) => 
                    setNewLeave({...newLeave, isHalfDay: checked as boolean})
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="halfDay" className="text-sm font-medium text-gray-700">
                  Half Day Leave
                </Label>
              </div>
            )}

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-sm font-medium text-gray-700">
                Reason/Comment <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Textarea
                  id="comments"
                  value={newLeave.comments}
                  onChange={(e) => setNewLeave({...newLeave, comments: e.target.value})}
                  placeholder="Please provide a reason for your leave request..."
                  className="w-full pl-10 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="flex justify-center items-center gap-3">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={isLoading || leaveTypesLoading || leaveTypes.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save'}
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
              Cannot submit leave request: Leave types not available
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddLeaveRequestModal;