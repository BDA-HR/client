import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import type { Employee } from '../../types/employee';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onAddEmployee }) => {
  const [step, setStep] = useState(1);
const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
  employeeId: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  },
  department: '',
  jobTitle: '',
  role: '', // Added missing required field
  jobGrade: '',
  employeeCategory: '',
  reportingTo: '',
  manager: '',
  team: '',
  joiningDate: new Date().toISOString().split('T')[0],
  contractType: 'Full-time',
  employmentStatus: 'Active',
  status: 'active',
  workLocation: '',
  workSchedule: '',
  salary: 0,
  currency: '',
  paymentMethod: '',
  bankDetails: {
    bankName: '',
    accountNumber: '',
    branchCode: ''
  },
  taxInformation: '',
  totalLeavesTaken: 0,
  leaveBalance: 0,
  attendancePercentage: 0,
  performanceRating: 0,
  lastAppraisalDate: '',
  nextAppraisalDate: '',
  keyPerformanceIndicators: [],
  skills: [],
  competencies: [],
  trainings: [],
  previousRoles: [],
  documents: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  updatedBy: ''
});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = ['Finance', 'Engineering', 'Product', 'Marketing', 'HR', 'Operations'];
  const jobGrades = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];
  const employmentStatuses: Array<Employee['employmentStatus']> = ['Active', 'On Leave', 'Terminated', 'Probation'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1 || stepNumber === 2) {
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.middleName.trim()) newErrors.middleName = 'Middle name is required'; // ✅
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
  } else if (stepNumber === 3) {
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  // FIX: Removed handleSubmit from form and moved logic to button
  const handleSubmit = () => {
    onAddEmployee(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 h-screen"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Step indicators */}
<div className="flex mb-6">
  {[1, 2, 3, 4].map(i => (
    <React.Fragment key={i}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{i}</div>
      {i < 4 && <div className={`flex-1 h-1 mx-2 my-auto ${step > i ? 'bg-green-500' : 'bg-gray-200'}`} />}
    </React.Fragment>
  ))}
</div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name *</label>
                        <input 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md`} 
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Middle Name *</label>
                        <input 
                          name="middleName" 
                          value={formData.middleName} 
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name *</label>
                        <input 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md`} 
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`} 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number *</label>
                        <PhoneInput
                          country={'us'}
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          inputClass={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                          containerClass={`${errors.phone ? 'border-red-500' : ''}`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Date of Birth</label>
                      <input 
                        type="date" 
                        name="dateOfBirth" 
                        value={formData.dateOfBirth} 
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      />
                    </div>
                  </motion.div>
                )}

  {step === 2 && (
  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4 font-ethiopic">
    <h3 className="text-lg font-medium text-gray-800 mb-4">መረጃ ያስገቡ</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">ስም *</label>
        <input 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange}
          lang="am"
          className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md font-ethiopic`} 
        />
        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">የአባት ስም *</label>
        <input 
          name="middleName" 
          value={formData.middleName} 
          onChange={handleChange}
          lang="am"
          required
          className={`w-full px-3 py-2 border ${errors.middleName ? 'border-red-500' : 'border-gray-300'} rounded-md font-ethiopic`} 
        />
        {errors.middleName && <p className="text-red-500 text-xs mt-1">{errors.middleName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">የአያት ስም *</label>
        <input 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange}
          lang="am"
          className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md font-ethiopic`} 
        />
        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">ኢሜይል *</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange}
          lang="am"
          className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md font-ethiopic`} 
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">ስልክ ቁጥር *</label>
        <PhoneInput
          country={'us'}
          value={formData.phone}
          onChange={handlePhoneChange}
          inputProps={{
            lang: 'am',
          }}
          inputClass={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md font-['Noto_Sans_Ethiopic','sans-serif']`}
          containerClass={`${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
    </div>
  </motion.div>
)}


                {step === 3 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Employment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Employee ID *</label>
                        <input 
                          name="employeeId" 
                          value={formData.employeeId} 
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Job Title *</label>
                        <input 
                          name="jobTitle" 
                          value={formData.jobTitle} 
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'} rounded-md`} 
                        />
                        {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Department *</label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Job Grade</label>
                        <select
                          name="jobGrade"
                          value={formData.jobGrade}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Job Grade</option>
                          {jobGrades.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Joining Date *</label>
                        <input 
                          type="date" 
                          name="joiningDate" 
                          value={formData.joiningDate} 
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${errors.joiningDate ? 'border-red-500' : 'border-gray-300'} rounded-md`} 
                        />
                        {errors.joiningDate && <p className="text-red-500 text-xs mt-1">{errors.joiningDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Employment Status</label>
                        <select
                          name="employmentStatus"
                          value={formData.employmentStatus}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          {employmentStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
    <h3 className="text-lg font-medium text-gray-800 mb-4">Review Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
      <p><strong>First Name:</strong> {formData.firstName}</p>
      <p><strong>Middle Name:</strong> {formData.middleName}</p>
      <p><strong>Last Name:</strong> {formData.lastName}</p>
      <p><strong>Email:</strong> {formData.email}</p>
      <p><strong>Phone:</strong> {formData.phone}</p>
      <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
      <p><strong>Department:</strong> {formData.department}</p>
      <p><strong>Job Title:</strong> {formData.jobTitle}</p>
      <p><strong>Joining Date:</strong> {formData.joiningDate}</p>
      <p><strong>Salary:</strong> {formData.salary}</p>
      <p><strong>Currency:</strong> {formData.currency}</p>
    </div>
  </motion.div>
)}

                              {/* FIX: Unified navigation buttons */}
              <div className="flex justify-between pt-6">
                <div>
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {step < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Add Employee
                    </Button>
                  )}
                </div>
</div>

              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddEmployeeModal;