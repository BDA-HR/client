import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  Users, 
  Award,
  Building
} from 'lucide-react'
import SettingsHeader from '../../components/hr/settings/SettingsHeader'
import SettingCard from '../../components/hr/settings/SettingCard'

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
}

// Settings card data
const settingsCards = [
  {
    id: 1,
    title: "Benefit Settings",
    description: "Manage employee benefits, insurance plans, and compensation packages",
    icon: Award,
    href: "/hr/settings/benefitset",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    id: 2,
    title: "Educational Qualification",
    description: "Configure educational qualifications and certification requirements",
    icon: GraduationCap,
    href: "/hr/settings/educationqual",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    id: 3,
    title: "Job Grade",
    description: "Set up job grades, levels, and career progression frameworks",
    icon: Building,
    href: "/hr/settings/jobgrade",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    id: 4,
    title: "Position",
    description: "Manage job positions, roles, and organizational structure",
    icon: Users,
    href: "/hr/settings/position",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  }
]

function PageSettings() {
  return (
    <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col space-y-6 bg-gray-50"
      >
        <SettingsHeader />
        
        {/* Main Content */}
        <div className="mx-auto w-full">
          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsCards.map((card, index) => (
              <SettingCard
                key={card.id}
                {...card}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </>
  )
}

export default PageSettings