import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface EmployeeStatsCardsProps {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  previousTotal?: number;
  previousActive?: number;
  previousOnLeave?: number;
}

const EmployeeStatsCards: React.FC<EmployeeStatsCardsProps> = ({
  totalEmployees,
  activeEmployees,
  onLeaveEmployees,
  previousTotal,
  previousActive,
  previousOnLeave
}) => {
  // Calculate percentage changes if previous data is provided
  const calculateChange = (current: number, previous?: number): number | undefined => {
    if (previous === undefined || previous === 0) return undefined;
    return ((current - previous) / previous) * 100;
  };

  const totalChange = calculateChange(totalEmployees, previousTotal);
  const activeChange = calculateChange(activeEmployees, previousActive);
  const onLeaveChange = calculateChange(onLeaveEmployees, previousOnLeave);

  return (
    <motion.div 
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-3 gap-5"
    >
      <StatCard 
        title="Total Employees" 
        value={totalEmployees.toString()} 
        change={totalChange}
        icon={Users} 
        color="bg-blue-50 border-blue-100 hover:ring-1 hover:ring-blue-300"
        trend="total"
      />
      <StatCard 
        title="Active Employees" 
        value={activeEmployees.toString()} 
        change={activeChange}
        icon={User} 
        color="bg-green-50 border-green-100 hover:ring-1 hover:ring-green-300"
        trend="positive"
      />
      <StatCard 
        title="On Leave" 
        value={onLeaveEmployees.toString()} 
        change={onLeaveChange}
        icon={Clock} 
        color="bg-amber-50 border-amber-100 hover:ring-1 hover:ring-amber-300"
        trend="negative"
      />
    </motion.div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ComponentType<{ size: number; className?: string }>;
  color: string;
  trend?: 'positive' | 'negative' | 'neutral' | 'total';
}

const StatCard = ({ title, value, change, icon: Icon, color, trend = 'neutral' }: StatCardProps) => {
  const getTrendConfig = () => {
    switch (trend) {
      case 'positive':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: TrendingUp,
          iconColor: 'text-green-600'
        };
      case 'negative':
        return {
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800',
          icon: TrendingDown,
          iconColor: 'text-amber-600'
        };
      case 'total':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: TrendingUp,
          iconColor: 'text-blue-600'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: TrendingUp,
          iconColor: 'text-gray-600'
        };
    }
  };

  const trendConfig = getTrendConfig();
  const TrendIcon = trendConfig.icon;

  // Determine icon color based on card type
  const getIconColor = () => {
    switch (trend) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-amber-600';
      case 'total': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const hasValidChange = change !== undefined && !isNaN(change) && change !== 0;

  return (
    <motion.div 
      variants={statCardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`p-6 rounded-xl border ${color} flex items-center shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group`}
    >
      <div className={`p-3 rounded-full bg-white bg-opacity-70 mr-4 shadow-inner group-hover:scale-110 transition-transform duration-300 ${getIconColor().replace('text', 'bg').replace('-600', '-100')}`}>
        <Icon className={`${getIconColor()} opacity-90`} size={24} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {hasValidChange && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full ${trendConfig.bgColor} ${trendConfig.textColor}`}
            >
              <TrendIcon size={14} className={trendConfig.iconColor} />
              <span className="text-xs font-semibold">
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </motion.div>
          )}
        </div>
        {/* Optional: Add a subtle progress bar */}
        {hasValidChange && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(change), 100)}%` }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={`h-1 rounded-full ${
                change > 0 ? 'bg-green-500' : 'bg-amber-500'
              }`}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const statCardVariants = {
  hidden: { 
    scale: 0.9, 
    opacity: 0,
    y: 20
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 10
    }
  },
  hover: {
    scale: 1.03,
    y: -2,
    transition: { 
      duration: 0.2,
      ease: "easeOut"
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
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

export default EmployeeStatsCards;