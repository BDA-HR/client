import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";


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

const PositionHeader = () => {
  return (
    <motion.div
      variants={itemVariants}
      className="mb-8 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <Users className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold text-black">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block"
            >
              <span className="bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                Position
              </span>{" "}
              Settings
            </motion.span>
          </h1>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PositionHeader;