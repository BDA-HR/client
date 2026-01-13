import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, Mail, MousePointer, BarChart2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const marketingData = [
  { name: 'Jan', opens: 4000, clicks: 2400, conversions: 1800 },
  { name: 'Feb', opens: 3000, clicks: 1398, conversions: 1200 },
  { name: 'Mar', opens: 2000, clicks: 9800, conversions: 800 },
  { name: 'Apr', opens: 2780, clicks: 3908, conversions: 1500 },
  { name: 'May', opens: 1890, clicks: 4800, conversions: 2200 },
  { name: 'Jun', opens: 2390, clicks: 3800, conversions: 1900 },
  { name: 'Jul', opens: 3490, clicks: 4300, conversions: 2100 },
];

const campaigns = [
  { name: 'Summer Sale', type: 'Email', sent: 'Jul 12', status: 'Active', ctr: '4.2%' },
  { name: 'Product Launch', type: 'Social', sent: 'Jun 28', status: 'Completed', ctr: '6.8%' },
  { name: 'Webinar Invite', type: 'Email', sent: 'Jun 15', status: 'Completed', ctr: '3.5%' },
  { name: 'Customer Survey', type: 'Email', sent: 'May 30', status: 'Completed', ctr: '2.9%' },
];

export default function MarketingOverview() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="bg-white rounded-lg border p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <Mail className="mr-2 text-purple-600" size={20} />
          Marketing Automation
        </h2>
        <Button variant="ghost" size="sm" className="text-purple-600" onClick={() => navigate('/crm/marketing')}>
          View All <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Campaign Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={marketingData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="opens" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.2}
              />
              <Area 
                type="monotone" 
                dataKey="clicks" 
                stackId="2" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.2}
              />
              <Area 
                type="monotone" 
                dataKey="conversions" 
                stackId="3" 
                stroke="#ffc658" 
                fill="#ffc658" 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Campaigns</h3>
        <div className="space-y-3">
          {campaigns.map((campaign, index) => (
            <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                {campaign.type === 'Email' ? <Mail size={16} /> : <BarChart2 size={16} />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{campaign.name}</p>
                <p className="text-xs text-gray-500">{campaign.type} • Sent {campaign.sent}</p>
              </div>
              <div className="flex items-center">
                <MousePointer size={14} className="mr-1 text-gray-400" />
                <span className="text-xs font-medium mr-3">{campaign.ctr}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}