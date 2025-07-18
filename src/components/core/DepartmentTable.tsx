// src/components/core/DepartmentTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Edit, Trash } from 'lucide-react';
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
        <Button onClick={onCreate} className="mb-4">
          Create New Department
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[30%]">Name</TableHead>
              <TableHead className="w-[40%]">Description</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => {
              const parent = departments.find(d => d.id === dept.parentId);
              return (
                <TableRow key={dept.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-muted-foreground">{dept.description}</TableCell>
                  <TableCell>{parent ? parent.name : 'None'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onEdit(dept)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
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