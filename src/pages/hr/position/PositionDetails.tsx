import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import PositionExperience from '../../../components/hr/position/settings/PositionExperiance';
import PositionBenefits from '../../../components/hr/position/settings/PositionBenefits';
import PositionEducation from '../../../components/hr/position/settings/PositionEducation';
import PositionRequirements from '../../../components/hr/position/settings/PositionRequirements';
import type { 
  PositionListDto, 
  PositionSettingType
} from '../../../types/hr/position';
import { positionService } from '../../../services/hr/positionService';

// Define the tab interface
interface SettingTab {
  id: PositionSettingType;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const settingTabs: SettingTab[] = [
  { 
    id: 'experience', 
    label: 'Experience', 
    icon: Briefcase, 
    description: 'Set experience requirements and age limits',
    color: 'green'
  },
  { 
    id: 'benefit', 
    label: 'Benefits', 
    icon: Award, 
    description: 'Manage position benefits and allowances',
    color: 'green'
  },
  { 
    id: 'education', 
    label: 'Education', 
    icon: GraduationCap, 
    description: 'Set education qualifications and levels',
    color: 'green'
  },
  { 
    id: 'requirement', 
    label: 'Requirements', 
    icon: Settings, 
    description: 'Configure job requirements and work conditions',
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
  },
  secondary: {
    light: 'bg-emerald-50',
    medium: 'bg-emerald-100', 
    dark: 'bg-emerald-500',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: 'text-emerald-600'
  },
  accent: {
    light: 'bg-teal-50',
    medium: 'bg-teal-100',
    dark: 'bg-teal-500',
    text: 'text-teal-700',
    border: 'border-teal-200',
    icon: 'text-teal-600'
  }
};

function PositionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PositionSettingType>('experience');
  const [position, setPosition] = useState<PositionListDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPosition();
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
          <Button onClick={handleBack} variant={'outline'}>            Back to Positions
          </Button>
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
    <div className="min-h-screen">
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
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                position.isVacant === '1' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {position.isVacantStr}
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <Users className="text-white" size={28} />
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
                    {settingTabs.find(tab => tab.id === activeTab)?.label} Settings
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {settingTabs.find(tab => tab.id === activeTab)?.description}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${greenTheme.primary.light} ${greenTheme.primary.text}`}>
                Configure {settingTabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} requirements
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <ActiveTabComponent positionId={position.id} />
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Position ID: {position.id}</span>
            <span>•</span>
            <span>Last updated: {new Date(position.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBack}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Back to List
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.print()}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Print Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for dynamic icon rendering
const IconComponent = ({ icon: Icon, className }: { icon: React.ComponentType<any>, className: string }) => {
  return <Icon className={className} />;
};

export default PositionDetails;