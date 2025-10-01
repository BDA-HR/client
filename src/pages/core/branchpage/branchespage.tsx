import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import BranchTable from "../../../components/core/branch/BranchTable";
import AddBranchModal from "../../../components/core/branch/AddBranchModal";
import AddHeader from "../../../components/core/branch/AddHeader";
import { branchService } from "../../../services/core/branchservice";
import type {
  BranchListDto,
  AddBranchDto,
  EditBranchDto,
} from "../../../types/core/branch";
import type { UUID } from "../../../types/core/branch";

interface BranchesPageProps {
  onBack?: () => void;
}

const BranchesPage: React.FC<BranchesPageProps> = () => {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");

  const [branches, setBranches] = useState<BranchListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (companyId) {
      loadCompanyBranches(companyId);
    } else {
      loadAllBranches();
    }
  }, [companyId]);

  // Helper functions for search
  const getStatusText = (status: string): string => {
    // Handle both string numbers and actual numbers
    const statusNum = parseInt(status);

    switch (statusNum) {
      case 0:
        return "Active";
      case 1:
        return "Inactive";
      case 2:
        return "Under Construction";
      default:
        // If it's not a number, return the original string
        return status || "Unknown";
    }
  };

  const getBranchTypeText = (branchType: string): string => {
    // Handle both string numbers and actual numbers
    const typeNum = parseInt(branchType);

    switch (typeNum) {
      case 0:
        return "Head Office";
      case 1:
        return "Regional";
      case 2:
        return "Local";
      case 3:
        return "Virtual";
      default:
        // If it's not a number, return the original string
        return branchType || "Unknown";
    }
  };

  // Filter branches based on search term - FIXED VERSION
  const filteredBranches = useMemo(() => {
    console.log("Searching for:", searchTerm);
    console.log("Total branches:", branches.length);

    if (!searchTerm.trim()) {
      return branches;
    }

    const lowercasedSearch = searchTerm.toLowerCase().trim();

    const filtered = branches.filter((branch) => {
      // Safely check basic fields with null checks
      const basicMatch =
        (branch.name && branch.name.toLowerCase().includes(lowercasedSearch)) ||
        (branch.nameAm &&
          branch.nameAm.toLowerCase().includes(lowercasedSearch)) ||
        (branch.code && branch.code.toLowerCase().includes(lowercasedSearch)) ||
        (branch.location &&
          branch.location.toLowerCase().includes(lowercasedSearch));

      // Check status text - handle both string and number status
      const statusValue = branch.branchStat?.toString() || "";
      const statusText = getStatusText(statusValue);
      const statusMatch = statusText.toLowerCase().includes(lowercasedSearch);

      // Check branch type text - handle both string and number type
      const branchTypeValue = branch.branchType?.toString() || "";
      const branchTypeText = getBranchTypeText(branchTypeValue);
      const branchTypeMatch = branchTypeText
        .toLowerCase()
        .includes(lowercasedSearch);

      const matches = basicMatch || statusMatch || branchTypeMatch;

      if (matches) {
        console.log("Match found:", branch.name, {
          name: branch.name,
          status: statusText,
          type: branchTypeText,
          searchTerm: lowercasedSearch,
        });
      }

      return matches;
    });

    console.log("Filtered results:", filtered.length);
    console.log("Sample of filtered:", filtered.slice(0, 3));
    return filtered;
  }, [branches, searchTerm]);

  // Alternative simpler search approach - uncomment if the above doesn't work
  /*
  const filteredBranches = useMemo(() => {
    if (!searchTerm.trim()) return branches;

    const lowercasedSearch = searchTerm.toLowerCase().trim();
    
    return branches.filter((branch) => {
      // Convert all searchable fields to lowercase strings and check
      const searchableText = [
        branch.name || '',
        branch.nameAm || '',
        branch.code || '',
        branch.location || '',
        getStatusText(branch.branchStat?.toString() || ''),
        getBranchTypeText(branch.branchType?.toString() || '')
      ].join(' ').toLowerCase();

      return searchableText.includes(lowercasedSearch);
    });
  }, [branches, searchTerm]);
  */

  // Paginate filtered branches
  const paginatedBranches = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBranches.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBranches, currentPage]);

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);

  // Debug effect to see branch data
  useEffect(() => {
    if (branches.length > 0) {
      console.log("Sample branch data:", branches[0]);
      console.log(
        "All branch names:",
        branches.map((b) => b.name)
      );
      console.log(
        "All branch statuses:",
        branches.map((b) => ({
          name: b.name,
          status: b.branchStat,
          statusText: getStatusText(b.branchStat?.toString() || ""),
        }))
      );
    }
  }, [branches]);

  const loadAllBranches = async () => {
    try {
      setLoading(true);
      const allBranches = await branchService.getAllBranches();
      console.log("Loaded all branches:", allBranches);
      setBranches(allBranches);
      setError(null);
    } catch (err) {
      const errorMessage = "Failed to load branches. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error loading branches:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyBranches = async (compId: string) => {
    try {
      setLoading(true);
      const companyBranches = await branchService.getCompanyBranches(
        compId as UUID
      );
      console.log("Loaded company branches:", companyBranches);
      setBranches(companyBranches);
      setError(null);
    } catch (err) {
      const errorMessage =
        "Failed to load company branches. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error loading company branches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (term: string) => {
    console.log("Search term changed:", term);
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddBranch = async (branchData: AddBranchDto) => {
    try {
      const newBranch = await branchService.createBranch(branchData);
      setBranches([...branches, newBranch]);
      setError(null);
      toast.success("Branch added successfully!");
    } catch (err) {
      const errorMessage = "Failed to add branch. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error adding branch:", err);
      throw err;
    }
  };

  const handleBranchUpdate = async (updatedBranch: BranchListDto) => {
    try {
      const updateData: EditBranchDto = {
        id: updatedBranch.id as UUID,
        name: updatedBranch.name,
        nameAm: updatedBranch.nameAm,
        code: updatedBranch.code,
        location: updatedBranch.location,
        dateOpened: new Date().toISOString(),
        branchType: "REGULAR",
        branchStat: updatedBranch.branchStat,
        compId: updatedBranch.comp as UUID,
        rowVersion: updatedBranch.rowVersion,
      };

      const updated = await branchService.updateBranch(updateData);
      setBranches(branches.map((b) => (b.id === updated.id ? updated : b)));
      setError(null);
      toast.success("Branch updated successfully!");
    } catch (err) {
      const errorMessage = "Failed to update branch. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating branch:", err);
      throw err;
    }
  };

  const handleBranchStatusChange = async (id: string, status: string) => {
    try {
      const branch = branches.find((b) => b.id === id);
      if (branch) {
        const updateData: EditBranchDto = {
          id: branch.id as UUID,
          name: branch.name,
          nameAm: branch.nameAm,
          code: branch.code,
          location: branch.location,
          dateOpened: new Date().toISOString(),
          branchType: "REGULAR",
          branchStat: status,
          compId: branch.comp as UUID,
          rowVersion: branch.rowVersion,
        };

        const updated = await branchService.updateBranch(updateData);
        setBranches(branches.map((b) => (b.id === updated.id ? updated : b)));
        setError(null);
        toast.success(`Branch status updated to ${getStatusText(status)}`);
      }
    } catch (err) {
      const errorMessage = "Failed to update branch status. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating branch status:", err);
    }
  };

  const handleBranchDelete = async (id: string) => {
    try {
      await branchService.deleteBranch(id as UUID);
      setBranches(branches.filter((b) => b.id !== id));
      setError(null);
      toast.success("Branch deleted successfully!");
    } catch (err) {
      const errorMessage = "Failed to delete branch. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting branch:", err);
    }
  };

  const showAddBranchWarning = () => {
    const warningMessage = "Please select a company first";
    setError(warningMessage);
    toast(warningMessage, {
      icon: "⚠️",
      style: {
        background: "#ffcc00",
        color: "#000",
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:text-white"
          >
            {companyId ? `Company Branches` : "Branches for All Companies"}
          </motion.h1>
        </div>
      </motion.div>

      <AddHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAddBranch={companyId ? handleAddBranch : undefined}
        defaultCompanyId={companyId as UUID}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 p-2 cursor-pointer"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      <BranchTable
        branches={paginatedBranches}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredBranches.length}
        onPageChange={handlePageChange}
        onBranchUpdate={handleBranchUpdate}
        onBranchStatusChange={handleBranchStatusChange}
        onBranchDelete={handleBranchDelete}
      />
    </div>
  );
};

export default BranchesPage;
