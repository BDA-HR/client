import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Grid, List } from 'lucide-react';

interface JobGradeHeaderProps {
  jobGrades: JobGrade[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onAddClick: () => void;
}

const JobGradeHeader: React.FC<JobGradeHeaderProps> = ({ 
  jobGrades, 
  viewMode, 
  setViewMode,
  onAddClick 
}) => {
  return (
    <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end">
      <div>
        <h1 className="text-3xl font-bold text-black">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block"
          >
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Job Grade
            </span> Framework
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-sm text-gray-600"
        >
          Comprehensive job classification with {jobGrades.length} grades and detailed role descriptions
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex space-x-3 mt-4 sm:mt-0"
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800"
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          {viewMode === 'grid' ? (
            <>
              <List className="h-4 w-4" />
              List View
            </>
          ) : (
            <>
              <Grid className="h-4 w-4" />
              Grid View
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800"
        >
          Export Data
        </Button>
         <Button
          size="sm"
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-sm"
          onClick={onAddClick}
        >
          Add New Grade
        </Button>
      </motion.div>
    </motion.div>
  );
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

type JobGrade = {
  id: string;
  grade: string;
  title: string;
  experience: string;
  roles: string[];
  salary: SalaryRange;
  skill: string;
  icon: React.ElementType;
  descriptions: JobDescription[];
  department?: string;
  category?: string;
};

type SalaryRange = {
  min: string;
  mid: string;
  max: string;
};

type JobDescription = {
  id: number;
  text: string;
};

export default JobGradeHeader;