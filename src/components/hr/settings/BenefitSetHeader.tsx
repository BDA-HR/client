import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Grid, List, DollarSign } from 'lucide-react';
import type { BenefitSetListDto } from '../../../types/hr/benefit';

interface BenefitSetHeaderProps {
  benefitSets: BenefitSetListDto[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
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

const BenefitSetHeader: React.FC<BenefitSetHeaderProps> = ({ 
  // benefitSets, 
  viewMode, 
  setViewMode,
}) => {
  return (
    <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <DollarSign className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold text-black">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block"
            >
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Benefit 
              </span> Sets
            </motion.span>
          </h1>
        </motion.div>
      </div>
      {/* <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-sm text-gray-600"
      >
        Comprehensive benefit packages with {benefitSets.length} sets and detailed coverage
      </motion.p> */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex space-x-3 mt-4 sm:mt-0"
      >
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
      </motion.div>
    </motion.div>
  );
};

export default BenefitSetHeader;