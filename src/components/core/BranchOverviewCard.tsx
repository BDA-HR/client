import { motion } from 'framer-motion';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Building, MapPin, Users, Settings, Edit, Calendar, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  status: 'active' | 'inactive' | 'setup';
  manager: string;
  users: number;
  established: string;
  lastActivity: string;
}

const branches: Branch[] = [
  {
    id: 1,
    name: 'Headquarters',
    code: 'BR-HQ-001',
    location: 'New York, USA',
    status: 'active',
    manager: 'Sarah Johnson',
    users: 45,
    established: 'Jan 15, 2015',
    lastActivity: 'Today, 10:45 AM'
  },
  {
    id: 2,
    name: 'West Coast Branch',
    code: 'BR-WC-002',
    location: 'San Francisco, USA',
    status: 'active',
    manager: 'Michael Chen',
    users: 32,
    established: 'Mar 22, 2018',
    lastActivity: 'Today, 9:30 AM'
  },
  {
    id: 3,
    name: 'Europe Branch',
    code: 'BR-EU-003',
    location: 'Berlin, Germany',
    status: 'active',
    manager: 'Emma Schmidt',
    users: 28,
    established: 'Aug 5, 2020',
    lastActivity: 'Yesterday, 3:15 PM'
  },
  {
    id: 4,
    name: 'Asia Branch',
    code: 'BR-AS-004',
    location: 'Singapore',
    status: 'setup',
    manager: 'Raj Patel',
    users: 12,
    established: 'May 10, 2023',
    lastActivity: '2 days ago'
  }
];

const BranchOverviewCard = ({ currentBranchId, setCurrentBranchId }: { currentBranchId: number, setCurrentBranchId: (id: number) => void }) => {
  const branchDetails = branches.find(b => b.id === currentBranchId) || branches[0];

  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden">
        {/* Gradient background */}
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
            <div className="border rounded-lg p-4 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
                  <p className="text-xl font-semibold">{branchDetails.users}</p>
                </div>
              </div>
            </div>
            
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
            
            <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manager</p>
                  <p className="text-sm font-medium">{branchDetails.manager}</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                  <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Established</p>
                  <p className="text-sm font-medium">{branchDetails.established}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-3 bg-gradient-to-r from-emerald-50/50 to-white/50 dark:from-emerald-900/10 dark:to-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last activity: {branchDetails.lastActivity}
          </p>
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