import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '../../../components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import BranchTable from '../../../components/core/branch/BranchTable';
import AddBranchModal from '../../../components/core/branch/AddBranchModal';
import { branchService } from '../../../services/core/branchservice';
import type { BranchListDto, AddBranchDto, EditBranchDto } from '../../../types/core/branch';
import type { UUID } from '../../../types/core/branch';

interface BranchesPageProps {
  onBack?: () => void;
}

const BranchesPage: React.FC<BranchesPageProps> = ({ onBack }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const companyId = searchParams.get('companyId');

  const [branches, setBranches] = useState<BranchListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');

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
      const errorMessage = 'Failed to load branches. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyBranches = async (compId: string) => {
    try {
      setLoading(true);
      const companyBranches = await branchService.getCompanyBranches(compId as UUID);
      setBranches(companyBranches);

      if (companyBranches.length > 0) {
        const name = companyBranches[0].compAm || companyBranches[0].comp;
        setCompanyName(name || 'this company');
      } else {
        setCompanyName('this company');
      }

      setError(null);
    } catch (err) {
      const errorMessage = 'Failed to load company branches. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading company branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBranch = async (branchData: AddBranchDto) => {
    try {
      const newBranch = await branchService.createBranch(branchData);
      setBranches([...branches, newBranch]);
      setError(null);
      toast.success('Branch added successfully!');
    } catch (err) {
      const errorMessage = 'Failed to add branch. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error adding branch:', err);
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
        branchType: 'REGULAR',
        branchStat: updatedBranch.branchStat,
        compId: updatedBranch.comp as UUID,
        rowVersion: updatedBranch.rowVersion,
      };

      const updated = await branchService.updateBranch(updateData);
      setBranches(branches.map((b) => (b.id === updated.id ? updated : b)));
      setError(null);
      toast.success('Branch updated successfully!');
    } catch (err) {
      const errorMessage = 'Failed to update branch. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating branch:', err);
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
          branchType: 'REGULAR',
          branchStat: status,
          compId: branch.comp as UUID,
          rowVersion: branch.rowVersion,
        };

        const updated = await branchService.updateBranch(updateData);
        setBranches(branches.map((b) => (b.id === updated.id ? updated : b)));
        setError(null);
        toast.success(`Branch status updated to ${status}`);
      }
    } catch (err) {
      const errorMessage = 'Failed to update branch status. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating branch status:', err);
    }
  };

  const handleBranchDelete = async (id: string) => {
    try {
      await branchService.deleteBranch(id as UUID);
      setBranches(branches.filter((b) => b.id !== id));
      setError(null);
      toast.success('Branch deleted successfully!');
    } catch (err) {
      const errorMessage = 'Failed to delete branch. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error deleting branch:', err);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const showAddBranchWarning = () => {
    const warningMessage = 'Please select a company first';
    setError(warningMessage);
    toast(warningMessage, {
      icon: '⚠️',
      style: {
        background: '#ffcc00',
        color: '#000',
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
      <Button
        onClick={handleBack}
        variant="outline"
        className="cursor-pointer flex items-center gap-2 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Companies
      </Button>

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
            {companyId ? `Branches for ${companyName}` : 'Branches for All Companies'}
          </motion.h1>
          {companyId ? (
            <p className="text-gray-600 mt-1">{`Viewing branches for ${companyName}`}</p>
          ) : (
            <p className="text-gray-600 mt-1">Viewing branches across all companies</p>
          )}
        </div>

        {/* Render Add Branch Modal button only if companyId is available */}
        {companyId ? (
          <AddBranchModal onAddBranch={handleAddBranch} defaultCompanyId={companyId as UUID} />
        ) : (
          <Button
            onClick={showAddBranchWarning}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 cursor-pointer flex items-center gap-2"
          >
            <Plus size={16} />
            Add Branch
          </Button>
        )}
      </motion.div>

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
        branches={branches}
        currentPage={1}
        totalPages={1}
        totalItems={branches.length}
        onPageChange={() => {}}
        onBranchUpdate={handleBranchUpdate}
        onBranchStatusChange={handleBranchStatusChange}
        onBranchDelete={handleBranchDelete}
      />
    </div>
  );
};

export default BranchesPage;