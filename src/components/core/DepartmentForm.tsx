// src/components/core/department/DepartmentForm.tsx
import { Label } from "../ui/label";
import { Input } from "..//ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Button } from "../ui/button";
import type { Department } from "../../types/coreTypes";

interface DepartmentFormProps {
  initialData: Omit<Department, 'id'> & { id?: string };
  departments: Department[];
  isEdit: boolean;
  onChange: (field: keyof Department, value: string | null) => void;
  onSubmit: (dept: Omit<Department, 'id'>) => void;
  onCancel: () => void;
}


const DepartmentForm = ({ 
  initialData, 
  departments, 
  isEdit, 
  onChange, 
  onSubmit, 
  onCancel 
}: DepartmentFormProps) => (
  <div className="space-y-6">
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Department Name *</Label>
          <Input
            id="name"
            value={initialData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter department name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={initialData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Enter department description"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Parent Department</Label>
          <Select
            value={initialData.parentId || ''}
            onValueChange={(value) => 
              onChange('parentId', value === '' ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parent department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {departments
                .filter(dept => dept.id !== initialData.id)
                .map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          className="px-6"
        >
          Cancel
        </Button>
        <Button type="submit" className="px-6">
          {isEdit ? "Update Department" : "Create Department"}
        </Button>
      </div>
    </form>
  </div>
);

export default DepartmentForm;