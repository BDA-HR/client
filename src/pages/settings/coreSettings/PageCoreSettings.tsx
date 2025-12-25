import { motion } from 'framer-motion'
import { 
  Key, 
  Menu,
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

// Core specific settings card data
const coreSettingsCards = [
  
  {
    id: 1,
    title: "Menu Permissions",
    description: "Configure menu permissions, navigation access, and module visibility",
    icon: Menu,
    href: "/settings/core/menu-permissions",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600"
  },
  {
    id: 2,
    title: "Access Permissions",
    description: "Manage API permissions, access keys, and endpoint security settings",
    icon: Key,
    href: "/settings/core/api-permissions",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600"
  },
]

function PageCoreSettings() {
  return (
    <section className="space-y-6">
      <SettingsHeader />
      
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col space-y-6 bg-gray-50"
      >
        <div className="mx-auto w-full">          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreSettingsCards.map((card, index) => (
              <SettingCard
                key={card.id}
                {...card}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </section>
  )
}

export default PageCoreSettings