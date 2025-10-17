import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { DollarSign, ArrowLeft } from 'lucide-react';
import type { BenefitSetListDto } from '../../../types/hr/benefit';
import { useNavigate } from 'react-router-dom';

interface BenefitSetHeaderProps {
  benefitSets: BenefitSetListDto[];
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

const BenefitSetHeader: React.FC<BenefitSetHeaderProps> = () => {
  const navigate = useNavigate();

  return (
    <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end">
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
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
              </span> Settings
            </motion.span>
          </h1>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BenefitSetHeader;