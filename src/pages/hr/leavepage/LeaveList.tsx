import React, { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "../../../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";

interface LeaveRequest {
  id: string;
  employee: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  submittedAt: string;
}

const LeaveList = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employee: 'John Doe',
      leaveType: 'Annual Leave',
      startDate: '2023-08-15',
      endDate: '2023-08-18',
      days: 4,
      status: 'pending',
      reason: 'Family vacation',
      submittedAt: '2023-07-20',
    },
    {
      id: '2',
      employee: 'Jane Smith',
      leaveType: 'Sick Leave',
      startDate: '2023-08-10',
      endDate: '2023-08-11',
      days: 2,
      status: 'approved',
      reason: 'Medical appointment',
      submittedAt: '2023-07-18',
    },
    {
      id: '3',
      employee: 'Robert Johnson',
      leaveType: 'Unpaid Leave',
      startDate: '2023-09-01',
      endDate: '2023-09-05',
      days: 5,
      status: 'rejected',
      reason: 'Personal reasons',
      submittedAt: '2023-07-22',
    },
  ]);

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
    alert('Leave request approved');
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
    alert('Leave request rejected');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow 
              key={request.id}
              className={request.status === 'pending' ? 'bg-blue-50' : ''}
            >
              <TableCell className="font-medium">{request.employee}</TableCell>
              <TableCell>{request.leaveType}</TableCell>
              <TableCell>
                <div>{request.startDate} to {request.endDate}</div>
                <div className="text-sm text-gray-500">{request.days} days</div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>{request.submittedAt}</TableCell>
              <TableCell className="text-right">
                {request.status === 'pending' && (
                  <div className="flex justify-end space-x-2">
                    <Button 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approve
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm">Reject</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject this leave request? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleReject(request.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Confirm Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
                {request.status !== 'pending' && (
                  <span className="text-gray-500 text-sm">No actions</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Pending: {requests.filter(r => r.status === 'pending').length}
        </div>
        <div className="text-sm text-gray-600">
          Total: {requests.length}
        </div>
      </div>
    </div>
  );
};

export default LeaveList;