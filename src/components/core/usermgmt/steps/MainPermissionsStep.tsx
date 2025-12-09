import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Checkbox } from '../../../../components/ui/checkbox';

interface MainPermissionsStepProps {
  initialData: {
    permissions: string[];
  };
  onSubmit: (data: any) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  permissions: Array<{
    id: string;
    name: string;
    module: string;
    description: string;
  }>;
  selectedModules: string[];
}

export const MainPermissionsStep: React.FC<MainPermissionsStepProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
  permissions,
  selectedModules,
}) => {
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(initialData);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Initialize expanded modules
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    permissions.forEach(permission => {
      if (!initialExpanded[permission.module]) {
        initialExpanded[permission.module] = false; // Start collapsed
      }
    });
    setExpandedModules(initialExpanded);
  }, [permissions]);

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, typeof permissions> = {};
    
    permissions.forEach(permission => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    });
    
    return grouped;
  }, [permissions]);

  // Filter permissions based on search
  const filteredPermissions = useMemo(() => {
    const filtered: Record<string, typeof permissions> = {};
    
    Object.entries(groupedPermissions).forEach(([module, modulePermissions]) => {
      const filteredModulePermissions = modulePermissions.filter(permission =>
        permission.name.toLowerCase().includes(search.toLowerCase()) ||
        permission.description.toLowerCase().includes(search.toLowerCase())
      );
      
      if (filteredModulePermissions.length > 0) {
        filtered[module] = filteredModulePermissions;
      }
    });
    
    return filtered;
  }, [groupedPermissions, search]);

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => {
      if (prev.permissions.includes(permissionId)) {
        return {
          ...prev,
          permissions: prev.permissions.filter(id => id !== permissionId)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionId]
        };
      }
    });
  };

  const handleSelectAllInModule = (moduleName: string, modulePermissions: typeof permissions) => {
    const modulePermissionIds = modulePermissions.map(p => p.id);
    const allSelected = modulePermissionIds.every(id => formData.permissions.includes(id));
    
    if (allSelected) {
      // Deselect all in module
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
      }));
    } else {
      // Select all in module
      const newPermissions = [...formData.permissions];
      modulePermissionIds.forEach(id => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
      setFormData({ permissions: newPermissions });
    }
  };

  const handleSelectAll = () => {
    const allIds = permissions.map(p => p.id);
    setFormData({ permissions: allIds });
  };

  const handleClearAll = () => {
    setFormData({ permissions: [] });
  };

  const toggleModuleExpansion = (moduleName: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  const expandAllModules = () => {
    const newExpanded: Record<string, boolean> = {};
    Object.keys(groupedPermissions).forEach(module => {
      newExpanded[module] = true;
    });
    setExpandedModules(newExpanded);
  };

  const collapseAllModules = () => {
    const newExpanded: Record<string, boolean> = {};
    Object.keys(groupedPermissions).forEach(module => {
      newExpanded[module] = false;
    });
    setExpandedModules(newExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (permissions.length === 0) {
      alert('No permissions available for the selected modules.');
      return;
    }
    
    await onSubmit(formData);
  };

  const getModuleLabel = (moduleId: string) => {
    const moduleMap: Record<string, string> = {
      'hr': 'HR',
      'crm': 'CRM',
      'file': 'File Management',
      'finance': 'Finance',
      'procurement': 'Procurement',
      'inventory': 'Inventory',
    };
    return moduleMap[moduleId] || moduleId;
  };

  // Calculate module selection stats
  const getModuleSelectionStats = (modulePermissions: typeof permissions) => {
    const selectedCount = modulePermissions.filter(p => formData.permissions.includes(p.id)).length;
    const totalCount = modulePermissions.length;
    return { selectedCount, totalCount };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Menu Permissions
        </h2>
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-emerald-700">
            <span className="font-semibold">Selected Modules:</span>{' '}
            {selectedModules.map(getModuleLabel).join(', ')} ({selectedModules.length} modules)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Search and Stats */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mt-1">
                {formData.permissions.length} permissions selected
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={expandAllModules}
                disabled={isLoading || permissions.length === 0}
                className="px-4"
              >
                Expand All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={collapseAllModules}
                disabled={isLoading || permissions.length === 0}
                className="px-4"
              >
                Collapse All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={isLoading || permissions.length === 0}
                className="px-4"
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={isLoading || formData.permissions.length === 0}
                className="px-4"
              >
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search permissions by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-4">
          {Object.keys(filteredPermissions).length > 0 ? (
            Object.entries(filteredPermissions).map(([moduleName, modulePermissions]) => {
              const isExpanded = expandedModules[moduleName] || false;
              const stats = getModuleSelectionStats(modulePermissions);
              
              return (
                <div 
                  key={moduleName} 
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
                >
                  {/* Module Header - Clickable to expand/collapse */}
                  <div 
                    className="bg-gray-50 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleModuleExpansion(moduleName)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-500">
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            {getModuleLabel(moduleName)}
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                              {modulePermissions.length} permissions
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
                          e.stopPropagation(); // Prevent toggling expansion
                          handleSelectAllInModule(moduleName, modulePermissions);
                        }}
                        disabled={isLoading}
                        className="px-4"
                      >
                        {stats.selectedCount === modulePermissions.length ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Permissions List - Collapsible */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-white"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modulePermissions.map(permission => (
                          <div 
                            key={permission.id} 
                            className={`p-3 rounded-lg border transition-all duration-200 ${
                              formData.permissions.includes(permission.id) 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={formData.permissions.includes(permission.id)}
                                onCheckedChange={() => handlePermissionChange(permission.id)}
                                disabled={isLoading}
                                className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:text-white data-[state=checked]:border-green-600"
                              />
                              <div className="flex-1">
                                <div className="mb-2">
                                  <label
                                    htmlFor={`permission-${permission.id}`}
                                    className="text-sm font-medium text-gray-700 cursor-pointer block"
                                  >
                                    {permission.name}
                                  </label>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {permission.description}
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
              <p className="text-gray-500">No permissions found matching your search.</p>
              {selectedModules.length === 0 && (
                <p className="text-sm mt-2 text-gray-400">Please select modules in Step 1 first.</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{selectedModules.length}</div>
              <div className="text-sm text-gray-600">Selected Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formData.permissions.length}</div>
              <div className="text-sm text-gray-600">Menu Permissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{permissions.length}</div>
              <div className="text-sm text-gray-600">Total Available Permissions</div>
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
                {formData.permissions.length}
              </div>
              <div className="text-xs text-gray-500">Total Permissions Selected</div>
            </div>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              disabled={isLoading || permissions.length === 0}
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  Save & Continue
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};