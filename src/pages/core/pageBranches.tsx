import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import BranchTable from "../../components/core/branch/BranchTable";
import AddHeader from "../../components/core/branch/AddHeader";
import {
  useBranches,
  useCompanyBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
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
  const companyId = searchParams.get("companyId");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use React Query hooks based on companyId
  const {
    data: branches = [],
    isLoading: isLoadingBranches,
    isError: branchesError,
    error: branchesErrorData,
    refetch: refetchBranches,
  } = companyId ? useCompanyBranches(companyId as UUID) : useBranches();

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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddBranch = async (branchData: AddBranchDto) => {
    try {
      await createBranchMutation.mutateAsync(branchData, {
        onSuccess: () => {
          toast.success("Branch added successfully!");
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Failed to add branch. Please try again.";
          toast.error(errorMessage);
          throw error;
        },
      });
    } catch (error) {
      // Error is already handled in the mutation
      throw error;
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
        branchType: updatedBranch.branchType || BranchType["0"],
        branchStat: updatedBranch.branchStat || BranchStat["0"],
        compId: updatedBranch.compId as UUID,
        rowVersion: updatedBranch.rowVersion,
      };

      await updateBranchMutation.mutateAsync(updateData, {
        onSuccess: () => {
          toast.success("Branch updated successfully!");
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Failed to update branch. Please try again.";
          toast.error(errorMessage);
          throw error;
        },
      });
    } catch (error) {
      throw error;
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

        await updateBranchMutation.mutateAsync(updateData, {
          onSuccess: () => {
            toast.success(`Branch status updated to ${getStatusText(status)}`);
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message ||
              "Failed to update branch status. Please try again.";
            toast.error(errorMessage);
          },
        });
      }
    } catch (error) {
      console.error("Error updating branch status:", error);
    }
  };

  const handleBranchDelete = async (id: string) => {
    try {
      await deleteBranchMutation.mutateAsync(id as UUID, {
        onSuccess: () => {
          toast.success("Branch deleted successfully!");
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Failed to delete branch. Please try again.";
          toast.error(errorMessage);
        },
      });
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  const reloadBranches = () => {
    refetchBranches();
  };

  // Get error message from React Query error
  const getErrorMessage = () => {
    if (branchesError) {
      const errorMessage =
        (branchesErrorData as any)?.response?.data?.message ||
        "Failed to load branches. Please try again later.";
      return errorMessage;
    }
    return null;
  };

  const errorMessage = getErrorMessage();

  // Get mutation error message
  const getMutationErrorMessage = () => {
    if (createBranchMutation.isError) {
      return (
        createBranchMutation.error?.message ||
        "Failed to add branch. Please try again."
      );
    }
    if (updateBranchMutation.isError) {
      return (
        updateBranchMutation.error?.message ||
        "Failed to update branch. Please try again."
      );
    }
    if (deleteBranchMutation.isError) {
      return (
        deleteBranchMutation.error?.message ||
        "Failed to delete branch. Please try again."
      );
    }
    return null;
  };

  const mutationErrorMessage = getMutationErrorMessage();

  if (isLoadingBranches) {
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

      {/* Error Message for loading branches */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              Failed to load branches.{" "}
              <button
                onClick={reloadBranches}
                className="underline hover:text-red-800 font-semibold focus:outline-none"
              >
                Try again
              </button>
            </span>
            <button
              onClick={() => refetchBranches()}
              className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Error Message for mutations */}
      {mutationErrorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{mutationErrorMessage}</span>
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
