import React, { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

// Define props interface with optional onSuccess
interface LeaveRequestFormProps {
  onSuccess?: () => void;
}

const LeaveRequestForm = ({ onSuccess }: LeaveRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, leaveType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Leave Request:', formData);
      setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" });
      
      // Call onSuccess if provided
      if (onSuccess) onSuccess();
      
      setIsSubmitting(false);
      alert('Leave request submitted successfully!');
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border">
      <h2 className="text-xl font-semibold mb-6">New Leave Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Leave Type</label>
          <Select onValueChange={handleSelectChange} value={formData.leaveType}>
            <SelectTrigger>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Annual Leave</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="maternity">Maternity Leave</SelectItem>
              <SelectItem value="paternity">Paternity Leave</SelectItem>
              <SelectItem value="unpaid">Unpaid Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Date Range</label>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-xs mb-1">Start Date</label>
              <Input 
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-1">End Date</label>
              <Input 
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reason</label>
          <Textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Explain the reason for your leave"
            className="resize-none min-h-[100px]"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;