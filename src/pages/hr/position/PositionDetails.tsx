import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Settings, 
  Building,
  UserCheck,
  Calendar,
  BadgePlus,
  Grid,
  List,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import PositionExperience from '../../../components/hr/position/settings/PositionExperiance';
import PositionBenefits from '../../../components/hr/position/settings/PositionBenefits';
import PositionEducation from '../../../components/hr/position/settings/PositionEducation';
import PositionRequirements from '../../../components/hr/position/settings/PositionRequirements';
import PositionExperienceModal from '../../../components/hr/position/settings/PositionExperianceModal';
import PositionRequirementsModal from '../../../components/hr/position/settings/PositionRequirementsModal';
import PositionEducationModal from '../../../components/hr/position/settings/PositionEducationModal';
import PositionBenefitsModal from '../../../components/hr/position/settings/PositionBenefitsModal';
import type { 
  PositionListDto, 
  PositionSettingType,
  PositionExpAddDto,
  PositionExpModDto,
  PositionExpListDto,
  PositionReqAddDto,
  PositionReqModDto,
  PositionReqListDto,
  PositionEduAddDto,
  PositionEduModDto,
  PositionEduListDto,
  PositionBenefitAddDto,
  PositionBenefitModDto,
  PositionBenefitListDto,
  ProfessionTypeDto,
  EducationLevelDto,
  BenefitSettingDto
} from '../../../types/hr/position';
import { positionService, lookupService } from '../../../services/hr/positionService';

// Define the tab interface
interface SettingTab {
  id: PositionSettingType;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

const settingTabs: SettingTab[] = [
  { 
    id: 'experience', 
    label: 'Experience', 
    icon: Briefcase, 
    color: 'green'
  },
  { 
    id: 'benefit', 
    label: 'Benefits', 
    icon: Award, 
    color: 'green'
  },
  { 
    id: 'education', 
    label: 'Education', 
    icon: GraduationCap, 
    color: 'green'
  },
  { 
    id: 'requirement', 
    label: 'Requirements', 
    icon: Settings, 
    color: 'green'
  },
];

// Unified green color scheme
const greenTheme = {
  primary: {
    light: 'bg-green-50',
    medium: 'bg-green-100',
    dark: 'bg-green-500',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: 'text-green-600',
    active: 'border-green-500 text-green-600 bg-green-50'
  }
};

function PositionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PositionSettingType>('experience');
  const [position, setPosition] = useState<PositionListDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Experience modal state
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<PositionExpListDto | null>(null);
  const [hasExperience, setHasExperience] = useState(false);
  const experienceRef = useRef<any>(null);

  // Requirement modal state
  const [hasRequirement, setHasRequirement] = useState(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<PositionReqListDto | null>(null);
  const [professionTypes, setProfessionTypes] = useState<ProfessionTypeDto[]>([]);
  const requirementRef = useRef<any>(null);

  // Education modal state
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<PositionEduListDto | null>(null);
  const [educationLevels, setEducationLevels] = useState<EducationLevelDto[]>([]);
  const educationRef = useRef<any>(null);

  // Benefit modal state
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<PositionBenefitListDto | null>(null);
  const [benefitSettings, setBenefitSettings] = useState<BenefitSettingDto[]>([]);
  const benefitRef = useRef<any>(null);

  // Grid/List view state for benefits
  const [benefitViewMode, setBenefitViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (id) {
      fetchPosition();
      checkIfHasExperience();
      checkIfHasRequirement();
      fetchProfessionTypes();
      fetchEducationLevels();
      fetchBenefitSettings();
    }
  }, [id]);

  const fetchPosition = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const positionData = await positionService.getPosition(id!);
      setPosition(positionData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch position details');
      console.error('Error fetching position:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/hr/settings/position');
  };

