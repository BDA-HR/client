import { useState, useEffect } from 'react'
import LeavePolicyAccrualHeader from '../../../../components/hr/settings/leave/leavepolicyaccrual/LeavePolicyAccrualHeader'
import { Button } from '../../../../components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, FileText, Clock, Settings, Pen } from 'lucide-react';
import type { LeavePolicyListDto } from '../../../../types/hr/leavepolicy';
import type { LeavePolicyAccrualListDto } from '../../../../types/hr/leavepolicyaccrual';

function LeavePolicyAccrualPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [policy, setPolicy] = useState<LeavePolicyListDto | null>(null);
  const [accrual, setAccrual] = useState<LeavePolicyAccrualListDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Local state for editable fields
  const [formData, setFormData] = useState({
    policyInfo: {
      name: '',
      leaveType: '',
      requiresAttachment: false,
      holidaysAsLeave: false,
    },
    durationLimits: {
      minDurPerReq: 0,
      maxDurPerReq: 0,
    },
    accrualSettings: {
      entitlement: 0,
      frequency: '',
      accrualRate: 0,
    },
    carryoverSettings: {
      minServiceMonths: 0,
      maxCarryoverDays: 0,
      carryoverExpiryDays: 0,
    }
  });

  useEffect(() => {
    const fetchPolicyDetails = async () => {
      try {
        setLoading(true);
        
        const mockPolicy: LeavePolicyListDto = {
          id: id!,
          leaveTypeId: 'leave-type-id',
          name: 'Annual Leave Policy',
          requiresAttachment: true,
          minDurPerReq: 0.5,
          maxDurPerReq: 30,
          holidaysAsLeave: false,
          leaveType: 'Annual Leave',
          requiresAttachmentStr: 'Yes',
          minDurPerReqStr: '0.5 days',
          maxDurPerReqStr: '30 days',
          holidaysAsLeaveStr: 'No',
          rowVersion: '1'
        };

        const mockAccrual: LeavePolicyAccrualListDto = {
          id: 'accrual-id',
          leavePolicyId: id!,
          entitlement: 20,
          frequency: 'Monthly',
          accrualRate: 1.67,
          minServiceMonths: 3,
          maxCarryoverDays: 10,
          carryoverExpiryDays: 90,
          frequencyStr: 'Monthly',
          leavePolicy: 'Annual Leave Policy',
          rowVersion: '1'
        };

        setPolicy(mockPolicy);
        setAccrual(mockAccrual);

        // Initialize form data
        setFormData({
          policyInfo: {
            name: mockPolicy.name,
            leaveType: mockPolicy.leaveType,
            requiresAttachment: mockPolicy.requiresAttachment,
            holidaysAsLeave: mockPolicy.holidaysAsLeave,
          },
          durationLimits: {
            minDurPerReq: mockPolicy.minDurPerReq,
            maxDurPerReq: mockPolicy.maxDurPerReq,
          },
          accrualSettings: {
            entitlement: mockAccrual.entitlement,
            frequency: mockAccrual.frequency,
            accrualRate: mockAccrual.accrualRate,
          },
          carryoverSettings: {
            minServiceMonths: mockAccrual.minServiceMonths,
            maxCarryoverDays: mockAccrual.maxCarryoverDays,
            carryoverExpiryDays: mockAccrual.carryoverExpiryDays,
          }
        });
      } catch (error) {
        console.error('Error fetching policy details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPolicyDetails();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate('/hr/settings/annualleave');
  };

  const handleEditSection = (section: string) => {
    setIsEditing(true);
    setEditingSection(section);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingSection(null);
    setHasChanges(false);
    
    // Reset form data to original values
    if (policy && accrual) {
      setFormData({
        policyInfo: {
          name: policy.name,
          leaveType: policy.leaveType,
          requiresAttachment: policy.requiresAttachment,
          holidaysAsLeave: policy.holidaysAsLeave,
        },
        durationLimits: {
          minDurPerReq: policy.minDurPerReq,
          maxDurPerReq: policy.maxDurPerReq,
        },
        accrualSettings: {
          entitlement: accrual.entitlement,
          frequency: accrual.frequency,
          accrualRate: accrual.accrualRate,
        },
        carryoverSettings: {
          minServiceMonths: accrual.minServiceMonths,
          maxCarryoverDays: accrual.maxCarryoverDays,
          carryoverExpiryDays: accrual.carryoverExpiryDays,
        }
      });
    }
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
    // Here you would typically make an API call to save the changes
    setIsEditing(false);
    setEditingSection(null);
    setHasChanges(false);
    
    // Update the policy and accrual state with new data
    if (policy && accrual) {
      setPolicy({
        ...policy,
        name: formData.policyInfo.name,
        leaveType: formData.policyInfo.leaveType,
        requiresAttachment: formData.policyInfo.requiresAttachment,
        holidaysAsLeave: formData.policyInfo.holidaysAsLeave,
        minDurPerReq: formData.durationLimits.minDurPerReq,
        maxDurPerReq: formData.durationLimits.maxDurPerReq,
        requiresAttachmentStr: formData.policyInfo.requiresAttachment ? 'Yes' : 'No',
        holidaysAsLeaveStr: formData.policyInfo.holidaysAsLeave ? 'Yes' : 'No',
        minDurPerReqStr: `${formData.durationLimits.minDurPerReq} days`,
        maxDurPerReqStr: `${formData.durationLimits.maxDurPerReq} days`,
      });

      setAccrual({
        ...accrual,
        entitlement: formData.accrualSettings.entitlement,
        frequency: formData.accrualSettings.frequency,
        accrualRate: formData.accrualSettings.accrualRate,
        minServiceMonths: formData.carryoverSettings.minServiceMonths,
        maxCarryoverDays: formData.carryoverSettings.maxCarryoverDays,
        carryoverExpiryDays: formData.carryoverSettings.carryoverExpiryDays,
      });
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const renderField = (section: string, field: string, label: string, value: any, isBoolean = false) => {
    const isEditingThisSection = isEditing && editingSection === section;
    
    if (isEditingThisSection) {
      if (isBoolean) {
        return (
          <select 
            value={value ? 'true' : 'false'}
            onChange={(e) => handleInputChange(section, field, e.target.value === 'true')}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      }
      
      return (
        <input 
          type={typeof value === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => handleInputChange(
            section, 
            field, 
            typeof value === 'number' ? parseFloat(e.target.value) : e.target.value
          )}
          className="text-sm border border-gray-300 rounded px-2 py-1 w-32"
        />
      );
    }
    
    if (isBoolean) {
      return (
        <span className={`text-sm ${value ? 'text-red-600' : 'text-green-600'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    }
    
    return <span className="text-sm text-gray-900">{value}</span>;
  };

  if (loading) {
    return (
      <section className="p-6">
        <Button variant={"outline"} className="mb-4 cursor-pointer flex items-center gap-2" onClick={handleBackClick}>
          <ArrowLeft size={16} />
          Back to Leave Settings
        </Button>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">Loading policy details...</div>
        </div>
      </section>
    );
  }

  if (!policy) {
    return (
      <section className="p-6">
        <Button variant={"outline"} className="mb-4 cursor-pointer flex items-center gap-2" onClick={handleBackClick}>
          <ArrowLeft size={16} />
          Back to Leave Settings
        </Button>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Policy not found</div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Button variant={"outline"} className="mb-6 cursor-pointer flex items-center gap-2" onClick={handleBackClick}>
        <ArrowLeft size={16} />
        Back to Leave Settings
      </Button>
      
      <LeavePolicyAccrualHeader onAdd={() => console.log("Add clicked")} />

      {/* Policy Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Basic Policy Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Policy Information
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditSection('policyInfo')}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <Pen size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Policy Name</span>
              {renderField('policyInfo', 'name', 'Policy Name', formData.policyInfo.name)}
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Leave Type</span>
              {renderField('policyInfo', 'leaveType', 'Leave Type', formData.policyInfo.leaveType)}
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Requires Attachment</span>
              {renderField('policyInfo', 'requiresAttachment', 'Requires Attachment', formData.policyInfo.requiresAttachment, true)}
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Holidays Count as Leave</span>
              {renderField('policyInfo', 'holidaysAsLeave', 'Holidays Count as Leave', formData.policyInfo.holidaysAsLeave, true)}
            </div>
          </div>
        </div>

        {/* Duration Limits */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Duration Limits
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditSection('durationLimits')}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <Pen size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Minimum Duration per Request</span>
              <div className="flex items-center gap-2">
                {renderField('durationLimits', 'minDurPerReq', 'Minimum Duration per Request', formData.durationLimits.minDurPerReq)}
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Maximum Duration per Request</span>
              <div className="flex items-center gap-2">
                {renderField('durationLimits', 'maxDurPerReq', 'Maximum Duration per Request', formData.durationLimits.maxDurPerReq)}
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accrual Information - Only show if accrual data exists */}
        {accrual && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Accrual Settings
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection('accrualSettings')}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <Pen size={16} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Annual Entitlement</span>
                  <div className="flex items-center gap-2">
                    {renderField('accrualSettings', 'entitlement', 'Annual Entitlement', formData.accrualSettings.entitlement)}
                    <span className="text-sm text-gray-500">days</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Accrual Frequency</span>
                  {renderField('accrualSettings', 'frequency', 'Accrual Frequency', formData.accrualSettings.frequency)}
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Accrual Rate</span>
                  <div className="flex items-center gap-2">
                    {renderField('accrualSettings', 'accrualRate', 'Accrual Rate', formData.accrualSettings.accrualRate)}
                    <span className="text-sm text-gray-500">days per period</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-600" />
                  Carryover Settings
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection('carryoverSettings')}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <Pen size={16} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Minimum Service Months</span>
                  <div className="flex items-center gap-2">
                    {renderField('carryoverSettings', 'minServiceMonths', 'Minimum Service Months', formData.carryoverSettings.minServiceMonths)}
                    <span className="text-sm text-gray-500">months</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Maximum Carryover Days</span>
                  <div className="flex items-center gap-2">
                    {renderField('carryoverSettings', 'maxCarryoverDays', 'Maximum Carryover Days', formData.carryoverSettings.maxCarryoverDays)}
                    <span className="text-sm text-gray-500">days</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Carryover Expiry</span>
                  <div className="flex items-center gap-2">
                    {renderField('carryoverSettings', 'carryoverExpiryDays', 'Carryover Expiry', formData.carryoverSettings.carryoverExpiryDays)}
                    <span className="text-sm text-gray-500">days</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons - Only show when there are changes */}
      {hasChanges && (
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
      )}
    </section>
  );
}

export default LeavePolicyAccrualPage;