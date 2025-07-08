import React from 'react';
import { X, User, Mail, DollarSign, Briefcase, Calendar, Clock } from 'lucide-react';

interface EmployeeDetailsModalProps {
  employee: Employee;
  onClose: () => void;
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({ employee, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Employee Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start space-x-6">
            <div className="bg-gray-100 rounded-full p-6">
              <User size={48} className="text-gray-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h3>
              <p className="text-gray-600">{employee.role}</p>
              <div className="mt-4 flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  employee.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {employee.status === "active" ? "Active" : "On Leave"}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  employee.contractType === "Full-time" ? "bg-green-100 text-green-800" :
                  employee.contractType === "Part-time" ? "bg-blue-100 text-blue-800" :
                  employee.contractType === "Freelance" ? "bg-purple-100 text-purple-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {employee.contractType}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Personal Information</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="text-gray-500 mr-3" size={18} />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="text-gray-500 mr-3" size={18} />
                  <span>Payroll ID: {employee.payroll}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Employment Details</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Briefcase className="text-gray-500 mr-3" size={18} />
                  <span>{employee.department} Department</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-gray-500 mr-3" size={18} />
                  <span>Joined on {employee.joiningDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-gray-500 mr-3" size={18} />
                  <span>{employee.contractType} contract</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;