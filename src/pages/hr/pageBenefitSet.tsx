import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import BenefitSetHeader from '../../components/hr/benefit/BenefitSetHeader';
import BenefitSetCard from '../../components/hr/benefit/BenefitSetCard';
import BenefitSearchFilters from '../../components/hr/benefit/BenefitSearchFilter';
import AddBenefitModal from '../../components/hr/benefit/AddBenfitModal';
import EditBenefitSetModal from '../../components/hr/benefit/EditBenefitSetModal';
import DeleteBenefitModal from '../../components/hr/benefit/DeleteBenefitModal';
import type { UUID } from '../../types/hr/benefit';

// Types based on your DTOs
interface BenefitSetListDto {
  id: UUID;
  name: string;
  benefit: number;
  benefitStr: string;
  rowVersion?: string;
}

interface BenefitSetAddDto {
  name: string;
  benefitValue: number;
}

interface BenefitSetModDto {
  id: UUID;
  name: string;
  benefitValue: number;
  rowVersion: string;
}

// Mock service functions
const benefitSetService = {
  getBenefitSets: async (): Promise<BenefitSetListDto[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1' as UUID,
            name: 'Health Insurance',
            benefit: 5000,
            benefitStr: '5,000',
            rowVersion: '1'
          },
          {
            id: '2' as UUID,
            name: 'Transport Allowance',
            benefit: 2000,
            benefitStr: '2,000',
            rowVersion: '1'
          },
          {
            id: '3' as UUID,
            name: 'Housing Allowance',
            benefit: 8000,
            benefitStr: '8,000',
            rowVersion: '1'
          }
        ]);
      }, 500);
    });
  },

  createBenefitSet: async (data: BenefitSetAddDto): Promise<BenefitSetListDto> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36).substr(2, 9) as UUID,
          name: data.name,
          benefit: data.benefitValue,
          benefitStr: data.benefitValue.toLocaleString(),
          rowVersion: '1'
        });
      }, 500);
    });
  },

  updateBenefitSet: async (data: BenefitSetModDto): Promise<BenefitSetListDto> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: data.id,
          name: data.name,
          benefit: data.benefitValue,
          benefitStr: data.benefitValue.toLocaleString(),
          rowVersion: data.rowVersion
        });
      }, 500);
    });
  },

  deleteBenefitSet: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Deleted benefit set:', id);
        resolve();
      }, 500);
    });
  }
};

const PageBenefitSet: React.FC = () => {
  const navigate = useNavigate();
  const [benefitSets, setBenefitSets] = useState<BenefitSetListDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBenefitSet, setEditingBenefitSet] = useState<BenefitSetListDto | null>(null);
  const [deletingBenefitSet, setDeletingBenefitSet] = useState<BenefitSetListDto | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load benefit sets on component mount
  useEffect(() => {
    loadBenefitSets();
  }, []);

  const loadBenefitSets = async () => {
    try {
      setLoading(true);
      const data = await benefitSetService.getBenefitSets();
      setBenefitSets(data);
    } catch (error) {
      console.error('Error loading benefit sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (data: BenefitSetAddDto) => {
    try {
      const newBenefitSet = await benefitSetService.createBenefitSet(data);
      setBenefitSets(prev => [...prev, newBenefitSet]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding benefit set:', error);
    }
  };

  const handleEditSubmit = async (data: BenefitSetModDto) => {
    try {
      const updatedBenefitSet = await benefitSetService.updateBenefitSet(data);
      setBenefitSets(prev => prev.map(set => 
        set.id === updatedBenefitSet.id ? updatedBenefitSet : set
      ));
      setEditingBenefitSet(null);
    } catch (error) {
      console.error('Error updating benefit set:', error);
    }
  };

  const handleDeleteConfirm = async (benefitSet: BenefitSetListDto) => {
    try {
      setDeletingId(benefitSet.id);
      await benefitSetService.deleteBenefitSet(benefitSet.id);
      setBenefitSets(prev => prev.filter(set => set.id !== benefitSet.id));
      setDeletingBenefitSet(null);
    } catch (err) {
      console.error('Error deleting benefit set:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (benefitSet: BenefitSetListDto) => {
    setDeletingBenefitSet(benefitSet);
  };

  // Filter benefit sets based on search term
  const filteredBenefitSets = benefitSets.filter(benefitSet =>
    benefitSet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefitSet.benefitStr.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6"
    >
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header Component */}
      <BenefitSetHeader
        benefitSets={benefitSets}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Search Filters Component */}
      <BenefitSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        benefitSets={benefitSets}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      {/* Benefit Sets Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
      }>
        {filteredBenefitSets.map((benefitSet) => (
          <BenefitSetCard
            key={benefitSet.id}
            benefitSet={benefitSet}
            onEdit={() => setEditingBenefitSet(benefitSet)}
            onDelete={() => handleDeleteClick(benefitSet)}
            isDeleting={deletingId === benefitSet.id}
            viewMode={viewMode}
          />
        ))}
      </div>

      {filteredBenefitSets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12 bg-white rounded-lg border border-gray-200"
        >
          <div className="p-3 rounded-full bg-gray-100 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Benefit Sets Found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No benefit sets match your search.' : 'Get started by creating the first benefit set for your organization.'}
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Benefit Set
          </Button>
        </motion.div>
      )}

      {/* Add Benefit Modal */}
      <AddBenefitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBenefit={handleAddSubmit}
      />

      {/* Edit Benefit Set Modal */}
      <EditBenefitSetModal
        isOpen={!!editingBenefitSet}
        onClose={() => setEditingBenefitSet(null)}
        onSave={handleEditSubmit}
        benefitSet={editingBenefitSet}
      />

      {/* Delete Benefit Set Modal */}
      <DeleteBenefitModal
        isOpen={!!deletingBenefitSet}
        onClose={() => setDeletingBenefitSet(null)}
        onConfirm={handleDeleteConfirm}
        benefitSet={deletingBenefitSet}
      />
    </motion.section>
  );
};

export default PageBenefitSet;