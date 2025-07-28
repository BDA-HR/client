import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { motion } from 'framer-motion';
import { Activity, CreditCard, Users, Database, Box, Layers } from 'lucide-react';
import { companies } from '../../../data/company';
import type { Department } from '../../../data/company'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

const DepartmentOverview = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  // Get all unique branches for the selected company
  const branches = selectedCompany === 'all' 
    ? companies.flatMap(company => company.branches)
    : companies.find(company => company.id.toString() === selectedCompany)?.branches || [];

  // Filter departments based on selections
  const filteredDepartments = companies.flatMap(company => {
    // Filter by company if selected
    if (selectedCompany !== 'all' && company.id.toString() !== selectedCompany) {
      return [];
    }

    return company.branches.flatMap(branch => {
      // Filter by branch if selected
      if (selectedBranch !== 'all' && branch.id.toString() !== selectedBranch) {
        return [];
      }

      return branch.departments;
    });
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map(company => (
              <SelectItem key={company.id} value={company.id.toString()}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedBranch} 
          onValueChange={setSelectedBranch}
          disabled={selectedCompany === 'all'}
        >
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {selectedCompany === 'all' ? 'Select a company first' : 'All Branches'}
            </SelectItem>
            {branches.map(branch => (
              <SelectItem key={branch.id} value={branch.id.toString()}>
                {branch.name} ({branch.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredDepartments.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredDepartments.map((department) => (
            <DepartmentCard 
              key={department.id} 
              department={department}
            />
          ))}
        </motion.div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">No departments found</p>
        </div>
      )}
    </div>
  );
};

interface DepartmentCardProps {
  department: Department;
}

const DepartmentCard = ({ department }: DepartmentCardProps) => {
  const typeConfig = {
    operations: {
      icon: <Activity className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
      gradient: 'from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900'
    },
    finance: {
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
      gradient: 'from-green-50 to-white dark:from-green-900/20 dark:to-gray-900'
    },
    hr: {
      icon: <Users className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
      gradient: 'from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900'
    },
    it: {
      icon: <Database className="h-5 w-5" />,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
      gradient: 'from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900'
    },
    sales: {
      icon: <Box className="h-5 w-5" />,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
      gradient: 'from-red-50 to-white dark:from-red-900/20 dark:to-gray-900'
    },
    marketing: {
      icon: <Layers className="h-5 w-5" />,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
      gradient: 'from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900'
    }
  };

  const config = typeConfig[department.type] || typeConfig.operations;

  return (
    <motion.div variants={itemVariants}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${config.color}`}>
                {config.icon}
              </div>
              <div>
                <h4 className="font-medium">{department.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{department.type} department</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {department.budget} budget
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`border rounded-lg p-4 bg-gradient-to-br ${config.gradient}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manager</p>
                <p className="text-sm font-medium">{department.manager}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Employees</p>
                <p className="text-sm font-medium">{department.employees}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs text-gray-500 dark:text-gray-400">
          Last activity: {department.lastActivity}
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default DepartmentOverview;