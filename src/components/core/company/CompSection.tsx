import { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon } from 'lucide-react';
import AddCompModal from './AddCompModal';
import EditCompModal from './EditCompModal';
import DeleteCompDialog from './DeleteCompModal';
import CompList from './CompList';
import { 
  useCompanies, 
  useCreateCompany, 
  useUpdateCompany, 
  useDeleteCompany 
} from '../../../services/core/company/company.queries';
import type { CompListDto, UUID, AddCompDto } from '../../../types/core/comp';

interface CompSectionProps {
  onClick?: (companyId: UUID) => void;
}

const CompSection: React.FC<CompSectionProps> = ({ onClick }) => {
  const [editCompany, setEditCompany] = useState<CompListDto | null>(null);
  const [deleteCompany, setDeleteCompany] = useState<CompListDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // React Query hooks
  const { 
    data: companies = [], 
    isLoading, 
    error: queryError,
    refetch 
  } = useCompanies();

  const createCompanyMutation = useCreateCompany({
    onError: (error) => {
      setFormError(error.message || 'Failed to create company. Please try again.');
    }
  });

  const updateCompanyMutation = useUpdateCompany({
    onError: (error) => {
      setFormError(error.message || 'Failed to update company. Please try again.');
    }
  });

  const deleteCompanyMutation = useDeleteCompany({
    onError: (error) => {
      setFormError(error.message || 'Failed to delete company. Please try again.');
    }
  });

  const handleAddCompany = async (companyData: { name: string; nameAm: string; code?: string }) => {
    setFormError(null);
    
    // Create proper AddCompDto object based on your actual AddCompDto type
    const newCompanyData: AddCompDto = {
      ...companyData,
    };
    
    // No try/catch needed - error is handled by mutation's onError
    await createCompanyMutation.mutateAsync(newCompanyData);
  };

  const handleEditCompany = async (updatedCompany: CompListDto) => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await updateCompanyMutation.mutateAsync(updatedCompany);
    setEditCompany(null);
  };

  const handleDeleteCompany = async (companyId: UUID) => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await deleteCompanyMutation.mutateAsync(companyId);
    setDeleteCompany(null);
  };

  const handleViewBranches = (companyId: UUID) => {
    if (onClick) {
      onClick(companyId);
    }
  };

  // Combine query error and form error for display
  const displayError = queryError?.message || formError;

  return (
    <div className="space-y-6">
      {/* Header - Moved up with negative margin */}
      <div className="flex justify-between items-center -mt-6">
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:text-white"
        >
          Companies
        </motion.h1>
        
        <AddCompModal 
          onAddCompany={handleAddCompany}
        />
      </div>

      {/* Error message for API errors */}
      {displayError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {displayError.includes("load") ? (
                <>
                  Failed to load Companies.{" "}
                  <button
                    onClick={() => refetch()}
                    className="underline hover:text-red-800 font-semibold focus:outline-none"
                    disabled={isLoading}
                  >
                    Try again
                  </button>
                </>
              ) : displayError.includes("create") ? (
                "Failed to create company. Please try again."
              ) : displayError.includes("update") ? (
                "Failed to update company. Please try again."
              ) : displayError.includes("delete") ? (
                "Failed to delete company. Please try again."
              ) : (
                displayError
              )}
            </span>
            <button
              onClick={() => {
                setFormError(null);
                // Clear query error by refetching
                if (queryError) refetch();
              }}
              className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {/* No companies message - Show when not loading and companies array is empty */}
      {!isLoading && companies.length === 0 && !displayError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-red-100 border-l-4 border-yellow-500 rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-yellow-800 font-medium">No Companies Found</h3>
              <p className="text-yellow-700 text-sm mt-1">
                There are currently no companies in the system. Please add a company to get started.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Companies list */}
      {!isLoading && companies.length > 0 && (
        <CompList 
          companies={companies}
          onEditCompany={setEditCompany}
          onDeleteCompany={setDeleteCompany}
          onViewBranches={handleViewBranches}
        />
      )}

      {/* Edit Modal */}
      <EditCompModal 
        company={editCompany}
        isOpen={!!editCompany}
        onClose={() => setEditCompany(null)}
        onSave={handleEditCompany}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCompDialog
        company={deleteCompany}
        isOpen={!!deleteCompany}
        onClose={() => setDeleteCompany(null)}
        onConfirm={handleDeleteCompany}
      />
    </div>
  );
};

export default CompSection;