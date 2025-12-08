import { useState } from "react";
import EmployeeSearch from "../../components/core/usermgmt/EmployeeSearch";
import EmployeeList from "../../components/core/usermgmt/EmployeeList";
import { AddAccountStepForm } from "../../components/core/usermgmt/AddAccountStepForm";

// Mock data
const mockEmployees = [
  {
    id: "1",
    employeeCode: "EMP-2024-001",
    name: "John Doe",
    email: "john@company.com",
    department: "Engineering",
    status: "active" as const,
  },
  {
    id: "2",
    employeeCode: "EMP-2024-002",
    name: "Jane Smith",
    email: "jane@company.com",
    department: "Marketing",
    status: "active" as const,
  },
  {
    id: "3",
    employeeCode: "EMP-2024-003",
    name: "Bob Johnson",
    email: "bob@company.com",
    department: "Sales",
    status: "inactive" as const,
  },
];

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState(mockEmployees);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleAddAccount = () => {
    // No employee parameter since we removed the button from cards
    setSelectedEmployee(null);
    setShowAccountForm(true);
  };

  const handleAccountAdded = (result: any) => {
    console.log("Account created:", result);
    setShowAccountForm(false);
    setSelectedEmployee(null);
    // Show success toast or refresh data
  };

  const handleBackToAccounts = () => {
    setShowAccountForm(false);
    setSelectedEmployee(null);
  };

  const handleEdit = (employee: any) => {
    console.log("Edit employee:", employee);
  };

  const handleDelete = (employeeId: string) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
    console.log("Delete employee with ID:", employeeId);
  };

  const handleViewDetails = (employee: any) => {
    console.log("View details for:", employee);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {showAccountForm ? (
        <div className="w-full min-h-screen bg-gray-50 overflow-auto"> {/* Added overflow-auto */}
          <AddAccountStepForm
            onBackToAccounts={handleBackToAccounts}
            onAccountAdded={handleAccountAdded}
            employee={selectedEmployee}
          />
        </div>
      ) : (
        <section className="w-full min-h-screen bg-gray-50 overflow-auto"> {/* Added overflow-auto */}
          <div>
            <div >
              <div className="flex justify-between items-center pb-4">
                <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
              </div>
              
              <EmployeeSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddAccount={handleAddAccount} 
              />
              
              {filteredEmployees.length > 0 ? (
                <EmployeeList
                  employees={filteredEmployees}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No employees found. Try a different search.
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default UserManagement;