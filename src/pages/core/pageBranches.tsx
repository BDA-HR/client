import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import BranchTable from "../../components/core/branch/BranchTable";
import AddHeader from "../../components/core/branch/AddHeader";
import { 
  useBranches, 
  useCreateBranch, 
  useUpdateBranch, 
  useDeleteBranch 
} from "../../services/core/branch/branch.queries";
import type {
  BranchListDto,
  AddBranchDto,
  EditBranchDto,
} from "../../types/core/branch";
import type { UUID } from "../../types/core/branch";
import { BranchType, BranchStat } from "../../types/core/enum";

interface BranchesPageProps {
  onBack?: () => void;
}

const BranchesPage: React.FC<BranchesPageProps> = () => {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId") as UUID | null;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // React Query hooks
  const { 
    data: branches = [], 
    isLoading, 
    error: queryError,
    refetch 
  } = useBranches(companyId ? { companyId } : undefined);

  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();
  const deleteBranchMutation = useDeleteBranch();

  // Helper functions for search
  const getStatusText = (status: string): string => {
    const statusNum = parseInt(status);
    switch (statusNum) {
      case 0:
        return "Active";
      case 1:
        return "Inactive";
      case 2:
        return "Under Construction";
      default:
        return status || "Unknown";
    }
  };

  const getBranchTypeText = (branchType: string): string => {
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
        return branchType || "Unknown";
    }
  };

  // Filter branches based on search term
  const filteredBranches = useMemo(() => {
    if (!searchTerm.trim()) {
      return branches;
    }

    const lowercasedSearch = searchTerm.toLowerCase().trim();

    return branches.filter((branch) => {
      const basicMatch =
        (branch.name && branch.name.toLowerCase().includes(lowercasedSearch)) ||
        (branch.nameAm && branch.nameAm.toLowerCase().includes(lowercasedSearch)) ||
        (branch.code && branch.code.toLowerCase().includes(lowercasedSearch)) ||
        (branch.location && branch.location.toLowerCase().includes(lowercasedSearch));

      const statusValue = branch.branchStat?.toString() || "";
      const statusText = getStatusText(statusValue);
      const statusMatch = statusText.toLowerCase().includes(lowercasedSearch);

      const branchTypeValue = branch.branchType?.toString() || "";
      const branchTypeText = getBranchTypeText(branchTypeValue);
      const branchTypeMatch = branchTypeText.toLowerCase().includes(lowercasedSearch);

      return basicMatch || statusMatch || branchTypeMatch;
    });
  }, [branches, searchTerm]);

  // Paginate filtered branches
  const paginatedBranches = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBranches.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBranches, currentPage]);

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddBranch = async (branchData: AddBranchDto) => {
    try {
      await createBranchMutation.mutateAsync(branchData);
      toast.success("Branch added successfully!");
    } catch (err) {
      const errorMessage = "Failed to add branch. Please try again.";
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
        dateOpened: new Date().toISOString(), // Consider preserving original date
        branchType: updatedBranch.branchType || BranchType["0"],
        branchStat: updatedBranch.branchStat || BranchStat["0"],
        compId: updatedBranch.compId as UUID,
        rowVersion: updatedBranch.rowVersion,
      };

      await updateBranchMutation.mutateAsync(updateData);
      toast.success("Branch updated successfully!");
    } catch (err) {
      const errorMessage = "Failed to update branch. Please try again.";
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
          branchType: branch.branchType || BranchType["0"],
          branchStat: status as BranchStat,
          compId: branch.compId as UUID,
          rowVersion: branch.rowVersion,
        };

        await updateBranchMutation.mutateAsync(updateData);
        toast.success(`Branch status updated to ${getStatusText(status)}`);
      }
    } catch (err) {
      const errorMessage = "Failed to update branch status. Please try again.";
      toast.error(errorMessage);
      console.error("Error updating branch status:", err);
    }
  };

  const handleBranchDelete = async (id: string) => {
    try {
      await deleteBranchMutation.mutateAsync(id as UUID);
      toast.success("Branch deleted successfully!");
    } catch (err) {
      const errorMessage = "Failed to delete branch. Please try again.";
      toast.error(errorMessage);
      console.error("Error deleting branch:", err);
    }
  };

  // Handle error display
  const errorMessage = useMemo(() => {
    if (queryError) {
      return queryError.message || "Failed to load branches. Please try again.";
    }
    return null;
  }, [queryError]);

  if (isLoading) {
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

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {errorMessage.includes("load") ? (
                <>
                  Failed to load branches.{" "}
                  <button
                    onClick={() => refetch()}
                    className="underline hover:text-red-800 font-semibold focus:outline-none"
                    disabled={isLoading}
                  >
                    Try again
                  </button>
                </>
              ) : (
                errorMessage
              )}
            </span>
            <button
              onClick={() => {}}
              className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Mutation Error Display */}
      {(createBranchMutation.error || updateBranchMutation.error || deleteBranchMutation.error) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {createBranchMutation.error?.message || 
               updateBranchMutation.error?.message || 
               deleteBranchMutation.error?.message}
            </span>
            <button
              onClick={() => {
                createBranchMutation.reset();
                updateBranchMutation.reset();
                deleteBranchMutation.reset();
              }}
              className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
            >
              ×
            </button>
          </div>
        </motion.div>
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
