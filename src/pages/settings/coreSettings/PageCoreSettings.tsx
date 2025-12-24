import { motion } from 'framer-motion'
import { 
  Key, 
  Menu,
  Shield,
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
    title: "API Permissions",
    description: "Manage API permissions, access keys, and endpoint security settings",
    icon: Key,
    href: "/settings/core/api-permissions",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600"
  },
  {
    id: 2,
    title: "Menu Permissions",
    description: "Configure menu permissions, navigation access, and module visibility",
    icon: Menu,
    href: "/settings/core/menu-permissions",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600"
  }
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
          
          {/* Additional section for future cards */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Coming Soon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4">
                    <Shield className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Security Settings</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure advanced security policies</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md inline-block">
                  Coming Soon
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </section>
  )
}

export default PageCoreSettings