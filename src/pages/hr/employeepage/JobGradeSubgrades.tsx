import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Plus, MoreVertical, Edit, Trash2, BadgePlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { JobGradeListDto } from '../../../types/hr/jobgrade';
import type { JgStepListDto, JgStepAddDto } from '../../../types/hr/JgStep';

// Mock API service - replace with actual API calls
const jobGradeStepService = {
  getByJobGradeId: async (jobGradeId: string): Promise<JgStepListDto[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSteps: JgStepListDto[] = [
          {
            id: '1',
            name: 'Junior Level',
            salary: 15000,
            jobGradeId: jobGradeId,
            jobGrade: 'Grade A',
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            updatedAt: new Date().toISOString(),
            updatedBy: 'system'
          },
          {
            id: '2',
            name: 'Intermediate Level',
            salary: 25000,
            jobGradeId: jobGradeId,
            jobGrade: 'Grade A',
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            updatedAt: new Date().toISOString(),
            updatedBy: 'system'
          },
          {
            id: '3',
            name: 'Senior Level',
            salary: 35000,
            jobGradeId: jobGradeId,
            jobGrade: 'Grade A',
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            updatedAt: new Date().toISOString(),
            updatedBy: 'system'
          }
        ];
        resolve(mockSteps);
      }, 500);
    });
  },

  create: async (stepData: JgStepAddDto): Promise<JgStepListDto> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStep: JgStepListDto = {
          id: Math.random().toString(36).substr(2, 9),
          ...stepData,
          jobGrade: 'Grade A', // This would come from the backend
          createdAt: new Date().toISOString(),
          createdBy: 'user',
          updatedAt: new Date().toISOString(),
          updatedBy: 'user'
        };
        resolve(newStep);
      }, 500);
    });
  },

  delete: async (stepId: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Deleted step:', stepId);
        resolve();
      }, 500);
    });
  }
};

// Step Card Component with custom dropdown
interface StepCardProps {
  step: JgStepListDto;
  index: number;
  totalSteps: number;
  onEdit: (stepId: string) => void;
  onDelete: (stepId: string) => void;
  isDeleting: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, totalSteps, onEdit, onDelete, isDeleting }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setShowMenu(false);
    onEdit(step.id);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete(step.id);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-semibold text-sm">
              {index + 1}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {step.name}
            </h3>
            <p className="text-sm text-gray-600">
              Step {index + 1} of {totalSteps}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {new Intl.NumberFormat('en-ET', {
                style: 'currency',
                currency: 'ETB',
                minimumFractionDigits: 0,
              }).format(step.salary)}
            </p>
            <p className="text-sm text-gray-500">Step Salary</p>
          </div>
          
          {/* Custom Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-400"></div>
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
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
        </div>
      </div>
    </motion.div>
  );
};

const JobGradeSubgrades: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [jobGrade, setJobGrade] = useState<JobGradeListDto | null>(null);
  const [steps, setSteps] = useState<JgStepListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadJobGradeAndSteps();
  }, [gradeId, location.state]);

  const loadJobGradeAndSteps = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get job grade from navigation state or fetch from API
      if (location.state?.jobGrade) {
        setJobGrade(location.state.jobGrade);
      } else if (gradeId) {
        // Fallback: Fetch job grade by ID from API
        // This would be your actual API call to get job grade by ID
        console.log('Fetching job grade:', gradeId);
        // const fetchedJobGrade = await jobGradeService.getById(gradeId);
        // setJobGrade(fetchedJobGrade);
      }

      // Fetch steps for this job grade
      if (gradeId) {
        const stepsData = await jobGradeStepService.getByJobGradeId(gradeId);
        setSteps(stepsData);
      }
    } catch (err) {
      setError('Failed to load job grade steps');
      console.error('Error loading job grade steps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/hr/settings/jobgrade');
  };

  const handleAddStep = async () => {
    if (!gradeId) return;

    try {
      // Example of adding a new step
      const newStepData: JgStepAddDto = {
        name: `Step ${steps.length + 1}`,
        salary: jobGrade ? (jobGrade.startSalary + (steps.length * 5000)) : 20000,
        jobGradeId: gradeId
      };

      const newStep = await jobGradeStepService.create(newStepData);
      setSteps(prev => [...prev, newStep]);
      
      // Alternatively, you could open a modal for step creation
      // navigate('add-step', { state: { jobGradeId: gradeId } });
    } catch (err) {
      setError('Failed to create step');
      console.error('Error creating step:', err);
    }
  };

  const handleEditStep = (stepId: string) => {
    // Navigate to edit step page or open modal
    console.log('Edit step:', stepId);
    // navigate(`/hr/settings/jobgrade/${gradeId}/step/${stepId}/edit`, {
    //   state: { step: steps.find(s => s.id === stepId), jobGrade }
    // });
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!window.confirm('Are you sure you want to delete this step?')) return;
    
    try {
      setDeletingId(stepId);
      await jobGradeStepService.delete(stepId);
      setSteps(prev => prev.filter(step => step.id !== stepId));
    } catch (err) {
      setError('Failed to delete step');
      console.error('Error deleting step:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex  items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mr-4 hover:bg-green-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Grades
          </Button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button onClick={loadJobGradeAndSteps} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 space-y-6"
    >
              <Button
          variant="outline"
          onClick={handleBack}
          className="cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job Grades
        </Button>
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className='bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>{jobGrade?.name}</span> - Steps
          </h1>
        </div>
        <Button
          onClick={handleAddStep}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto cursor-pointer"
        >
          <BadgePlus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </div>

      {/* Job Grade Info Card */}
      {jobGrade && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-green-100 p-6 mb-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 mr-4">
              <Briefcase className="text-green-600" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {jobGrade.name}
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div>
                  <span className="text-gray-500">Start Salary:</span>
                  <span className="ml-2 font-semibold">
                    {new Intl.NumberFormat('en-ET', {
                      style: 'currency',
                      currency: 'ETB',
                      minimumFractionDigits: 0,
                    }).format(jobGrade.startSalary)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Max Salary:</span>
                  <span className="ml-2 font-semibold">
                    {new Intl.NumberFormat('en-ET', {
                      style: 'currency',
                      currency: 'ETB',
                      minimumFractionDigits: 0,
                    }).format(jobGrade.maxSalary)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Steps List */}
      <div className="grid gap-4">
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            totalSteps={steps.length}
            onEdit={handleEditStep}
            onDelete={handleDeleteStep}
            isDeleting={deletingId === step.id}
          />
        ))}
      </div>

      {steps.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12 bg-white rounded-lg border border-gray-200"
        >
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Steps Found
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating the first step for this job grade.
          </p>
          <Button
            onClick={handleAddStep}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Step
          </Button>
        </motion.div>
      )}
    </motion.section>
  );
};

export default JobGradeSubgrades;