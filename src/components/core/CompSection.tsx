import { useState } from 'react';
import { motion } from 'framer-motion';
import { companies as importedCompanies } from '../../data/company-branches';
import type { Company } from '../../data/company-branches';
import type { Branch } from '../../types/branches';
import AddCompModal from './AddCompModal';
import EditCompModal from './EditCompModal';
import CompList from './CompList';
import BranchView from './BranchView';

interface CompSectionProps {
  onClick: (companyId: number) => void;
}

const CompSection: React.FC<CompSectionProps> = ({ onClick }) => {
  const [companies, setCompanies] = useState<Company[]>(importedCompanies);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [viewingBranches, setViewingBranches] = useState<{companyId: number, branches: Branch[]} | null>(null);

  const handleAddCompany = (company: Company) => {
    setCompanies((prev) => [...prev, company]);
  };

  const handleEditCompany = (updatedCompany: Company) => {
    setCompanies((prev) =>
      prev.map((comp) => (comp.id === updatedCompany.id ? updatedCompany : comp))
    );
    setEditCompany(null);
  };

  const handleDeleteCompany = (companyId: number) => {
    setCompanies((prev) => prev.filter((c) => c.id !== companyId));
  };

  const handleViewBranches = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setViewingBranches({
        companyId,
        branches: company.branches || []
      });
      onClick(companyId);
    }
  };

  const handleBackToCompanies = () => {
    setViewingBranches(null);
  };

  if (viewingBranches) {
    const company = companies.find(c => c.id === viewingBranches.companyId);
    
    return (
      <BranchView 
        company={company}
        branches={viewingBranches.branches}
        onBack={handleBackToCompanies}
      />
    );
  }

  const nextId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
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
          nextId={nextId}
        />
      </div>

      {/* Companies List */}
      <CompList 
        companies={companies}
        onEditCompany={setEditCompany}
        onDeleteCompany={handleDeleteCompany}
        onViewBranches={handleViewBranches}
      />

      {/* Edit Modal */}
      <EditCompModal 
        company={editCompany}
        onSave={handleEditCompany}
        onClose={() => setEditCompany(null)}
      />
    </div>
  );
};

export default CompSection;