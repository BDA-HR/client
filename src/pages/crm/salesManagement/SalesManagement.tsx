import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, FileText, Package } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';

export default function SalesManagementPage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Opportunities',
      description: 'Manage sales opportunities and track deals',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      path: '/crm/sales/opportunities'
    },
    {
      title: 'Quotations',
      description: 'Create and manage sales quotations',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/crm/quotations'
    },
    {
      title: 'Orders',
      description: 'Track and manage customer orders',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/crm/orders'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
        <p className="text-gray-600">Manage opportunities, quotations, and orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
