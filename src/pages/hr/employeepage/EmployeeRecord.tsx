import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, User, Users, Clock, ArrowLeft, Briefcase, Calendar } from 'lucide-react';

interface Employee {
  name: string;
  email: string;
  payroll: string;
  department: string;
  role: string;
  joiningDate: string;
  contractType: "Full-time" | "Part-time" | "Freelance" | "Internship";
  status: "active" | "on-leave";
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren"
    } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15,
      duration: 0.5
    }
  }
};

const statCardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 10
    }
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.2 }
  }
};

type StatCardProps = {
  title: string;
  value: string;
  change?: number;
  icon: React.ComponentType<{ size: number; className?: string }>;
  color: string;
};

const StatCard = ({ title, value, change, icon: Icon, color }: StatCardProps) => (
  <motion.div 
    variants={statCardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    className={`p-5 rounded-xl border ${color} flex items-center shadow-sm hover:shadow-md transition-all duration-300`}
  >
    <div className="p-3 rounded-full bg-white bg-opacity-70 mr-4 shadow-inner">
      <Icon className="text-green-600 opacity-90" size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-green-800">{title}</p>
      <div className="flex items-center">
        <p className="text-2xl font-bold mt-1 text-green-900">{value}</p>
        {change !== undefined && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              change > 0 ? 'bg-green-100 text-green-800' : 'bg-amber-800 text-amber-100'
            }`}
          >
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </motion.span>
        )}
      </div>
    </div>
  </motion.div>
);

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 10;
  
  // Sample employee data with status
  const employees: Employee[] = [
    {
      name: "Jane Cooper",
      email: "janecoop@gmail.com",
      payroll: "1219484SH3",
      department: "Finance",
      role: "Sr. Accountant",
      joiningDate: "Feb 23, 2025",
      contractType: "Full-time",
      status: "active"
    },
    {
      name: "Brooklyn Simmons",
      email: "brookjynsmms@gmail.com",
      payroll: "BHABHD127",
      department: "Engineer",
      role: "Lead Back End Dev",
      joiningDate: "Feb 18, 2025",
      contractType: "Freelance",
      status: "on-leave"
    },
{
      name: "Jane Cooper",
      email: "janecoop@gmail.com",
      payroll: "1219484SH3",
      department: "Finance",
      role: "Sr. Accountant",
      joiningDate: "Feb 23, 2025",
      contractType: "Full-time",
            status: "active"

    },
    {
      name: "Brooklyn Simmons",
      email: "brookjynsmms@gmail.com",
      payroll: "BHABHD127",
      department: "Engineer",
      role: "Lead Back End Dev",
      joiningDate: "Feb 18, 2025",
      contractType: "Freelance",
            status: "active"

    },
    {
      name: "Leslie Alexander",
      email: "alexanderis@gmail.com",
      payroll: "182194DANJ",
      department: "Product",
      role: "Jr. Technical Product",
      joiningDate: "Dec 25, 2024",
      contractType: "Internship",
            status: "active"

    },
    {
      name: "Esther Howard",
      email: "esthinhovard@gmail.com",
      payroll: "MMZKAOB11",
      department: "Finance",
      role: "Lead Accountant",
      joiningDate: "Jan 10, 2025",
      contractType: "Part-time",
            status: "active"

    },
    {
      name: "Cameron Williamson",
      email: "williamcn@gmail.com",
      payroll: "HSASH8188",
      department: "Engineer",
      role: "Sr. DevOps",
      joiningDate: "Mar 30, 2025",
      contractType: "Freelance",
            status: "active"

    },
    {
      name: "Albert Flores",
      email: "albertfirs@gmail.com",
      payroll: "NXAHCH100",
      department: "Marketing",
      role: "Jr. Digital Marketing",
      joiningDate: "Oct 4, 2024",
      contractType: "Part-time",
            status: "active"

    },
    {
      name: "Annette Black",
      email: "annetblack@gmail.com",
      payroll: "SJABV81742",
      department: "Engineer",
      role: "Jr. Front End Dev",
      joiningDate: "Dec 19, 2024",
      contractType: "Internship",
            status: "active"

    },
    {
      name: "Dafene Robertson",
      email: "dafenerobert@gmail.com",
      payroll: "71738KAON",
      department: "Marketing",
      role: "Sr. Content Writer",
      joiningDate: "Jan 28, 2025",
      contractType: "Full-time",
            status: "active"

    },
    {
      name: "Grande Ariana",
      email: "grandeari@gmail.com",
      payroll: "JJHDC6661",
      department: "Product",
      role: "Lead Product Manager",
      joiningDate: "Feb 12, 2025",
      contractType: "Full-time",
            status: "active"

    },  ];

  // Calculate stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === "active").length;
  const onLeaveEmployees = employees.filter(e => e.status === "on-leave").length;

  const getContractTypeColor = (type: Employee["contractType"]): string => {
    switch (type) {
      case "Full-time":
        return "bg-green-100 text-green-800";
      case "Part-time":
        return "bg-blue-100 text-blue-800";
      case "Freelance":
        return "bg-purple-100 text-purple-800";
      case "Internship":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDepartmentColor = (dept: string): string => {
    switch (dept) {
      case "Finance":
        return "text-red-600";
      case "Engineer":
        return "text-green-600";
      case "Product":
        return "text-amber-600";
      case "Marketing":
        return "text-emerald-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusColor = (status: Employee["status"]): string => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Header with back button */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-4"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="text-gray-600" />
            </motion.button>
            <div className="flex flex-col">
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl md:text-3xl font-bold text-gray-900"
              >
                Employee <span className="text-green-600">Management</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600"
              >
                View and manage employee records
              </motion.p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            <StatCard 
              title="Total Employees" 
              value={totalEmployees.toString()} 
              icon={Users} 
              color="bg-green-50 border-green-100 hover:ring-1 hover:ring-green-300"
            />
            <StatCard 
              title="Active Employees" 
              value={activeEmployees.toString()} 
              change={5.2}
              icon={User} 
              color="bg-green-50 border-green-100 hover:ring-1 hover:ring-green-300"
            />
            <StatCard 
              title="On Leave" 
              value={onLeaveEmployees.toString()} 
              change={-2.1}
              icon={Clock} 
              color="bg-amber-50 border-amber-100 hover:ring-1 hover:ring-amber-300"
            />
          </motion.div>

          {/* Filters and Search */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 text-sm"
                  placeholder="Search employees..."
                />
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                <ChevronDown className="ml-2 h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Responsive Table */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <motion.tr 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Department
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Joining Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </motion.tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee, index) => (
                    <motion.tr 
                      key={index}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <motion.div 
                            whileHover={{ rotate: 10 }}
                            className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"
                          >
                            <User className="text-green-600 h-5 w-5" />
                          </motion.div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                              {employee.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status === "active" ? "Active" : "On Leave"}
                        </span>
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium hidden md:table-cell ${getDepartmentColor(employee.department)}`}>
                        {employee.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                        <div className="flex items-center">
                          <Briefcase className="text-gray-400 mr-2 h-4 w-4" />
                          <span className="truncate max-w-[120px]">{employee.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        <div className="flex items-center">
                          <Calendar className="text-gray-400 mr-2 h-4 w-4" />
                          <span>{employee.joiningDate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getContractTypeColor(employee.contractType)}`}
                        >
                          {employee.contractType}
                        </motion.span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-green-600 hover:text-green-900 mr-3 hidden sm:inline-block"
                        >
                          Edit
                        </motion.button>
                        <motion.button 
                          whileHover={{ rotate: 90 }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <ChevronDown className="h-5 w-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <motion.div 
              variants={itemVariants}
              className="px-4 py-4 flex items-center justify-between border-t border-gray-200"
            >
              <div className="flex-1 flex justify-between sm:hidden">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </motion.button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                    <span className="font-medium">100</span> entries
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-4 w-4" />
                    </motion.button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : 
                                 currentPage >= totalPages - 2 ? totalPages - 4 + i : 
                                 currentPage - 2 + i;
                      return (
                        <motion.button
                          key={page}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-green-50 border-green-500 text-green-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </motion.button>
                      );
                    })}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </nav>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeManagement;