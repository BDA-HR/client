import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription,
  CardFooter
} from "../ui/card";
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

import { 

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { 
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  CalendarDays,
  Briefcase
} from 'lucide-react';
import type { Candidate } from '../../types/candidate';

const CandidateDetail = ({ 
  candidate,
  onBack,
  onStageChange,
  onStatusChange,
  onMoveToNextStage,
  stageOptions,
  statusOptions
}: { 
  candidate: Candidate;
  onBack: () => void;
  onStageChange: (stage: string) => void;
  onStatusChange: (status: string) => void;
  onMoveToNextStage: () => void;
  stageOptions: string[];
  statusOptions: string[];
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <CardTitle>Candidate Details</CardTitle>
          <CardDescription>
            Detailed information for {candidate.name}
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
                <h3 className="text-xl font-bold">{candidate.name}</h3>
                <p className="text-gray-600">{candidate.position}</p>
                <p className="text-sm text-gray-500">{candidate.department} Department</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                <span>Experience: {candidate.experience}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
                <span>Applied on {candidate.appliedDate}</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-blue-600 cursor-pointer">
                  {candidate.resume}
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Education</h4>
              <p>{candidate.education}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Location</h4>
              <p>{candidate.location}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Salary Expectation</h4>
              <p>{candidate.salaryExpectation}</p>
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
                  value={candidate.status}
                  onValueChange={onStatusChange}
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
                <p>{candidate.interviewDate || 'Not scheduled yet'}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Source</h4>
                <p>{candidate.source}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Department</h4>
                <p>{candidate.department}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Recruitment Pipeline</h4>
              <div className="flex items-center justify-between">
                {stageOptions.map((stage, index) => (
                  <div key={stage} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      candidate.stage === stage 
                        ? 'bg-blue-500 text-white' 
                        : index <= stageOptions.indexOf(candidate.stage) 
                          ? 'bg-gray-200 text-gray-600' 
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`mt-2 text-xs ${
                      candidate.stage === stage 
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
                value={candidate.stage}
                onValueChange={onStageChange}
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
                {candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-gray-600">{candidate.notes}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Candidate History</h4>
              <div className="space-y-4">
                {candidate.history.map((entry, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      {index < candidate.history.length - 1 && (
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
            <Button onClick={onMoveToNextStage}>
              Move to Next Stage
            </Button>
          </CardFooter>
        </Card>
      </div>
    </CardContent>
  </Card>
);

export default CandidateDetail;