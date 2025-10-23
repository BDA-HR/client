import { Briefcase, Calendar, User, Mail, Phone, MapPin, Clock, Award, BarChart2, DollarSign, Users, Star, TrendingUp } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { useModule } from '../../../ModuleContext';
import { useEffect, useState } from 'react';
import type { Employee } from '../../../types/employee';
import { motion } from 'framer-motion';

const EmployeeDetailsPage = () => {
  const { setActiveModule } = useModule();
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
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
      const parsedEmployee = JSON.parse(storedEmployee);
      if (parsedEmployee.id === id) {
        setEmployee(parsedEmployee);
        setLoading(false);
        return;
      }
    }

    // If no employee in sessionStorage or ID doesn't match, try to fetch from API
    // You would implement this API call based on your backend
    const fetchEmployee = async () => {
      try {
        // Replace this with your actual API call
        // const response = await fetch(`/api/employees/${id}`);
        // const data = await response.json();
        // setEmployee(data);
        
        // For now, we'll use a timeout to simulate loading
        setTimeout(() => {
          setLoading(false);
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
        </div>
      </div>
    );
  }
  
  const getContractTypeColor = (type: string): string => {
    switch (type) {
      case "Full-time": return "bg-green-100 text-green-800";
      case "Part-time": return "bg-blue-100 text-blue-800";
      case "Freelance": return "bg-purple-100 text-purple-800";
      case "Internship": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <div className="mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                <User className="text-green-600 h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{employee.firstName} {employee.lastName}</h1>
                <div className="flex items-center mt-1">
                  <span className="text-lg text-gray-600 mr-2">{employee.jobTitle}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getContractTypeColor(employee.contractType)}`}>
                    {employee.contractType}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Employee ID</p>
                <p className="font-medium">{employee.employeeId}</p>
              </div>
              <div>
                <p className="text-gray-500">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium capitalize">{employee.status}</p>
              </div>
              <div>
                <p className="text-gray-500">Joining Date</p>
                <p className="font-medium">{employee.joiningDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <User className="mr-2 text-green-500" size={20} />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="text-gray-500 mr-3 mt-1" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="text-gray-500 mr-3 mt-1" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{employee.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-gray-500 mr-3 mt-1" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{employee.address}, {employee.city}, {employee.country}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="text-gray-500 mr-3 mt-1" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p>{employee.dateOfBirth}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2 text-red-500" size={20} />
                Emergency Contact
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p>{employee.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p>{employee.emergencyContact.relationship}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{employee.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Employment Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Briefcase className="mr-2 text-green-500" size={20} />
                Employment Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Job Grade</p>
                  <p>{employee.jobGrade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p>{employee.employeeCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reporting To</p>
                  <p>{employee.reportingTo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Manager</p>
                  <p>{employee.manager}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Team</p>
                  <p>{employee.team}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Work Location</p>
                  <p>{employee.workLocation}</p>
                </div>
              </div>
            </div>

            {/* Time & Attendance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="mr-2 text-purple-500" size={20} />
                Time & Attendance
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Last Check-In</p>
                  <p>{employee.lastCheckIn || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Check-Out</p>
                  <p>{employee.lastCheckOut || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Leaves Taken</p>
                  <p>{employee.totalLeavesTaken} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Leave Balance</p>
                  <p>{employee.leaveBalance} days</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Attendance Percentage</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="h-2.5 rounded-full bg-green-500" 
                      style={{ width: `${employee.attendancePercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm mt-1">{employee.attendancePercentage}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart2 className="mr-2 text-amber-500" size={20} />
                Performance
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Current Rating</p>
                  <div className="flex items-center">
                    <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {employee.performanceRating}/5
                    </span>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={`${i < Math.floor(employee.performanceRating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Appraisal</p>
                  <p>{employee.lastAppraisalDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Appraisal</p>
                  <p>{employee.nextAppraisalDate}</p>
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="mr-2 text-emerald-500" size={20} />
                Compensation
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="text-lg font-medium">
                    {employee.currency} {employee.salary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p>{employee.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bank Details</p>
                  <p className="text-sm">
                    {employee.bankDetails.bankName} ••••{employee.bankDetails.accountNumber.slice(-4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Training & Development */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="mr-2 text-indigo-500" size={20} />
                Training & Development
              </h2>
              <div className="space-y-3">
                {employee.trainings.slice(0, 3).map((training, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{training.name}</p>
                    <div className="flex justify-between text-gray-500">
                      <span>{training.date}</span>
                      <span className={
                        training.status === "Completed" ? "text-green-500" :
                        training.status === "In Progress" ? "text-blue-500" : "text-gray-500"
                      }>
                        {training.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Career History Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-purple-500" size={20} />
            Career History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Responsibilities</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employee.previousRoles.map((role, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm">{role.jobTitle}</td>
                    <td className="px-4 py-2 text-sm">{role.department}</td>
                    <td className="px-4 py-2 text-sm">
                      {role.startDate} - {role.endDate || 'Present'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">{role.responsibilities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetailsPage;