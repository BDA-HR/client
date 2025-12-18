import { useState, useEffect } from "react";
import EmployeeSearch from "../../../components/core/usermgmt/EmployeeSearch";
import { AddAccountStepForm } from "../../../components/core/usermgmt/AddAccountStepForm";
import type { EmpSearchRes } from "../../../types/core/EmpSearchRes";
import EmployeeTable from "../../../components/hr/employee/EmployeeTable";

interface TableEmployee {
  id: string;
  code: string;
  empFullName: string;
  empFullNameAm: string;
  gender: string;
  department: string;
  position: string;
  branch?: string;
  jobGrade?: string;
  empType?: string;
  empNature?: string;
  photo?: string;
  status?: "active" | "on-leave";
  employmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
}

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmpSearchRes | null>(null);
  const [searchedEmployees, setSearchedEmployees] = useState<EmpSearchRes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // State for employee table
  const [employeesTableData, setEmployeesTableData] = useState<TableEmployee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

  // Create mock employees for demonstration
  const createMockEmployees = (): TableEmployee[] => {
    const departments = ["HR", "Finance", "IT", "Marketing", "Sales", "Operations"];
    const positions = ["Manager", "Senior Developer", "Developer", "Analyst", "Assistant", "Director"];
    const branches = ["Main Branch", "Downtown Branch", "West Branch", "East Branch"];
    const firstNames = ["John", "Jane", "Alex", "Sarah", "Michael", "Emily", "David", "Lisa"];
    const lastNames = ["Smith", "Doe", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller"];
    
    const mockEmployees: TableEmployee[] = [];
    
    for (let i = 1; i <= 11; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const pos = positions[Math.floor(Math.random() * positions.length)];
      
      mockEmployees.push({
        id: `emp-${i.toString().padStart(4, '0')}`,
        code: `EMP${i.toString().padStart(5, '0')}`,
        empFullName: `${firstName} ${lastName}`,
        empFullNameAm: `${firstName} ${lastName}`,
        gender: Math.random() > 0.5 ? "Male" : "Female",
        department: dept,
        position: pos,
        branch: branches[Math.floor(Math.random() * branches.length)],
        jobGrade: `Grade ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
        empType: Math.random() > 0.5 ? "Full-time" : "Part-time",
        empNature: Math.random() > 0.7 ? "Permanent" : Math.random() > 0.5 ? "Contract" : "Probation",
        photo: Math.random() > 0.7 ? `photo${i}` : "",
        status: Math.random() > 0.8 ? "on-leave" : "active",
        employmentDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: "admin"
      });
    }
    
    return mockEmployees;
  };

  // Fetch all employees for the table
  const fetchAllEmployees = async (page: number = 1) => {
    setTableLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockEmployees = createMockEmployees();
      
      // Simulate pagination
      const itemsPerPage = 10;
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedEmployees = mockEmployees.slice(startIndex, startIndex + itemsPerPage);
      
      setEmployeesTableData(paginatedEmployees);
      setTotalPages(Math.ceil(mockEmployees.length / itemsPerPage));
      setTotalItems(mockEmployees.length);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Failed to load employee list");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEmployees(currentPage);
  }, [currentPage]);

  const handleAddAccount = (employeeData: TableEmployee) => {
    const empSearchRes: EmpSearchRes = {
      id: employeeData.id,
      code: employeeData.code,
      fullName: employeeData.empFullName,
      fullNameAm: employeeData.empFullNameAm,
      gender: employeeData.gender,
      dept: employeeData.department,
      position: employeeData.position,
      photo: employeeData.photo || ""
    };
    
    setSelectedEmployee(empSearchRes);
    setShowAccountForm(true);
  };

  const handleAccountAdded = (result: any) => {
    console.log("Account created:", result);
    setShowAccountForm(false);
    setSelectedEmployee(null);
    setSearchedEmployees([]); 
    setError(null); 
    setHasSearched(false);
    fetchAllEmployees(currentPage);
  };

  const handleBackToAccounts = () => {
    setShowAccountForm(false);
    setSelectedEmployee(null);
    setSearchedEmployees([]); 
    setError(null); 
    setHasSearched(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setError(null); 
    
    if (value.length === 0) {
      setSearchedEmployees([]);
      setHasSearched(false);
    }
  };

  const handleSearchEmployee = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter an employee code");
      return;
    }

    setHasSearched(true);
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockFoundEmployee: EmpSearchRes = {
        id: `found-emp-${Date.now()}`,
        code: searchQuery,
        fullName: `Found Employee ${searchQuery}`,
        fullNameAm: `የተገኘ ሰራተኛ ${searchQuery}`,
        gender: "Male",
        dept: "IT",
        position: "Developer",
        photo: ""
      };
      
      setSearchedEmployees([mockFoundEmployee]);
      setLoading(false);
      
      // Add to table
      const tableEmployee: TableEmployee = {
        id: mockFoundEmployee.id,
        code: mockFoundEmployee.code,
        empFullName: mockFoundEmployee.fullName,
        empFullNameAm: mockFoundEmployee.fullNameAm,
        gender: mockFoundEmployee.gender,
        department: mockFoundEmployee.dept,
        position: mockFoundEmployee.position,
        branch: "Main Branch",
        jobGrade: "Grade B",
        empType: "Full-time",
        empNature: "Permanent",
        photo: mockFoundEmployee.photo,
        status: "active",
        employmentDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: "search-user"
      };
      
      setEmployeesTableData(prev => [tableEmployee, ...prev.slice(0, 9)]);
      setTotalItems(prev => prev + 1);
      
    } catch (err: any) {
      setError("Employee not found. Please try a different code.");
      setSearchedEmployees([]);
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEmployeeDelete = (employeeId: string) => {
    console.log("Delete employee:", employeeId);
    setEmployeesTableData(prev => prev.filter(emp => emp.id !== employeeId));
    setTotalItems(prev => prev - 1);
  };

  return (
    <>
      {showAccountForm ? (
        <div className="w-full bg-gray-50 overflow-auto">
          <AddAccountStepForm
            onBackToAccounts={handleBackToAccounts}
            onAccountAdded={handleAccountAdded}
            employee={selectedEmployee || undefined}
          />
        </div>
      ) : (
        <section className="w-full bg-gray-50 overflow-auto">
          <div>
            <div>
              <div className="pb-4">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent mr-2">
              User  
            </span>
          Management
          </h1>              </div>
              
              {/* Error Message Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <span>❌</span>
                    <span className="font-medium">Error:</span> {error}
                  </div>
                </div>
              )}
              
              {/* Loading State */}
              {loading && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Searching for employee with code: {searchQuery}
                  </div>
                </div>
              )}
              
              <EmployeeSearch
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchEmployee={handleSearchEmployee}
              />
              
              {/* Show search status message */}
              {hasSearched && searchedEmployees.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No employee found</h3>
                  <p className="text-gray-600">Please check the employee code and try again</p>
                </div>
              )}

              {/* Employee Table Section */}
              <div className="mt-8">
                <EmployeeTable
                  employees={employeesTableData}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                  onEmployeeUpdate={() => {}}
                  onEmployeeStatusChange={() => {}}
                  onEmployeeTerminate={() => {}}
                  onEmployeeDelete={handleEmployeeDelete}
                  onAddAccount={handleAddAccount} 
                  showAddAccountButton={true}
                  loading={tableLoading}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default UserManagement;