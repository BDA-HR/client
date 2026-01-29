import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Target, Clock, Award, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import type { Opportunity } from '../../../../types/crm';

interface SalesStatsProps {
  opportunities: Opportunity[];
}

export default function SalesStats({ opportunities }: SalesStatsProps) {
  const totalPipelineValue = opportunities
    .filter(opp => !['Closed Won', 'Closed Lost'].includes(opp.stage))
    .reduce((sum, opp) => sum + opp.amount, 0);
  
  const weightedPipelineValue = opportunities
    .filter(opp => !['Closed Won', 'Closed Lost'].includes(opp.stage))
    .reduce((sum, opp) => sum + (opp.amount * opp.probability / 100), 0);
  
  const closedWonValue = opportunities
    .filter(opp => opp.stage === 'Closed Won')
    .reduce((sum, opp) => sum + opp.amount, 0);
  
  const winRate = opportunities.length > 0 
    ? (opportunities.filter(opp => opp.stage === 'Closed Won').length / opportunities.length) * 100
    : 0;
  
  const avgDealSize = opportunities.length > 0 
    ? opportunities.reduce((sum, opp) => sum + opp.amount, 0) / opportunities.length
    : 0;
  
  const avgSalesCycle = opportunities.length > 0
    ? opportunities.reduce((sum, opp) => {
        const created = new Date(opp.createdAt);
        const now = new Date();
        return sum + Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      }, 0) / opportunities.length
    : 0;

  const stats = [
    {
      title: 'Pipeline Value',
      value: `$${totalPipelineValue.toLocaleString()}`,
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Weighted Pipeline',
      value: `$${weightedPipelineValue.toLocaleString()}`,
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Closed Won',
      value: `$${closedWonValue.toLocaleString()}`,
      change: '+28%',
      trend: 'up',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const velocityStats = [
    {
      title: 'Avg Deal Size',
      value: `$${avgDealSize.toLocaleString()}`,
      subtitle: 'Per opportunity'
    },
    {
      title: 'Avg Sales Cycle',
      value: `${Math.round(avgSalesCycle)} days`,
      subtitle: 'From creation to close'
    },
    {
      title: 'Active Deals',
      value: opportunities.filter(opp => !['Closed Won', 'Closed Lost'].includes(opp.stage)).length,
      subtitle: 'In pipeline'
    },
    {
      title: 'At Risk Deals',
      value: opportunities.filter(opp => {
        const closeDate = new Date(opp.expectedCloseDate);
        const now = new Date();
        return closeDate < now && !['Closed Won', 'Closed Lost'].includes(opp.stage);
      }).length,
      subtitle: 'Past due date'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : AlertTriangle;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendIcon className={`w-4 h-4 mr-1 ${
                          stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Velocity Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Sales Velocity Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {velocityStats.map((stat, index) => (
                <div key={stat.title} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{stat.title}</div>
                  <div className="text-xs text-gray-500">{stat.subtitle}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}