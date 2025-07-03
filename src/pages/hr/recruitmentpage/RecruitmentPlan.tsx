import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

const RecruitmentPlan = () => {
  const [plans] = useState([
    {
      id: 'RP-001',
      title: 'Software Engineer Expansion',
      department: 'IT',
      positions: 5,
      budget: '$85,000',
      status: 'Approved',
      timeline: {
        posting: '2023-06-01',
        screening: '2023-06-15',
        interviewing: '2023-07-01',
        onboarding: '2023-08-01'
      }
    }
  ]);

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recruitment Plan Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button>Create New Plan</Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
            </SelectContent>
          </Select>
          
          <Button>Filter</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan ID</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Positions</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <React.Fragment key={plan.id}>
                <TableRow>
                  <TableCell>{plan.id}</TableCell>
                  <TableCell>{plan.title}</TableCell>
                  <TableCell>{plan.department}</TableCell>
                  <TableCell>{plan.positions}</TableCell>
                  <TableCell>{plan.budget}</TableCell>
                  <TableCell>
                    <Badge variant={plan.status === 'Approved' ? 'default' : 'secondary'}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="link" 
                      onClick={() => toggleExpand(plan.id)}
                    >
                      {expandedRow === plan.id ? 'Collapse' : 'Expand'}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRow === plan.id && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-gray-50 p-4">
                      <div className="p-4">
                        <h4 className="font-medium mb-2">Timeline</h4>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Posting Deadline</p>
                            <p>{plan.timeline.posting}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Screening Deadline</p>
                            <p>{plan.timeline.screening}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Interview Deadline</p>
                            <p>{plan.timeline.interviewing}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Onboarding Date</p>
                            <p>{plan.timeline.onboarding}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecruitmentPlan;