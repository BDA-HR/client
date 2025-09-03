import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import BranchTable from '../../../components/core/company/BranchTable';
import { AddBranchModal } from '../../../components/core/company/AddBranchModal';
import { branchService } from '../../../services/core/branchservice';
import type { Branch } from '../../../types/core/branch';

const BranchesPage = () => {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('companyId');
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    if (companyId) {
      setFilteredBranches(branches.filter(branch => branch.compId === companyId));
    } else {
      setFilteredBranches(branches);
    }
  }, [branches, companyId]);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const allBranches = await branchService.getAllBranches();
      setBranches(allBranches);
      setError(null);
    } catch (err) {
      setError('Failed to load branches. Please try again later.');
      console.error('Error loading branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBranch = async (branchData: Omit<Branch, 'id'>) => {
    try {
      const newBranch = await branchService.createBranch(branchData.compId, branchData);
      setBranches([...branches, newBranch]);
      setIsAddModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to add branch. Please try again.');
      console.error('Error adding branch:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleBranchUpdate = async (updatedBranch: Branch) => {
    try {
      await branchService.updateBranch(updatedBranch.compId, updatedBranch.id, updatedBranch);
      setBranches(branches.map(b => b.id === updatedBranch.id ? updatedBranch : b));
      setError(null);
    } catch (err) {
      setError('Failed to update branch. Please try again.');
      console.error('Error updating branch:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleBranchDelete = async (id: string, compId: string) => {
    try {
      await branchService.deleteBranch(compId, id);
      setBranches(branches.filter(b => b.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete branch. Please try again.');
      console.error('Error deleting branch:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error && branches.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:text-white"
          >
            {companyId ? `Branches for Company ${companyId}` : 'All Branches'}
          </motion.h1>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button 
            onClick={() => window.location.reload()} 
            className="ml-4 text-red-800 underline"
          >
            Try Again
          </button>
        </div>
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
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:text-white"
          >
            {companyId ? `Branches for Company ${companyId}` : 'All Branches'}
          </motion.h1>
          {companyId && (
            <p className="text-gray-600 mt-1">
              Viewing branches specific to this company
            </p>
          )}
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </motion.div>

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

      <BranchTable 
        branches={filteredBranches} 
        currentPage={1}
        totalPages={1}
        totalItems={filteredBranches.length}
        onPageChange={() => {}}
        onBranchUpdate={handleBranchUpdate}
        onBranchStatusChange={(id, status) => {
          const branch = branches.find(b => b.id === id);
          if (branch) {
            handleBranchUpdate({...branch, branchStat: status});
          }
        }}
        onBranchDelete={handleBranchDelete}
      />

      <AddBranchModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBranch={handleAddBranch}
        defaultCompanyId={companyId || undefined}
      />
    </div>
  );
};

export default BranchesPage;