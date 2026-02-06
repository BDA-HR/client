import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AssetsHeader from '../../components/finance/assets/AssetsHeader';
import { AssetsSearchFilters } from '../../components/finance/assets/AssetsSearchFilters';
import { QuickActions } from '../../components/finance/assets/QuickActions';
import AssetsTable from '../../components/finance/assets/AssetsTable';
import AddAssetModal from '../../components/finance/assets/AddAssetsModal';
import type { AssetFormData } from '../../components/finance/assets/AddAssetsModal';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Sample assets data in state
  const [assetsData, setAssetsData] = useState<AssetItem[]>([
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
  ]);

  // Calculate asset statistics
  const calculateAssetStats = () => {
    const totalAssets = assetsData.length;
    const totalValue = assetsData.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalAcquisitionCost = assetsData.reduce((sum, asset) => sum + asset.acquisitionCost, 0);
    const activeAssets = assetsData.filter(asset => asset.status === 'Active' || asset.status === 'In Use').length;
    const maintenanceDue = assetsData.filter(asset => 
      asset.nextMaintenance && new Date(asset.nextMaintenance) <= new Date(new Date().setDate(new Date().getDate() + 30))
    ).length;
    
    return {
      totalAssets,
      totalValue: Math.round(totalValue),
      totalAcquisitionCost: Math.round(totalAcquisitionCost),
      activeAssets,
      maintenanceDue,
      netDepreciation: Math.round(totalAcquisitionCost - totalValue)
    };
  };

  const stats = calculateAssetStats();

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
    if (window.confirm(`Are you sure you want to dispose of asset ${item.tag} - ${item.name}?`)) {
      setAssetsData(prev => prev.map(asset => 
        asset.id === item.id ? { ...asset, status: 'Disposed' as const, currentValue: 0 } : asset
      ));
    }
  };

  const handleMaintenance = (item: AssetItem) => {
    console.log('Maintenance:', item);

    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 3);
    setAssetsData(prev => prev.map(asset => 
      asset.id === item.id ? { ...asset, nextMaintenance: nextDate.toISOString().split('T')[0] } : asset
    ));
  };

  const handleTransfer = (item: AssetItem) => {
    console.log('Transfer:', item);
    // Implement transfer logic
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleExport = () => {
    console.log('Export data');
    // Create CSV content
    const headers = ['Tag', 'Name', 'Category', 'Department', 'Location', 'Acquisition Date', 'Acquisition Cost', 'Current Value', 'Status', 'Serial Number'];
    const csvContent = [
      headers.join(','),
      ...filteredAssets.map(asset => [
        asset.tag,
        `"${asset.name}"`,
        asset.category,
        asset.department,
        `"${asset.location}"`,
        asset.acquisitionDate,
        asset.acquisitionCost,
        asset.currentValue,
        asset.status,
        asset.serialNumber
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `assets-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddAsset = () => {
    setIsAddModalOpen(true);
  };

  const handleAddNewAsset = async (assetData: AssetFormData) => {
    console.log('Adding new asset:', assetData);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const lastTagNumber = assetsData
          .map(asset => parseInt(asset.tag.split('-')[1]))
          .filter(num => !isNaN(num))
          .sort((a, b) => b - a)[0] || 10;
        
        const newId = Math.max(...assetsData.map(a => a.id)) + 1;
        const newTag = `ASSET-${String(lastTagNumber + 1).padStart(3, '0')}`;
        
        const newAsset: AssetItem = {
          id: newId,
          tag: newTag,
          name: assetData.name,
          category: assetData.category,
          department: assetData.department,
          location: assetData.location,
          acquisitionDate: assetData.acquisitionDate,
          acquisitionCost: assetData.acquisitionCost,
          currentValue: assetData.acquisitionCost,
          depreciationMethod: assetData.depreciationMethod,
          usefulLife: assetData.usefulLife,
          status: assetData.status,
          serialNumber: assetData.serialNumber,
          nextMaintenance: assetData.nextMaintenance || ''
        };
        
        // Add the new asset to the state
        setAssetsData(prev => [newAsset, ...prev]);
        
        resolve({ 
          data: { 
            message: 'Asset added successfully!', 
            asset: newAsset
          } 
        });
      }, 1500);
    });
  };

  const handleScheduleMaintenance = () => {
    console.log('Schedule maintenance clicked');
    // Open maintenance modal
  };

  const handleTransferAsset = () => {
    console.log('Transfer asset clicked');
  };

  const handleRunDepreciation = () => {
    console.log('Run depreciation clicked');
    const updatedAssets = assetsData.map(asset => {
      if (asset.status === 'Disposed') return asset;
      
      let depreciation = 0;
      const acquisitionDate = new Date(asset.acquisitionDate);
      const today = new Date();
      const monthsOwned = (today.getFullYear() - acquisitionDate.getFullYear()) * 12 + 
                         (today.getMonth() - acquisitionDate.getMonth());
      
      switch (asset.depreciationMethod) {
        case 'Straight-line':
          depreciation = (asset.acquisitionCost / (asset.usefulLife * 12)) * monthsOwned;
          break;
        case 'Declining Balance':
          const rate = (1 / asset.usefulLife) * 1.5;
          depreciation = asset.acquisitionCost * rate * (monthsOwned / 12);
          break;
        case 'Units of Production':
          depreciation = (asset.acquisitionCost / (asset.usefulLife * 12)) * monthsOwned;
          break;
      }
      
      const newValue = Math.max(0, asset.acquisitionCost - depreciation);
      
      return { ...asset, currentValue: Math.round(newValue) };
    });
    
    setAssetsData(updatedAssets);
  };

  const handleGenerateReport = () => {
    console.log('Generate report clicked');
    // Open report generation
  };

  const handleExportData = () => {
    console.log('Export data clicked');
    handleExport();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AssetsHeader stats={stats} />
      
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

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAsset={handleAddNewAsset}
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

      {/* Asset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-800">Total Assets</p>
              <p className="text-2xl font-bold text-indigo-900">{stats.totalAssets}</p>
            </div>
            <div className="p-3 bg-indigo-200 rounded-lg">
              <svg className="h-6 w-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-700">
            {stats.activeAssets} active assets
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-800">Total Value</p>
              <p className="text-2xl font-bold text-emerald-900">${stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-lg">
              <svg className="h-6 w-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-emerald-700">
            Acquisition: ${stats.totalAcquisitionCost.toLocaleString()}
          </div>
        </div>

        <div className={`bg-gradient-to-r p-5 rounded-xl border ${stats.netDepreciation > 0 ? 'from-amber-50 to-amber-100 border-amber-200' : 'from-emerald-50 to-emerald-100 border-emerald-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Net Depreciation</p>
              <p className={`text-2xl font-bold ${stats.netDepreciation > 0 ? 'text-amber-900' : 'text-emerald-900'}`}>
                ${Math.abs(stats.netDepreciation).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stats.netDepreciation > 0 ? 'bg-amber-200' : 'bg-emerald-200'}`}>
              <svg className={`h-6 w-6 ${stats.netDepreciation > 0 ? 'text-amber-700' : 'text-emerald-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className={`mt-2 text-xs ${stats.netDepreciation > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {stats.netDepreciation > 0 ? 'Depreciated value' : 'Appreciated value'}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Maintenance Due</p>
              <p className="text-2xl font-bold text-blue-900">{stats.maintenanceDue}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <svg className="h-6 w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-700">
            Within next 30 days
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Avg. Asset Life</p>
              <p className="text-2xl font-bold text-purple-900">
                {Math.round(assetsData.reduce((sum, asset) => sum + asset.usefulLife, 0) / assetsData.length)}y
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <svg className="h-6 w-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-purple-700">
            Average useful life
          </div>
        </div>
      </div>

      {/* Asset Categories Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from(new Set(assetsData.map(a => a.category))).map(category => {
            const categoryAssets = assetsData.filter(a => a.category === category);
            const categoryValue = categoryAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
            const categoryCount = categoryAssets.length;
            
            return (
              <div key={category} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{category}</h4>
                  <span className="text-sm font-medium text-indigo-600">{categoryCount} assets</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Total value: ${categoryValue.toLocaleString()}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(categoryCount / assetsData.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default PageAssets;