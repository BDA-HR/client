import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription,
  CardFooter
} from "../../../components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  CalendarDays,
  Briefcase,
  History
} from 'lucide-react';
import { Separator } from "../../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const CandidatePipeline = () => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [candidates, setCandidates] = useState([
    {
      id: 'CAN-1001',
      name: 'John Smith',
      position: 'Software Engineer',
      source: 'LinkedIn',
      stage: 'Interview',
      status: 'Scheduled',
      department: 'Engineering',
      appliedDate: '2023-07-01',
      daysInStage: 5,
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      resume: 'john_smith_resume.pdf',
      interviewDate: '2023-07-15',
      experience: '5 years',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      notes: 'Strong technical skills, excellent communication',
      education: 'BSc Computer Science, MIT',
      location: 'San Francisco, CA',
      salaryExpectation: '$120,000',
      history: [
        { date: '2023-07-01', stage: 'Application', status: 'New', note: 'Applied via LinkedIn' },
        { date: '2023-07-03', stage: 'Screening', status: 'In Review', note: 'Resume screened by HR' },
        { date: '2023-07-10', stage: 'Interview', status: 'Scheduled', note: 'Technical interview scheduled' }
      ]
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
      daysInStage: 2,
      email: 'sarah.johnson@example.com',
      phone: '(555) 987-6543',
      resume: 'sarah_johnson_resume.pdf',
      experience: '3 years',
      skills: ['Figma', 'UI/UX Design', 'User Research', 'Prototyping'],
      notes: 'Impressive portfolio with diverse projects',
      education: 'BA Design, Stanford University',
      location: 'New York, NY',
      salaryExpectation: '$95,000',
      history: [
        { date: '2023-07-10', stage: 'Application', status: 'New', note: 'Applied via company website' }
      ]
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
      daysInStage: 8,
      email: 'michael.chen@example.com',
      phone: '(555) 456-7890',
      resume: 'michael_chen_resume.pdf',
      interviewDate: '2023-07-18',
      experience: '4 years',
      skills: ['Python', 'SQL', 'Data Visualization', 'Machine Learning'],
      notes: 'Strong analytical skills, needs visa sponsorship',
      education: 'MSc Data Science, Harvard University',
      location: 'Boston, MA',
      salaryExpectation: '$110,000',
      history: [
        { date: '2023-07-05', stage: 'Application', status: 'New', note: 'Referred by employee' },
        { date: '2023-07-08', stage: 'Screening', status: 'Approved', note: 'Passed initial screening' },
        { date: '2023-07-12', stage: 'Interview', status: 'Completed', note: 'Technical interview passed' },
        { date: '2023-07-15', stage: 'Offer', status: 'Negotiating', note: 'Salary negotiation in progress' }
      ]
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
      daysInStage: 4,
      email: 'emily.davis@example.com',
      phone: '(555) 234-5678',
      resume: 'emily_davis_resume.pdf',
      experience: '6 years',
      skills: ['Product Strategy', 'Agile', 'Market Research', 'Roadmapping'],
      notes: 'Previous experience at FAANG companies',
      education: 'MBA, Wharton School',
      location: 'Seattle, WA',
      salaryExpectation: '$140,000',
      history: [
        { date: '2023-07-03', stage: 'Application', status: 'New', note: 'Applied via job board' },
        { date: '2023-07-05', stage: 'Screening', status: 'In Review', note: 'Resume under review' }
      ]
    },
    {
      id: 'CAN-1005',
      name: 'David Wilson',
      position: 'DevOps Engineer',
      source: 'LinkedIn',
      stage: 'Hired',
      status: 'Completed',
      department: 'Engineering',
      appliedDate: '2023-06-20',
      daysInStage: 0,
      email: 'david.wilson@example.com',
      phone: '(555) 876-5432',
      resume: 'david_wilson_resume.pdf',
      experience: '7 years',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      notes: 'Extensive cloud infrastructure experience',
      education: 'MSc Computer Engineering, Caltech',
      location: 'Austin, TX',
      salaryExpectation: '$135,000',
      history: [
        { date: '2023-06-20', stage: 'Application', status: 'New', note: 'Applied via LinkedIn' },
        { date: '2023-06-25', stage: 'Screening', status: 'Approved', note: 'Passed initial screening' },
        { date: '2023-06-30', stage: 'Interview', status: 'Completed', note: 'Technical interview passed' },
        { date: '2023-07-05', stage: 'Offer', status: 'Accepted', note: 'Offer accepted' },
        { date: '2023-07-10', stage: 'Hired', status: 'Completed', note: 'Onboarding completed' }
      ]
    },
    {
      id: 'CAN-1006',
      name: 'Lisa Thompson',
      position: 'Marketing Specialist',
      source: 'Company Website',
      stage: 'Rejected',
      status: 'Declined',
      department: 'Marketing',
      appliedDate: '2023-07-02',
      daysInStage: 3,
      email: 'lisa.thompson@example.com',
      phone: '(555) 345-6789',
      resume: 'lisa_thompson_resume.pdf',
      experience: '4 years',
      skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media'],
      notes: 'Good skills but not the right cultural fit',
      education: 'BA Marketing, NYU',
      location: 'Chicago, IL',
      salaryExpectation: '$85,000',
      history: [
        { date: '2023-07-02', stage: 'Application', status: 'New', note: 'Applied via company website' },
        { date: '2023-07-05', stage: 'Screening', status: 'Approved', note: 'Resume approved' },
        { date: '2023-07-08', stage: 'Interview', status: 'Completed', note: 'Interview completed' },
        { date: '2023-07-12', stage: 'Rejected', status: 'Declined', note: 'Not selected after interview' }
      ]
    }
  ]);

  // Stage and status options
  const stageOptions = ['Application', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
  const statusOptions = ['New', 'Scheduled', 'In Review', 'Completed', 'Approved', 'Negotiating', 'Accepted', 'Declined', 'Hired', 'Rejected'];

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

  const handleViewDetails = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
  };

  const handleBackToList = () => {
    setSelectedCandidateId(null);
  };

  const handleStageChange = (candidateId: string, newStage: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { 
              ...candidate, 
              stage: newStage,
              history: [
                ...candidate.history,
                { 
                  date: new Date().toISOString().split('T')[0], 
                  stage: newStage, 
                  status: candidate.status,
                  note: `Stage changed to ${newStage}`
                }
              ]
            } 
          : candidate
      )
    );
  };

  const handleStatusChange = (candidateId: string, newStatus: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { 
              ...candidate, 
              status: newStatus,
              history: [
                ...candidate.history,
                { 
                  date: new Date().toISOString().split('T')[0], 
                  stage: candidate.stage, 
                  status: newStatus,
                  note: `Status changed to ${newStatus}`
                }
              ]
            } 
          : candidate
      )
    );
  };

  const handleMoveToNextStage = (candidateId: string) => {
    setCandidates(prev => 
      prev.map(candidate => {
        if (candidate.id === candidateId) {
          const currentIndex = stageOptions.indexOf(candidate.stage);
          if (currentIndex < stageOptions.length - 1) {
            const newStage = stageOptions[currentIndex + 1];
            return { 
              ...candidate, 
              stage: newStage,
              history: [
                ...candidate.history,
                { 
                  date: new Date().toISOString().split('T')[0], 
                  stage: newStage, 
                  status: candidate.status,
                  note: `Moved to next stage: ${newStage}`
                }
              ]
            };
          }
        }
        return candidate;
      })
    );
  };

  // Candidate Detail View
  if (selectedCandidateId) {
    const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
    
    if (!selectedCandidate) {
      return (
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate not found</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleBackToList}>Back to list</Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Candidate Details</CardTitle>
                <CardDescription>
                  Detailed information for {selectedCandidate.name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div>
                      <h3 className="text-xl font-bold">{selectedCandidate.name}</h3>
                      <p className="text-gray-600">{selectedCandidate.position}</p>
                      <p className="text-sm text-gray-500">{selectedCandidate.department} Department</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{selectedCandidate.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{selectedCandidate.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Experience: {selectedCandidate.experience}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Applied on {selectedCandidate.appliedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-blue-600 cursor-pointer">
                        {selectedCandidate.resume}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Education</h4>
                    <p>{selectedCandidate.education}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Location</h4>
                    <p>{selectedCandidate.location}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Salary Expectation</h4>
                    <p>{selectedCandidate.salaryExpectation}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Status & Timeline */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Status</h4>
                      <Select
                        value={selectedCandidate.status}
                        onValueChange={(value) => handleStatusChange(selectedCandidate.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              <div className="flex items-center">
                                <Badge 
                                  variant={
                                    option === 'New' ? 'secondary' :
                                    option === 'Scheduled' ? 'default' :
                                    option === 'In Review' ? 'outline' : 
                                    option === 'Rejected' || option === 'Declined' ? 'destructive' : 'default'
                                  }
                                  className="mr-2"
                                >
                                  {option}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Interview Date</h4>
                      <p>{selectedCandidate.interviewDate || 'Not scheduled yet'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Source</h4>
                      <p>{selectedCandidate.source}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Department</h4>
                      <p>{selectedCandidate.department}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-3">Recruitment Pipeline</h4>
                    <div className="flex items-center justify-between">
                      {stageOptions.map((stage, index) => (
                        <div key={stage} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            selectedCandidate.stage === stage 
                              ? 'bg-blue-500 text-white' 
                              : index <= stageOptions.indexOf(selectedCandidate.stage) 
                                ? 'bg-gray-200 text-gray-600' 
                                : 'bg-gray-100 text-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <span className={`mt-2 text-xs ${
                            selectedCandidate.stage === stage 
                              ? 'font-bold text-blue-600' 
                              : 'text-gray-500'
                          }`}>
                            {stage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Stage</h4>
                    <Select
                      value={selectedCandidate.stage}
                      onValueChange={(value) => handleStageChange(selectedCandidate.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {stageOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            <div className="flex items-center">
                              <Badge 
                                variant={
                                  option === 'Application' ? 'secondary' :
                                  option === 'Screening' ? 'outline' :
                                  option === 'Interview' ? 'default' :
                                  option === 'Offer' ? 'destructive' : 
                                  option === 'Hired' ? 'default' : 'destructive'
                                }
                                className="mr-2"
                              >
                                {option}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedCandidate.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-gray-600">{selectedCandidate.notes}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-3">Candidate History</h4>
                    <div className="space-y-4">
                      {selectedCandidate.history.map((entry, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex flex-col items-center mr-4">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            {index < selectedCandidate.history.length - 1 && (
                              <div className="w-px h-full bg-gray-300"></div>
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="font-medium">{entry.stage} - <Badge variant={
                              entry.status === 'New' ? 'secondary' :
                              entry.status === 'Scheduled' ? 'default' :
                              entry.status === 'In Review' ? 'outline' : 
                              entry.status === 'Rejected' || entry.status === 'Declined' ? 'destructive' : 'default'
                            }>{entry.status}</Badge></p>
                            <p className="text-sm text-gray-500">{entry.date}</p>
                            <p className="text-sm mt-1">{entry.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-3">
                  <Button variant="outline">Schedule Interview</Button>
                  <Button onClick={() => handleMoveToNextStage(selectedCandidate.id)}>
                    Move to Next Stage
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main List View
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
                {candidates.filter(c => !showFullHistory ? c.stage !== 'Hired' && c.stage !== 'Rejected' : true)
                  .map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.id}</TableCell>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>{candidate.department}</TableCell>
                    <TableCell>
                      <Select
                        value={candidate.stage}
                        onValueChange={(value) => handleStageChange(candidate.id, value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {stageOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              <Badge 
                                variant={
                                  option === 'Application' ? 'secondary' :
                                  option === 'Screening' ? 'outline' :
                                  option === 'Interview' ? 'default' :
                                  option === 'Offer' ? 'destructive' : 
                                  option === 'Hired' ? 'default' : 'destructive'
                                }
                              >
                                {option}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={candidate.status}
                        onValueChange={(value) => handleStatusChange(candidate.id, value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              <Badge 
                                variant={
                                  option === 'New' ? 'secondary' :
                                  option === 'Scheduled' ? 'default' :
                                  option === 'In Review' ? 'outline' : 
                                  option === 'Rejected' || option === 'Declined' ? 'destructive' : 'default'
                                }
                              >
                                {option}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{candidate.daysInStage}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(candidate.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="flex items-center"
              >
                <History className="w-4 h-4 mr-2" />
                {showFullHistory ? 'Hide Full History' : 'View Full History'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default CandidatePipeline;