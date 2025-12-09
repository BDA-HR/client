import { useState } from "react";
import EmployeeSearch from "../../components/core/usermgmt/EmployeeSearch";
import EmployeeList from "../../components/core/usermgmt/AccountList";
import { AddAccountStepForm } from "../../components/core/usermgmt/AddAccountStepForm";
import { userManagementService } from "../../services/core/usermgtservice";
import type { EmpSearchRes } from "../../types/core/EmpSearchRes";

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmpSearchRes | null>(null);
  const [searchedEmployees, setSearchedEmployees] = useState<EmpSearchRes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddAccountFromList = () => {
    
    if (searchedEmployees.length > 0) {
      setSelectedEmployee(searchedEmployees[0]);
    } else {
      setSelectedEmployee(null);
    }
    setShowAccountForm(true);
  };

  const handleAccountAdded = (result: any) => {
    console.log("Account created:", result);
    setShowAccountForm(false);
    setSelectedEmployee(null);
    setSearchedEmployees([]); 
    setError(null); 
  };

  const handleBackToAccounts = () => {
    setShowAccountForm(false);
    setSelectedEmployee(null);
    setSearchedEmployees([]); 
    setError(null); 
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setError(null); 
    
    if (value.length === 0) {
      setSearchedEmployees([]);
    }
  };

  // Handle search employee button click - calls the API
  const handleSearchEmployee = async () => {
    if (!searchQuery || searchQuery.length !== 10 || !/^[A-Za-z0-9]{10}$/.test(searchQuery)) {
      setError("Please enter a valid 10-character employee code");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const employee = await userManagementService.getEmployeeByCode(searchQuery);
      setSearchedEmployees([employee]);
    } catch (err: any) {
      setError(err.message || "Failed to search employee. Please try again.");
      setSearchedEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showAccountForm ? (
        <div className="w-full min-h-screen bg-gray-50 overflow-auto">
          <AddAccountStepForm
            onBackToAccounts={handleBackToAccounts}
            onAccountAdded={handleAccountAdded}
            employee={selectedEmployee || undefined}
          />
        </div>
      ) : (
        <section className="w-full min-h-screen bg-gray-50 overflow-auto">
          <div>
            <div>
              <div className="flex justify-between items-center pb-4">
                <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
              </div>
              
              {/* Error Message Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
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
              
              {/* Show search results when we have employees */}
              {searchedEmployees.length > 0 ? (
                <EmployeeList
                  employees={searchedEmployees}
                  onAddAccount={handleAddAccountFromList}
                />
              ) : (
                // Show empty state when no results
                searchQuery.length === 10 && !loading && !error && (
                  <div className="text-center py-12 text-gray-500">
                    No employee found with code: {searchQuery}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default UserManagement;