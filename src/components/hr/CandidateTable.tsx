// CandidateTable.tsx
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { History } from 'lucide-react';
import type { Candidate } from '../../types/candidate';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const CandidateTable = ({ 
  candidates, 
  showFullHistory, 
  onViewDetails, 
  onStageChange, 
  onStatusChange, 
  onToggleHistory,
  stageOptions,
  statusOptions
}: { 
  candidates: Candidate[]; 
  showFullHistory: boolean; 
  onViewDetails: (candidate: Candidate) => void; 
  onStageChange: (id: string, stage: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onToggleHistory: () => void;
  stageOptions: string[];
  statusOptions: string[];
}) => {
  const [filters, setFilters] = React.useState({
    position: 'all',
    department: 'all',
    stage: 'all',
    status: 'all'
  });

  // Get unique values for filter dropdowns
  const positions = Array.from(new Set(candidates.map(c => c.position)));
  const departments = Array.from(new Set(candidates.map(c => c.department)));

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredCandidates = candidates
    .filter(c => !showFullHistory ? c.stage !== 'Hired' && c.stage !== 'Rejected' : true)
    .filter(c => 
      (filters.position === 'all' || c.position === filters.position) &&
      (filters.department === 'all' || c.department === filters.department) &&
      (filters.stage === 'all' || c.stage === filters.stage) &&
      (filters.status === 'all' || c.status === filters.status)
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <Select 
              value={filters.position}
              onValueChange={value => handleFilterChange('position', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <Select 
              value={filters.department}
              onValueChange={value => handleFilterChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <Select 
              value={filters.stage}
              onValueChange={value => handleFilterChange('stage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stageOptions.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select 
              value={filters.status}
              onValueChange={value => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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
            {filteredCandidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell className="font-medium">{candidate.id}</TableCell>
                <TableCell className="font-medium">{candidate.name}</TableCell>
                <TableCell>{candidate.position}</TableCell>
                <TableCell>{candidate.department}</TableCell>
                <TableCell>
                  <Select
                    value={candidate.stage}
                    onValueChange={(value) => onStageChange(candidate.id, value)}
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
                    onValueChange={(value) => onStatusChange(candidate.id, value)}
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
                    onClick={() => onViewDetails(candidate)}
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
            onClick={onToggleHistory}
            className="flex items-center"
          >
            <History className="w-4 h-4 mr-2" />
            {showFullHistory ? 'Hide Full History' : 'View Full History'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateTable;