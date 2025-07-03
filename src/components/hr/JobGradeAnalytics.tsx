import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface JobGradeAnalyticsProps {
  jobGrades: JobGrade[];
  filteredGrades: JobGrade[];
}

const JobGradeAnalytics: React.FC<JobGradeAnalyticsProps> = ({ jobGrades, filteredGrades }) => {
  const departments = [...new Set(jobGrades.map(grade => grade.department))];
  const categories = [...new Set(jobGrades.map(grade => grade.category))];

  return (
    <motion.div variants={itemVariants} className="mt-10 p-6 bg-white border border-green-100 rounded-xl shadow-sm">
      <div className="flex items-center mb-4">
        <BarChart3 className="text-green-600 mr-2" size={20} />
        <h2 className="text-lg font-semibold text-green-800">Grade Distribution</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-gray-600">Total Grades</p>
          <p className="text-xl font-semibold text-green-700">{jobGrades.length}</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-gray-600">Departments</p>
          <p className="text-xl font-semibold text-green-700">{departments.length}</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-gray-600">Categories</p>
          <p className="text-xl font-semibold text-green-700">{categories.length}</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-gray-600">Showing</p>
          <p className="text-xl font-semibold text-green-700">{filteredGrades.length}</p>
        </div>
      </div>
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

export default JobGradeAnalytics;