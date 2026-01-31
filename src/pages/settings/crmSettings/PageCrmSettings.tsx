import { motion } from 'framer-motion'
import { 
  Target, 
  BarChart3, 
  Users,
  Mail,
  Workflow,
  Database,
  Settings,
  Building,
  Award,
  Shield,
  Clock
} from 'lucide-react'
import SettingsHeader from '../../../components/settings/SettingsHeader'
import SettingCard from '../../../components/settings/SettingCard'

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

// CRM specific settings card data - Only 10 required settings
const crmSettingsCards = [
  {
    id: 1,
    title: "Lead Sources",
    description: "Manage and configure lead source options for tracking lead origins",
    icon: Target,
    href: "/settings/crm/lead-sources",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    id: 2,
    title: "Lead Statuses",
    description: "Configure lead status options and workflow progression stages",
    icon: BarChart3,
    href: "/settings/crm/lead-statuses",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    id: 3,
    title: "Lead Qualification Statuses",
    description: "Set up qualification status levels for lead assessment",
    icon: Award,
    href: "/settings/crm/lead-qualification-statuses",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    id: 4,
    title: "Lead Categories",
    description: "Define lead categories for better organization and filtering",
    icon: Database,
    href: "/settings/crm/lead-categories",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    id: 5,
    title: "Industries",
    description: "Set up industry categories for lead and company classification",
    icon: Building,
    href: "/settings/crm/industries",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600"
  },
  {
    id: 6,
    title: "Contact Methods",
    description: "Manage preferred contact method options for lead communication",
    icon: Mail,
    href: "/settings/crm/contact-methods",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600"
  },
  {
    id: 7,
    title: "Activity Types",
    description: "Configure activity types for tracking lead interactions",
    icon: Workflow,
    href: "/settings/crm/activity-types",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    iconColor: "text-red-600"
  },
  {
    id: 8,
    title: "Assignment Modes",
    description: "Set up lead assignment modes and routing rules",
    icon: Users,
    href: "/settings/crm/assignment-modes",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600"
  },
  {
    id: 9,
    title: "Routing Rules",
    description: "Configure automatic lead routing and assignment rules",
    icon: Shield,
    href: "/settings/crm/routing-rules",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
  {
    id: 10,
    title: "Conversion Targets",
    description: "Define conversion targets and goals for lead management",
    icon: Settings,
    href: "/settings/crm/conversion-targets",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600"
  }
]

function PageCrmSettings() {
  return (
    <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col space-y-6 bg-gray-50"
      >
        <SettingsHeader />
        
        <div className="mx-auto w-full">          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crmSettingsCards.map((card, index) => (
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

export default PageCrmSettings