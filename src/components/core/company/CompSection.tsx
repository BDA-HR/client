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

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const companiesData = await companyService.getAllCompanies();
        setCompanies(companiesData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
        setError('Failed to load companies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
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