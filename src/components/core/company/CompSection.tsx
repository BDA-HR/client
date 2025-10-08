import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon } from 'lucide-react';
import { companyService } from '../../../services/core/compservice';
import type { CompListDto, UUID } from '../../../types/core/comp';
import AddCompModal from './AddCompModal';
import EditCompModal from './EditCompModal';
import DeleteCompDialog from './DeleteCompModal';
import CompList from './CompList';

interface CompSectionProps {
  onClick?: (companyId: UUID) => void;
}

const CompSection: React.FC<CompSectionProps> = ({ onClick }) => {
  const [companies, setCompanies] = useState<CompListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState<CompListDto | null>(null);
  const [deleteCompany, setDeleteCompany] = useState<CompListDto | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const companiesData = await companyService.getAllCompanies();
      setCompanies(companiesData);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
      setError('Failed to load companies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddCompany = async (companyData: { name: string; nameAm: string }) => {
    try {
      const newCompany = await companyService.createCompany(companyData);
      setCompanies((prev) => [...prev, newCompany]);
      setError(null);
    } catch (err) {
      console.error('Failed to create company:', err);
      setError('Failed to create company. Please try again.');
      throw err;
    }
  };

  const handleEditCompany = async (updatedCompany: CompListDto) => {
    try {
      const result = await companyService.updateCompany(updatedCompany);
      setCompanies((prev) =>
        prev.map((comp) => (comp.id === result.id ? result : comp))
      );
      setEditCompany(null);
      setError(null);
    } catch (err) {
      console.error('Failed to update company:', err);
      setError('Failed to update company. Please try again.');
      throw err;
    }
  };

  const handleDeleteCompany = async (companyId: UUID) => {
    try {
      await companyService.deleteCompany(companyId);
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
      setDeleteCompany(null);
      setError(null);
    } catch (err) {
      console.error('Failed to delete company:', err);
      setError('Failed to delete company. Please try again.');
    }
  };

  const handleViewBranches = (companyId: UUID) => {
    if (onClick) {
      onClick(companyId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Moved up with negative margin */}
      <div className="flex justify-between items-center -mt-4"> {/* Added negative margin-top */}
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:text-white"
        >
          Companies
        </motion.h1>
        
        <AddCompModal 
          onAddCompany={handleAddCompany}
        />
      </div>

      {/* Error message for API errors */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {error.includes("load") ? (
                <>
                  Failed to load Companies.{" "}
                  <button
                    onClick={fetchCompanies}
                    className="underline hover:text-red-800 font-semibold focus:outline-none"
                  >
                    Try again
                  </button>{" "}
                  later.
                </>
              ) : error.includes("create") ? (
                "Failed to create company. Please try again."
              ) : error.includes("update") ? (
                "Failed to update company. Please try again."
              ) : error.includes("delete") ? (
                "Failed to delete company. Please try again."
              ) : (
                error
              )}
            </span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {/* No companies message - Show when not loading and companies array is empty */}
      {!loading && companies.length === 0 && !error && (
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
      {!loading && companies.length > 0 && (
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