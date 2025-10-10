import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Clock } from 'lucide-react';

interface EmployeeStatsCardsProps {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
}

const EmployeeStatsCards: React.FC<EmployeeStatsCardsProps> = ({
  totalEmployees,
  activeEmployees,
  onLeaveEmployees
}) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-3 gap-5"
    >
      <StatCard 
        title="Total Employees" 
        value={totalEmployees.toString()} 
        icon={Users} 
        color="bg-green-50 border-green-100 hover:ring-1 hover:ring-green-300"
      />
      <StatCard 
        title="Active Employees" 
        value={activeEmployees.toString()} 
        change={5.2}
        icon={User} 
        color="bg-green-50 border-green-100 hover:ring-1 hover:ring-green-300"
      />
      <StatCard 
        title="On Leave" 
        value={onLeaveEmployees.toString()} 
        change={-2.1}
        icon={Clock} 
        color="bg-amber-50 border-amber-100 hover:ring-1 hover:ring-amber-300"
      />
    </motion.div>
  );
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
      <Icon className="text-green-600 opacity-90" size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-green-800">{title}</p>
      <div className="flex items-center">
        <p className="text-2xl font-bold mt-1 text-green-900">{value}</p>
        {change !== undefined && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              change > 0 ? 'bg-green-100 text-green-800' : 'bg-amber-800 text-amber-100'
            }`}
          >
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </motion.span>
        )}
      </div>
    </div>
  </motion.div>
);

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

export default EmployeeStatsCards;