  // Experience modal handlers
  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (experience: PositionExpListDto) => {
    setEditingExperience(experience);
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = async (data: PositionExpAddDto | PositionExpModDto) => {
    try {
      if ('id' in data) {
        await positionService.updatePositionExp(data.id, data);
      } else {
        await positionService.addPositionExp(data);
        setHasExperience(true);
      }
      if (experienceRef.current && experienceRef.current.fetchExperiences) {
        await experienceRef.current.fetchExperiences();
      }
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleCloseExperienceModal = () => {
    setIsExperienceModalOpen(false);
    setEditingExperience(null);
  };

  // Requirement modal handlers
  const handleAddRequirement = () => {
    setEditingRequirement(null);
    setIsRequirementModalOpen(true);
  };

  const handleEditRequirement = (requirement: PositionReqListDto) => {
    setEditingRequirement(requirement);
    setIsRequirementModalOpen(true);
  };

  const handleSaveRequirement = async (data: PositionReqAddDto | PositionReqModDto) => {
    try {
      if ('id' in data) {
        await positionService.updatePositionReq(data.id, data);
      } else {
        await positionService.addPositionReq(data);
        setHasRequirement(true);
      }
      if (requirementRef.current && requirementRef.current.fetchRequirements) {
        await requirementRef.current.fetchRequirements();
      }
    } catch (error) {
      console.error('Error saving requirement:', error);
    }
  };

  const handleCloseRequirementModal = () => {
    setIsRequirementModalOpen(false);
    setEditingRequirement(null);
  };

  // Education modal handlers
  const handleAddEducation = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education: PositionEduListDto) => {
    setEditingEducation(education);
    setIsEducationModalOpen(true);
  };

  const handleSaveEducation = async (data: PositionEduAddDto | PositionEduModDto) => {
    try {
      if ('id' in data) {
        await positionService.updatePositionEdu(data.id, data);
      } else {
        await positionService.addPositionEdu(data);
      }
      if (educationRef.current && educationRef.current.fetchEducations) {
        await educationRef.current.fetchEducations();
      }
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleCloseEducationModal = () => {
    setIsEducationModalOpen(false);
    setEditingEducation(null);
  };

  // Benefit modal handlers
  const handleAddBenefit = () => {
    setEditingBenefit(null);
    setIsBenefitModalOpen(true);
  };

  const handleEditBenefit = (benefit: PositionBenefitListDto) => {
    setEditingBenefit(benefit);
    setIsBenefitModalOpen(true);
  };

  const handleSaveBenefit = async (data: PositionBenefitAddDto | PositionBenefitModDto) => {
    try {
      if ('id' in data) {
        await positionService.updatePositionBenefit(data.id, data);
      } else {
        await positionService.addPositionBenefit(data);
      }
      if (benefitRef.current && benefitRef.current.fetchBenefits) {
        await benefitRef.current.fetchBenefits();
      }
    } catch (error) {
      console.error('Error saving benefit:', error);
    }
  };

  const handleCloseBenefitModal = () => {
    setIsBenefitModalOpen(false);
    setEditingBenefit(null);
  };

  // Check if position has experiences
  const checkIfHasExperience = async () => {
    try {
      const data = await positionService.getAllPositionExp();
      const positionExperiences = data.filter(exp => exp.positionId === id);
      setHasExperience(positionExperiences.length > 0);
    } catch (error) {
      console.error('Error checking experiences:', error);
    }
  };

  // Check if position has requirements
  const checkIfHasRequirement = async () => {
    try {
      const data = await positionService.getAllPositionReq();
      const positionRequirements = data.filter(req => req.positionId === id);
      setHasRequirement(positionRequirements.length > 0);
    } catch (error) {
      console.error('Error checking requirements:', error);
    }
  };

  // Fetch profession types
  const fetchProfessionTypes = async () => {
    try {
      const data = await lookupService.getAllProfessionTypes();
      setProfessionTypes(data);
    } catch (error) {
      console.error('Error fetching profession types:', error);
    }
  };

  // Fetch education levels
  const fetchEducationLevels = async () => {
    try {
      const data = await lookupService.getAllEducationLevels();
      setEducationLevels(data);
    } catch (error) {
      console.error('Error fetching education levels:', error);
    }
  };

  // Fetch benefit settings
  const fetchBenefitSettings = async () => {
    try {
      const data = await lookupService.getAllBenefitSettings();
      setBenefitSettings(data);
    } catch (error) {
      console.error('Error fetching benefit settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700">Loading Position Details</h3>
          <p className="text-gray-500 mt-2">Please wait while we fetch the position information...</p>
        </div>
      </div>
    );
  }

  if (error || !position) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-green-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Position Not Found</h3>
          <p className="text-gray-600 mb-6">{error || 'The requested position could not be found.'}</p>
          <Button onClick={handleBack} variant={'outline'}>Back to Positions</Button>
        </div>
      </div>
    );
  }

  const ActiveTabComponent = {
    experience: PositionExperience,
    benefit: PositionBenefits,
    education: PositionEducation,
    requirement: PositionRequirements,
  }[activeTab];

  return (
    <div className="min-h-screen space-y-4">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Positions
              </Button>
              <div className="h-8 w-px bg-green-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{position.name}</h1>
                <p className="text-lg text-gray-600 mt-1">{position.nameAm}</p>
              </div>
            </div>
          </div>

          {/* Position Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Department</p>
                  <p className="text-lg font-semibold text-gray-900">{position.department}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Positions</p>
                  <p className="text-lg font-semibold text-gray-900">{position.noOfPosition}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className={`text-lg font-semibold ${
                    position.isVacant === '1' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {position.isVacantStr}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-2">
            <nav className="flex space-x-2">
              {settingTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? `${greenTheme.primary.light} border border-green-300 text-green-700 shadow-sm`
                        : 'text-gray-500 hover:text-green-700 hover:bg-green-50'
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 ${isActive ? greenTheme.primary.icon : 'text-gray-400'}`} />
                    {tab.label}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-green-500 ml-1"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden">
          {/* Tab Header */}
          <div className={`border-b ${greenTheme.primary.border} px-6 py-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${greenTheme.primary.light}`}>
                  {settingTabs.find(tab => tab.id === activeTab) && (
                    <IconComponent 
                      icon={settingTabs.find(tab => tab.id === activeTab)!.icon}
                      className={`h-6 w-6 ${greenTheme.primary.icon}`}
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                   Position {settingTabs.find(tab => tab.id === activeTab)?.label} 
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* View Mode Toggle - Only shown for Benefit tab */}
                {activeTab === 'benefit' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 cursor-pointer border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800 whitespace-nowrap"
                    onClick={() => setBenefitViewMode(benefitViewMode === "grid" ? "list" : "grid")}
                  >
                    {benefitViewMode === "grid" ? (
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
                )}

                {/* Add Education Button - Only shown for Education tab */}
                {activeTab === 'education' && (
                  <Button 
                    onClick={handleAddEducation}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto cursor-pointer"
                  >
                    <BadgePlus className="h-4 w-4" />
                    Add Education
                  </Button>
                )}

                {/* Add Benefit Button - Only shown for Benefit tab */}
                {activeTab === 'benefit' && (
                  <Button 
                    onClick={handleAddBenefit}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto cursor-pointer"
                  >
                    <BadgePlus className="h-4 w-4" />
                    Add Benefit
                  </Button>
                )}

                {/* Add Experience Button - Only shown for Experience tab when no experience exists */}
                {activeTab === 'experience' && !hasExperience && (
                  <Button 
                    onClick={handleAddExperience}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap cursor-pointer"
                  >
                    <BadgePlus className="h-4 w-4" />
                    Add Experience
                  </Button>
                )}

                {/* Add Requirements Button - Only shown for Requirements tab when no requirement exists */}
                {activeTab === 'requirement' && !hasRequirement && (
                  <Button 
                    onClick={handleAddRequirement}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap cursor-pointer"
                  >
                    <BadgePlus className="h-4 w-4" />
                    Add Requirements
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'experience' ? (
              <PositionExperience 
                positionId={position.id} 
                ref={experienceRef}
                onEdit={handleEditExperience}
                onExperienceAdded={() => setHasExperience(true)}
                onExperienceDeleted={() => setHasExperience(false)}
              />
            ) : activeTab === 'requirement' ? (
              <PositionRequirements 
                positionId={position.id} 
                ref={requirementRef}
                onEdit={handleEditRequirement}
                onRequirementAdded={() => setHasRequirement(true)}
                onRequirementDeleted={() => setHasRequirement(false)}
              />
            ) : activeTab === 'education' ? (
              <PositionEducation 
                positionId={position.id} 
                ref={educationRef}
                onEdit={handleEditEducation}
              />
            ) : activeTab === 'benefit' ? (
              <PositionBenefits 
                positionId={position.id} 
                ref={benefitRef}
                onEdit={handleEditBenefit}
                viewMode={benefitViewMode}
                setViewMode={setBenefitViewMode}
              />
            ) : (
              <ActiveTabComponent positionId={position.id} />
            )}
          </div>
        </div>

        {/* Experience Modal */}
        <PositionExperienceModal
          isOpen={isExperienceModalOpen}
          onClose={handleCloseExperienceModal}
          onSave={handleSaveExperience}
          positionId={position.id}
          editingExperience={editingExperience}
        />

        {/* Requirements Modal */}
        <PositionRequirementsModal
          isOpen={isRequirementModalOpen}
          onClose={handleCloseRequirementModal}
          onSave={handleSaveRequirement}
          positionId={position.id}
          professionTypes={professionTypes}
          editingRequirement={editingRequirement}
        />

        {/* Education Modal */}
        <PositionEducationModal
          isOpen={isEducationModalOpen}
          onClose={handleCloseEducationModal}
          onSave={handleSaveEducation}
          positionId={position.id}
          educationLevels={educationLevels}
          editingEducation={editingEducation}
        />

        {/* Benefit Modal */}
        <PositionBenefitsModal
          isOpen={isBenefitModalOpen}
          onClose={handleCloseBenefitModal}
          onSave={handleSaveBenefit}
          positionId={position.id}
          benefitSettings={benefitSettings}
          editingBenefit={editingBenefit}
        />
      </div>
    </div>
  );
}

// Helper component for dynamic icon rendering
const IconComponent = ({ icon: Icon, className }: { icon: React.ComponentType<any>, className: string }) => {
  return <Icon className={className} />;
};

export default PositionDetails;