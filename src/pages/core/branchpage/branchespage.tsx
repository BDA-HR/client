import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import BranchTable from '../../../components/core/branch/BranchTable';
import { AddBranchModal } from '../../../components/core/branch/AddBranchModal';
import { branchService } from '../../../services/core/branchservice';
import type { BranchListDto, AddBranchDto, EditBranchDto } from '../../../types/core/branch';

const BranchesPage = () => {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('companyId');
  
  const [branches, setBranches] = useState<BranchListDto[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyName = branches.length > 0 ? branches[0].comp : '';

  useEffect(() => {
    if (companyId) {
      loadCompanyBranches(companyId);
    } else {
      loadAllBranches();
    }
  }, [companyId]);

  const loadAllBranches = async () => {
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

  const loadCompanyBranches = async (compId: string) => {
    try {
      setLoading(true);
      const companyBranches = await branchService.getCompanyBranches(compId);
      setBranches(companyBranches);
      setError(null);
    } catch (err) {
      setError('Failed to load company branches. Please try again later.');
      console.error('Error loading company branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBranch = async (branchData: AddBranchDto) => {
    try {
      const newBranch = await branchService.createBranch(branchData);
      setBranches([...branches, newBranch]);
      setIsAddModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to add branch. Please try again.');
      console.error('Error adding branch:', err);
      throw err;
    }
  };

  const handleBranchUpdate = async (updatedBranch: BranchListDto) => {
    try {
      // Convert to EditBranchDto for the update
      const updateData: EditBranchDto = {
        id: updatedBranch.id,
        name: updatedBranch.name,
        nameAm: updatedBranch.nameAm,
        code: updatedBranch.code,
        location: updatedBranch.location,
        dateOpened: new Date().toISOString(), 
        branchType: 'REGULAR',
        branchStat: updatedBranch.branchStat,
        compId: updatedBranch.comp,
        rowVersion: updatedBranch.rowVersion
      };
      
      const updated = await branchService.updateBranch(updateData);
      setBranches(branches.map(b => b.id === updated.id ? updated : b));
      setError(null);
    } catch (err) {
      setError('Failed to update branch. Please try again.');
      console.error('Error updating branch:', err);
      throw err;
    }
  };

  const handleBranchStatusChange = async (id: string, status: string) => {
    try {
      const branch = branches.find(b => b.id === id);
      if (branch) {
        const updateData: EditBranchDto = {
          id: branch.id,
          name: branch.name,
          nameAm: branch.nameAm,
          code: branch.code,
          location: branch.location,
          dateOpened: new Date().toISOString(),
          branchType: 'REGULAR',
          branchStat: status,
          compId: branch.comp,
          rowVersion: branch.rowVersion
        };
        
        const updated = await branchService.updateBranch(updateData);
        setBranches(branches.map(b => b.id === updated.id ? updated : b));
        setError(null);
      }
    } catch (err) {
      setError('Failed to update branch status. Please try again.');
      console.error('Error updating branch status:', err);
    }
  };

  const handleBranchDelete = async (id: string) => {
    try {
      await branchService.deleteBranch(id);
      setBranches(branches.filter(b => b.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete branch. Please try again.');
      console.error('Error deleting branch:', err);
    }
  };

  const openAddModal = () => {
    if (!companyId) {
      setError('Please select a company first');
      return;
    }
    setIsAddModalOpen(true);
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
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:text-white"
          >
            {companyId ? `Branches for ${companyName || 'Company'}` : 'All Branches'}
          </motion.h1>
          {companyId && (
            <p className="text-gray-600 mt-1">
              {`Viewing branches for ${companyName || 'this company'}`}
            </p>
          )}
        </div>
        <Button 
          onClick={openAddModal}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 cursor-pointer"
          disabled={!companyId}
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
        branches={branches} 
        currentPage={1}
        totalPages={1}
        totalItems={branches.length}
        onPageChange={() => {}}
        onBranchUpdate={handleBranchUpdate}
        onBranchStatusChange={handleBranchStatusChange}
        onBranchDelete={handleBranchDelete}
      />

      <AddBranchModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBranch={handleAddBranch}
        defaultCompanyId={companyId || undefined}
        companyName={companyName}
      />
    </div>
  );
};

export default BranchesPage;