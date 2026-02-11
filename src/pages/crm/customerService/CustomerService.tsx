import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ticket, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';

export default function CustomerService() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Support Tickets',
      description: 'Manage and track customer support tickets',
      icon: Ticket,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      path: '/crm/support/tickets'
    },
    {
      title: 'Knowledge Base',
      description: 'Browse and manage knowledge base articles',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/crm/support/knowledge-base'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Service</h1>
        <p className="text-gray-600">Manage support tickets and customer satisfaction</p>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const IconComponent = section.icon;
          
          return (
            <motion.div
              key={section.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(section.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

