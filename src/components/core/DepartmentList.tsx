import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from 'lucide-react';
import DepartmentTable from "./DepartmentTable";
import DepartmentForm from "./DepartmentForm";
import DepartmentHierarchy from "./DepartmentHierarchy";
import type { Department } from "../../types/coreTypes";

export const DepartmentListTab = ({ 
  departments, 
  onEdit, 
  onDelete, 
  onCreate 
}: { 
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}) => (
  <Card className="border-none shadow-none">
    <CardContent className="p-0">
      <DepartmentTable 
        departments={departments}
        onEdit={onEdit}
        onDelete={onDelete}
        onCreate={onCreate}
      />
    </CardContent>
  </Card>
);

export const DepartmentFormTab = ({ 
  initialData, 
  departments, 
  isEdit, 
  onChange, 
  onSubmit, 
  onCancel,
  formError
}: { 
  initialData: Omit<Department, 'id'> & { id?: string };
  departments: Department[];
  isEdit: boolean;
  onChange: (field: keyof Department, value: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  formError: string | null;
}) => (
  <Card className="border-none shadow-none">
    <CardHeader className="px-0 pt-0 pb-4">
      <CardTitle className="text-xl">
        {isEdit ? "Edit Department" : "Create New Department"}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-0">
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <DepartmentForm 
        initialData={initialData}
        departments={departments}
        isEdit={isEdit}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </CardContent>
  </Card>
);

export const DepartmentHierarchyTab = ({ 
  treeData, 
  expandedNodes, 
  onToggle 
}: { 
  treeData: Department[];
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
}) => (
  <Card className="border-none shadow-none">
    <CardHeader className="px-0 pt-0 pb-4">
      <CardTitle className="text-xl">Organizational Hierarchy</CardTitle>
    </CardHeader>
    <CardContent className="px-0">
      <DepartmentHierarchy 
        treeData={treeData}
        expandedNodes={expandedNodes}
        onToggle={onToggle}
      />
    </CardContent>
  </Card>
);

interface DepartmentListProps {
  departments: Department[];
  onCreateDepartment: (department: Department) => void;
  onUpdateDepartment: (department: Department) => void;
  onDeleteDepartment: (id: string) => void;
}

const DepartmentList = ({ departments, onCreateDepartment, onUpdateDepartment, onDeleteDepartment }: DepartmentListProps) => {
  const [tabValue, setTabValue] = useState('list');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Omit<Department, 'id'> & { id?: string }>({
    name: '',
    description: '',
    parentId: null
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const rootNodeIds = departments.filter(dept => dept.parentId === null).map(dept => dept.id);
    return new Set(rootNodeIds);
  });

  // Reset form when switching to form tab without a selected department
  useEffect(() => {
    if (tabValue === 'form' && !selectedDepartment) {
      setFormData({ name: '', description: '', parentId: null });
      setFormError(null);
    }
  }, [tabValue, selectedDepartment]);

  const handleSelectDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setFormData(department);
    setTabValue('form');
  };

  const handleCreateNew = () => {
    setSelectedDepartment(null);
    setFormData({ name: '', description: '', parentId: null });
    setTabValue('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.name.trim()) {
      setFormError('Department name is required');
      return;
    }

    if (selectedDepartment) {
      const updatedDepartment = { ...formData, id: selectedDepartment.id } as Department;
      onUpdateDepartment(updatedDepartment);
    } else {
      const newDepartment: Department = {
        ...formData,
        id: (Math.max(0, ...departments.map(d => parseInt(d.id))) + 1).toString()
      };
      onCreateDepartment(newDepartment);
    }
    
    setTabValue('list');
  };

  const handleFormChange = (field: keyof Department, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteDepartment = (id: string) => {
    if (departments.some(d => d.parentId === id)) {
      setFormError('Cannot delete department with child departments');
      return;
    }
    
    onDeleteDepartment(id);
    if (selectedDepartment?.id === id) {
      setSelectedDepartment(null);
      setFormData({ name: '', description: '', parentId: null });
    }
  };

  const buildTree = (depts: Department[], parentId: string | null = null): Department[] => {
    return depts
      .filter(dept => dept.parentId === parentId)
      .map(dept => ({
        ...dept,
        children: buildTree(depts, dept.id)
      }));
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const treeData = buildTree(departments);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="grid grid-cols-3 w-[500px] mb-8 bg-green-100 p-1.5">
          <TabsTrigger 
            value="list" 
            className="py-2.5 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Department List
          </TabsTrigger>
          <TabsTrigger 
            value="form" 
            className="py-2.5 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            {selectedDepartment ? "Edit Department" : "Create Department"}
          </TabsTrigger>
          <TabsTrigger 
            value="hierarchy" 
            className="py-2.5 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Organizational Hierarchy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-0">
          <DepartmentListTab 
            departments={departments}
            onEdit={handleSelectDepartment}
            onDelete={handleDeleteDepartment}
            onCreate={handleCreateNew}
          />
        </TabsContent>

        <TabsContent value="form" className="mt-0">
          <DepartmentFormTab 
            initialData={formData}
            departments={departments}
            isEdit={!!selectedDepartment}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            onCancel={() => setTabValue('list')}
            formError={formError}
          />
        </TabsContent>

        <TabsContent value="hierarchy" className="mt-0">
          <DepartmentHierarchyTab 
            treeData={treeData}
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentList;