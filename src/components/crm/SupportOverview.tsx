import { motion } from 'framer-motion';
import { ChevronRight, Headphones } from 'lucide-react';
import { Button } from '../ui/button';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface TicketData {
  name: string;
  value: number;
  color: string;
}

interface RecentTicket {
  id: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Pending';
  created: string;
}

interface PriorityColors {
  High: string;
  Medium: string;
  Low: string;
}

const ticketData: TicketData[] = [
  { name: 'Open', value: 45, color: 'rgba(239, 68, 68, 0.8)' },     // red-500
  { name: 'In Progress', value: 32, color: 'rgba(249, 115, 22, 0.8)' }, // orange-500
  { name: 'Resolved', value: 50, color: 'rgba(16, 185, 129, 0.8)' }, // green-500
  { name: 'Pending', value: 15, color: 'rgba(59, 130, 246, 0.8)' },  // blue-500
];

const recentTickets: RecentTicket[] = [
  { id: 'TKT-1024', subject: 'Login issues', priority: 'High', status: 'Open', created: '2h ago' },
  { id: 'TKT-1023', subject: 'Billing question', priority: 'Medium', status: 'In Progress', created: '5h ago' },
  { id: 'TKT-1022', subject: 'Feature request', priority: 'Low', status: 'Pending', created: '1d ago' },
  { id: 'TKT-1021', subject: 'Performance slow', priority: 'High', status: 'Resolved', created: '1d ago' },
];

const priorityColors: PriorityColors = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-orange-100 text-orange-800',
  Low: 'bg-blue-100 text-blue-800'
};

// Prepare data for Chart.js
const chartData = {
  labels: ticketData.map(item => item.name),
  datasets: [
    {
      data: ticketData.map(item => item.value),
      backgroundColor: ticketData.map(item => item.color),
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  plugins: {
    legend: {
      display: false, // We'll show our own legend
    },
  },
  cutout: '70%', // Makes it a donut instead of pie
  maintainAspectRatio: false,
};

export default function SupportOverview() {
  return (
    <motion.div 
      className="bg-white rounded-lg border p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <Headphones className="mr-2 text-indigo-600" size={20} />
          Customer Support
        </h2>
        <Button variant="ghost" size="sm" className="text-indigo-600">
          View All <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Ticket Status</h3>
        <div className="h-48 flex">
          <div className="w-2/3 h-full">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="w-1/3 flex flex-col justify-center">
            {ticketData.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Tickets</h3>
        <div className="space-y-3">
          {recentTickets.map((ticket, index) => (
            <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mr-3">
                <Headphones size={16} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{ticket.subject}</p>
                <p className="text-xs text-gray-500">{ticket.id} • {ticket.created}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}