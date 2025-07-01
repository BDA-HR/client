import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';

const salesData = [
  { name: 'Jan', revenue: 4000, quota: 3800 },
  { name: 'Feb', revenue: 3000, quota: 3500 },
  { name: 'Mar', revenue: 5000, quota: 4500 },
  { name: 'Apr', revenue: 4800, quota: 5000 },
  { name: 'May', revenue: 6000, quota: 5500 },
  { name: 'Jun', revenue: 7500, quota: 7000 },
  { name: 'Jul', revenue: 8000, quota: 7500 },
];

const deals = [
  { name: 'Enterprise Plan', value: 12000, stage: 'Closed Won' },
  { name: 'Premium Support', value: 8500, stage: 'Negotiation' },
  { name: 'Custom Integration', value: 15000, stage: 'Proposal' },
  { name: 'Annual Renewal', value: 9500, stage: 'Discovery' },
];

export default function SalesOverview() {
  return (
    <motion.div 
      className="bg-white rounded-lg border p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <TrendingUp className="mr-2 text-green-600" size={20} />
          Sales Management
        </h2>
        <Button variant="ghost" size="sm" className="text-green-600">
          View All <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Revenue vs Quota</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="quota" 
                stroke="#6B7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Top Deals</h3>
        <div className="space-y-3">
          {deals.map((deal, index) => (
            <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                <DollarSign size={16} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{deal.name}</p>
                <p className="text-sm text-gray-500">${deal.value.toLocaleString()}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                deal.stage === 'Closed Won' ? 'bg-green-100 text-green-800' :
                deal.stage === 'Negotiation' ? 'bg-orange-100 text-orange-800' :
                deal.stage === 'Proposal' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {deal.stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}