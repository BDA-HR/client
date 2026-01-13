import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

interface LeadData {
  name: string;
  leads: number;
  converted: number;
}

interface LeadStatus {
  status: string;
  count: number;
  color: string;
}

const leadData: LeadData[] = [
  { name: 'Jan', leads: 120, converted: 45 },
  { name: 'Feb', leads: 98, converted: 32 },
  { name: 'Mar', leads: 150, converted: 68 },
  { name: 'Apr', leads: 110, converted: 52 },
  { name: 'May', leads: 180, converted: 79 },
  { name: 'Jun', leads: 210, converted: 92 },
];

const leadStatus: LeadStatus[] = [
  { status: 'New', count: 324, color: 'bg-orange-300' },
  { status: 'Contacted', count: 278, color: 'bg-orange-400' },
  { status: 'Qualified', count: 195, color: 'bg-amber-400' },
  { status: 'Proposal Sent', count: 147, color: 'bg-amber-500' },
  { status: 'Closed Won', count: 89, color: 'bg-orange-600' },
  { status: 'Closed Lost', count: 58, color: 'bg-orange-700' },
];

export default function LeadOverview() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm hover:shadow-orange-100 transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center text-black">
          <UserPlus className="mr-2 text-orange-600" size={20} />
          Lead Management
        </h2>
        <Button variant="ghost" size="sm" className="hover:text-orange-600  text-black hover:bg-orange-50" onClick={() => navigate('/crm/leads')}>
          View All <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-orange-700 mb-2">Lead Conversion Rate</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FED7AA" />
              <XAxis dataKey="name" stroke="#9A3412" />
              <YAxis stroke="#9A3412" />
              <Tooltip 
                contentStyle={{
                  background: '#FFF7ED',
                  borderColor: '#F97316',
                  borderRadius: '0.5rem',
                  color: '#9A3412'
                }}
              />
              <Bar 
                dataKey="leads" 
                fill="#F97316" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
              />
              <Bar 
                dataKey="converted" 
                fill="#F59E0B" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-orange-700 mb-3">Lead Status</h3>
        <div className="space-y-3">
          {leadStatus.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>
              <span className="text-sm font-medium text-orange-900 flex-1">{item.status}</span>
              <span className="text-sm text-orange-700">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}