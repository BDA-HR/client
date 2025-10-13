import { motion } from 'framer-motion';
import { useState } from 'react';
import SettingsHeader from '../../components/hr/settings components/SettingsHeader';
import SettingCard from '../../components/hr/settings components/SettingCard';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Mock data for each type
const mockBenefits = [
  {
    id: '1',
    Name: 'Health Insurance',
    Benefit: 5000,
    BenefitStr: '$5,000'
  },
  {
    id: '2',
    Name: 'Retirement Plan',
    Benefit: 10000,
    BenefitStr: '$10,000'
  },
  {
    id: '3',
    Name: 'Training Budget',
    Benefit: 2000,
    BenefitStr: '$2,000'
  }
];

const mockEducationalQualities = [
  {
    id: '1',
    Name: 'High School Diploma'
  },
  {
    id: '2',
    Name: 'Bachelor Degree'
  },
  {
    id: '3',
    Name: 'Master Degree'
  }
];

const mockPositionEducation = [
  {
    id: '1',
    Name: 'Computer Science Degree'
  },
  {
    id: '2',
    Name: 'Engineering Degree'
  }
];

const mockPositionExperience = [
  {
    id: '1',
    Name: '5+ Years Experience'
  },
  {
    id: '2',
    Name: '2+ Years Management'
  }
];

function PageSettings() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // State for each setting type
  const [benefits, setBenefits] = useState(mockBenefits);
  const [educationalQualities, setEducationalQualities] = useState(mockEducationalQualities);
  const [positionEducation, setPositionEducation] = useState(mockPositionEducation);
  const [positionExperience, setPositionExperience] = useState(mockPositionExperience);

  const handleToggleExpand = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleEdit = (setting: any, type: string) => {
    console.log(`Edit ${type}:`, setting);
    // Implement edit logic here based on type
  };

  const handleDelete = (setting: any, type: string) => {
    console.log(`Delete ${type}:`, setting);
    // Implement delete logic here based on type
    switch (type) {
      case 'benefit':
        setBenefits(benefits.filter(b => b.id !== setting.id));
        break;
      case 'educationQual':
        setEducationalQualities(educationalQualities.filter(q => q.id !== setting.id));
        break;
      case 'positionEducation':
        setPositionEducation(positionEducation.filter(p => p.id !== setting.id));
        break;
      case 'positionExperience':
        setPositionExperience(positionExperience.filter(p => p.id !== setting.id));
        break;
      default:
        break;
    }
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Helper function to render section of settings
  const renderSettingsSection = (
    title: string,
    settings: any[],
    type: 'benefit' | 'educationQual' | 'positionEducation' | 'positionExperience'
  ) => (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      {settings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium">No {title.toLowerCase()} found</p>
          <p className="text-sm">Add your first {title.toLowerCase()} to get started</p>
        </div>
      ) : (
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          animate="visible"
          className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'flex flex-col space-y-4'
            }
          `}
        >
          {settings.map((setting) => (
            <SettingCard
              key={setting.id}
              setting={setting}
              settingType={type}
              expanded={expandedCard === setting.id}
              onToggleExpand={() => handleToggleExpand(setting.id)}
              viewMode={viewMode}
              onEdit={(s) => handleEdit(s, type)}
              onDelete={(s) => handleDelete(s, type)}
            />
          ))}
        </motion.div>
      )}
    </section>
  );

  return (
    <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-full flex flex-col space-y-8"
      >
        <SettingsHeader 
          onViewModeChange={handleViewModeChange} 
          currentViewMode={viewMode}
        />
        
        {/* Benefits Section */}
        {renderSettingsSection('Benefits', benefits, 'benefit')}

        {/* Educational Qualities Section */}
        {renderSettingsSection('Educational Qualities', educationalQualities, 'educationQual')}

        {/* Position Education Section */}
        {renderSettingsSection('Position Education', positionEducation, 'positionEducation')}

        {/* Position Experience Section */}
        {renderSettingsSection('Position Experience', positionExperience, 'positionExperience')}
      </motion.section>
    </>
  );
}

export default PageSettings;