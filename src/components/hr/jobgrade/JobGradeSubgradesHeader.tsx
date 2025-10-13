import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { BadgePlus, Grid, List, TrendingUp } from 'lucide-react';
import type { JobGradeListDto } from '../../../types/hr/jobgrade';

interface JobGradeSubgradesHeaderProps {
  jobGrade: JobGradeListDto | null;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onAddStep: () => void;
}

// Define variants with proper TypeScript types
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: 'spring' as const, 
      stiffness: 100, 
      damping: 15 
    }
  }
};

const JobGradeSubgradesHeader: React.FC<JobGradeSubgradesHeaderProps> = ({ 
  jobGrade, 
  viewMode, 
  setViewMode,
  onAddStep 
}) => {
  return (
    <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold text-black">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block"
            >
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {jobGrade?.name || 'Job Grade'}
              </span> Steps
            </motion.span>
          </h1>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex space-x-3 mt-4 sm:mt-0"
      >
        {/* View Mode Toggle */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 cursor-pointer border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800"
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

        {/* Add Step Button */}
        <Button
          onClick={onAddStep}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap cursor-pointer"
        >
          <BadgePlus className="h-4 w-4 mr-2" />
          Add Job Step
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default JobGradeSubgradesHeader;