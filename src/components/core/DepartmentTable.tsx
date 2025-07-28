import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Edit, Trash, Plus } from 'lucide-react';
import type { Department } from "../../types/coreTypes";

interface DepartmentTableProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

const DepartmentTable = ({ 
  departments, 
  onEdit, 
  onDelete, 
  onCreate 
}: DepartmentTableProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={onCreate} 
          className="mb-4 bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Department
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[30%] font-semibold text-gray-700">Name</TableHead>
              <TableHead className="w-[40%] font-semibold text-gray-700">Description</TableHead>
              <TableHead className="font-semibold text-gray-700">Parent</TableHead>
              <TableHead className="text-right w-[120px] font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => {
              const parent = departments.find(d => d.id === dept.parentId);
              return (
                <TableRow key={dept.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-gray-600">{dept.description}</TableCell>
                  <TableCell className="text-gray-600">{parent ? parent.name : 'None'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-gray-600 border-gray-300 hover:bg-gray-100"
                        onClick={() => onEdit(dept)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => onDelete(dept.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DepartmentTable;