import React from 'react';
import { Users, DollarSign, Calendar, TrendingUp, Shield, Calculator } from 'lucide-react';

export const PayrollStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      color: 'bg-gradient-to-br from-indigo-50 to-white',
      border: 'border border-indigo-200'
    },
    {
      title: 'Monthly Payroll',
      value: '$385K',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      color: 'bg-gradient-to-br from-emerald-50 to-white',
      border: 'border border-emerald-200'
    },
    {
      title: 'Next Pay Date',
      value: 'Feb 15',
      change: 'On Schedule',
      trend: 'stable',
      icon: <Calendar className="w-5 h-5 text-cyan-600" />,
      color: 'bg-gradient-to-br from-cyan-50 to-white',
      border: 'border border-cyan-200'
    },
    {
      title: 'Avg. Salary',
      value: '$65K',
      change: '+5.2%',
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      color: 'bg-gradient-to-br from-purple-50 to-white',
      border: 'border border-purple-200'
    },
    {
      title: 'Benefits Cost',
      value: '$42K',
      change: '+3.8%',
      trend: 'up',
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      color: 'bg-gradient-to-br from-amber-50 to-white',
      border: 'border border-amber-200'
    },
    {
      title: 'Tax Liability',
      value: '$78K',
      change: '-2.1%',
      trend: 'down',
      icon: <Calculator className="w-5 h-5 text-rose-600" />,
      color: 'bg-gradient-to-br from-rose-50 to-white',
      border: 'border border-rose-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`${stat.color} p-4 rounded-xl ${stat.border} hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">{stat.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <div className={`text-xs ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-rose-600' : 'text-gray-600'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};