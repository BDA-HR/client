import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { AlertCircle } from 'lucide-react';
import DepartmentTable from "../../../components/core/DepartmentTable";
import DepartmentForm from "../../../components/core/DepartmentForm";
import DepartmentHierarchy from "../../../components/core/DepartmentHierarchy";
import type { Department } from "../../../types/coreTypes";

const DepartmentList = () => {
  const [tabValue, setTabValue] = useState('list');
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'HR', description: 'Human Resources', parentId: null },
    { id: '2', name: 'Engineering', description: 'Engineering Department', parentId: null },
    { id: '3', name: 'Frontend', description: 'Frontend Team', parentId: '2' },
    { id: '4', name: 'Backend', description: 'Backend Team', parentId: '2' },
    { id: '5', name: 'Recruitment', description: 'Recruitment Team', parentId: '1' },
  ]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Omit<Department, 'id'> & { id?: string }>({
    name: '',
    description: '',
    parentId: null
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['2']));

  // Department selection handler
  const handleSelectDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setFormData(department);
    setTabValue('form');
  };

  // Create new department handler
  const handleCreateNew = () => {
    setSelectedDepartment(null);
    setFormData({ name: '', description: '', parentId: null });
    setTabValue('form');
  };

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.name.trim()) {
      setFormError('Department name is required');
      return;
    }

    if (selectedDepartment) {
      // Update existing department
      setDepartments(departments.map(dept => 
        dept.id === selectedDepartment.id ? { ...formData, id: selectedDepartment.id } as Department : dept
      ));
    } else {
      // Create new department
      const newDepartment: Department = {
        ...formData,
        id: (Math.max(0, ...departments.map(d => parseInt(d.id))) + 1).toString()
      };
      setDepartments([...departments, newDepartment]);
    }
    
    setTabValue('list');
  };

  // Form field change handler
  const handleFormChange = (field: keyof Department, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Department deletion handler
  const handleDeleteDepartment = (id: string) => {
    // Prevent deletion if department has children
    if (departments.some(d => d.parentId === id)) {
      setFormError('Cannot delete department with child departments');
      return;
    }
    
    setDepartments(departments.filter(dept => dept.id !== id));
    if (selectedDepartment?.id === id) {
      setSelectedDepartment(null);
      setFormData({ name: '', description: '', parentId: null });
    }
  };

  // Build department tree for hierarchy view
  const buildTree = (depts: Department[], parentId: string | null = null): Department[] => {
    return depts
      .filter(dept => dept.parentId === parentId)
      .map(dept => ({
        ...dept,
        children: buildTree(depts, dept.id)
      }));
  };

  // Toggle node expansion in hierarchy view
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Department Management</h1>
      
      {formError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="grid grid-cols-3 w-[500px] mb-8 bg-muted p-1.5">
          <TabsTrigger 
            value="list" 
            className="py-2.5 data-[state=active]:shadow-lg"
          >
            Department List
          </TabsTrigger>
          <TabsTrigger 
            value="form" 
            className="py-2.5 data-[state=active]:shadow-lg"
          >
            {selectedDepartment ? "Edit Department" : "Create Department"}
          </TabsTrigger>
          <TabsTrigger 
            value="hierarchy" 
            className="py-2.5 data-[state=active]:shadow-lg"
          >
            Organizational Hierarchy
          </TabsTrigger>
        </TabsList>

        {/* Department List Tab */}
        <TabsContent value="list" className="mt-0">
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <DepartmentTable 
                departments={departments}
                onEdit={handleSelectDepartment}
                onDelete={handleDeleteDepartment}
                onCreate={handleCreateNew}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Form Tab */}
        <TabsContent value="form" className="mt-0">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl">
                {selectedDepartment ? "Edit Department" : "Create New Department"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <DepartmentForm 
                initialData={formData}
                departments={departments}
                isEdit={!!selectedDepartment}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                onCancel={() => setTabValue('list')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Hierarchy Tab */}
        <TabsContent value="hierarchy" className="mt-0">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl">Organizational Hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <DepartmentHierarchy 
                treeData={treeData}
                expandedNodes={expandedNodes}
                onToggle={toggleNode}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentList;