import { motion } from "framer-motion";
import { BadgePlus, History } from "lucide-react";
import { Button } from "../../ui/button";

interface PeriodSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (status: "all" | "active" | "inactive") => void;
  onClearFilters: () => void;
  onAddPeriod: () => void;
  onViewHistory: () => void;
  totalItems: number;
  filteredItems: number;
}

const PeriodSearchFilters = ({
  searchTerm,
  setSearchTerm,
  onAddPeriod,
  onViewHistory,
  totalItems,
}: PeriodSearchFiltersProps) => {
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
            Search periods
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
              placeholder="Search periods by name, quarter, fiscal year, or status (active/inactive)..."
              className="block w-full md:w-1/2 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onAddPeriod}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 cursor-pointer"
          >
            <BadgePlus size={20} />
            Add New Period
          </Button>
          
          <Button
            onClick={onViewHistory}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer border-emerald-200"
          >
            <History size={18} />
            <span>View History ({totalItems})</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PeriodSearchFilters;