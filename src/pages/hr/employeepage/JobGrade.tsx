import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Layers, TrendingUp, Award, BarChart3, ShieldCheck, 
  BookOpen,
  Search, Filter, ChevronDown, ChevronUp, Loader2, Grid, List
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

// Types
type SalaryRange = {
  min: string;
  mid: string;
  max: string;
};

type JobDescription = {
  id: number;
  text: string;
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

// Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: 'beforeChildren' }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 12 }
  },
  hover: { scale: 1.03, transition: { duration: 0.25 } }
};

// Mock data generator for 100+ job grades
const generateJobGrades = (count: number): JobGrade[] => {
  const icons = [Briefcase, Layers, TrendingUp, Award, ShieldCheck];
  const categories = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'IT', 'Sales'];
  const departments = ['Product', 'Growth', 'Corporate', 'Support', 'R&D'];
  const skills = ['Basic', 'Foundational', 'Intermediate', 'Advanced', 'Expert'];
  
  return Array.from({ length: count }, (_, i) => {
    const gradeNum = Math.floor(i / 20) + 1;
    const level = (i % 5) + 1;
    
    return {
      id: `grade-${i}`,
      grade: `G${gradeNum}-L${level}`,
      title: `${['Entry', 'Junior', 'Mid', 'Senior', 'Lead'][level - 1]} ${categories[i % categories.length]} ${['Specialist', 'Analyst', 'Engineer', 'Manager', 'Director'][level - 1]}`,
      experience: `${level * 2}-${level * 2 + 2} years`,
      roles: [
        `${['Associate', 'Junior', '', 'Senior', 'Lead'][level - 1]} ${categories[i % categories.length]} ${['Assistant', 'Analyst', 'Developer', 'Manager', 'Director'][level - 1]}`,
        `${categories[i % categories.length]} ${['Technician', 'Coordinator', 'Specialist', 'Consultant', 'Architect'][level - 1]}`
      ],
      salary: {
        min: `$${30 + (gradeNum * 10) + (level * 5)}K`,
        mid: `$${35 + (gradeNum * 10) + (level * 5)}K`,
        max: `$${40 + (gradeNum * 10) + (level * 5)}K`
      },
      skill: skills[level - 1],
      icon: icons[level - 1],
      department: departments[i % departments.length],
      category: categories[i % categories.length],
      descriptions: Array.from({ length: 3 + (i % 3) }, (_, j) => ({
        id: j,
        text: `Responsibility ${j + 1}: ${[
          'Lead cross-functional initiatives',
          'Develop and implement strategies',
          'Mentor junior team members',
          'Optimize operational processes',
          'Conduct market research',
          'Manage budget and resources',
          'Ensure compliance with regulations'
        ][(i + j) % 7]} for ${categories[i % categories.length]} department.`
      }))
    };
  });
};

// Component for individual job grade card
const JobGradeCard = ({
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
}: JobGrade & { 
  expanded: boolean; 
  onToggleExpand: () => void;
  viewMode: 'grid' | 'list';
}) => (
  <motion.div
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
            <h3 className="text-lg font-bold text-green-800">{title}</h3>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{grade}</p>
                <p className="text-xs text-gray-400 mt-1">{department} • {category}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-600 hover:bg-green-50"
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
                    <li key={desc.id} className="flex">
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
              <h3 className="font-bold text-green-800">{title}</h3>
              <p className="text-sm text-gray-500">{grade} • {department} • {category}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-green-600 hover:bg-green-50"
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
              <p className="text-xs text-gray-500">Skill Level</p>
              <p>{skill}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Salary Band</p>
              <p>{salary.min} – {salary.max}</p>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
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
                      <li key={desc.id} className="flex">
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

// Main component
const JobGradePage = () => {
  const [jobGrades, setJobGrades] = useState<JobGrade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<JobGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    department: '',
    category: '',
    skillLevel: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Generate mock data on mount
  useEffect(() => {
    setLoading(true);
    const generatedGrades = generateJobGrades(120); // Generate 120 job grades
    setJobGrades(generatedGrades);
    setFilteredGrades(generatedGrades);
    setLoading(false);
  }, []);

  // Apply filters and search
  // Apply filters and search
useEffect(() => {
  let results = jobGrades;
  
  // Apply search
  if (searchTerm) {
    results = results.filter(grade =>
      grade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  
  // Apply filters
  if (filters.department) {
    results = results.filter(grade => grade.department === filters.department);
  }
  if (filters.category) {
    results = results.filter(grade => grade.category === filters.category);
  }
  if (filters.skillLevel) {
    results = results.filter(grade => grade.skill === filters.skillLevel);
  }
  
  setFilteredGrades(results);
}, [searchTerm, filters, jobGrades]);
  // Get unique filter options
  const departments = [...new Set(jobGrades.map(grade => grade.department))];
  const categories = [...new Set(jobGrades.map(grade => grade.category))];
  const skillLevels = [...new Set(jobGrades.map(grade => grade.skill))];

  const toggleExpandCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 min-h-screen bg-gray-50"
    >
      {/* Header */}
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
            className="mt-2 text-sm text-green-700"
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
          >
            Add New Grade
          </Button>
        </motion.div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search job grades, titles, or roles..."
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="text-sm border rounded-md px-3 py-1 bg-white"
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <select
            className="text-sm border rounded-md px-3 py-1 bg-white"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            className="text-sm border rounded-md px-3 py-1 bg-white"
            value={filters.skillLevel}
            onChange={(e) => setFilters({...filters, skillLevel: e.target.value})}
          >
            <option value="">All Skill Levels</option>
            {skillLevels.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-600 hover:bg-green-50"
            onClick={() => setFilters({ department: '', category: '', skillLevel: '' })}
          >
            Clear Filters
          </Button>
        </div>
      </motion.div>

      {/* Results count */}
      <motion.div variants={itemVariants} className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredGrades.length} of {jobGrades.length} job grades
        </p>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
        </motion.div>
      )}

      {/* Job Grades Grid/List */}
      {!loading && (
        <motion.div
          variants={itemVariants}
          className={viewMode === 'grid' ? 
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : 
            "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredGrades.map((grade) => (
              <JobGradeCard
                key={grade.id}
                {...grade}
                expanded={expandedCard === grade.id}
                onToggleExpand={() => toggleExpandCard(grade.id)}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && filteredGrades.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-green-100"
        >
          <BookOpen className="h-10 w-10 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No job grades found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
          <Button
            variant="ghost"
            className="mt-4 text-green-600 hover:bg-green-50"
            onClick={() => {
              setSearchTerm('');
              setFilters({ department: '', category: '', skillLevel: '' });
            }}
          >
            Reset filters
          </Button>
        </motion.div>
      )}

      {/* Analytics Section */}
      {!loading && filteredGrades.length > 0 && (
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
      )}
    </motion.div>
  );
};

export default JobGradePage;