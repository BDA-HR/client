import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../../components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import type { CompListDto } from '../../../types/core/comp'; // Changed import
import { useNavigate } from 'react-router-dom';

interface CompListProps {
  companies: CompListDto[]; // Changed from Company[] to CompListDto[]
  onEditCompany: (company: CompListDto) => void; // Changed from Company to CompListDto
  onDeleteCompany: (companyId: string) => void;
  onViewBranches: (companyId: string) => void;
}

const CompList: React.FC<CompListProps> = ({
  companies,
  onEditCompany,
  onDeleteCompany,
}) => {
  const navigate = useNavigate();

  const handleViewBranches = (companyId: string) => {
    navigate(`/branches?companyId=${companyId}`);
  };

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
      {companies.map((company) => (
        <motion.div
          key={company.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="relative rounded-xl border border-gray-200 shadow-sm p-4 space-y-3 transition hover:shadow-md">
            <div>
              <h4 className="text-md font-semibold text-black ">{company.nameAm}</h4>
              <p className="text-sm text-gray-600 ">{company.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {company.branchCount} branches
              </p>
            </div>

            <div className="flex justify-between items-center">
              <Button
                className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                size="sm"
                onClick={() => handleViewBranches(company.id)}
              >
                View Branches
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
                  <DropdownMenuItem onClick={() => onEditCompany(company)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteCompany(company.id)}
                    className="text-red-500"
                  >
                    Delete
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

export default CompList;