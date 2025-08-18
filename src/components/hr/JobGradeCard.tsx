import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

interface JobGradeCardProps extends JobGrade {
  expanded: boolean;
  onToggleExpand: () => void;
  viewMode: 'grid' | 'list';
}

const JobGradeCard: React.FC<JobGradeCardProps> = ({
  id,
  grade,
  title,
  experience,
  roles,
  salary,
  skill,
  icon: Icon,
  descriptions,
  department,
  category,
  expanded,
  onToggleExpand,
  viewMode
}) => (
  <motion.div
    layout
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    className={`bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all ${
      viewMode === 'grid' ? 'p-5' : 'p-4 flex items-start'
    }`}
  >
    {viewMode === 'grid' ? (
      <>
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-green-50 mr-4">
            <Icon className="text-green-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-black">{title}</h3>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{grade}</p>
                <p className="text-xs text-gray-400 mt-1">{department} • {category}</p>
              </div>
              <Button 
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
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-1 text-sm text-gray-700">
          <p><strong>Experience:</strong> {experience}</p>
          <p><strong>Roles:</strong> {roles.join(', ')}</p>
          <p><strong>Skill Level:</strong> {skill}</p>
          <p><strong>Salary Band:</strong> {salary.min} – {salary.max}</p>
          <div className="text-xs text-gray-500 mt-1">
            <em>Midpoint: {salary.mid}</em>
          </div>
        </div>

        <AnimatePresence>
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
                    <li key={`${id}-desc-${desc.id}`} className="flex">
                      <span className="text-green-500 mr-2">•</span>
                      {desc.text}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    ) : (
      <>
        <div className="p-2 rounded-md bg-green-50 mr-4">
          <Icon className="text-green-600" size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-black">{title}</h3>
              <p className="text-sm text-gray-500">{grade} • {category}</p>
            </div>
            <Button 
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
            </Button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-2 text-sm text-gray-700">
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p>{experience}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Roles</p>
              <p>{roles.join(', ')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Catagoty</p>
              <p>{category}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Salary Band</p>
              <p>{salary.min} – {salary.max}</p>
            </div>
          </div>

          <AnimatePresence>
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
                      <li key={`${id}-desc-${desc.id}`} className="flex">
                        <span className="text-green-500 mr-2">•</span>
                        {desc.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    )}
  </motion.div>
);

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 12 }
  },
  hover: { scale: 1.03, transition: { duration: 0.25 } }
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

export default JobGradeCard;