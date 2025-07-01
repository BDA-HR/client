import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { RefreshCw, Plus, User, Users, TrendingUp, Headphones } from 'lucide-react';
import LeadOverview from '../../components/crm/LeadOverview';
import ContactOverview from '../../components/crm/ContactOverview';
import SalesOverview from '../../components/crm/SalesOverview';
import MarketingOverview from '../../components/crm/MarketingOverview';
import SupportOverview from '../../components/crm/SupportOverview';
import ActivityOverview from '../../components/crm/ActivityOverview';
import AnalyticsOverview from '../../components/crm/AnalyticsOverview';
import { useModule } from '../../ModuleContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren"
    } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15,
      duration: 0.5
    }
  }
};

const statCardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 10
    }
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.2 }
  }
};

type StatCardProps = {
  title: string;
  value: string;
  change?: number;
icon: React.ComponentType<{ size: number; className?: string }>;
  color: string;
};

const StatCard = ({ title, value, change, icon: Icon, color }: StatCardProps) => (
  <motion.div 
    variants={statCardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    className={`p-5 rounded-xl border ${color} flex items-center shadow-sm hover:shadow-md transition-all duration-300`}
  >
    <div className="p-3 rounded-full bg-white bg-opacity-70 mr-4 shadow-inner">
<Icon className="text-orange-600 opacity-90" size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-orange-800">{title}</p>
      <div className="flex items-center">
        <p className="text-2xl font-bold mt-1 text-orange-900">{value}</p>
        {change !== undefined && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              change > 0 ? 'bg-orange-100 text-orange-800' : 'bg-amber-800 text-amber-100'
            }`}
          >
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </motion.span>
        )}
      </div>
    </div>
  </motion.div>
);

export default function CRMDashboard() {
  const { activeModule } = useModule();

  // Orange color variants
  const cardColors = [
    "hover:shadow-lg hover:ring-1 hover:ring-orange-400 transition-all",
    "hover:shadow-lg hover:ring-1 hover:ring-orange-400 transition-all",
    "hover:shadow-lg hover:ring-1 hover:ring-orange-400 transition-all",
    "hover:shadow-lg hover:ring-1 hover:ring-orange-400 transition-all"
  ];

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="p-6 min-h-screen"
    >
      {/* Header Section */}
      <motion.section 
        variants={itemVariants}
        className="mb-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end"
      >
        <div>
          <h1 className="text-3xl font-bold text-black">
            {activeModule === 'CRM' ? (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block"
              >
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  CRM
                </span> Module
              </motion.span>
            ) : 'Dashboard'}
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm text-orange-700"
          >
            Manage leads, contacts, sales, marketing, support, and customer interactions
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-3 mt-4 sm:mt-0"
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-800 transition-colors"
          >
            <RefreshCw size={16} className="hover:animate-spin" />
            <span>Refresh</span>
          </Button>
          <Button 
            size="sm" 
            className="flex items-center bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-orange-200 transition-all"
          >
            <Plus size={16} className="mr-2" /> 
            <span>New Entry</span>
          </Button>
        </motion.div>
      </motion.section>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        <StatCard 
          title="Total Leads" 
          value="1,248" 
          change={12.5} 
          icon={User} 
          color={cardColors[0]}
        />
        <StatCard 
          title="Active Contacts" 
          value="3,742" 
          change={4.2} 
          icon={Users} 
          color={cardColors[1]}
        />
        <StatCard 
          title="Sales Pipeline" 
          value="$284K" 
          change={8.7} 
          icon={TrendingUp} 
          color={cardColors[2]}
        />
        <StatCard 
          title="Open Tickets" 
          value="127" 
          change={-3.8} 
          icon={Headphones} 
          color={cardColors[3]}
        />
      </motion.div>

      {/* Main Dashboard Sections */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <LeadOverview />
        <ContactOverview />
        <SalesOverview />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
      >
        <MarketingOverview />
        <SupportOverview />
        <ActivityOverview />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="mt-6"
      >
        <AnalyticsOverview />
      </motion.div>
    </motion.div>
  );
}