import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      {/* Header - Always rendered */}
      <div className="flex justify-between items-center">
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="absolute top-0 right-0 p-2"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {/* Companies List - Only show when not loading */}
      {!loading && (
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