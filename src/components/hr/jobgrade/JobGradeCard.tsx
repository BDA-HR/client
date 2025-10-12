import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { JobGradeListDto } from '../../../types/hr/jobgrade';

interface JobGradeCardProps {
  jobGrade: JobGradeListDto;
  expanded: boolean;
  onToggleExpand: () => void;
  viewMode: 'grid' | 'list';
  onEdit: (jobGrade: JobGradeListDto) => void;
  onDelete: (jobGrade: JobGradeListDto) => void;
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

const JobGradeCard: React.FC<JobGradeCardProps> = ({
  jobGrade,
  // expanded,
  // onToggleExpand,
  viewMode,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Convert salary to display format
  const formatSalary = (salary: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  };

  // Calculate midpoint salary
  const midpointSalary = (jobGrade.startSalary + jobGrade.maxSalary) / 2;

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

  const handleEdit = () => {
    setShowMenu(false);
    onEdit(jobGrade);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete(jobGrade);
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all relative ${
        viewMode === 'grid' ? 'p-5' : 'p-4 flex items-start'
      }`}
    >
      {/* More Options Menu */}
      <div className="absolute top-3 right-3" ref={menuRef}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
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

      {viewMode === 'grid' ? (
        <>
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-green-50 mr-4">
              <Briefcase className="text-green-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-black mb-1">{jobGrade.name}</h3>
              <div className="flex justify-between items-center">
                {/* Grade ID and Department commented out for future use */}
                {/* <div>
                  <p className="text-sm text-gray-500">Grade {jobGrade.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-400 mt-1">{department} • {category}</p>
                </div> */}
                {/* More/Less button commented out for future use */}
                {/* <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-600 hover:bg-green-50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand();
                  }}
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="mr-1 h-4 w-4" />
                      Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1 h-4 w-4" />
                      More
                    </>
                  )}
                </Button> */}
              </div>
            </div>
          </div>
          
          {/* Salary Information */}
          <div className="space-y-3 text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-green-800 mb-2">Salary Range</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start:</span>
                  <span className="font-semibold">{formatSalary(jobGrade.startSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum:</span>
                  <span className="font-semibold">{formatSalary(jobGrade.maxSalary)}</span>
                </div>
                <div className="flex justify-between border-t border-green-200 pt-1 mt-1">
                  <span className="text-gray-600 font-medium">Midpoint:</span>
                  <span className="font-bold text-green-700">{formatSalary(midpointSalary)}</span>
                </div>
              </div>
            </div>
            
            {/* Additional info */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">Range:</span>{' '}
                {formatSalary(jobGrade.maxSalary - jobGrade.startSalary)}
              </div>
              {/* <div>
                <span className="font-medium">Spread:</span>{' '}
                {((jobGrade.maxSalary - jobGrade.startSalary) / jobGrade.startSalary * 100).toFixed(1)}%
              </div> */}
            </div>
          </div>

          {/* Expandable content commented out for future use */}
          {/* <AnimatePresence>
            {expanded && (
              <motion.div
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-green-50">
                  <h4 className="text-sm font-medium text-green-700 mb-2">Key Responsibilities:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {descriptions.map((desc) => (
                      <li key={`${jobGrade.id}-desc-${desc.id}`} className="flex">
                        <span className="text-green-500 mr-2">•</span>
                        {desc.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}
        </>
      ) : (
        // List View
        <>
          <div className="p-2 rounded-md bg-green-50 mr-4">
            <Briefcase className="text-green-600" size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-black">{jobGrade.name}</h3>
                {/* Grade ID and Category commented out for future use */}
                {/* <p className="text-sm text-gray-500">Grade {jobGrade.id.slice(0, 8)} • {category}</p> */}
              </div>
              {/* More/Less button commented out for future use */}
              {/* <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-600 hover:bg-green-50 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="mr-1 h-4 w-4" />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 h-4 w-4" />
                    More
                  </>
                )}
              </Button> */}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-3 text-sm text-gray-700">
              <div>
                <p className="text-xs text-gray-500">Start Salary</p>
                <p className="font-semibold">{formatSalary(jobGrade.startSalary)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Max Salary</p>
                <p className="font-semibold">{formatSalary(jobGrade.maxSalary)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Midpoint</p>
                <p className="font-semibold text-green-700">{formatSalary(midpointSalary)}</p>
              </div>
              {/* Department commented out for future use */}
              {/* <div>
                <p className="text-xs text-gray-500">Department</p>
                <p>{department}</p>
              </div> */}
            </div>

            {/* Expandable content commented out for future use */}
            {/* <AnimatePresence>
              {expanded && (
                <motion.div
                  layout
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-green-50">
                    <h4 className="text-sm font-medium text-green-700 mb-2">Key Responsibilities:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {descriptions.map((desc) => (
                        <li key={`${jobGrade.id}-desc-${desc.id}`} className="flex">
                          <span className="text-green-500 mr-2">•</span>
                          {desc.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default JobGradeCard;