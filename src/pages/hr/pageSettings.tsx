import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  Users, 
  Award,
  ChevronRight,
  Building
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SettingsHeader from '../../components/hr/settings components/SettingsHeader'

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
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
  const navigate = useNavigate()

  const handleCardClick = (href: string) => {
    navigate(href)
  }

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
              <motion.div
                key={card.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 
                         hover:shadow-md transition-all duration-200 
                         cursor-pointer group overflow-hidden"
                onClick={() => handleCardClick(card.href)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.bgColor}`}>
                      <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 
                                           group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {card.description}
                  </p>
                  
                  <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${card.color} 
                                group-hover:w-16 transition-all duration-300`} />
                </div>
                
                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.color} 
                              opacity-0 group-hover:opacity-5 transition-opacity duration-200 
                              pointer-events-none rounded-2xl`} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  )
}

export default PageSettings