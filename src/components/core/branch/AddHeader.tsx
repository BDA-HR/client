import { motion } from "framer-motion";
import type { AddBranchDto } from "../../../types/core/branch";
import AddBranchModal from "./AddBranchModal";

interface AddHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddBranch?: (branch: AddBranchDto) => void;
  selectedBranchId?: string;
  defaultCompanyId?: string;
}

const AddHeader = ({
  searchTerm,
  onSearchChange,
  onAddBranch,
  defaultCompanyId,
}: AddHeaderProps) => {
  const handleAddBranch = (branch: AddBranchDto) => {
    if (onAddBranch) {
      onAddBranch(branch);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-lg shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search branches
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Search branches "
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {onAddBranch && defaultCompanyId && (
            <AddBranchModal
              onAddBranch={handleAddBranch}
              defaultCompanyId={defaultCompanyId}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AddHeader;