import { motion } from "framer-motion";
import LeavePolicyHeader from './LeavePolicyHeader';
import LeavePolicySearchFilters from './LeavePolicySearchFilter';
import LeavePolicyCard from "./LeavePolicyCard";
import type { LeavePolicyListDto } from '../../../../../types/hr/leavepolicy';

interface LeavePolicySectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  leavePolicies: LeavePolicyListDto[];
  onEdit: (policy: LeavePolicyListDto) => void;
  onDelete: (policy: LeavePolicyListDto) => void;
  onAddClick: () => void;
}

const LeavePolicySection: React.FC<LeavePolicySectionProps> = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  leavePolicies,
  onEdit,
  onDelete,
  onAddClick
}) => {
  return (
    <>
      {/* Leave Policy Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <LeavePolicyHeader />
      </motion.div>

      {/* Search and Filters Section for Leave Policies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6"
      >
        <LeavePolicySearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          leavePolicyData={leavePolicies}
          onAddClick={onAddClick}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </motion.div>

      {/* Leave Policies Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6"
      >
        {leavePolicies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No leave policies found matching your search.
            </div>
            <p className="text-gray-400 mt-2">
              Try adjusting your search terms or add a new leave policy.
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {leavePolicies.map((policy) => (
              <LeavePolicyCard
                key={policy.id}
                leavePolicy={policy}
                viewMode={viewMode}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default LeavePolicySection;