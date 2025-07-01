import { motion } from 'framer-motion';
import { ChevronRight, Calendar, User } from 'lucide-react';
import { Button } from '../ui/button';

type ActivityType = 'Meeting' | 'Call' | 'Email' | 'Task';
type ActivityStatus = 'upcoming' | 'completed' | 'pending' | 'overdue';

interface Activity {
  type: ActivityType;
  title: string;
  date: string;
  participants: string;
  status: ActivityStatus;
}

interface StatusColors {
  upcoming: string;
  completed: string;
  pending: string;
  overdue: string;
}

const activities: Activity[] = [
  { type: 'Meeting', title: 'Product demo with Acme Inc', date: 'Today, 2:00 PM', participants: 'Alex Johnson, Sarah Lee', status: 'upcoming' },
  { type: 'Call', title: 'Follow-up on proposal', date: 'Today, 11:30 AM', participants: 'Michael Chen', status: 'completed' },
  { type: 'Email', title: 'Send contract details', date: 'Tomorrow, 9:00 AM', participants: 'Emily Davis', status: 'pending' },
  { type: 'Task', title: 'Prepare Q2 sales report', date: 'Jun 30', participants: 'Yourself', status: 'overdue' },
];


const statusColors: StatusColors = {
  upcoming: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-gray-100 text-gray-800',
  overdue: 'bg-red-100 text-red-800'
};

export default function ActivityOverview() {
  return (
    <motion.div 
      className="bg-white rounded-lg border p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2 text-amber-600" size={20} />
          Activity Management
        </h2>
        <Button variant="ghost" size="sm" className="text-amber-600">
          View All <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg border">

            <div className="flex-1">
              <p className="font-medium">{activity.title}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Calendar size={12} className="mr-1" /> {activity.date}
              </p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <User size={12} className="mr-1" /> {activity.participants}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[activity.status]}`}>
              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}