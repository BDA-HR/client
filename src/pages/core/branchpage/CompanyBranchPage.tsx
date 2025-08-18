import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { companies } from '../../../data/company';
import AddCompanyForm from '../../../components/core/AddCompanyForm';
import { ArrowLeft, Plus } from 'lucide-react';
import BranchTable from '../../../components/core/BranchTable';
import type { Branch } from '../../../types/branches';
import { dummyBranches } from '../../../types/branches';
import BranchHeader from '../../../components/core/BranchHeader';
import { AddBranchModal } from '../../../components/core/AddBranchModal';
import AddHierarchy from '../../../components/core/AddHierarchy';
const CompanyBranchesPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>(dummyBranches);

  const company = companies.find(c => c.id === Number(companyId)) || companies[0];
  const selectedCompany = company.name;

  const handleCompanyFormClick = () => setShowCompanyForm(false);
  const handleCompanyBackClick = () => setShowCompanyForm(true);

  const handleAddBranch = (branchName: string) => {
    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      branchId: `BR-${branches.length + 100}`,
      name: branchName,
      code: `NEW${branches.length + 1}`,
      type: "Local",
      status: "active",
      address: "To be added",
      city: "To be added",
      state: "",
      postalCode: "",
      country: "USA",
      phone: "",
      email: "",
      manager: "To be assigned",
      openingDate: new Date().toISOString().split('T')[0],
      totalEmployees: 0,
      operatingHours: "9:00 AM - 5:00 PM",
      facilities: [],
      services: [],
      annualRevenue: 0,
      currency: "USD",
      taxId: "",
      bankAccounts: [],
      customerSatisfaction: 0,
      lastAuditDate: "",
      auditScore: 0,
      keyPerformanceIndicators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: "system"
    };
    setBranches([...branches, newBranch]);
    setIsAddModalOpen(false);
  };

  const handleBranchUpdate = (updatedBranch: Branch) => {
    setBranches(branches.map(b => b.id === updatedBranch.id ? updatedBranch : b));
  };

  const handleBranchStatusChange = (id: string, status: Branch['status']) => {
    setBranches(branches.map(b => b.id === id ? {...b, status} : b));
  };

  const handleBranchDelete = (id: string) => {
    setBranches(branches.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      ></motion.div>

      {showCompanyForm ? (
        <>
          <AddCompanyForm onClick={handleCompanyFormClick} />
          <div className="pt-6">
            <AddHierarchy />
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={handleCompanyBackClick}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Companies
            </Button>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </div>
          
          <BranchHeader companyName={selectedCompany} />
          
          <div className="pt-4">
            <BranchTable 
              branches={branches} 
              currentPage={1}
              totalPages={1}
              totalItems={branches.length}
              onPageChange={() => {}}
              onBranchUpdate={handleBranchUpdate}
              onBranchStatusChange={handleBranchStatusChange}
              onBranchDelete={handleBranchDelete}
              onAddBranch={handleAddBranch}
            />
          </div>
        </div>
      )}

      <AddBranchModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBranch={handleAddBranch}
      />
    </div>
  );
};

export default CompanyBranchesPage;