import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import JobGradeSubgradesHeader from '../../../components/hr/jobgrade/JobGradeSubgradesHeader';
import AddJgStepModal from '../../../components/hr/jobgrade/AddJgStepModal';
import EditJgStepModal from '../../../components/hr/jobgrade/EditJgStepModal';
import DeleteJgStepModal from '../../../components/hr/jobgrade/DeleteJgStepModal';
import StepCard from '../../../components/hr/jobgrade/StepCard';
import type { JobGradeListDto } from '../../../types/hr/jobgrade';
import type { JgStepListDto, JgStepAddDto, JgStepModDto, UUID } from '../../../types/hr/JgStep';

// Mock API service - replace with actual API calls
const jobGradeStepService = {
  getByJobGradeId: async (jobGradeId: string): Promise<JgStepListDto[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSteps: JgStepListDto[] = [
          {
            id: '1' as UUID,
            name: 'Junior Level',
            salary: 15000,
            jobGradeId: jobGradeId as UUID,
            jobGrade: 'Grade A',
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            updatedAt: new Date().toISOString(),
            updatedBy: 'system',
            rowVersion: '1'
          },
          {
            id: '2' as UUID,
            name: 'Intermediate Level',
            salary: 25000,
            jobGradeId: jobGradeId as UUID,
            jobGrade: 'Grade A',
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            updatedAt: new Date().toISOString(),
            updatedBy: 'system',
            rowVersion: '1'
          },
          {
            id: '3' as UUID,
            name: 'Senior Level',
            salary: 35000,
            jobGradeId: jobGradeId as UUID,
            jobGrade: 'Grade A',
            createdAt: new Date().toISOString(),
            createdBy: 'system',
            updatedAt: new Date().toISOString(),
            updatedBy: 'system',
            rowVersion: '1'
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
          jobGrade: 'Grade A',
          createdAt: new Date().toISOString(),
          createdBy: 'user',
          updatedAt: new Date().toISOString(),
          updatedBy: 'user',
          rowVersion: '1'
        };
        resolve(newStep);
      }, 500);
    });
  },

  update: async (stepData: JgStepModDto): Promise<JgStepListDto> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedStep: JgStepListDto = {
          ...stepData,
          jobGrade: 'Grade A',
          updatedAt: new Date().toISOString(),
          updatedBy: 'user',
          createdAt: new Date().toISOString(), // These would come from server in real app
          createdBy: 'system'
        };
        resolve(updatedStep);
      }, 500);
    });
  },

  delete: async (stepId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Deleted step:', stepId);
        resolve();
      }, 500);
    });
  }
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<JgStepListDto | null>(null);
  const [deletingStep, setDeletingStep] = useState<JgStepListDto | null>(null);

  useEffect(() => {
    loadJobGradeAndSteps();
  }, [gradeId, location.state]);

  const loadJobGradeAndSteps = async () => {
    try {
      setLoading(true);
      setError(null);

      if (location.state?.jobGrade) {
        setJobGrade(location.state.jobGrade);
      } else if (gradeId) {
        console.log('Fetching job grade:', gradeId);
      }

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

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (step: JgStepListDto) => {
    setEditingStep(step);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingStep(null);
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteModal = (step: JgStepListDto) => {
    setDeletingStep(step);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeletingStep(null);
    setIsDeleteModalOpen(false);
  };

  const handleAddStep = async (stepData: JgStepAddDto) => {
    if (!gradeId) return;

    try {
      const newStep = await jobGradeStepService.create(stepData);
      setSteps(prev => [...prev, newStep]);
      handleCloseAddModal();
    } catch (err) {
      setError('Failed to create step');
      console.error('Error creating step:', err);
    }
  };

  const handleEditStep = async (stepData: JgStepModDto) => {
    try {
      const updatedStep = await jobGradeStepService.update(stepData);
      setSteps(prev => prev.map(step => 
        step.id === updatedStep.id ? updatedStep : step
      ));
      handleCloseEditModal();
    } catch (err) {
      setError('Failed to update step');
      console.error('Error updating step:', err);
    }
  };

  const handleDeleteStep = async (step: JgStepListDto) => {
    try {
      setDeletingId(step.id);
      await jobGradeStepService.delete(step.id);
      setSteps(prev => prev.filter(s => s.id !== step.id));
      handleCloseDeleteModal();
    } catch (err) {
      setError('Failed to delete step');
      console.error('Error deleting step:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center mb-6">
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
      className="bg-gray-50 space-y-6"
    >
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={handleBack}
        className="cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Job Grades
      </Button>

      {/* Header */}
      <JobGradeSubgradesHeader
        jobGrade={jobGrade}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddStep={handleOpenAddModal}
      />

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
                      minimumFractionDigits: 0,
                    }).format(jobGrade.startSalary)} ETB
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Max Salary:</span>
                  <span className="ml-2 font-semibold">
                    {new Intl.NumberFormat('en-ET', {
                      minimumFractionDigits: 0,
                    }).format(jobGrade.maxSalary)} ETB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Steps List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
      }>
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            totalSteps={steps.length}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            isDeleting={deletingId === step.id}
            viewMode={viewMode}
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
            onClick={handleOpenAddModal}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Step
          </Button>
        </motion.div>
      )}

      {/* Add Step Modal */}
      <AddJgStepModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddStep={handleAddStep}
        jobGradeId={gradeId as UUID || ''}
      />

      {/* Edit Step Modal */}
      <EditJgStepModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleEditStep}
        step={editingStep}
      />

      {/* Delete Step Modal */}
      <DeleteJgStepModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteStep}
        step={deletingStep}
      />
    </motion.section>
  );
};

export default JobGradeSubgrades;