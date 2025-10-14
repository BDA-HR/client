import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import BenefitSetHeader from '../../components/hr/settings/BenefitSetHeader';
import BenefitSetCard from '../../components/hr/settings/BenefitSetCard';
import BenefitSearchFilters from '../../components/hr/settings/BenefitSearchFilter';
// Types based on your DTOs
interface BenefitSetListDto {
  id: string;
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
  id: string;
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
            id: '1',
            name: 'Health Insurance',
            benefit: 5000,
            benefitStr: '5,000',
            rowVersion: '1'
          },
          {
            id: '2',
            name: 'Transport Allowance',
            benefit: 2000,
            benefitStr: '2,000',
            rowVersion: '1'
          },
          {
            id: '3',
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
          id: Math.random().toString(36).substr(2, 9),
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this benefit set?')) return;
    
    try {
      setDeletingId(id);
      await benefitSetService.deleteBenefitSet(id);
      setBenefitSets(prev => prev.filter(set => set.id !== id));
    } catch (err) {
      console.error('Error deleting benefit set:', err);
    } finally {
      setDeletingId(null);
    }
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
            onDelete={() => handleDelete(benefitSet.id)}
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <BenefitSetModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          title="Add Benefit Set"
        />
      )}

      {/* Edit Modal */}
      {editingBenefitSet && (
        <BenefitSetModal
          isOpen={!!editingBenefitSet}
          onClose={() => setEditingBenefitSet(null)}
          onSubmit={handleEditSubmit}
          title="Edit Benefit Set"
          initialData={{
            id: editingBenefitSet.id,
            name: editingBenefitSet.name,
            benefitValue: editingBenefitSet.benefit,
            rowVersion: editingBenefitSet.rowVersion || ''
          }}
        />
      )}
    </motion.section>
  );
};

// Modal Component for Add/Edit
interface BenefitSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  initialData?: BenefitSetModDto;
}

const BenefitSetModal: React.FC<BenefitSetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    benefitValue: initialData?.benefitValue || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onSubmit({
        ...formData,
        id: initialData.id,
        rowVersion: initialData.rowVersion
      });
    } else {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benefit Value (ETB)
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              value={formData.benefitValue}
              onChange={(e) => setFormData({ ...formData, benefitValue: parseFloat(e.target.value) || 0 })}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer"
            >
              {initialData ? 'Update' : 'Add'} Benefit Set
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PageBenefitSet;