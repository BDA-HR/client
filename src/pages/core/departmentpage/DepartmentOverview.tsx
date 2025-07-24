// pages/DepartmentOverview.tsx

import { useState } from "react";
import DepartmentList from "../../../components/core/DepartmentList";
import DepartmentOverviewCard from "../../../components/core/DepartmentOverviewCard";
import DepartmentForm from "../../../components/core/DepartmentForm"; 
import type { Department } from "../../../types/coreTypes";

const DepartmentOverview = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Executive", description: "Company leadership", parentId: null },
    { id: "2", name: "Engineering", description: "Product development", parentId: null },
    { id: "3", name: "Frontend", description: "Client-side development", parentId: "2" },
    { id: "4", name: "HR", description: "Human Resources", parentId: null },
  ]);

  const [showForm, setShowForm] = useState(false); // Control popup


  const handleCreateDepartment = (newDepartment: Department) => {
    setDepartments(prev => [...prev, newDepartment]);
    setShowForm(false); // close modal after submit
  };

  const handleUpdateDepartment = (updatedDepartment: Department) => {
    setDepartments(prev => prev.map(dept => dept.id === updatedDepartment.id ? updatedDepartment : dept));
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
  };

  return (
    <div className="bg-green-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <DepartmentOverviewCard departments={departments} />

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <DepartmentList
                departments={departments}
                onCreateDepartment={() => setShowForm(true)}
                onUpdateDepartment={handleUpdateDepartment}
                onDeleteDepartment={handleDeleteDepartment}
              />
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <DepartmentForm
              onSubmit={(data) => {
                const newDept: Department = { id: Date.now().toString(), ...data };
                handleCreateDepartment(newDept);
              }}
              departments={departments}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentOverview;
