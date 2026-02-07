import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import useToast from '../../../hooks/useToast';

interface ProcessPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessPayroll: (data: any) => Promise<any>;
  employees: any[];
}

const ProcessPayrollModal: React.FC<ProcessPayrollModalProps> = ({
  isOpen,
  onClose,
  onProcessPayroll,
  employees = []
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  const totalAmount = employees.reduce((sum, emp) => sum + emp.netPay, 0);
  const monthlyAmount = totalAmount / 12;
  
  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp.id.toString()));
    }
  };
  
  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const payrollData = {
        period: selectedPeriod,
        payDate,
        employeeIds: selectedEmployees,
        totalAmount: selectedPeriod === 'monthly' ? monthlyAmount : totalAmount
      };
      
      await onProcessPayroll(payrollData);
      toast.success('Payroll processed successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to process payroll');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 h-dvh">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <DollarSign size={24} className="text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-800">Process Payroll</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Payroll Summary */}
            <Card className="border-emerald-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-sm text-emerald-600 mb-1">Total Employees</div>
                    <div className="text-2xl font-bold text-emerald-700">{employees.length}</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Monthly Payroll</div>
                    <div className="text-2xl font-bold text-blue-700">
                      ${monthlyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 mb-1">Annual Payroll</div>
                    <div className="text-2xl font-bold text-purple-700">
                      ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Payroll Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pay Period</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                    <option value="semi-monthly">Semi-monthly</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pay Date</label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            
            {/* Employee Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Select Employees</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={isLoading}
                >
                  {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`flex items-center justify-between p-3 border-b hover:bg-gray-50 ${
                      selectedEmployees.includes(employee.id.toString()) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id.toString())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEmployees([...selectedEmployees, employee.id.toString()]);
                          } else {
                            setSelectedEmployees(selectedEmployees.filter(id => id !== employee.id.toString()));
                          }
                        }}
                        disabled={isLoading}
                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.employeeId} • {employee.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${employee.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employee.status === 'Active' ? (
                          <span className="text-emerald-600">Active</span>
                        ) : (
                          <span className="text-amber-600">{employee.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Selected: {selectedEmployees.length} of {employees.length} employees
                </span>
                <span className="font-medium">
                  Total: ${((selectedPeriod === 'monthly' ? monthlyAmount : totalAmount) * 
                    (selectedEmployees.length / employees.length)).toLocaleString('en-US', { 
                    minimumFractionDigits: 2 
                  })}
                </span>
              </div>
            </div>
            
            {/* Warning Message */}
            {selectedEmployees.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Payroll Processing Notice</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Processing payroll for {selectedEmployees.length} employee(s). This action will:
                    </p>
                    <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Generate payslips for selected employees</li>
                      <li>Update payment records</li>
                      <li>Create journal entries for accounting</li>
                      <li>Send payment notifications to employees</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t px-6 py-4">
          <div className="flex justify-end items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || selectedEmployees.length === 0}
              className="px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign size={18} className="mr-2" />
                  Process Payroll
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessPayrollModal;