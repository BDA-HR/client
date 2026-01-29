import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AssetsHeader from '../../components/finance/assets/AssetsHeader';
import { AssetsSearchFilters } from '../../components/finance/assets/AssetsSearchFilters';
import { QuickActions } from '../../components/finance/assets/QuickActions';
import AssetsTable from '../../components/finance/assets/AssetsTable';

interface AssetItem {
  id: number;
  tag: string;
  name: string;
  category: string;
  department: string;
  location: string;
  acquisitionDate: string;
  acquisitionCost: number;
  currentValue: number;
  depreciationMethod: string;
  usefulLife: number;
  status: 'Active' | 'In Use' | 'Idle' | 'Under Maintenance' | 'Disposed';
  serialNumber: string;
  nextMaintenance: string;
}

function PageAssets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sample assets data
  const assetsData: AssetItem[] = [
    { id: 1, tag: 'ASSET-001', name: 'HP ProBook Laptop', category: 'Computers', department: 'IT', location: 'Floor 3, Room 302', acquisitionDate: '2023-01-15', acquisitionCost: 1200, currentValue: 850, depreciationMethod: 'Straight-line', usefulLife: 3, status: 'In Use', serialNumber: 'SN-HP001234', nextMaintenance: '2024-03-15' },
    { id: 2, tag: 'ASSET-002', name: 'Canon Office Printer', category: 'Equipment', department: 'Administration', location: 'Reception Area', acquisitionDate: '2022-06-10', acquisitionCost: 3500, currentValue: 2100, depreciationMethod: 'Declining Balance', usefulLife: 5, status: 'Active', serialNumber: 'SN-CN789456', nextMaintenance: '2024-02-28' },
    { id: 3, tag: 'ASSET-003', name: 'Company Vehicle - Toyota', category: 'Vehicles', department: 'Sales', location: 'Parking Lot A', acquisitionDate: '2021-03-22', acquisitionCost: 28000, currentValue: 18500, depreciationMethod: 'Units of Production', usefulLife: 5, status: 'In Use', serialNumber: 'SN-TY987654', nextMaintenance: '2024-01-30' },
    { id: 4, tag: 'ASSET-004', name: 'Industrial Machinery', category: 'Machinery', department: 'Manufacturing', location: 'Production Floor', acquisitionDate: '2020-11-05', acquisitionCost: 150000, currentValue: 98000, depreciationMethod: 'Straight-line', usefulLife: 10, status: 'Under Maintenance', serialNumber: 'SN-IM555888', nextMaintenance: '2024-02-10' },
    { id: 5, tag: 'ASSET-005', name: 'Office Furniture Set', category: 'Furniture', department: 'HR', location: 'HR Office', acquisitionDate: '2023-08-14', acquisitionCost: 4500, currentValue: 4300, depreciationMethod: 'Straight-line', usefulLife: 7, status: 'Active', serialNumber: 'SN-OF112233', nextMaintenance: '' },
    { id: 6, tag: 'ASSET-006', name: 'Accounting Software License', category: 'Software', department: 'Finance', location: 'Virtual', acquisitionDate: '2023-12-01', acquisitionCost: 8500, currentValue: 8000, depreciationMethod: 'Straight-line', usefulLife: 3, status: 'Active', serialNumber: 'SN-SW445566', nextMaintenance: '' },
    { id: 7, tag: 'ASSET-007', name: 'Conference Room Projector', category: 'Equipment', department: 'Operations', location: 'Conference Room A', acquisitionDate: '2022-09-18', acquisitionCost: 1800, currentValue: 1200, depreciationMethod: 'Declining Balance', usefulLife: 4, status: 'Idle', serialNumber: 'SN-PR778899', nextMaintenance: '2024-03-01' },
    { id: 8, tag: 'ASSET-008', name: 'Warehouse Racking System', category: 'Equipment', department: 'Operations', location: 'Warehouse B', acquisitionDate: '2021-05-30', acquisitionCost: 25000, currentValue: 18500, depreciationMethod: 'Straight-line', usefulLife: 8, status: 'Active', serialNumber: 'SN-WR334455', nextMaintenance: '2024-04-15' },
    { id: 9, tag: 'ASSET-009', name: 'Old Desktop Computers', category: 'Computers', department: 'IT', location: 'Storage Room', acquisitionDate: '2019-07-12', acquisitionCost: 3000, currentValue: 0, depreciationMethod: 'Straight-line', usefulLife: 4, status: 'Disposed', serialNumber: 'SN-DC667788', nextMaintenance: '' },
    { id: 10, tag: 'ASSET-010', name: 'Security Camera System', category: 'Equipment', department: 'Security', location: 'Entrance & Exits', acquisitionDate: '2023-03-25', acquisitionCost: 12000, currentValue: 11500, depreciationMethod: 'Straight-line', usefulLife: 5, status: 'In Use', serialNumber: 'SN-SC990011', nextMaintenance: '2024-05-20' },
  ];

  // Filter data based on search term and filters
  const filteredAssets = assetsData.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || asset.status === filterStatus;
    const matchesDepartment = filterDepartment === 'All' || asset.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Handler functions
  const handleViewDetails = (item: AssetItem) => {
    console.log('View details:', item);
    // Implement view details logic
  };

  const handleEdit = (item: AssetItem) => {
    console.log('Edit:', item);
    // Implement edit logic
  };

  const handleDelete = (item: AssetItem) => {
    console.log('Delete/dispose:', item);
    // Implement delete/dispose logic
  };

  const handleMaintenance = (item: AssetItem) => {
    console.log('Maintenance:', item);
    // Implement maintenance logic
  };

  const handleTransfer = (item: AssetItem) => {
    console.log('Transfer:', item);
    // Implement transfer logic
  };

  const handleAddNew = () => {
    console.log('Add new asset');
    // Implement add new asset logic
  };

  const handleExport = () => {
    console.log('Export data');
    // Implement export logic
  };

  const handleAddAsset = () => {
    console.log('Add asset clicked');
    // Open add asset modal
  };

  const handleScheduleMaintenance = () => {
    console.log('Schedule maintenance clicked');
    // Open maintenance modal
  };

  const handleTransferAsset = () => {
    console.log('Transfer asset clicked');
    // Open transfer modal
  };

  const handleRunDepreciation = () => {
    console.log('Run depreciation clicked');
    // Run depreciation calculation
  };

  const handleGenerateReport = () => {
    console.log('Generate report clicked');
    // Open report generation
  };

  const handleExportData = () => {
    console.log('Export data clicked');
    // Handle export
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AssetsHeader />      
      <QuickActions
        onAddAsset={handleAddAsset}
        onScheduleMaintenance={handleScheduleMaintenance}
        onTransferAsset={handleTransferAsset}
        onRunDepreciation={handleRunDepreciation}
        onGenerateReport={handleGenerateReport}
        onExportData={handleExportData}
      />

      <AssetsSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        onAddNew={handleAddNew}
        onExport={handleExport}
      />

      <AssetsTable
        data={filteredAssets}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredAssets.length / 10)}
        totalItems={filteredAssets.length}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMaintenance={handleMaintenance}
        onTransfer={handleTransfer}
      />

    </motion.div>
  );
}

export default PageAssets;