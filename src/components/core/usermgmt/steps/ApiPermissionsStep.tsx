import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Checkbox } from '../../../../components/ui/checkbox';

interface ApiPermissionsStepProps {
  initialData: {
    apiPermissions: string[];
  };
  onSubmit: (data: any) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  apiPermissions: Array<{
    id: string;
    name: string;
    mainPermissionId: string;
    action: string;
    resource: string;
    description?: string;
  }>;
  selectedPermissions: string[];
  mainPermissionsList?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export const ApiPermissionsStep: React.FC<ApiPermissionsStepProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
  apiPermissions,
  selectedPermissions,
  mainPermissionsList = [],
}) => {
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(initialData);
  const [expandedMainPermissions, setExpandedMainPermissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);


  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    apiPermissions.forEach(apiPermission => {
      if (!initialExpanded[apiPermission.mainPermissionId]) {
        initialExpanded[apiPermission.mainPermissionId] = false; 
      }
    });
    setExpandedMainPermissions(initialExpanded);
  }, [apiPermissions]);

  
  const getMainPermissionName = (permissionId: string) => {
    if (mainPermissionsList && mainPermissionsList.length > 0) {
      const mainPerm = mainPermissionsList.find(p => p.id === permissionId);
      return mainPerm?.name || permissionId.replace('perm_', '').replace(/_/g, ' ');
    }
    return permissionId.replace('perm_', '').replace(/_/g, ' ');
  };

  // Group detailed permissions by main permission
  const groupedApiPermissions = useMemo(() => {
    const grouped: Record<string, typeof apiPermissions> = {};
    
    apiPermissions.forEach(apiPermission => {
      if (!grouped[apiPermission.mainPermissionId]) {
        grouped[apiPermission.mainPermissionId] = [];
      }
      grouped[apiPermission.mainPermissionId].push(apiPermission);
    });
    
    return grouped;
  }, [apiPermissions]);

  // Filter detailed permissions based on search
  const filteredApiPermissions = useMemo(() => {
    const filtered: Record<string, typeof apiPermissions> = {};
    
    Object.entries(groupedApiPermissions).forEach(([mainPermId, groupPermissions]) => {
      const filteredGroupPermissions = groupPermissions.filter(apiPermission =>
        apiPermission.name.toLowerCase().includes(search.toLowerCase()) ||
        apiPermission.action.toLowerCase().includes(search.toLowerCase()) ||
        apiPermission.resource.toLowerCase().includes(search.toLowerCase()) ||
        (apiPermission.description && apiPermission.description.toLowerCase().includes(search.toLowerCase()))
      );
      
      if (filteredGroupPermissions.length > 0) {
        filtered[mainPermId] = filteredGroupPermissions;
      }
    });
    
    return filtered;
  }, [groupedApiPermissions, search]);

  const handleApiPermissionChange = (apiPermissionId: string) => {
    setFormData(prev => {
      if (prev.apiPermissions.includes(apiPermissionId)) {
        return {
          ...prev,
          apiPermissions: prev.apiPermissions.filter(id => id !== apiPermissionId)
        };
      } else {
        return {
          ...prev,
          apiPermissions: [...prev.apiPermissions, apiPermissionId]
        };
      }
    });
  };

  const handleSelectAllInGroup = (mainPermId: string, groupPermissions: typeof apiPermissions) => {
    const groupPermissionIds = groupPermissions.map(p => p.id);
    const allSelected = groupPermissionIds.every(id => formData.apiPermissions.includes(id));
    
    if (allSelected) {
      setFormData(prev => ({
        ...prev,
        apiPermissions: prev.apiPermissions.filter(id => !groupPermissionIds.includes(id))
      }));
    } else {
      const newApiPermissions = [...formData.apiPermissions];
      groupPermissionIds.forEach(id => {
        if (!newApiPermissions.includes(id)) {
          newApiPermissions.push(id);
        }
      });
      setFormData({ apiPermissions: newApiPermissions });
    }
  };

  const handleSelectAll = () => {
    const allIds = apiPermissions.map(p => p.id);
    setFormData({ apiPermissions: allIds });
  };

  const handleClearAll = () => {
    setFormData({ apiPermissions: [] });
  };

  const toggleMainPermissionExpansion = (mainPermId: string) => {
    setExpandedMainPermissions(prev => ({
      ...prev,
      [mainPermId]: !prev[mainPermId]
    }));
  };

  const expandAllMainPermissions = () => {
    const newExpanded: Record<string, boolean> = {};
    Object.keys(groupedApiPermissions).forEach(mainPermId => {
      newExpanded[mainPermId] = true;
    });
    setExpandedMainPermissions(newExpanded);
  };

  const collapseAllMainPermissions = () => {
    const newExpanded: Record<string, boolean> = {};
    Object.keys(groupedApiPermissions).forEach(mainPermId => {
      newExpanded[mainPermId] = false;
    });
    setExpandedMainPermissions(newExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (apiPermissions.length === 0) {
      alert('No detailed permissions available based on selected main permissions.');
      return;
    }
    
    await onSubmit(formData);
  };

  const getGroupSelectionStats = (groupPermissions: typeof apiPermissions) => {
    const selectedCount = groupPermissions.filter(p => formData.apiPermissions.includes(p.id)).length;
    const totalCount = groupPermissions.length;
    return { selectedCount, totalCount };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6"
    >
      {/* Header Section*/}
      <div className="mb-8 flex items-center gap-16">
        <h2 className="text-2xl font-bold text-gray-800">
          Access Permissions
        </h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-md">
          <span className="text-sm text-emerald-700 font-medium">
            <span className="font-bold">{selectedPermissions.length}</span> main permissions selected
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Search and Action Buttons - Side by side */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search detailed permissions by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 w-full"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={expandAllMainPermissions}
              disabled={isLoading || apiPermissions.length === 0}
              className="px-4"
            >
              Expand All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={collapseAllMainPermissions}
              disabled={isLoading || apiPermissions.length === 0}
              className="px-4"
            >
              Collapse All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={isLoading || apiPermissions.length === 0}
              className="px-4"
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={isLoading || formData.apiPermissions.length === 0}
              className="px-4"
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {Object.keys(filteredApiPermissions).length > 0 ? (
            Object.entries(filteredApiPermissions).map(([mainPermId, groupPermissions]) => {
              const isExpanded = expandedMainPermissions[mainPermId] || false;
              const stats = getGroupSelectionStats(groupPermissions);
              
              return (
                <div 
                  key={mainPermId} 
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
                >
                  {/* Main Permission Header - Clickable to expand/collapse */}
                  <div 
                    className="bg-gray-50 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleMainPermissionExpansion(mainPermId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-500">
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            {getMainPermissionName(mainPermId)}
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                              {groupPermissions.length} detailed permissions
                            </span>
                          </h3>
                          <div className="mt-2 ml-8">
                            <span className="text-sm text-gray-600">
                              {stats.selectedCount} of {stats.totalCount} selected
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleSelectAllInGroup(mainPermId, groupPermissions);
                        }}
                        disabled={isLoading}
                        className="px-4"
                      >
                        {stats.selectedCount === groupPermissions.length ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Detailed Permissions List - Collapsible */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-white"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupPermissions.map(apiPermission => (
                          <div 
                            key={apiPermission.id} 
                            className={`p-3 rounded-lg border transition-all duration-200 ${
                              formData.apiPermissions.includes(apiPermission.id) 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={`api-permission-${apiPermission.id}`}
                                checked={formData.apiPermissions.includes(apiPermission.id)}
                                onCheckedChange={() => handleApiPermissionChange(apiPermission.id)}
                                disabled={isLoading}
                                className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:text-white data-[state=checked]:border-green-600"
                              />
                              <div className="flex-1">
                                <div className="flex items-center h-full">
                                  <label
                                    htmlFor={`api-permission-${apiPermission.id}`}
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    {apiPermission.name}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-gray-500">No detailed permissions found matching your search.</p>
              {selectedPermissions.length === 0 && (
                <p className="text-sm mt-2 text-gray-400">Please select main permissions in Step 2 first.</p>
              )}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{selectedPermissions.length}</div>
              <div className="text-sm text-gray-600">Main Permissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formData.apiPermissions.length}</div>
              <div className="text-sm text-gray-600">Detailed Permissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {selectedPermissions.length + formData.apiPermissions.length}
              </div>
              <div className="text-sm text-gray-600">Total Permissions</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-8 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="px-8"
          >
            Back
          </Button>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                {selectedPermissions.length + formData.apiPermissions.length}
              </div>
              <div className="text-xs text-gray-500">Total Permissions Selected</div>
            </div>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              disabled={isLoading}
            >
              {isLoading ? (
                'Creating Account...'
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};