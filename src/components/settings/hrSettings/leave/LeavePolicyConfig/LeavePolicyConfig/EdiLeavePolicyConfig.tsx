import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, AlertCircle, UserCheck, Edit } from 'lucide-react';
import { Button } from '../../../../../ui/button';
import { Label } from '../../../../../ui/label';
import { Input } from '../../../../../ui/input';
import List from '../../../../../List/list';
import type { ListItem } from "../../../../../../types/List/list";
import type {
  LeavePolicyConfigModDto,
  UUID,
  LeavePolicyConfigListDto,
} from "../../../../../../types/core/Settings/leavePolicyConfig";
import type { NameListItem } from "../../../../../../types/NameList/nameList";
import { AccrualFrequency } from "../../../../../../types/core/enum";

import toast from 'react-hot-toast';
import { useLeavePolicyConfig, useUpdateLeavePolicyConfig } from '../../../../../../services/core/settings/ModHrm/LeavePolicyConfigService/leavePolicyConfig.queries';

interface EditLeavePolicyConfigModalProps {
  configId: UUID;
  onClose: () => void;
}

const EditLeavePolicyConfigModal: React.FC<EditLeavePolicyConfigModalProps> = ({ 
  configId, 
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [config, setConfig] = useState<LeavePolicyConfigModDto | null>(null);
  
  const [errors, setErrors] = useState<{
    annualEntitlement?: string;
    accrualFrequency?: string;
    accrualRate?: string;
    maxDaysPerReq?: string;
    maxCarryOverDays?: string;
    minServiceMonths?: string;
    fiscalYearId?: string;
    leavePolicyId?: string;
    leaveAppChainId?: string;
  }>({});
  
  // Fetch config data using the hook
  const { 
    data: configData, 
    isLoading: isFetchingConfig,
    error: fetchError 
  } = useLeavePolicyConfig(configId);
  
  // Use the update mutation hook
  const updateMutation = useUpdateLeavePolicyConfig();
  const isLoading = updateMutation.isPending;
  
  // State for dropdown lists
  const [fiscalYearNames, setFiscalYearNames] = useState<NameListItem[]>([]);
  const [leavePolicyNames, setLeavePolicyNames] = useState<NameListItem[]>([]);
  const [leaveAppChainNames, setLeaveAppChainNames] = useState<NameListItem[]>([]);
  const [isFetchingLists, setIsFetchingLists] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // Accrual frequency options
  const accrualFrequencyOptions = Object.entries(AccrualFrequency).map(
    ([key, value]) => ({
      id: key,
      name: value,
    }),
  );

  // When config data is fetched, convert it to ModDto
  useEffect(() => {
    if (configData) {
      // Convert accrualFrequencyStr back to enum key for the form
      const accrualFrequencyKey = Object.entries(AccrualFrequency).find(
        ([key, value]) => value === configData.accrualFrequencyStr
      )?.[0] || configData.accrualFrequency || "";

      const modDto: LeavePolicyConfigModDto = {
        id: configData.id,
        annualEntitlement: configData.annualEntitlement,
        accrualFrequency: accrualFrequencyKey,
        accrualRate: configData.accrualRate,
        maxDaysPerReq: configData.maxDaysPerReq,
        maxCarryOverDays: configData.maxCarryOverDays,
        minServiceMonths: configData.minServiceMonths,
        isActive: configData.isActive,
        fiscalYearId: '' as UUID, // You need to get the actual ID from your backend
        leavePolicyId: '' as UUID, // You need to get the actual ID from your backend
        leaveAppChainId: '' as UUID, // You need to get the actual ID from your backend
        rowVersion: configData.rowVersion || ''
      };
      setConfig(modDto);
    }
  }, [configData]);

  // Fetch lists
  useEffect(() => {
    const fetchLists = async () => {
      setIsFetchingLists(true);
      try {
        // TODO: Replace these with actual API calls
        const fiscalYears: NameListItem[] = [
          { id: 'fiscal-1' as UUID, name: 'Fiscal Year 2024' },
          { id: 'fiscal-2' as UUID, name: 'Fiscal Year 2025' }
        ];
        const leavePolicies: NameListItem[] = [
          { id: 'policy-1' as UUID, name: 'Annual Leave' },
          { id: 'policy-2' as UUID, name: 'Sick Leave' }
        ];
        const leaveAppChains: NameListItem[] = [
          { id: 'chain-1' as UUID, name: 'Standard Approval' },
          { id: 'chain-2' as UUID, name: 'Manager Approval' }
        ];
        
        setFiscalYearNames(fiscalYears);
        setLeavePolicyNames(leavePolicies);
        setLeaveAppChainNames(leaveAppChains);
      } catch (error) {
        setListError('Failed to load reference data');
      } finally {
        setIsFetchingLists(false);
      }
    };
    
    fetchLists();
  }, []);

  const fiscalYearListItems: ListItem[] = Array.isArray(fiscalYearNames) 
    ? fiscalYearNames
        .filter(item => item && item.id && item.name) 
        .map(item => ({
          id: item.id,
          name: item.name
        }))
    : [];

  const leavePolicyListItems: ListItem[] = Array.isArray(leavePolicyNames) 
    ? leavePolicyNames
        .filter(item => item && item.id && item.name) 
        .map(item => ({
          id: item.id,
          name: item.name
        }))
    : [];

  const leaveAppChainListItems: ListItem[] = Array.isArray(leaveAppChainNames) 
    ? leaveAppChainNames
        .filter(item => item && item.id && item.name) 
        .map(item => ({
          id: item.id,
          name: item.name
        }))
    : [];

  const handleSelectFiscalYear = (item: ListItem) => {
    if (config) {
      setConfig(prev => ({ ...prev!, fiscalYearId: item.id as UUID }));
      if (errors.fiscalYearId) setErrors(prev => ({ ...prev, fiscalYearId: undefined }));
    }
  };

  const handleSelectLeavePolicy = (item: ListItem) => {
    if (config) {
      setConfig(prev => ({ ...prev!, leavePolicyId: item.id as UUID }));
      if (errors.leavePolicyId) setErrors(prev => ({ ...prev, leavePolicyId: undefined }));
    }
  };

  const handleSelectLeaveAppChain = (item: ListItem) => {
    if (config) {
      setConfig(prev => ({ ...prev!, leaveAppChainId: item.id as UUID }));
      if (errors.leaveAppChainId) setErrors(prev => ({ ...prev, leaveAppChainId: undefined }));
    }
  };

  const handleSelectAccrualFrequency = (item: ListItem) => {
    if (config) {
      setConfig(prev => ({ ...prev!, accrualFrequency: item.id }));
      if (errors.accrualFrequency) setErrors(prev => ({ ...prev, accrualFrequency: undefined }));
    }
  };

  const validateForm = () => {
    if (!config) return false;

    const newErrors: typeof errors = {};

    if (!config.annualEntitlement || config.annualEntitlement <= 0) {
      newErrors.annualEntitlement = 'Annual entitlement must be greater than 0';
    }

    if (!config.accrualFrequency?.trim()) {
      newErrors.accrualFrequency = 'Accrual frequency is required';
    }

    if (!config.accrualRate || config.accrualRate <= 0) {
      newErrors.accrualRate = 'Accrual rate must be greater than 0';
    }

    if (!config.maxDaysPerReq || config.maxDaysPerReq <= 0) {
      newErrors.maxDaysPerReq = 'Maximum days per request must be greater than 0';
    }

    if (config.maxCarryOverDays < 0) {
      newErrors.maxCarryOverDays = 'Maximum carry over days cannot be negative';
    }

    if (!config.minServiceMonths || config.minServiceMonths < 0) {
      newErrors.minServiceMonths = 'Minimum service months must be 0 or greater';
    }

    // Note: These IDs might not be available from ListDto, you'll need to get them from your backend
    // For now, we'll skip these validations or you'll need to fetch them separately
    /*
    if (!config.fiscalYearId) {
      newErrors.fiscalYearId = 'Please select a fiscal year';
    }

    if (!config.leavePolicyId) {
      newErrors.leavePolicyId = 'Please select a leave policy';
    }

    if (!config.leaveAppChainId) {
      newErrors.leaveAppChainId = 'Please select a leave approval chain';
    }
    */

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!config || !validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const dataToSend: LeavePolicyConfigModDto = {
        ...config,
        annualEntitlement: Number(config.annualEntitlement),
        accrualRate: Number(config.accrualRate),
        maxDaysPerReq: Number(config.maxDaysPerReq),
        maxCarryOverDays: Number(config.maxCarryOverDays),
        minServiceMonths: Number(config.minServiceMonths),
        // Make sure all required fields are included
        fiscalYearId: config.fiscalYearId || '' as UUID,
        leavePolicyId: config.leavePolicyId || '' as UUID,
        leaveAppChainId: config.leaveAppChainId || '' as UUID,
      };
      
      await updateMutation.mutateAsync(dataToSend);

      toast.success('Leave policy configuration updated successfully!');
      handleClose();

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update leave policy configuration';
      toast.error(errorMessage);
      console.error('Error updating leave policy configuration:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setConfig(null);
      setErrors({});
      setListError(null);
      setIsOpen(false);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && config) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const isFormValid = config && 
    config.annualEntitlement > 0 &&
    config.accrualFrequency?.trim() &&
    config.accrualRate > 0 &&
    config.maxDaysPerReq > 0 &&
    config.maxCarryOverDays >= 0 &&
    config.minServiceMonths >= 0 &&
    // Optional: Add back when you have the IDs
    // config.fiscalYearId &&
    // config.leavePolicyId &&
    // config.leaveAppChainId &&
    !errors.annualEntitlement &&
    !errors.accrualFrequency &&
    !errors.accrualRate &&
    !errors.maxDaysPerReq &&
    !errors.maxCarryOverDays &&
    !errors.minServiceMonths;

  if (!isOpen) return null;

  if (fetchError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Configuration</h3>
            <p className="text-gray-600 mb-4">{fetchError.message}</p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          handleClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <Edit size={20} className="text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Edit Leave Policy Configuration
              </h2>
              <p className="text-sm text-gray-500">
                Update leave policy rules and entitlements
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isLoading || isFetchingConfig}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {isFetchingConfig ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-600">Loading configuration...</span>
              </div>
            </div>
          ) : !config ? (
            <div className="p-6 text-center">
              <p className="text-red-500">Failed to load configuration data</p>
            </div>
          ) : (
            <>
              {/* Three Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Left Column - Entitlement & Accrual */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-500" />
                    Entitlement & Accrual
                  </h3>
                  
                  {/* Annual Entitlement */}
                  <div className="space-y-2 min-h-[76px]">
                    <Label htmlFor="annualEntitlement" className="text-sm font-medium text-gray-700">
                      Annual Entitlement <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="annualEntitlement"
                      type="number"
                      min="0"
                      step="0.5"
                      value={config.annualEntitlement === 0 ? '' : config.annualEntitlement}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        setConfig(prev => ({ ...prev!, annualEntitlement: value }));
                        if (errors.annualEntitlement) setErrors(prev => ({ ...prev, annualEntitlement: undefined }));
                      }}
                      placeholder="Enter days (e.g., 21)"
                      className={`w-full ${errors.annualEntitlement ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading || isFetchingLists}
                    />
                    {errors.annualEntitlement && (
                      <p className="text-sm text-red-500">{errors.annualEntitlement}</p>
                    )}
                    <p className="text-xs text-gray-500">Total leave days per year</p>
                  </div>

                  {/* Accrual Rate */}
                  <div className="space-y-2 min-h-[76px]">
                    <Label htmlFor="accrualRate" className="text-sm font-medium text-gray-700">
                      Accrual Rate <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="accrualRate"
                      type="number"
                      min="0"
                      step="0.25"
                      value={config.accrualRate === 0 ? '' : config.accrualRate}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        setConfig(prev => ({ ...prev!, accrualRate: value }));
                        if (errors.accrualRate) setErrors(prev => ({ ...prev, accrualRate: undefined }));
                      }}
                      placeholder="Enter rate (e.g., 1.75)"
                      className={`w-full ${errors.accrualRate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading || isFetchingLists}
                    />
                    {errors.accrualRate && (
                      <p className="text-sm text-red-500">{errors.accrualRate}</p>
                    )}
                    <p className="text-xs text-gray-500">Days per accrual period</p>
                  </div>
                </div>

                {/* Middle Column - Limits */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} className="text-orange-500" />
                    Limits & Restrictions
                  </h3>
                  
                  {/* Max Days Per Request */}
                  <div className="space-y-2 min-h-[76px]">
                    <Label htmlFor="maxDaysPerReq" className="text-sm font-medium text-gray-700">
                      Max Days Per Request <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="maxDaysPerReq"
                      type="number"
                      min="0"
                      step="0.5"
                      value={config.maxDaysPerReq === 0 ? '' : config.maxDaysPerReq}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        setConfig(prev => ({ ...prev!, maxDaysPerReq: value }));
                        if (errors.maxDaysPerReq) setErrors(prev => ({ ...prev, maxDaysPerReq: undefined }));
                      }}
                      placeholder="Enter days (e.g., 14)"
                      className={`w-full ${errors.maxDaysPerReq ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading || isFetchingLists}
                    />
                    {errors.maxDaysPerReq && (
                      <p className="text-sm text-red-500">{errors.maxDaysPerReq}</p>
                    )}
                    <p className="text-xs text-gray-500">Maximum days for a single request</p>
                  </div>

                  {/* Max Carry Over Days */}
                  <div className="space-y-2 min-h-[76px]">
                    <Label htmlFor="maxCarryOverDays" className="text-sm font-medium text-gray-700">
                      Max Carry Over Days
                    </Label>
                    <Input
                      id="maxCarryOverDays"
                      type="number"
                      min="0"
                      value={config.maxCarryOverDays === 0 ? '' : config.maxCarryOverDays}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        setConfig(prev => ({ ...prev!, maxCarryOverDays: value }));
                        if (errors.maxCarryOverDays) setErrors(prev => ({ ...prev, maxCarryOverDays: undefined }));
                      }}
                      placeholder="Enter days (e.g., 10)"
                      className={`w-full ${errors.maxCarryOverDays ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading || isFetchingLists}
                    />
                    {errors.maxCarryOverDays && (
                      <p className="text-sm text-red-500">{errors.maxCarryOverDays}</p>
                    )}
                    <p className="text-xs text-gray-500">Days that can be carried to next year (0 for none)</p>
                  </div>
                </div>

                {/* Right Column - Eligibility & References */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <UserCheck size={16} className="text-blue-500" />
                    Eligibility & References
                  </h3>
                  
                  {/* Min Service Months */}
                  <div className="space-y-2 min-h-[76px]">
                    <Label htmlFor="minServiceMonths" className="text-sm font-medium text-gray-700">
                      Minimum Service Months
                    </Label>
                    <Input
                      id="minServiceMonths"
                      type="number"
                      min="0"
                      value={config.minServiceMonths === 0 ? '' : config.minServiceMonths}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        setConfig(prev => ({ ...prev!, minServiceMonths: value }));
                        if (errors.minServiceMonths) setErrors(prev => ({ ...prev, minServiceMonths: undefined }));
                      }}
                      placeholder="Enter months (e.g., 3)"
                      className={`w-full ${errors.minServiceMonths ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading || isFetchingLists}
                    />
                    {errors.minServiceMonths && (
                      <p className="text-sm text-red-500">{errors.minServiceMonths}</p>
                    )}
                    <p className="text-xs text-gray-500">Minimum service required before eligibility</p>
                  </div>

                  {/* Accrual Frequency */}
                  <div className="space-y-2 min-h-[76px]">
                    <Label className="text-sm font-medium text-gray-700">
                      Accrual Frequency <span className="text-red-500">*</span>
                    </Label>
                    <List
                      items={accrualFrequencyOptions as any}
                      selectedValue={config.accrualFrequency as UUID}
                      onSelect={handleSelectAccrualFrequency}
                      label=""
                      placeholder="Select frequency"
                      required
                      disabled={isLoading || isFetchingLists}
                    />
                    {errors.accrualFrequency && (
                      <p className="text-sm text-red-500">{errors.accrualFrequency}</p>
                    )}
                  </div>

                  {/* Is Active Checkbox */}
                  <div className="space-y-2 min-h-[76px]">
                    <Label className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <div className="flex items-center space-x-2 h-10">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={config.isActive}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev!, isActive: e.target.checked }));
                        }}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        disabled={isLoading || isFetchingLists}
                      />
                      <Label
                        htmlFor="isActive"
                        className="text-sm font-medium text-gray-700"
                      >
                        Active Configuration
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500">Enable/disable this configuration</p>
                  </div>
                </div>
              </div>

              {/* Reference Selection Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">References</h3>
                
                {isFetchingLists ? (
                  <div className="flex items-center justify-center p-4 border rounded-lg bg-gray-50">
                    <div className="h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-sm text-gray-600">Loading reference data...</span>
                  </div>
                ) : listError ? (
                  <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">{listError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Fiscal Year */}
                    <div className="space-y-2 min-h-[76px]">
                      <Label className="text-sm font-medium text-gray-700">
                        Fiscal Year
                      </Label>
                      <List
                        items={fiscalYearListItems}
                        selectedValue={config.fiscalYearId}
                        onSelect={handleSelectFiscalYear}
                        label=""
                        placeholder="Select fiscal year"
                        disabled={isLoading || isFetchingLists}
                      />
                      {errors.fiscalYearId && (
                        <p className="text-sm text-red-500">{errors.fiscalYearId}</p>
                      )}
                      {fiscalYearListItems.length === 0 && (
                        <p className="text-sm text-amber-600">No fiscal years available</p>
                      )}
                    </div>

                    {/* Leave Policy */}
                    <div className="space-y-2 min-h-[76px]">
                      <Label className="text-sm font-medium text-gray-700">
                        Leave Policy
                      </Label>
                      <List
                        items={leavePolicyListItems}
                        selectedValue={config.leavePolicyId}
                        onSelect={handleSelectLeavePolicy}
                        label=""
                        placeholder="Select leave policy"
                        disabled={isLoading || isFetchingLists}
                      />
                      {errors.leavePolicyId && (
                        <p className="text-sm text-red-500">{errors.leavePolicyId}</p>
                      )}
                      {leavePolicyListItems.length === 0 && (
                        <p className="text-sm text-amber-600">No leave policies available</p>
                      )}
                    </div>

                    {/* Leave Approval Chain */}
                    <div className="space-y-2 min-h-[76px]">
                      <Label className="text-sm font-medium text-gray-700">
                        Leave Approval Chain
                      </Label>
                      <List
                        items={leaveAppChainListItems}
                        selectedValue={config.leaveAppChainId}
                        onSelect={handleSelectLeaveAppChain}
                        label=""
                        placeholder="Select approval chain"
                        disabled={isLoading || isFetchingLists}
                      />
                      {errors.leaveAppChainId && (
                        <p className="text-sm text-red-500">{errors.leaveAppChainId}</p>
                      )}
                      {leaveAppChainListItems.length === 0 && (
                        <p className="text-sm text-amber-600">No approval chains available</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Configuration Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Configuration ID</p>
                    <p className="text-sm font-medium text-gray-900">{config.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Row Version</p>
                    <p className="text-sm font-medium text-gray-900">{config.rowVersion || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-center items-center gap-3">
            <Button
              variant="outline"
              className="cursor-pointer px-6 min-w-[100px]"
              onClick={handleClose}
              disabled={isLoading || isFetchingConfig || isFetchingLists}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6 min-w-[100px] shadow-sm hover:shadow transition-shadow duration-200"
              onClick={handleSubmit}
              disabled={
                !isFormValid ||
                isLoading ||
                isFetchingConfig ||
                isFetchingLists ||
                listError !== null
              }
              type="button"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Configuration"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditLeavePolicyConfigModal;