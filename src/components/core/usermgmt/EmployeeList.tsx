import { motion } from "motion/react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { MoreVertical, PenBox, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  department: string;
  status: "active" | "inactive";
}

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  onViewDetails: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 },
        },
      }}
    >
      {employees.map((employee) => (
        <motion.div
          key={employee.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="relative rounded-xl border border-gray-200 shadow-sm p-4 space-y-3 transition hover:shadow-md">
            <div>
              <h4 className="text-md font-semibold text-black">
                {employee.name}
              </h4>
              <p className="text-sm text-gray-600">{employee.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-gray-500">
                  Code:
                </span>
                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {employee.employeeCode}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{employee.department}</p>
              <span
                className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                  employee.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {employee.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <Button
                className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                size="sm"
                onClick={() => onViewDetails(employee)}
              >
                View Details
              </Button>
            </div>

            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="flex items-center gap-2"
                    onClick={() => onEdit(employee)}
                  >
                    <PenBox size={16} />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-red-600 data-[highlighted]:!bg-red-50 data-[highlighted]:text-red-700"
                    onClick={() => onDelete(employee.id)}
                  >
                    <Trash2 size={16} className="text-red-600" />
                    <p className="text-red-600">Delete</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EmployeeList; 