import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, User, MoreHorizontal, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu';

interface Opportunity {
  id: string;
  name: string;
  accountName: string;
  contactName: string;
  amount: number;
  probability: number;
  expectedCloseDate: string;
  stage: string;
  assignedTo: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Enterprise Software License',
    accountName: 'Innovation Labs',
    contactName: 'Alice Johnson',
    amount: 125000,
    probability: 75,
    expectedCloseDate: '2024-02-15',
    stage: 'Proposal',
    assignedTo: 'Sarah Johnson'
  },
  {
    id: '2',
    name: 'Professional Services Package',
    accountName: 'Innovation Labs',
    contactName: 'Bob Smith',
    amount: 45000,
    probability: 85,
    expectedCloseDate: '2024-01-30',
    stage: 'Negotiation',
    assignedTo: 'Sarah Johnson'
  },
  {
    id: '3',
    name: 'Cloud Migration Project',
    accountName: 'TechCorp',
    contactName: 'Carol Davis',
    amount: 75000,
    probability: 50,
    expectedCloseDate: '2024-03-10',
    stage: 'Qualification',
    assignedTo: 'Mike Wilson'
  },
  {
    id: '4',
    name: 'Annual Support Contract',
    accountName: 'DataSystems',
    contactName: 'David Brown',
    amount: 25000,
    probability: 90,
    expectedCloseDate: '2024-02-05',
    stage: 'Negotiation',
    assignedTo: 'Emily Davis'
  }
];

const stages = [
  { name: 'Qualification', color: 'bg-blue-100 border-blue-200', probability: 25 },
  { name: 'Needs Analysis', color: 'bg-yellow-100 border-yellow-200', probability: 40 },
  { name: 'Proposal', color: 'bg-orange-100 border-orange-200', probability: 60 },
  { name: 'Negotiation', color: 'bg-purple-100 border-purple-200', probability: 80 },
  { name: 'Closed Won', color: 'bg-green-100 border-green-200', probability: 100 },
  { name: 'Closed Lost', color: 'bg-red-100 border-red-200', probability: 0 }
];

export default function SalesPipeline() {
  const [opportunities, setOpportunities] = useState(mockOpportunities);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getOpportunitiesByStage = (stageName: string) => {
    return opportunities.filter(opp => opp.stage === stageName);
  };

  const getStageTotal = (stageName: string) => {
    return getOpportunitiesByStage(stageName).reduce((sum, opp) => sum + opp.amount, 0);
  };

  const moveOpportunity = (opportunityId: string, newStage: string) => {
    setOpportunities(prev => 
      prev.map(opp => 
        opp.id === opportunityId 
          ? { ...opp, stage: newStage, probability: stages.find(s => s.name === newStage)?.probability || opp.probability }
          : opp
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Pipeline</h2>
          <p className="text-gray-600">Drag opportunities between stages to update their status</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-x-auto">
        {stages.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.name);
          const stageTotal = getStageTotal(stage.name);
          
          return (
            <div key={stage.name} className="min-w-80 lg:min-w-0">
              <Card className={`${stage.color} min-h-96`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      {stage.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {stageOpportunities.length}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(stageTotal)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stageOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {opportunity.name}
                        </h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            {stages.map(s => s.name !== stage.name && (
                              <DropdownMenuItem 
                                key={s.name}
                                onClick={() => moveOpportunity(opportunity.id, s.name)}
                              >
                                Move to {s.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          {opportunity.accountName}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              {formatCurrency(opportunity.amount)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {opportunity.probability}%
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(opportunity.expectedCloseDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span className="truncate max-w-16">{opportunity.assignedTo.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {stageOpportunities.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No opportunities</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Pipeline Summary */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle>Pipeline Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{opportunities.length}</div>
              <div className="text-sm text-gray-600">Total Opportunities</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.amount, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Pipeline Value</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(opportunities.reduce((sum, opp) => sum + (opp.amount * opp.probability / 100), 0))}
              </div>
              <div className="text-sm text-gray-600">Weighted Pipeline</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length)}%
              </div>
              <div className="text-sm text-gray-600">Average Probability</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}