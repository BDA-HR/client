import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const CandidatePipeline = () => {
  const [candidates] = useState([
    {
      id: 'CAN-1001',
      name: 'John Smith',
      position: 'Software Engineer',
      source: 'LinkedIn',
      stage: 'Interview',
      status: 'Scheduled',
      department: 'Engineering',
      appliedDate: '2023-07-01',
      daysInStage: 5
    },
    {
      id: 'CAN-1002',
      name: 'Sarah Johnson',
      position: 'UX Designer',
      source: 'Company Website',
      stage: 'Application',
      status: 'New',
      department: 'Design',
      appliedDate: '2023-07-10',
      daysInStage: 2
    },
    {
      id: 'CAN-1003',
      name: 'Michael Chen',
      position: 'Data Analyst',
      source: 'Referral',
      stage: 'Offer',
      status: 'Negotiating',
      department: 'Data',
      appliedDate: '2023-07-05',
      daysInStage: 8
    },
    {
      id: 'CAN-1004',
      name: 'Emily Davis',
      position: 'Product Manager',
      source: 'Job Board',
      stage: 'Screening',
      status: 'In Review',
      department: 'Product',
      appliedDate: '2023-07-03',
      daysInStage: 4
    }
  ]);

  // Metrics data
  const metrics = [
    { id: 1, title: 'Total Applicants', value: 124, change: '+12%', icon: <Users className="w-6 h-6" /> },
    { id: 2, title: 'Hired Candidates', value: 24, change: '+5%', icon: <CheckCircle className="w-6 h-6" /> },
    { id: 3, title: 'Time to Hire (Avg)', value: '24 days', change: '-3 days', icon: <Clock className="w-6 h-6" /> },
    { id: 4, title: 'Rejected Candidates', value: 86, change: '+8%', icon: <XCircle className="w-6 h-6" /> },
  ];

  // Charts data
  const stageData = [
    { name: 'Application', candidates: 45 },
    { name: 'Screening', candidates: 28 },
    { name: 'Interview', candidates: 18 },
    { name: 'Offer', candidates: 12 },
    { name: 'Hired', candidates: 24 },
  ];

  const departmentData = [
    { name: 'Engineering', applicants: 42 },
    { name: 'Marketing', applicants: 28 },
    { name: 'Sales', applicants: 32 },
    { name: 'HR', applicants: 12 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      {metric.change} from last month
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    {metric.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidates by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="candidates" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="applicants"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Days in Stage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.id}</TableCell>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>{candidate.department}</TableCell>
                    <TableCell>
                      <Badge variant={
                        candidate.stage === 'Application' ? 'secondary' :
                        candidate.stage === 'Screening' ? 'outline' :
                        candidate.stage === 'Interview' ? 'default' :
                        candidate.stage === 'Offer' ? 'destructive' : 'default'
                      }>
                        {candidate.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        candidate.status === 'New' ? 'secondary' :
                        candidate.status === 'Scheduled' ? 'default' :
                        candidate.status === 'In Review' ? 'outline' : 'destructive'
                      }>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{candidate.daysInStage}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default CandidatePipeline;