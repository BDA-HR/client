import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, GraduationCap, Briefcase, Award, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';

// Import your DTO types
import type { BenefitSetListDto } from '../../../types/hr/benefit';
import type { EducationQualListDto } from '../../../types/hr/educationQual';

// Union type for all possible setting types
type SettingData = BenefitSetListDto | EducationQualListDto; // Add other DTO types here

// Type discriminator
type SettingType = 'benefit' | 'educationQual' | 'positionEducation' | 'positionExperience';

interface SettingCardProps {
  setting: SettingData;
  settingType: SettingType;
  expanded: boolean;
  onToggleExpand: () => void;
  viewMode: 'grid' | 'list';
  onEdit: (setting: SettingData) => void;
  onDelete: (setting: SettingData) => void;
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

// Configuration for each setting type
const settingTypeConfig = {
  benefit: {
    icon: DollarSign,
    color: 'blue',
    title: 'Benefit',
    fields: ['Name', 'BenefitStr'] as const
  },
  educationQual: {
    icon: GraduationCap,
    color: 'purple',
    title: 'Educational Quality',
    fields: ['Name'] as const
  },
  positionEducation: {
    icon: Award,
    color: 'green',
    title: 'Position Education',
    fields: ['Name'] as const // Adjust based on your DTO
  },
  positionExperience: {
    icon: Briefcase,
    color: 'orange',
    title: 'Position Experience',
    fields: ['Name'] as const // Adjust based on your DTO
  }
} as const;

const SettingCard: React.FC<SettingCardProps> = ({
  setting,
  settingType,
  viewMode,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const config = settingTypeConfig[settingType];
  const IconComponent = config.icon;
  const color = config.color;

  // Color classes based on type
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      icon: 'text-blue-600',
      text: 'text-blue-800'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      icon: 'text-purple-600',
      text: 'text-purple-800'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      icon: 'text-green-600',
      text: 'text-green-800'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      icon: 'text-orange-600',
      text: 'text-orange-800'
    }
  };

  const currentColor = colorClasses[color];

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
    onEdit(setting);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete(setting);
  };

  // Get display value for a field
  const getDisplayValue = (field: string): string => {
    const value = (setting as any)[field];
    return value !== undefined && value !== null ? String(value) : 'N/A';
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`bg-white border ${currentColor.border} rounded-xl shadow-sm hover:shadow-md transition-all relative ${
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
            <div className={`p-3 rounded-full ${currentColor.bg} mr-4`}>
              <IconComponent className={currentColor.icon} size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-black mb-1">
                {getDisplayValue('Name')}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{config.title}</p>
            </div>
          </div>
          
          {/* Setting Information */}
          <div className="space-y-3 text-sm">
            <div className={`${currentColor.bg} p-3 rounded-lg`}>
              <p className={`font-medium ${currentColor.text} mb-2`}>{config.title} Details</p>
              <div className="space-y-2">
                {config.fields.map((field) => (
                  field !== 'Name' && (
                    <div key={field} className="flex justify-between">
                      <span className="text-gray-600">
                        {field === 'BenefitStr' ? 'Amount' : field}:
                      </span>
                      <span className="font-semibold text-right max-w-[60%]">
                        {getDisplayValue(field)}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        // List View
        <>
          <div className={`p-2 rounded-md ${currentColor.bg} mr-4`}>
            <IconComponent className={currentColor.icon} size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-black">{getDisplayValue('Name')}</h3>
                <p className="text-sm text-gray-500 capitalize">{config.title}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-700">
              {config.fields.map((field) => (
                field !== 'Name' && (
                  <div key={field}>
                    <p className="text-xs text-gray-500">
                      {field === 'BenefitStr' ? 'Amount' : field}
                    </p>
                    <p className={`font-semibold ${currentColor.text}`}>
                      {getDisplayValue(field)}
                    </p>
                  </div>
                )
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SettingCard;