import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, User, Edit, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import type { Opportunity } from '../../../../types/crm';

interface SalesPipelineProps {
  opportunities: Opportunity[];
  onStageChange: (opportunityId: string, newStage: Opportunity['stage']) => void;
  onEdit: (opportunity: Opportunity) => void;
}

const stages: Opportunity['stage'][] = [
  'Qualification',
  'Needs Analysis', 
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

const stageColors = {
  'Qualification': 'bg-blue-100 border-blue-300',
  'Needs Analysis': 'bg-yellow-100 border-yellow-300',
  'Proposal': 'bg-purple-100 border-purple-300',
  'Negotiation': 'bg-orange-100 border-orange-300',
  'Closed Won': 'bg-green-100 border-green-300',
  'Closed Lost': 'bg-red-100 border-red-300'
};

const probabilityColors = {
  low: 'text-red-600',
  medium: 'text-yellow-600',
  high: 'text-green-600'
};

export default function SalesPipeline({ opportunities, onStageChange, onEdit }: SalesPipelineProps) {
  const [draggedOpportunity, setDraggedOpportunity] = useState<string | null>(null);

  const getOpportunitiesByStage = (stage: Opportunity['stage']) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const getStageValue = (stage: Opportunity['stage']) => {
    return getOpportunitiesByStage(stage).reduce((sum, opp) => sum + opp.amount, 0);
  };

  const getProbabilityLevel = (probability: number) => {
    if (probability < 30) return 'low';
    if (probability < 70) return 'medium';
    return 'high';
  };

  const isOverdue = (expectedCloseDate: string) => {
    return new Date(expectedCloseDate) < new Date();
  };

  const handleDragStart = (e: React.DragEvent, opportunityId: string) => {
    setDraggedOpportunity(opportunityId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStage: Opportunity['stage']) => {
    e.preventDefault();
    if (draggedOpportunity) {
      onStageChange(draggedOpportunity, targetStage);
      setDraggedOpportunity(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stages.map((stage) => {
              const stageOpps = getOpportunitiesByStage(stage);
              const stageValue = getStageValue(stage);
              
              return (
                <div key={stage} className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    ${stageValue.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-700">{stage}</div>
                  <div className="text-xs text-gray-500">
                    {stageOpps.length} deal{stageOpps.length !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage);
          const stageValue = getStageValue(stage);
          
          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Card className={`${stageColors[stage]} border-2`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {stage}
                  </CardTitle>
                  <div className="text-xs text-gray-600">
                    {stageOpportunities.length} deals • ${stageValue.toLocaleString()}
                  </div>
                </CardHeader>
              </Card>

              <div
                className="space-y-3 min-h-96"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {stageOpportunities.map((opportunity) => (
                  <motion.div
                    key={opportunity.id}
                    layout
                    draggable
                    onDragStart={(e) => handleDragStart(e, opportunity.id)}
                    className="cursor-move"
                  >
                    <Card className="hover:shadow-md transition-shadow bg-white">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight">
                              {opportunity.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(opportunity)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Amount and Probability */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-gray-900">
                                ${opportunity.amount.toLocaleString()}
                              </span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${probabilityColors[getProbabilityLevel(opportunity.probability)]}`}
                            >
                              {opportunity.probability}%
                            </Badge>
                          </div>

                          {/* Owner and Close Date */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{opportunity.assignedTo}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className={`text-xs ${
                                isOverdue(opportunity.expectedCloseDate) 
                                  ? 'text-red-600 font-medium' 
                                  : 'text-gray-600'
                              }`}>
                                {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                              </span>
                              {isOverdue(opportunity.expectedCloseDate) && (
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          </div>

                          {/* Next Step */}
                          {opportunity.nextStep && (
                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              <strong>Next:</strong> {opportunity.nextStep}
                            </div>
                          )}

                          {/* Stage Change Dropdown */}
                          <Select
                            value={opportunity.stage}
                            onValueChange={(value) => onStageChange(opportunity.id, value as Opportunity['stage'])}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {stages.map((stageOption) => (
                                <SelectItem key={stageOption} value={stageOption} className="text-xs">
                                  {stageOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {stageOpportunities.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-sm">No opportunities</div>
                    <div className="text-xs">Drag deals here</div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}