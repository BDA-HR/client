import { Building, MapPin, Users, Settings, Calendar, Edit, ChevronDown, User, Layers } from 'lucide-react';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { motion } from 'framer-motion';
import type { Branch } from '../../data/company';

interface BranchOverviewCardProps {
  currentBranchId: number;
  setCurrentBranchId: (id: number) => void;
  branches: Branch[];
}

const BranchOverviewCard = ({ 
  currentBranchId, 
  setCurrentBranchId,
  branches
}: BranchOverviewCardProps) => {
  const branchDetails = branches.find(b => b.id === currentBranchId) || branches[0];
  
  // Calculate total employees across all departments
  const totalEmployees = branchDetails.departments.reduce(
    (sum, department) => sum + department.employees, 
    0
  );

  // Ensure active users don't exceed total employees
  const activeUsers = Math.min(branchDetails.users, totalEmployees);

  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-emerald-100/10 dark:from-emerald-900/10 dark:to-emerald-950/20 pointer-events-none" />
        
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="pl-0 hover:bg-transparent text-lg font-bold p-0 h-auto">
                      <Building className="h-5 w-5 text-emerald-600 mr-2" />
                      {branchDetails.name}
                      <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {branches.map((branch) => (
                      <DropdownMenuItem 
                        key={branch.id} 
                        onClick={() => setCurrentBranchId(branch.id)}
                        className={branch.id === currentBranchId ? "bg-emerald-50 dark:bg-emerald-900/30" : ""}
                      >
                        <Building className="h-4 w-4 mr-2 text-emerald-600" />
                        {branch.name}
                        {branch.id === currentBranchId && (
                          <span className="ml-auto text-xs text-emerald-600">Current</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Badge 
                  variant={
                    branchDetails.status === 'active' ? 'default' : 
                    branchDetails.status === 'inactive' ? 'destructive' : 'secondary'
                  }
                  className="capitalize"
                >
                  {branchDetails.status}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                {branchDetails.code} • {branchDetails.location}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <Edit size={14} />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <Settings size={14} />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Users Card - Now showing active users (capped at total employees) */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                  <p className="text-xl font-semibold">{activeUsers}</p>
                </div>
              </div>
            </div>
            
            {/* Location Card */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-sm font-medium line-clamp-1">{branchDetails.location}</p>
                </div>
              </div>
            </div>
            
            {/* General Manager Card */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">General Manager</p>
                  <p className="text-sm font-medium">{branchDetails.GeneralManager}</p>
                </div>
              </div>
            </div>
            
            {/* Departments Card */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                  <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Departments</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-semibold">{branchDetails.departments.length}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({totalEmployees} employees)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-3 bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/10 dark:to-gray-800/50">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>Established: {branchDetails.established}</span>
            <span className="mx-1">•</span>
            <span>Last activity: {branchDetails.lastActivity}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: 'spring', 
      stiffness: 260, 
      damping: 20 
    }
  }
};

export default BranchOverviewCard;