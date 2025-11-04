import { Briefcase, User, Mail, Clock, Award, BarChart2, DollarSign, Users, Star, TrendingUp } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { useModule } from '../../../ModuleContext';
import { useEffect, useState } from 'react';
import type { EmployeeListDto } from '../../../types/hr/employee';
import { motion } from 'framer-motion';
import type { UUID } from 'crypto';

// Extended type for display purposes with optional fields
type EmployeeDisplay = EmployeeListDto & {
  // Optional fields that might not be available in the list DTO
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  employeeCategory?: string;
  reportingTo?: string;
  manager?: string;
  team?: string;
  contractType?: string;
  employmentStatus?: string;
  status?: "active" | "on-leave";
  workLocation?: string;
  workSchedule?: string;
  salary?: number;
  currency?: string;
  paymentMethod?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branchCode: string;
  };
  taxInformation?: string;
  lastCheckIn?: string;
  lastCheckOut?: string;
  totalLeavesTaken?: number;
  leaveBalance?: number;
  attendancePercentage?: number;
  performanceRating?: number;
  lastAppraisalDate?: string;
  nextAppraisalDate?: string;
  keyPerformanceIndicators?: {
    name: string;
    target: string;
    actual: string;
    weight: number;
  }[];
  skills?: string[];
  competencies?: string[];
  trainings?: {
    name: string;
    date: string;
    duration: string;
    status: "Completed" | "In Progress" | "Pending";
    certification?: string;
  }[];
  previousRoles?: {
    jobTitle: string;
    department: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }[];
  documents?: {
    type: string;
    name: string;
    issueDate: string;
    expiryDate?: string;
    status: string;
  }[];
};

