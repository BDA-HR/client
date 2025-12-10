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
  const [hasSearched, setHasSearched] = useState(false); 
  
  const handleAddAccountFromList = () => {
    if (searchedEmployees.length > 0) {
      setSelectedEmployee(searchedEmployees[0]);
      setShowAccountForm(true);
    }
  };

  const handleAccountAdded = (result: any) => {
    console.log("Account created:", result);
    setShowAccountForm(false);
    setSelectedEmployee(null);
    setSearchedEmployees([]); 
    setError(null); 
    setHasSearched(false);
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
    if (!searchQuery || searchQuery.length !== 10 || !/^[A-Za-z0-9]{10}$/.test(searchQuery)) {
      setError("Please enter a valid 10-character employee code");
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    setLoading(true);
    setError(null);
    
    try {
      const employee = await userManagementService.getEmployeeByCode(searchQuery);
      setSearchedEmployees([employee]);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to search employee. Please try again.");
      setSearchedEmployees([]);
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
          <div className="p-6">
            <div>
              <div className="pb-4">
                <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
              </div>
              
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
              
              {/* Show search results when we have employees */}
              {searchedEmployees.length > 0 ? (
                <div className="space-y-6">
                  <EmployeeList
                    employees={searchedEmployees}
                    onAddAccount={handleAddAccountFromList}
                  />
                </div>
              ) : (
                hasSearched && !loading && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No employee found</h3>
                    <p className="text-gray-600">Please check the employee code and try again</p>
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