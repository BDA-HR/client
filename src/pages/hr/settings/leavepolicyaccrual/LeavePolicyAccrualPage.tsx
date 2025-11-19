import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import LeavePolicyTableHeader from '../../../../components/hr/settings/leave/leavepolicyaccrual/LeavePolicyAccrualHeader';
import LeavePolicyTableSearch from '../../../../components/hr/settings/leave/leavepolicyaccrual/LeavePolicyAccrualSearch';
import LeavePolicyTable from '../../../../components/hr/settings/leave/leavepolicyaccrual/LeavePolicyTable';
import type { LeavePolicyListDto } from '../../../../types/hr/leavepolicy';

const LeavePolicyAccrualPage: React.FC = () => {
  const { Id } = useParams<{ Id: string }>();
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicyListDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [requiresAttachmentFilter, setRequiresAttachmentFilter] = useState<string>('all');
  const [holidaysAsLeaveFilter, setHolidaysAsLeaveFilter] = useState<string>('all');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchLeavePolicies = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockPolicies: LeavePolicyListDto[] = [
            {
              id: '1',
              leaveTypeId: '1',
              name: 'Annual Leave',
              requiresAttachment: false,
              minDurPerReq: 1,
              maxDurPerReq: 30,
              holidaysAsLeave: false,
              leaveType: 'Annual',
              requiresAttachmentStr: 'No',
              minDurPerReqStr: '1 day',
              maxDurPerReqStr: '30 days',
              holidaysAsLeaveStr: 'No',
              rowVersion: '1'
            },
            {
              id: '2',
              leaveTypeId: '2',
              name: 'Sick Leave',
              requiresAttachment: true,
              minDurPerReq: 1,
              maxDurPerReq: 15,
              holidaysAsLeave: true,
              leaveType: 'Sick',
              requiresAttachmentStr: 'Yes',
              minDurPerReqStr: '1 day',
              maxDurPerReqStr: '15 days',
              holidaysAsLeaveStr: 'Yes',
              rowVersion: '1'
            },
            {
              id: '3',
              leaveTypeId: '3',
              name: 'Maternity Leave',
              requiresAttachment: true,
              minDurPerReq: 90,
              maxDurPerReq: 120,
              holidaysAsLeave: true,
              leaveType: 'Maternity',
              requiresAttachmentStr: 'Yes',
              minDurPerReqStr: '90 days',
              maxDurPerReqStr: '120 days',
              holidaysAsLeaveStr: 'Yes',
              rowVersion: '1'
            }
          ];
          setLeavePolicies(mockPolicies);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching leave policies:', error);
        setLoading(false);
      }
    };

    fetchLeavePolicies();
  }, [Id]);

  // Get unique leave types for filter
  const leaveTypes = useMemo(() => {
    const types = leavePolicies.map(policy => policy.leaveType).filter(Boolean);
    return Array.from(new Set(types));
  }, [leavePolicies]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return leavePolicies.filter(policy => {
      const matchesSearch = policy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          policy.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAttachment = requiresAttachmentFilter === 'all' || 
                               (requiresAttachmentFilter === 'true' && policy.requiresAttachment) ||
                               (requiresAttachmentFilter === 'false' && !policy.requiresAttachment);
      
      const matchesHolidays = holidaysAsLeaveFilter === 'all' ||
                             (holidaysAsLeaveFilter === 'true' && policy.holidaysAsLeave) ||
                             (holidaysAsLeaveFilter === 'false' && !policy.holidaysAsLeave);
      
      const matchesLeaveType = leaveTypeFilter === 'all' || policy.leaveType === leaveTypeFilter;

      return matchesSearch && matchesAttachment && matchesHolidays && matchesLeaveType;
    });
  }, [leavePolicies, searchTerm, requiresAttachmentFilter, holidaysAsLeaveFilter, leaveTypeFilter]);

  const handleEdit = (leavePolicy: LeavePolicyListDto) => {
    console.log('Edit leave policy:', leavePolicy);
    // Implement edit logic here
  };

  const handleDelete = (leavePolicy: LeavePolicyListDto) => {
    console.log('Delete leave policy:', leavePolicy);
    // Implement delete logic here
  };

  const handleAdd = () => {
    console.log('Add new leave policy');
    // Implement add logic here
  };

  const handleExport = () => {
    console.log('Export leave policies');
    // Implement export logic here
  };

  const handleImport = () => {
    console.log('Import leave policies');
    // Implement import logic here
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRequiresAttachmentFilter('all');
    setHolidaysAsLeaveFilter('all');
    setLeaveTypeFilter('all');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading leave policies...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header Component */}
      <LeavePolicyTableHeader
        totalCount={filteredData.length}
        onAdd={handleAdd}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Search and Filters Component */}
      <LeavePolicyTableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        requiresAttachmentFilter={requiresAttachmentFilter}
        onRequiresAttachmentFilterChange={setRequiresAttachmentFilter}
        holidaysAsLeaveFilter={holidaysAsLeaveFilter}
        onHolidaysAsLeaveFilterChange={setHolidaysAsLeaveFilter}
        leaveTypeFilter={leaveTypeFilter}
        onLeaveTypeFilterChange={setLeaveTypeFilter}
        leaveTypes={leaveTypes}
        onClearFilters={handleClearFilters}
      />

      {/* Table Component */}
      <LeavePolicyTable
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />
    </div>
  );
};

export default LeavePolicyAccrualPage;