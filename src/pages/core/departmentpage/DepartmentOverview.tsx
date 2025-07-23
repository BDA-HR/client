// pages/DepartmentOverview.tsx
import DepartmentList from "../../../components/core/DepartmentList";
import DepartmentOverviewCard from "../../../components/core/DepartmentOverviewCard";
import { useState } from "react";
import type { Department } from "../../../types/coreTypes";

const DepartmentOverview = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Executive", description: "Company leadership", parentId: null },
    { id: "2", name: "Engineering", description: "Product development", parentId: null },
    { id: "3", name: "Frontend", description: "Client-side development", parentId: "2" },
    { id: "4", name: "HR", description: "Human Resources", parentId: null },
  ]);

  const handleCreateDepartment = (newDepartment: Department) => {
    setDepartments(prev => [...prev, newDepartment]);
  };

  const handleUpdateDepartment = (updatedDepartment: Department) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === updatedDepartment.id ? updatedDepartment : dept
    ));
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
                onCreateDepartment={handleCreateDepartment}
                onUpdateDepartment={handleUpdateDepartment}
                onDeleteDepartment={handleDeleteDepartment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentOverview;