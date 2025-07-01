import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronRight, BarChart2, TrendingUp, Users, Mail, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';

const performanceData = [
  { name: 'Jan', leads: 120, conversions: 45, revenue: 4000 },
  { name: 'Feb', leads: 98, conversions: 32, revenue: 3000 },
  { name: 'Mar', leads: 150, conversions: 68, revenue: 5000 },
  { name: 'Apr', leads: 110, conversions: 52, revenue: 4800 },
  { name: 'May', leads: 180, conversions: 79, revenue: 6000 },
  { name: 'Jun', leads: 210, conversions: 92, revenue: 7500 },
  { name: 'Jul', leads: 240, conversions: 105, revenue: 8000 },
];

const kpiData = [
  { name: 'Lead Conversion Rate', value: '42%', change: 8, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
  { name: 'Customer Acquisition Cost', value: '$120', change: -5, icon: Users, color: 'bg-green-100 text-green-600' },
  { name: 'Email Open Rate', value: '28%', change: 12, icon: Mail, color: 'bg-purple-100 text-purple-600' },
  { name: 'Avg. Revenue per Customer', value: '$1,240', change: 15, icon: DollarSign, color: 'bg-orange-100 text-orange-600' },
];

export default function AnalyticsOverview() {
  return (
    <motion.div 
      className="bg-white rounded-lg border p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <BarChart2 className="mr-2 text-cyan-600" size={20} />
          Analytics & Reporting
        </h2>
        <Button variant="ghost" size="sm" className="text-cyan-600">
          View All Reports <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`p-4 rounded-lg border ${kpi.color} flex items-center`}>
            <div className="p-2 rounded-full bg-white bg-opacity-50 mr-3">
              <kpi.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">{kpi.name}</p>
              <div className="flex items-center">
                <p className="text-xl font-bold">{kpi.value}</p>
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                  kpi.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {kpi.change > 0 ? '↑' : '↓'} {Math.abs(kpi.change)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Performance Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="leads" 
                name="Leads"
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="conversions" 
                name="Conversions"
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                name="Revenue ($)"
                stroke="#F97316" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Conversion Funnel</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" name="Leads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" name="Conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}