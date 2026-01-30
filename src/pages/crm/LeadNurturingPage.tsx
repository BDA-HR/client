import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import LeadNurturing from '../../components/crm/leadManagement/components/LeadNurturing';

export default function LeadNurturingPage() {
  const navigate = useNavigate();

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

      {/* Nurturing Component - render the content directly */}
      <LeadNurturing
        isOpen={true}
        onClose={() => navigate('/crm/leads')}
      />
    </motion.div>
  );
}