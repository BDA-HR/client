import { motion } from 'framer-motion';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChevronRight, Users, Briefcase, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

Chart.register(ArcElement, Tooltip, Legend);

interface ContactData {
  name: string;
  value: number;
}

interface RecentContact {
  name: string;
  company: string;
  location: string;
  type: 'Customer' | 'Prospect' | 'Partner';
}

const contactData: ContactData[] = [
  { name: 'Customers', value: 45 },
  { name: 'Prospects', value: 30 },
  { name: 'Partners', value: 15 },
  { name: 'Suppliers', value: 10 },
];

const recentContacts: RecentContact[] = [
  { name: 'Alex Johnson', company: 'Acme Inc', location: 'New York', type: 'Customer' },
  { name: 'Sarah Williams', company: 'Globex Corp', location: 'Chicago', type: 'Prospect' },
  { name: 'Michael Chen', company: 'Stark Industries', location: 'San Francisco', type: 'Partner' },
  { name: 'Emily Davis', company: 'Wayne Enterprises', location: 'Boston', type: 'Customer' },
];

export default function ContactOverview() {
  const navigate = useNavigate();

  const data = {
    labels: contactData.map(d => d.name),
    datasets: [
      {
        data: contactData.map(d => d.value),
        backgroundColor: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA'],
        hoverBackgroundColor: ['#EA580C', '#F97316', '#FB923C', '#FBBF24'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9A3412',
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const label = ctx.label ?? '';
            const value = ctx.parsed;
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percent = ((value / total) * 100).toFixed(0);
            return `${label}: ${percent}% (${value})`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm hover:shadow-orange-100 transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center text-black">
          <Users className="mr-2 text-orange-600" size={20} />
          Contact Management
        </h2>
        <Button variant="ghost" size="sm" className="hover:text-orange-600 hover:bg-orange-50 text-black" onClick={() => navigate('/crm/contacts')}>
          View All <ChevronRight size={16} />
        </Button>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-orange-700 mb-2">Contact Distribution</h3>
        <div className="h-48">
          <Doughnut data={data} options={options} />
        </div>
      </div>

      {/* Recent Contacts */}
      <div>
        <h3 className="text-sm font-medium text-orange-700 mb-3">Recent Contacts</h3>
        <div className="space-y-3">
          {recentContacts.map((contact, idx) => (
            <div
              key={idx}
              className="flex items-center p-2 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <div className="bg-orange-100 text-orange-600 p-2 rounded-full mr-3">
                <Briefcase size={16} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-orange-900">{contact.name}</p>
                <p className="text-xs text-orange-700 flex items-center">
                  <MapPin size={12} className="mr-1" />
                  {contact.company} • {contact.location}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  contact.type === 'Customer'
                    ? 'bg-orange-100 text-orange-800'
                    : contact.type === 'Prospect'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-orange-200 text-orange-900'
                }`}
              >
                {contact.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
