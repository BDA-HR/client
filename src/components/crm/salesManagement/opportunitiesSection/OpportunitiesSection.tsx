import { motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../ui/button";
import { mockOpportunities } from '../../../../data/crmMockData';
import type { Opportunity } from '../../../../types/crm';
import SalesHeader from '../components/SalesHeader';
import SalesFilters from '../components/SalesFilters';
import SalesTable from '../components/SalesTable';
import OpportunityForm from '../components/opportunities/OpportunityForm';
import DeleteOpportunityModal from '../DeleteOpportunityModal';

const OpportunitiesSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [isAddOpportunityModalOpen, setIsAddOpportunityModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingOpportunity, setDeletingOpportunity] = useState<Opportunity | null>(null);

  const itemsPerPage = 10;

  // Filter opportunities based on search term
  const filteredOpportunities = opportunities.filter(
    (opportunity) =>
      opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredOpportunities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add new opportunity
  const handleAddOpportunity = (opportunityData: Partial<Opportunity>) => {
    const newOpportunity: Opportunity = {
      ...opportunityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Opportunity;
    setOpportunities([...opportunities, newOpportunity]);
    setIsAddOpportunityModalOpen(false);
  };

  // Edit opportunity
  const handleOpportunityEdit = (opportunityData: Partial<Opportunity>) => {
    if (selectedOpportunity) {
      const updatedOpportunities = opportunities.map(opp => 
        opp.id === selectedOpportunity.id 
          ? { ...opp, ...opportunityData, updatedAt: new Date().toISOString() }
          : opp
      );
      setOpportunities(updatedOpportunities);
    }
  };

  // Delete opportunity
  const handleOpportunityDelete = (opportunity: Opportunity) => {
    setOpportunities(opportunities.filter(opp => opp.id !== opportunity.id));
  };

  // Modal control
  const handleOpenAddOpportunityModal = () => {
    setFormMode('add');
    setSelectedOpportunity(null);
    setIsAddOpportunityModalOpen(true);
  };

  const handleCloseAddOpportunityModal = () => setIsAddOpportunityModalOpen(false);

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setFormMode('edit');
    setSelectedOpportunity(opportunity);
    setIsAddOpportunityModalOpen(true);
  };

  const handleViewOpportunity = (opportunity: Opportunity) => {
    window.location.href = `/crm/opportunity/${opportunity.id}`;
  };

  const handleDeleteOpportunity = (opportunity: Opportunity) => {
    setDeletingOpportunity(opportunity);
  };

  const handleConfirmDelete = () => {
    if (deletingOpportunity) {
      handleOpportunityDelete(deletingOpportunity);
      setDeletingOpportunity(null);
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-gray-600">Manage sales opportunities and track deals</p>
        </div>
        <Button 
          onClick={handleOpenAddOpportunityModal}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Opportunity
        </Button>
      </div>

      {/* Filters */}
      <SalesFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Table */}
      <SalesTable
        opportunities={paginatedOpportunities}
        onEdit={handleEditOpportunity}
        onDelete={handleDeleteOpportunity}
        onView={handleViewOpportunity}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Opportunity Form */}
      <OpportunityForm
        isOpen={isAddOpportunityModalOpen}
        onClose={handleCloseAddOpportunityModal}
        onSubmit={formMode === 'add' ? handleAddOpportunity : handleOpportunityEdit}
        opportunity={selectedOpportunity}
        mode={formMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteOpportunityModal
        isOpen={!!deletingOpportunity}
        onClose={() => setDeletingOpportunity(null)}
        onConfirm={handleConfirmDelete}
        opportunityName={deletingOpportunity?.name || ''}
      />
    </motion.section>
  );
};

export default OpportunitiesSection;
