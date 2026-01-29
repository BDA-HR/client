import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { showToast } from '../../layout/layout';
import { mockCampaigns } from '../../data/crmMockData';
import CampaignStats from '../../components/crm/marketingAutomation/components/CampaignStats';
import CampaignList from '../../components/crm/marketingAutomation/components/CampaignList';
import CampaignFilters from '../../components/crm/marketingAutomation/components/CampaignFilters';
import CampaignForm from '../../components/crm/marketingAutomation/components/CampaignForm';
import AutomationRules from '../../components/crm/marketingAutomation/components/AutomationRules';
import LeadScoring from '../../components/crm/marketingAutomation/components/LeadScoring';
import type { Campaign } from '../../types/crm';

interface FilterState {
  searchTerm: string;
  type: string;
  status: string;
  dateRange: string;
  performance: string;
}

export default function MarketingAutomation() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    type: 'all',
    status: 'all',
    dateRange: 'all',
    performance: 'all'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'campaigns' | 'automation' | 'scoring'>('campaigns');

  // Filter campaigns based on current filters
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesType = filters.type === 'all' || campaign.type === filters.type;
    const matchesStatus = filters.status === 'all' || campaign.status === filters.status;
    
    const matchesDate = filters.dateRange === 'all' || (() => {
      const campaignDate = new Date(campaign.startDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filters.dateRange) {
        case 'active':
          const start = new Date(campaign.startDate);
          const end = new Date(campaign.endDate);
          return start <= now && end >= now;
        case 'this-month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return campaignDate >= monthStart && campaignDate <= monthEnd;
        case 'this-quarter':
          const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
          return campaignDate >= quarterStart && campaignDate <= quarterEnd;
        default: return true;
      }
    })();
    
    const matchesPerformance = filters.performance === 'all' || (() => {
      const conversionRate = campaign.metrics.sent > 0 
        ? (campaign.metrics.converted / campaign.metrics.sent) * 100 
        : 0;
      
      switch (filters.performance) {
        case 'high': return conversionRate > 5;
        case 'medium': return conversionRate >= 2 && conversionRate <= 5;
        case 'low': return conversionRate < 2;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesType && matchesStatus && matchesDate && matchesPerformance;
  });

  const handleAddCampaign = (campaignData: Partial<Campaign>) => {
    const campaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      automationRules: [],
      leadScoringRules: [],
      abTestVariants: [],
      conversionGoals: [],
      segmentIds: [],
      triggerConditions: []
    } as Campaign;
    
    setCampaigns([...campaigns, campaign]);
    showToast.success('Campaign created successfully');
  };

  const handleEditCampaign = (campaignData: Partial<Campaign>) => {
    if (selectedCampaign) {
      const updatedCampaigns = campaigns.map(campaign => 
        campaign.id === selectedCampaign.id 
          ? { ...campaign, ...campaignData }
          : campaign
      );
      setCampaigns(updatedCampaigns);
      setSelectedCampaign(null);
      showToast.success('Campaign updated successfully');
    }
  };

  const handleStatusChange = (campaignId: string, newStatus: Campaign['status']) => {
    const updatedCampaigns = campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: newStatus }
        : campaign
    );
    setCampaigns(updatedCampaigns);
    showToast.success(`Campaign ${newStatus.toLowerCase()}`);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      type: 'all',
      status: 'all',
      dateRange: 'all',
      performance: 'all'
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
          <h1 className="text-2xl font-bold text-gray-900">Marketing Automation</h1>
          <p className="text-gray-600">Create and manage automated marketing campaigns</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('campaigns')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'campaigns' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setViewMode('automation')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'automation' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Automation
            </button>
            <button
              onClick={() => setViewMode('scoring')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'scoring' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lead Scoring
            </button>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <CampaignStats campaigns={campaigns} />

      {/* Content based on view mode */}
      {viewMode === 'campaigns' && (
        <>
          {/* Filters */}
          <CampaignFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            totalCount={campaigns.length}
            filteredCount={filteredCampaigns.length}
          />

          {/* Campaign List */}
          <CampaignList
            campaigns={filteredCampaigns}
            onStatusChange={handleStatusChange}
            onEdit={(campaign) => {
              setSelectedCampaign(campaign);
              setIsEditDialogOpen(true);
            }}
          />
        </>
      )}

      {viewMode === 'automation' && (
        <AutomationRules campaigns={campaigns} />
      )}

      {viewMode === 'scoring' && (
        <LeadScoring />
      )}

      {/* Add Campaign Form */}
      <CampaignForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddCampaign}
        mode="add"
      />

      {/* Edit Campaign Form */}
      <CampaignForm
        campaign={selectedCampaign}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedCampaign(null);
        }}
        onSubmit={handleEditCampaign}
        mode="edit"
      />
    </motion.div>
  );
}