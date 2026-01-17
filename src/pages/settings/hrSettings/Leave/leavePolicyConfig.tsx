import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import LeavePolicyConfigSection from "../../../../components/settings/hrSettings/leave/LeavePolicyConfig/leavePolicyConfigSection";
import type { UUID } from "../../../../types/core/Settings/leavePolicyConfig";

 const LeavePolicyConfig: React.FC = () => {
    const { leavePolicyId } = useParams<{ leavePolicyId: string }>();
    const navigate = useNavigate();

    if (!leavePolicyId) {
      navigate("/settings/hr/leave");
      return null;
    }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6 min-h-screen"
    >
      <LeavePolicyConfigSection leavePolicyId={leavePolicyId as UUID} />
    </motion.section>
  );
};

export default LeavePolicyConfig;
