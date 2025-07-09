import { Briefcase, Calendar, User, Mail, Phone, MapPin, Clock, Award, BarChart2, DollarSign, Users, Star, TrendingUp } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useModule } from '../../ModuleContext';
import { useEffect } from 'react';

const EmployeeDetailsPage = () => {
  // All hooks at the top
  const { setActiveModule } = useModule();
  const storedModule = sessionStorage.getItem('currentModule');
  
  useEffect(() => {
    if (storedModule) {
      setActiveModule(storedModule);
    }
  }, [setActiveModule, storedModule]);

  // Then your conditional checks
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get employee data from sessionStorage
const employee = {
    id: 'emp-1',
    employeeId: '1219484SH3',
    firstName: 'Jane',
    lastName: 'Cooper',
    email: 'janecoop@gmail.com',
    phone: '+1 555-123-4567',
    address: '123 Main Street, San Francisco, USA',
    dateOfBirth: 'June 15, 1990',
    department: 'Finance',
    jobTitle: 'Sr. Accountant',
    jobGrade: 'G6',
    employeeCategory: 'Technical',
    reportingTo: 'Emily Wong',
    manager: 'Jacob Lee',
    team: 'Platform Engineering',
    joiningDate: 'Feb 23, 2025',
    contractType: "Full-time",
    employmentStatus: "Active",
    status: "active",
    workLocation: 'San Francisco HQ',
    salary: 120000,
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    bankDetails: {
      bankName: 'Bank of America',
      accountNumber: '••••5678',
      branchCode: '12345'
    },
    lastCheckIn: 'Jul 6, 2025 • 9:05 AM',
    lastCheckOut: 'Jul 6, 2025 • 6:01 PM',
    totalLeavesTaken: 8,
    leaveBalance: 12,
    attendancePercentage: 94,
    performanceRating: 4.5,
    lastAppraisalDate: 'Feb 2025',
    nextAppraisalDate: 'Aug 2025',
    emergencyContact: {
      name: 'Jane Chen',
      relationship: 'Sister',
      phone: '+1 555-987-6543'
    },
    trainings: [
      {
        name: 'Advanced React',
        date: 'Jan 2025',
        status: "Completed"
      },
      {
        name: 'Leadership Skills',
        date: 'May 2025',
        status: "In Progress"
      }
    ],
    previousRoles: [
      {
        jobTitle: 'Software Developer',
        department: 'R&D',
        startDate: '2021',
        endDate: '2023',
        responsibilities: 'Led React migration, improved performance by 25%'
      }
    ]
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
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
            {/* Personal Information */}
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
                    <p>{employee.address}</p>
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
                  <p>{employee.lastCheckIn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Check-Out</p>
                  <p>{employee.lastCheckOut}</p>
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
                {employee.trainings.map((training, index) => (
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
                    <td className="px-4 py-2 text-sm">{role.startDate} - {role.endDate}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{role.responsibilities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;