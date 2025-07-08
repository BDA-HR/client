import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription,
} from "../../../components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  
} from 'lucide-react';
import { Badge } from "../../../components/ui/badge";

const RecruitmentList = () => {
  // State for recruitment plans
  const [plans] = useState([
    {
      id: 'RP-001',
      title: 'Software Engineer Expansion',
      department: 'IT',
      positions: 5,
      budget: 85000,
      employmentType: 'Full-time',
      qualifications: "Bachelor's Degree in Computer Science",
      status: 'Approved',
      timeline: {
        posting: '2023-06-01',
        screening: '2023-06-15',
        interviewing: '2023-07-01',
        onboarding: '2023-08-01'
      },
      createdBy: 'Jane Smith',
      createdDate: '2023-05-10',
      applicants: 42,
      hired: 3,
      rejected: 32
    },
    {
      id: 'RP-002',
      title: 'Marketing Team Growth',
      department: 'Marketing',
      positions: 3,
      budget: 65000,
      employmentType: 'Full-time',
      qualifications: "Bachelor's Degree in Marketing",
      status: 'Pending',
      timeline: {
        posting: '2023-07-01',
        screening: '2023-07-15',
        interviewing: '2023-08-01',
        onboarding: '2023-09-01'
      },
      createdBy: 'Mike Johnson',
      createdDate: '2023-06-15',
      applicants: 28,
      hired: 1,
      rejected: 22
    },
    {
      id: 'RP-003',
      title: 'Customer Support Reps',
      department: 'Customer Service',
      positions: 4,
      budget: 50000,
      employmentType: 'Part-time',
      qualifications: "Associate's Degree",
      status: 'Rejected',
      timeline: {
        posting: '2023-08-01',
        screening: '2023-08-15',
        interviewing: '2023-09-01',
        onboarding: '2023-10-01'
      },
      createdBy: 'Sarah Williams',
      createdDate: '2023-07-20',
      applicants: 15,
      hired: 0,
      rejected: 12
    }
  ]);

  // State for requisitions
  const [requisitions, setRequisitions] = useState([
    {
      id: 'REQ-1001',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      positions: 2,
      budget: 120000,
      status: 'Approved',
      submittedBy: 'John Smith',
      submittedDate: '2023-06-10',
      approvedBy: 'Jane Doe',
      approvedDate: '2023-06-15'
    },
    {
      id: 'REQ-1002',
      title: 'Marketing Specialist',
      department: 'Marketing',
      positions: 1,
      budget: 85000,
      status: 'Pending',
      submittedBy: 'Sarah Johnson',
      submittedDate: '2023-07-01',
      approvedBy: '-',
      approvedDate: '-'
    },
    {
      id: 'REQ-1003',
      title: 'HR Coordinator',
      department: 'Human Resources',
      positions: 1,
      budget: 65000,
      status: 'Rejected',
      submittedBy: 'Michael Brown',
      submittedDate: '2023-07-15',
      approvedBy: 'Jane Doe',
      approvedDate: '2023-07-18',
      reason: 'Budget constraints'
    }
  ]);

  // Approval workflow handlers
  const handleApprove = (id: string) => {
    setRequisitions(requisitions.map(req => 
      req.id === id ? {
        ...req, 
        status: 'Approved',
        approvedBy: 'Current User',
        approvedDate: new Date().toISOString().split('T')[0]
      } : req
    ));
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please enter reason for rejection:');
    if (reason) {
      setRequisitions(requisitions.map(req => 
        req.id === id ? {
          ...req, 
          status: 'Rejected',
          approvedBy: 'Current User',
          approvedDate: new Date().toISOString().split('T')[0],
          reason
        } : req
      ));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Rejected': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recruitment Dashboard</CardTitle>
            <CardDescription>
              Manage hiring plans and approval workflows
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Analytics Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">124</div>
                    <div className="text-sm text-gray-600">Total Applicants</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm text-gray-600">Hired Candidates</div>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-sm text-gray-600">Pending Offers</div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">86</div>
                    <div className="text-sm text-gray-600">Rejected Candidates</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Recruitment Plans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Recruitment Plans</CardTitle>
              <CardDescription>
                Approved hiring plans with current progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan ID</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Positions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{plan.id}</TableCell>
                      <TableCell className="font-medium">{plan.title}</TableCell>
                      <TableCell>{plan.department}</TableCell>
                      <TableCell>{plan.employmentType}</TableCell>
                      <TableCell>{plan.positions}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            plan.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                            plan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }
                        >
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <span className="text-green-600">{plan.hired} hired</span>
                          <span className="text-gray-400">/</span>
                          <span>{plan.applicants} applied</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Approval Workflow Table */}
          <Card>
            <CardHeader>
              <CardTitle>Requisition Approval Workflow</CardTitle>
              <CardDescription>
                Job requests pending approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Req ID</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Positions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitions.map((req) => (
                    <TableRow key={req.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{req.id}</TableCell>
                      <TableCell className="font-medium">{req.title}</TableCell>
                      <TableCell>{req.department}</TableCell>
                      <TableCell>{req.positions}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(req.status)}
                          <Badge 
                            variant="outline"
                            className={
                              req.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                              req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            }
                          >
                            {req.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{req.submittedBy}</div>
                          <div className="text-gray-500 text-xs">{req.submittedDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {req.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(req.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleReject(req.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            {req.approvedBy}<br/>
                            <span className="text-xs">{req.approvedDate}</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentList;