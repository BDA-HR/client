import { motion } from "framer-motion";
import { useState } from "react";
import { mockOpportunities } from '../../../data/crmMockData';
import type { Opportunity } from '../../../types/crm';
import { default as SalesSection } from './components/SalesSection';

const SalesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  
  // Modal states
  const [isAddOpportunityModalOpen, setIsAddOpportunityModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  // Filter opportunities based on search term
  const filteredOpportunities = opportunities.filter(
    (opportunity) =>
      opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.stage.toLowerCase().includes(searchTerm.toLowerCase())
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
    // Navigate to opportunity detail page
    window.location.href = `/crm/opportunity/${opportunity.id}`;
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6 min-h-screen"
    >
      <SalesSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        opportunities={filteredOpportunities}
        onEdit={handleOpportunityEdit}
        onDelete={handleOpportunityDelete}
        onView={handleViewOpportunity}
        onAddClick={handleOpenAddOpportunityModal}
        onAddOpportunity={handleAddOpportunity}
        isAddOpportunityModalOpen={isAddOpportunityModalOpen}
        onCloseAddOpportunityModal={handleCloseAddOpportunityModal}
        onOpenAddOpportunityModal={handleOpenAddOpportunityModal}
        selectedOpportunity={selectedOpportunity}
        formMode={formMode}
        onEditOpportunity={handleEditOpportunity}
      />
    </motion.section>
  );
};

export default SalesManagement;