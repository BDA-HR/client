import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { showToast } from '../../layout/layout';
import { mockOpportunities } from '../../data/crmMockData';
import SalesStats from '../../components/crm/salesManagement/components/SalesStats';
import SalesPipeline from '../../components/crm/salesManagement/components/SalesPipeline';
import SalesFilters from '../../components/crm/salesManagement/components/SalesFilters';
import OpportunityForm from '../../components/crm/salesManagement/components/OpportunityForm';
import SalesForecasting from '../../components/crm/salesManagement/components/SalesForecasting';
import type { Opportunity } from '../../types/crm';

interface FilterState {
  searchTerm: string;
  stage: string;
  owner: string;
  amountRange: string;
  probability: string;
  dateRange: string;
}

export default function SalesManagement() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    stage: 'all',
    owner: 'all',
    amountRange: 'all',
    probability: 'all',
    dateRange: 'all'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'pipeline' | 'list' | 'forecast'>('pipeline');

  // Filter opportunities based on current filters
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = 
      opportunity.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesStage = filters.stage === 'all' || opportunity.stage === filters.stage;
    const matchesOwner = filters.owner === 'all' || opportunity.assignedTo === filters.owner;
    
    const matchesAmount = filters.amountRange === 'all' || (() => {
      switch (filters.amountRange) {
        case 'small': return opportunity.amount < 50000;
        case 'medium': return opportunity.amount >= 50000 && opportunity.amount < 200000;
        case 'large': return opportunity.amount >= 200000;
        default: return true;
      }
    })();
    
    const matchesProbability = filters.probability === 'all' || (() => {
      switch (filters.probability) {
        case 'low': return opportunity.probability < 30;
        case 'medium': return opportunity.probability >= 30 && opportunity.probability < 70;
        case 'high': return opportunity.probability >= 70;
        default: return true;
      }
    })();
    
    const matchesDate = filters.dateRange === 'all' || (() => {
      const oppDate = new Date(opportunity.expectedCloseDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filters.dateRange) {
        case 'this-month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return oppDate >= monthStart && oppDate <= monthEnd;
        case 'this-quarter':
          const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
          return oppDate >= quarterStart && oppDate <= quarterEnd;
        case 'overdue':
          return oppDate < today;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStage && matchesOwner && matchesAmount && matchesProbability && matchesDate;
  });

  const handleAddOpportunity = (opportunityData: Partial<Opportunity>) => {
    const opportunity: Opportunity = {
      ...opportunityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Opportunity;
    
    setOpportunities([...opportunities, opportunity]);
    showToast.success('Opportunity added successfully');
  };

  const handleEditOpportunity = (opportunityData: Partial<Opportunity>) => {
    if (selectedOpportunity) {
      const updatedOpportunities = opportunities.map(opp => 
        opp.id === selectedOpportunity.id 
          ? { ...opp, ...opportunityData, updatedAt: new Date().toISOString() }
          : opp
      );
      setOpportunities(updatedOpportunities);
      setSelectedOpportunity(null);
      showToast.success('Opportunity updated successfully');
    }
  };

  const handleStageChange = (opportunityId: string, newStage: Opportunity['stage']) => {
    const updatedOpportunities = opportunities.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, stage: newStage, updatedAt: new Date().toISOString() }
        : opp
    );
    setOpportunities(updatedOpportunities);
    showToast.success(`Opportunity moved to ${newStage}`);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      stage: 'all',
      owner: 'all',
      amountRange: 'all',
      probability: 'all',
      dateRange: 'all'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600">Track deals and manage your sales pipeline</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'pipeline' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('forecast')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'forecast' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Forecast
            </button>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* Stats */}
      <SalesStats opportunities={opportunities} />

      {/* Filters */}
      <SalesFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        totalCount={opportunities.length}
        filteredCount={filteredOpportunities.length}
      />

      {/* Content based on view mode */}
      {viewMode === 'pipeline' && (
        <SalesPipeline
          opportunities={filteredOpportunities}
          onStageChange={handleStageChange}
          onEdit={(opportunity) => {
            setSelectedOpportunity(opportunity);
            setIsEditDialogOpen(true);
          }}
        />
      )}

      {viewMode === 'forecast' && (
        <SalesForecasting opportunities={filteredOpportunities} />
      )}

      {/* Add Opportunity Form */}
      <OpportunityForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddOpportunity}
        mode="add"
      />

      {/* Edit Opportunity Form */}
      <OpportunityForm
        opportunity={selectedOpportunity}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedOpportunity(null);
        }}
        onSubmit={handleEditOpportunity}
        mode="edit"
      />
    </motion.div>
  );
}