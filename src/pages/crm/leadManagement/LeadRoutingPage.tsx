import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../../layout/layout';
// import LeadRouting from '../../../components/crm/leadManagement/components_old/LeadRouting';
import type { RoutingRule } from '../../../types/crm';

export default function LeadRoutingPage() {
  const navigate = useNavigate();

  const handleRoutingRulesUpdate = (rules: RoutingRule[]) => {
    // In a real app, this would save the routing rules
    showToast.success('Routing rules updated successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/crm/leads')}
            className="hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leads
          </Button>
        </div>
      </div>

      {/* Routing Component - render the content directly */}
      {/* <LeadRouting
        isOpen={true}
        onClose={() => navigate('/crm/leads')}
        onRulesUpdate={handleRoutingRulesUpdate}
      /> */}
    </motion.div>
  );
}
