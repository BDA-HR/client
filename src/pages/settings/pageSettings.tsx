import { motion } from 'framer-motion'
import { 
  Users,
  Building,
  CreditCard,
  ShoppingCart,
  Package,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react'
import SettingsHeader from '../../components/settings/SettingsHeader'
import SettingCard from '../../components/settings/SettingCard'

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

const mainSettingsCards = [
  {
    id: 1,
    title: "Core Settings",
    icon: SettingsIcon,
    href: "/settings/core",
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-50",
    iconColor: "text-gray-600"
  },
  {
    id: 2,
    title: "HR Settings",
    icon: Users,
    href: "/settings/hr",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    id: 3,
    title: "CRM Settings",
    icon: Building,
    href: "/settings/crm",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    id: 4,
    title: "Finance Settings",
    icon: CreditCard,
    href: "/settings/finance",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    id: 5,
    title: "Procurement Settings",
    icon: ShoppingCart,
    href: "/settings/procurement",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    id: 6,
    title: "Inventory Settings",
    icon: Package,
    href: "/settings/inventory",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600"
  },
  {
    id: 7,
    title: "File Management",
    icon: FileText,
    href: "/settings/file",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    iconColor: "text-red-600"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mainSettingsCards.map((card, index) => (
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