const EmployeeDetailsPage = () => {
  const { setActiveModule } = useModule();
  const { id } = useParams();
  const [employee, setEmployee] = useState<EmployeeDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check authentication first
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) {
      setLoading(false);
      return;
    }

    // Set the active module from session storage if available
    const storedModule = sessionStorage.getItem('currentModule');
    if (storedModule) {
      setActiveModule(storedModule);
    }

    // Try to get employee data from sessionStorage first
    const storedEmployee = sessionStorage.getItem('selectedEmployee');
    if (storedEmployee) {
      try {
        const parsedEmployee = JSON.parse(storedEmployee);
        if (parsedEmployee.id === id) {
          setEmployee(parsedEmployee);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored employee data:', error);
      }
    }

    // If no employee in sessionStorage or ID doesn't match, try to fetch from API
    const fetchEmployee = async () => {
      try {
        // TODO: Replace this with your actual API call
        // const response = await fetch(`/api/employees/${id}`);
        // const data = await response.json();
        // setEmployee(data);
        
        // For now, we'll use a timeout to simulate loading and show a fallback
        setTimeout(() => {
          setLoading(false);
          // If no employee data is available, set a minimal employee object
          if (!employee) {
            setEmployee({
              id: id || '' as UUID,
              personId: '' as UUID,
              jobGradeId: '' as UUID,
              positionId: '' as UUID,
              departmentId: '' as UUID,
              employmentTypeId: '' as UUID,
              employmentNatureId: '' as UUID,
              gender: '0',
              nationality: 'Ethiopian',
              code: 'EMP001',
              employmentDate: new Date().toISOString(),
              jobGrade: 'G7',
              position: 'HR Manager',
              department: 'Human Resources',
              employmentType: 'Permanent',
              employmentNature: 'Full-time',
              genderStr: 'Male',
              empFullName: 'John Smith',
              empFullNameAm: 'ጆን ስሚዝ',
              employmentDateStr: '2023-01-15',
              employmentDateStrAm: '2015-ጥር-15',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              updatedBy: 'Admin',
              // Additional sample data for demonstration
              email: 'john.smith@company.com',
              phone: '+251-911-234567',
              address: 'Bole Road, Addis Ababa',
              dateOfBirth: '1990-05-15',
              maritalStatus: 'Married',
              emergencyContact: {
                name: 'Sarah Smith',
                relationship: 'Spouse',
                phone: '+251-911-345678'
              },
              salary: 50000,
              currency: 'ETB',
              performanceRating: 4.5,
              lastAppraisalDate: '2024-01-15',
              nextAppraisalDate: '2025-01-15',
              attendancePercentage: 95.5,
              leaveBalance: 18
            });
          }
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch employee:', error);
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, setActiveModule]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading employee details...</p>
        </div>
      </div>
    );
  }

  // Check authentication after loading
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Employee Not Found</h1>
          <p>The employee data could not be loaded.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getEmploymentTypeColor = (type: string): string => {
    switch (type) {
      case "Permanent": return "bg-green-100 text-green-800";
      case "Contract": return "bg-blue-100 text-blue-800";
      case "Temporary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string = 'active'): string => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  // Helper function to check if field has data
  const hasData = (field: any): boolean => {
    return field !== undefined && field !== null && field !== '';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <User className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Information</h1>
          <p className="text-gray-600">Complete employee profile and details</p>
        </div>

        <div id="employee-details-content">
          {/* Basic Information Section */}
          <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <User className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              {employee.code && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                  <span className="text-xs font-medium text-green-600">Employee Code: </span>
                  <span className="text-sm font-bold text-green-800">{employee.code}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <div className="lg:col-span-1 flex flex-col items-center">
                <div className="bg-green-100 rounded-full h-32 w-32 flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                  <User className="text-green-600 h-16 w-16" />
                </div>
                <div className="text-center">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(employee.status)}`}>
                    {employee.status === "on-leave" ? "On Leave" : "Active"}
                  </span>
                </div>
              </div>

              {/* Personal Information */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Full Name (English)</label>
                  <p className="text-gray-900 font-medium text-lg">{employee.empFullName || ' '}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">ሙሉ ስም (Amharic)</label>
                  <p className="text-gray-900 font-medium text-lg">{employee.empFullNameAm || ' '}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900">{employee.gender || ' '}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Nationality</label>
                  <p className="text-gray-900">{employee.nationality || ' '}</p>
                </div>
                {hasData(employee.dateOfBirth) && (
                  <div className="field">
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">{formatDate(employee.dateOfBirth)}</p>
                  </div>
                )}
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Employment Date</label>
                  <p className="text-gray-900">{formatDate(employee.employmentDate)}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Employment Type</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEmploymentTypeColor(employee.employmentType)}`}>
                    {employee.employmentType}
                  </span>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Employment Nature</label>
                  <p className="text-gray-900">{employee.employmentNature || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-white">
            <div className="flex items-center mb-6">
              <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Employment Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-900 font-medium">{employee.department || ' '}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Position</label>
                <p className="text-gray-900 font-medium">{employee.position || ' '}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Job Grade</label>
                <p className="text-gray-900">{employee.jobGrade || ' '}</p>
              </div>
              {hasData(employee.employeeCategory) && (
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Employee Category</label>
                  <p className="text-gray-900">{employee.employeeCategory}</p>
                </div>
              )}
              {hasData(employee.reportingTo) && (
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Reporting To</label>
                  <p className="text-gray-900">{employee.reportingTo}</p>
                </div>
              )}
              {hasData(employee.manager) && (
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Manager</label>
                  <p className="text-gray-900">{employee.manager}</p>
                </div>
              )}
              {hasData(employee.team) && (
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Team</label>
                  <p className="text-gray-900">{employee.team}</p>
                </div>
              )}
              {hasData(employee.workLocation) && (
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Work Location</label>
                  <p className="text-gray-900">{employee.workLocation}</p>
                </div>
              )}
              {hasData(employee.workSchedule) && (
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Work Schedule</label>
                  <p className="text-gray-900">{employee.workSchedule}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          {(hasData(employee.email) || hasData(employee.phone) || hasData(employee.address)) && (
            <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-white">
              <div className="flex items-center mb-6">
                <Mail className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hasData(employee.email) && (
                  <div className="field">
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-900">{employee.email}</p>
                  </div>
                )}
                {hasData(employee.phone) && (
                  <div className="field">
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-900">{employee.phone}</p>
                  </div>
                )}
                {hasData(employee.address) && (
                  <div className="field md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{employee.address}{employee.city && `, ${employee.city}`}{employee.country && `, ${employee.country}`}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Emergency Contact Section */}
          {employee.emergencyContact && (
            <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-white">
              <div className="flex items-center mb-6">
                <Users className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.name}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Relationship</label>
                  <p className="text-gray-900">{employee.emergencyContact.relationship}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-900">{employee.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Performance & Compensation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Performance Section */}
            {hasData(employee.performanceRating) && (
              <div className="border border-gray-200 rounded-xl p-6 bg-white">
                <div className="flex items-center mb-6">
                  <BarChart2 className="w-5 h-5 text-amber-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                </div>

                <div className="space-y-4">
                  <div className="field">
                    <label className="text-sm font-medium text-gray-500">Current Rating</label>
                    <div className="flex items-center">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-3">
                        {employee.performanceRating}/5
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={`${i < Math.floor(employee.performanceRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} mr-1`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {hasData(employee.lastAppraisalDate) && (
                    <div className="field">
                      <label className="text-sm font-medium text-gray-500">Last Appraisal</label>
                      <p className="text-gray-900">{formatDate(employee.lastAppraisalDate)}</p>
                    </div>
                  )}
                  {hasData(employee.nextAppraisalDate) && (
                    <div className="field">
                      <label className="text-sm font-medium text-gray-500">Next Appraisal</label>
                      <p className="text-gray-900">{formatDate(employee.nextAppraisalDate)}</p>
                    </div>
                  )}
                  {hasData(employee.attendancePercentage) && (
                    <div className="field">
                      <label className="text-sm font-medium text-gray-500">Attendance Rate</label>
                      <p className="text-gray-900">{employee.attendancePercentage}%</p>
                    </div>
                  )}
                  {hasData(employee.leaveBalance) && (
                    <div className="field">
                      <label className="text-sm font-medium text-gray-500">Leave Balance</label>
                      <p className="text-gray-900">{employee.leaveBalance} days</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compensation Section */}
            {hasData(employee.salary) && (
              <div className="border border-gray-200 rounded-xl p-6 bg-white">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-5 h-5 text-emerald-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Compensation</h3>
                </div>

                <div className="space-y-4">
                  <div className="field">
                    <label className="text-sm font-medium text-gray-500">Salary</label>
                    <p className="text-xl font-bold text-gray-900">
                      {employee.currency} {employee.salary?.toLocaleString()}
                    </p>
                  </div>
                  {hasData(employee.paymentMethod) && (
                    <div className="field">
                      <label className="text-sm font-medium text-gray-500">Payment Method</label>
                      <p className="text-gray-900">{employee.paymentMethod}</p>
                    </div>
                  )}
                  {employee.bankDetails && (
                    <>
                      <div className="field">
                        <label className="text-sm font-medium text-gray-500">Bank Name</label>
                        <p className="text-gray-900">{employee.bankDetails.bankName}</p>
                      </div>
                      <div className="field">
                        <label className="text-sm font-medium text-gray-500">Account Number</label>
                        <p className="text-gray-900">••••{employee.bankDetails.accountNumber?.slice(-4)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* System Information Section */}
          <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-white">
            <div className="flex items-center mb-6">
              <Clock className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Created Date</label>
                <p className="text-gray-900">{formatDate(employee.createdAt)}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{formatDate(employee.updatedAt)}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Updated By</label>
                <p className="text-gray-900">{employee.updatedBy || 'System'}</p>
              </div>
            </div>
          </div>

          {/* Training & Development Section */}
          {employee.trainings && employee.trainings.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-white">
              <div className="flex items-center mb-6">
                <Award className="w-5 h-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Training & Development</h3>
              </div>

              <div className="space-y-4">
                {employee.trainings.map((training, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{training.name}</p>
                        <p className="text-sm text-gray-500">{training.date} • {training.duration}</p>
                        {training.certification && (
                          <p className="text-sm text-blue-600">{training.certification}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        training.status === "Completed" ? "bg-green-100 text-green-800" :
                        training.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {training.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Career History Section */}
          {employee.previousRoles && employee.previousRoles.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-6 bg-white">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Career History</h3>
              </div>

              <div className="space-y-4">
                {employee.previousRoles.map((role, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{role.jobTitle}</p>
                        <p className="text-sm text-gray-500">{role.department}</p>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {role.startDate} - {role.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{role.responsibilities}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetailsPage;