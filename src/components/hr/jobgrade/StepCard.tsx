import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { JgStepListDto } from '../../../types/hr/JgStep';
import { createPortal } from 'react-dom';

interface StepCardProps {
  step: JgStepListDto;
  index: number;
  totalSteps: number;
  onEdit: (step: JgStepListDto) => void;
  onDelete: (step: JgStepListDto) => void;
  isDeleting: boolean;
  viewMode: 'grid' | 'list';
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  index,
  onEdit,
  onDelete,
  viewMode
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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
      const isOutsideMenuButton = menuButtonRef.current && 
        !menuButtonRef.current.contains(event.target as Node);
      const isOutsideMenu = menuRef.current && 
        !menuRef.current.contains(event.target as Node);
      
      if (isOutsideMenuButton && isOutsideMenu) {
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
    
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 160
      });
    }
    
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

  // Dropdown menu component using portal
  const DropdownMenu = () => {
    if (!showMenu) return null;

    return createPortal(
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        style={{
          position: 'absolute',
          top: menuPosition.top,
          left: menuPosition.left,
        }}
        className="fixed w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] py-1"
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
      </motion.div>,
      document.body
    );
  };

  // List View
  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-white border ${stepColor.border} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200 relative p-4`}
        >
          {/* More Options Menu Button */}
          <div className="absolute top-3 right-3">
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer relative z-10"
              onClick={handleMenuClick}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className={`p-2 rounded-full ${stepColor.bg} mr-4`}>
                <TrendingUp className={stepColor.icon} size={20} />
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
        <DropdownMenu />
      </>
    );
  }

  // Grid View
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`bg-white border ${stepColor.border} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200 relative p-6`}
      >
        {/* More Options Menu Button */}
        <div className="absolute top-4 right-4">
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer relative z-10"
            onClick={handleMenuClick}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
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
      <DropdownMenu />
    </>
  );
};

export default StepCard;