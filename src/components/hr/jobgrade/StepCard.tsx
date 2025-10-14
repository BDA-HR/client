import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { JgStepListDto } from '../../../types/hr/JgStep';

interface StepCardProps {
  step: JgStepListDto;
  index: number;
  totalSteps: number;
  onEdit: (step: JgStepListDto) => void;
  onDelete: (step: JgStepListDto) => void;
  isDeleting: boolean;
  viewMode: 'grid' | 'list';
}

// Define variants with proper TypeScript types
const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { 
      type: 'spring' as const, 
      stiffness: 120, 
      damping: 12 
    }
  },
  hover: { 
    scale: 1.03, 
    transition: { 
      duration: 0.25 
    } 
  }
};

const StepCard: React.FC<StepCardProps> = ({
  step,
  index,
  onEdit,
  onDelete,
  viewMode
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Format salary with ETB after the amount
  const formatSalary = (salary: number): string => {
    const formattedAmount = new Intl.NumberFormat('en-ET', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
    
    return `${formattedAmount} ETB`;
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(step);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(step);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Get different colors for different step levels
  const getStepColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
      { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
      { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
      { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
      { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
      { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100' },
    ];
    return colors[index % colors.length];
  };

  const stepColor = getStepColor(index);

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`bg-white border ${stepColor.border} rounded-xl shadow-sm hover:shadow-md transition-all relative ${
        viewMode === 'grid' ? 'p-6' : 'p-4'
      }`}
    >
      {/* More Options Menu */}
      <div className="absolute top-3 right-3" ref={menuRef}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
          onClick={handleMenuClick}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
          >
            <button
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className={`p-3 rounded-full ${stepColor.bg} mr-4`}>
            <TrendingUp className={stepColor.icon} size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {step.name}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-4 mr-8">
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {formatSalary(step.salary)}
            </p>
            <p className="text-sm text-gray-500">Salary</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StepCard;