import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../ui/button";

// Define variants with proper TypeScript types
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

interface LeaveAppChainHeaderProps {
  leavePolicyName: string;
}


const LeavePolicyHeader: React.FC<LeaveAppChainHeaderProps> = ({ leavePolicyName }) => {
   const navigate = useNavigate();

   const handleBack = () => {
     navigate(-1);
   };
  return (
    <motion.div
      variants={itemVariants}
      className="mb-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Button>
            <div className="h-8 w-px bg-green-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-black tracking-tight">
                {leavePolicyName}
              </h1>
              {/* <p className="text-lg text-gray-600 mt-1">{position.nameAm}</p> */}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeavePolicyHeader;