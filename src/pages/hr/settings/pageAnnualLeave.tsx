import { motion } from "framer-motion";
import { useState } from "react";
import LeaveHeader from '../../../components/hr/settings/leave/leavetype/LeaveHeader';
import LeaveTypeSection from '../../../components/hr/settings/leave/leavetype/LeaveTypeSection';
import LeavePolicySection from '../../../components/hr/settings/leave/leavepolicy/LeavePolicySection';
import type { LeaveTypeListDto, LeaveTypeAddDto, LeaveTypeModDto } from '../../../types/hr/leavetype';
import type { LeavePolicyListDto } from '../../../types/hr/leavepolicy';

const PageAnnualLeave = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [policySearchTerm, setPolicySearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [policyViewMode, setPolicyViewMode] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeListDto[]>([
    {
      id: '1',
      name: 'Annual Leave',
      code: '0',
      isPaid: true,
      codeStr: 'ANNUAL',
      isPaidStr: 'Paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      rowVersion: '1'
    },
    {
      id: '2',
      name: 'Sick Leave',
      code: '1',
      codeStr: 'SICK',
      isPaid: true,
      isPaidStr: 'Paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      rowVersion: '1'
    },
    {
      id: '3',
      name: 'Unpaid Leave',
      code: '2',
      codeStr: 'UNPAID',
      isPaid: false,
      isPaidStr: 'Unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      rowVersion: '1'
    },
  ]);

  // Sample leave policy data - replace with actual data from your API
  const sampleLeavePolicies: LeavePolicyListDto[] = [
    {
      id: '1',
      leaveTypeId: '1',
      name: 'Annual Leave Policy',
      requiresAttachment: true,
      minDurPerReq: 1,
      maxDurPerReq: 30,
      holidaysAsLeave: false,
      leaveType: 'Annual Leave',
      requiresAttachmentStr: 'Yes',
      minDurPerReqStr: '1 day',
      maxDurPerReqStr: '30 days',
      holidaysAsLeaveStr: 'No',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system'
    },
    {
      id: '2',
      leaveTypeId: '2',
      name: 'Sick Leave Policy',
      requiresAttachment: true,
      minDurPerReq: 1,
      maxDurPerReq: 15,
      holidaysAsLeave: true,
      leaveType: 'Sick Leave',
      requiresAttachmentStr: 'Yes',
      minDurPerReqStr: '1 day',
      maxDurPerReqStr: '15 days',
      holidaysAsLeaveStr: 'Yes',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system'
    },
    {
      id: '3',
      leaveTypeId: '3',
      name: 'Unpaid Leave Policy',
      requiresAttachment: false,
      minDurPerReq: 1,
      maxDurPerReq: 90,
      holidaysAsLeave: false,
      leaveType: 'Unpaid Leave',
      requiresAttachmentStr: 'No',
      minDurPerReqStr: '1 day',
      maxDurPerReqStr: '90 days',
      holidaysAsLeaveStr: 'No',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system'
    },
  ];

  // Filter leave types based on search term
  const filteredLeaveTypes = leaveTypes.filter(leaveType =>
    leaveType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leaveType.codeStr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter leave policies based on search term
  const filteredLeavePolicies = sampleLeavePolicies.filter(policy =>
    policy.name.toLowerCase().includes(policySearchTerm.toLowerCase()) ||
    policy.leaveType.toLowerCase().includes(policySearchTerm.toLowerCase())
  );

  const handleEdit = (leaveType: LeaveTypeListDto | LeaveTypeModDto) => {
    console.log('Edit leave type:', leaveType);
    
    // If it's a modification (from edit modal)
    if ('rowVersion' in leaveType) {
      const updatedLeaveType = leaveType as LeaveTypeModDto;
      
      // Update the leave type in state
      setLeaveTypes(prev => prev.map(lt => 
        lt.id === updatedLeaveType.id 
          ? { 
              ...lt, 
              name: updatedLeaveType.name,
              code: updatedLeaveType.code,
              isPaid: updatedLeaveType.isPaid,
              codeStr: updatedLeaveType.code === '0' ? 'ANNUAL' : 'SICK',
              isPaidStr: updatedLeaveType.isPaid ? 'Paid' : 'Unpaid',
              updatedAt: new Date().toISOString(),
              updatedBy: 'user',
              rowVersion: updatedLeaveType.rowVersion
            }
          : lt
      ));
    }
    // If it's just the edit action (from card click)
    else {
      console.log('Opening edit modal for:', leaveType);
      // The actual edit modal opening is handled in LeaveTypeSection
    }
  };

  const handleDelete = (leaveType: LeaveTypeListDto) => {
    console.log('Delete leave type:', leaveType);
    
    // Remove the leave type from state
    setLeaveTypes(prev => prev.filter(lt => lt.id !== leaveType.id));
    
    // Show success message or handle error
    // You might want to add a confirmation dialog here
  };

  const handleAddLeaveType = (leaveTypeData: LeaveTypeAddDto) => {
    console.log('Adding new leave type:', leaveTypeData);
    
    // Create a new leave type with generated ID and additional fields
    const newLeaveType: LeaveTypeListDto = {
      id: Date.now().toString(), // Generate a simple ID (replace with proper ID generation)
      name: leaveTypeData.name,
      code: leaveTypeData.code,
      isPaid: leaveTypeData.isPaid,
      codeStr: leaveTypeData.code === '0' ? 'ANNUAL' : 'SICK',
      isPaidStr: leaveTypeData.isPaid ? 'Paid' : 'Unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user', // Replace with actual user
      updatedBy: 'user',  // Replace with actual user
      rowVersion: '1'
    };

    // Add the new leave type to the state
    setLeaveTypes(prev => [...prev, newLeaveType]);
    setIsAddModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handlePolicyEdit = (policy: LeavePolicyListDto) => {
    console.log('Edit leave policy:', policy);
    // Implement edit logic here
  };

  const handlePolicyDelete = (policy: LeavePolicyListDto) => {
    console.log('Delete leave policy:', policy);
    // Implement delete logic here
  };

  const handlePolicyAddClick = () => {
    console.log('Add new leave policy clicked');
    // Implement add logic here
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6 min-h-screen"
    >
      {/* Use the LeaveHeader component */}
      <LeaveHeader />
      
      {/* Leave Type Section */}
      <LeaveTypeSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        leaveTypes={filteredLeaveTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAddModalOpen={isAddModalOpen}
        onAddLeaveType={handleAddLeaveType}
        onCloseAddModal={handleCloseAddModal}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Leave Policy Section */}
      <LeavePolicySection
        searchTerm={policySearchTerm}
        setSearchTerm={setPolicySearchTerm}
        viewMode={policyViewMode}
        setViewMode={setPolicyViewMode}
        leavePolicies={filteredLeavePolicies}
        onEdit={handlePolicyEdit}
        onDelete={handlePolicyDelete}
        onAddClick={handlePolicyAddClick}
      />
    </motion.section>
  );
};

export default PageAnnualLeave;