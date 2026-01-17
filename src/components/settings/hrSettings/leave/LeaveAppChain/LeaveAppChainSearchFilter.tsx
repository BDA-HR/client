import React from "react";
import { motion } from "framer-motion";
import {  BadgePlus } from "lucide-react";
import { Button } from "../../../../ui/button";

interface LeaveAppChainSearchFiltersProps {
 
  onAddClick: () => void;
}

const LeaveAppChainSearchFilters: React.FC<LeaveAppChainSearchFiltersProps> = ({

  onAddClick,
}) => {
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <Button
          onClick={onAddClick}
          size="sm"
          className="flex cursor-pointer items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto"
        >
          <BadgePlus className="h-4 w-4" />
          Add New
        </Button>
      </div>
    </motion.div>
  );
};

export default LeaveAppChainSearchFilters;