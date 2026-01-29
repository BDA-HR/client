import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, AlertCircle, Settings, RefreshCw, Eye, Edit } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Progress } from '../../../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Alert, AlertDescription } from '../../../ui/alert';
import { showToast } from '../../../../layout/layout';
import type { Lead, ScoringRule, ScoreBreakdown } from '../../../../types/crm';

interface LeadScoringProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onScoreUpdate: (leadId: string, newScore: number, breakdown: ScoreBreakdown[]) => void;
}

const SCORING_CATEGORIES = [
  {
    id: 'demographic',
    name: 'Demographic',
    description: 'Job title, company size, industry',
    color: '#3B82F6',
    weight: 0.25
  },
  {
    id: 'firmographic',
    name: 'Firmographic',
    description: 'Company details, revenue, location',
    color: '#10B981',
    weight: 0.25
  },
  {
    id: 'behavioral',
    name: 'Behavioral',
    description: 'Website activity, email engagement',
    color: '#F59E0B',
    weight: 0.25
  },
  {
    id: 'engagement',
    name: 'Engagement',
    description: 'Calls, meetings, responses',
    color: '#EF4444',
    weight: 0.25
  }
];

const SCORING_RULES: ScoringRule[] = [
  {
    id: '1',
    name: 'C-Level Executive',
    category: 'Demographic',
    criteria: [
      { field: 'jobTitle', operator: 'contains', value: 'CEO' },
      { field: 'jobTitle', operator: 'contains', value: 'CTO' },
      { field: 'jobTitle', operator: 'contains', value: 'CFO' }
    ],
    points: 25,
    isActive: true,
    weight: 1.0
  },
  {
    id: '2',
    name: 'Director Level',
    category: 'Demographic',
    criteria: [
      { field: 'jobTitle', operator: 'contains', value: 'Director' },
      { field: 'jobTitle', operator: 'contains', value: 'VP' },
      { field: 'jobTitle', operator: 'contains', value: 'Vice President' }
    ],
    points: 20,
    isActive: true,
    weight: 1.0
  },
  {
    id: '3',
    name: 'Manager Level',
    category: 'Demographic',
    criteria: [
      { field: 'jobTitle', operator: 'contains', value: 'Manager' },
      { field: 'jobTitle', operator: 'contains', value: 'Lead' },
      { field: 'jobTitle', operator: 'contains', value: 'Head' }
    ],
    points: 15,
    isActive: true,
    weight: 1.0
  },
  {
    id: '4',
    name: 'Enterprise Company',
    category: 'Firmographic',
    criteria: [
      { field: 'companySize', operator: 'equals', value: '500+' },
      { field: 'companySize', operator: 'equals', value: '1000+' }
    ],
    points: 20,
    isActive: true,
    weight: 1.0
  },
  {
    id: '5',
    name: 'Mid-Market Company',
    category: 'Firmographic',
    criteria: [
      { field: 'companySize', operator: 'equals', value: '201-500' },
      { field: 'companySize', operator: 'equals', value: '101-200' }
    ],
    points: 15,
    isActive: true,
    weight: 1.0
  },
  {
    id: '6',
    name: 'High Revenue Company',
    category: 'Firmographic',
    criteria: [
      { field: 'annualRevenue', operator: 'greater_than', value: '10000000' }
    ],
    points: 15,
    isActive: true,
    weight: 1.0
  },
  {
    id: '7',
    name: 'Email Engagement',
    category: 'Behavioral',
    criteria: [
      { field: 'emailsOpened', operator: 'greater_than', value: '3' }
    ],
    points: 10,
    isActive: true,
    weight: 1.0
  },
  {
    id: '8',
    name: 'Website Activity',
    category: 'Behavioral',
    criteria: [
      { field: 'pagesVisited', operator: 'greater_than', value: '5' }
    ],
    points: 10,
    isActive: true,
    weight: 1.0
  },
  {
    id: '9',
    name: 'Content Downloads',
    category: 'Behavioral',
    criteria: [
      { field: 'leadMagnetDownloads', operator: 'array_length_greater_than', value: '1' }
    ],
    points: 15,
    isActive: true,
    weight: 1.0
  },
  {
    id: '10',
    name: 'Demo Request',
    category: 'Engagement',
    criteria: [
      { field: 'demoRequested', operator: 'equals', value: 'true' }
    ],
    points: 25,
    isActive: true,
    weight: 1.0
  },
  {
    id: '11',
    name: 'Meeting Attendance',
    category: 'Engagement',
    criteria: [
      { field: 'meetingsAttended', operator: 'greater_than', value: '0' }
    ],
    points: 20,
    isActive: true,
    weight: 1.0
  },
  {
    id: '12',
    name: 'Call Engagement',
    category: 'Engagement',
    criteria: [
      { field: 'callsConnected', operator: 'greater_than', value: '1' }
    ],
    points: 15,
    isActive: true,
    weight: 1.0
  },
  {
    id: '13',
    name: 'High Budget',
    category: 'Firmographic',
    criteria: [
      { field: 'budget', operator: 'greater_than', value: '50000' }
    ],
    points: 20,
    isActive: true,
    weight: 1.0
  },
  {
    id: '14',
    name: 'Urgent Timeline',
    category: 'Engagement',
    criteria: [
      { field: 'urgency', operator: 'equals', value: 'Immediate' },
      { field: 'urgency', operator: 'equals', value: 'This Quarter' }
    ],
    points: 15,
    isActive: true,
    weight: 1.0
  }
];

export default function LeadScoring({ lead, isOpen, onClose, onScoreUpdate }: LeadScoringProps) {
  const [currentScore, setCurrentScore] = useState(lead.score);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [scoringHistory, setScoringHistory] = useState(lead.scoreHistory || []);

  useEffect(() => {
    if (isOpen) {
      calculateScore();
    }
  }, [isOpen, lead]);

  const calculateScore = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const breakdown: ScoreBreakdown[] = [];
    let totalScore = 0;
    
    // Calculate score for each category
    for (const category of SCORING_CATEGORIES) {
      const categoryRules = SCORING_RULES.filter(rule => 
        rule.category === category.name && rule.isActive
      );
      
      let categoryScore = 0;
      const matchedFactors: string[] = [];
      
      for (const rule of categoryRules) {
        if (evaluateRule(rule, lead)) {
          categoryScore += rule.points;
          matchedFactors.push(rule.name);
        }
      }
      
      // Apply category weight
      const weightedScore = Math.min(categoryScore * category.weight, 100);
      totalScore += weightedScore;
      
      breakdown.push({
        category: category.name,
        score: Math.round(weightedScore),
        maxScore: 100,
        percentage: Math.round((weightedScore / 100) * 100),
        factors: matchedFactors
      });
    }
    
    // Normalize total score to 0-100 range
    const finalScore = Math.min(Math.round(totalScore), 100);
    
    setCurrentScore(finalScore);
    setScoreBreakdown(breakdown);
    setIsCalculating(false);
    
    // Add to scoring history
    const newHistoryEntry = {
      id: Date.now().toString(),
      previousScore: lead.score,
      newScore: finalScore,
      changedAt: new Date().toISOString(),
      reason: 'Automatic scoring calculation',
      automatedChange: true,
      factors: breakdown.flatMap(b => b.factors.map(factor => ({
        factor,
        points: SCORING_RULES.find(r => r.name === factor)?.points || 0,
        description: `Matched rule: ${factor}`
      })))
    };
    
    setScoringHistory([newHistoryEntry, ...scoringHistory]);
  };

  const evaluateRule = (rule: ScoringRule, lead: Lead): boolean => {
    return rule.criteria.some(criterion => {
      const fieldValue = getFieldValue(lead, criterion.field);
      
      switch (criterion.operator) {
        case 'equals':
          return fieldValue === criterion.value;
        case 'contains':
          return typeof fieldValue === 'string' && 
                 fieldValue.toLowerCase().includes(criterion.value.toLowerCase());
        case 'greater_than':
          return Number(fieldValue) > Number(criterion.value);
        case 'less_than':
          return Number(fieldValue) < Number(criterion.value);
        case 'array_length_greater_than':
          return Array.isArray(fieldValue) && fieldValue.length > Number(criterion.value);
        default:
          return false;
      }
    });
  };

  const getFieldValue = (lead: Lead, fieldPath: string): any => {
    return fieldPath.split('.').reduce((obj, key) => obj?.[key], lead);
  };

  const handleSaveScore = () => {
    onScoreUpdate(lead.id, currentScore, scoreBreakdown);
    showToast(`Lead score updated to ${currentScore}`, 'success');
    onClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredBreakdown = selectedCategory === 'all' 
    ? scoreBreakdown 
    : scoreBreakdown.filter(b => b.category.toLowerCase() === selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Lead Scoring - {lead.firstName} {lead.lastName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Score</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={calculateScore}
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Recalculate
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
                    {isCalculating ? '...' : currentScore}
                  </div>
                  <div className="space-y-1">
                    <Badge className={getScoreBadgeColor(currentScore)}>
                      {currentScore >= 80 ? 'Hot' : currentScore >= 60 ? 'Warm' : currentScore >= 40 ? 'Cool' : 'Cold'}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      Previous: {lead.score}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Score Change</div>
                  <div className={`text-lg font-medium ${
                    currentScore > lead.score ? 'text-green-600' : 
                    currentScore < lead.score ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {currentScore > lead.score ? '+' : ''}{currentScore - lead.score}
                  </div>
                </div>
              </div>
              
              <Progress value={currentScore} className="w-full h-2" />
            </CardContent>
          </Card>

          <Tabs defaultValue="breakdown" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
              <TabsTrigger value="rules">Scoring Rules</TabsTrigger>
              <TabsTrigger value="history">Score History</TabsTrigger>
            </TabsList>

            {/* Score Breakdown */}
            <TabsContent value="breakdown" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Score Breakdown by Category</span>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {SCORING_CATEGORIES.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredBreakdown.map((breakdown) => (
                      <div key={breakdown.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: SCORING_CATEGORIES.find(c => c.name === breakdown.category)?.color 
                              }}
                            />
                            <span className="font-medium">{breakdown.category}</span>
                            <Badge variant="outline">{breakdown.score}/{breakdown.maxScore}</Badge>
                          </div>
                          <span className="text-sm text-gray-600">
                            {breakdown.percentage}%
                          </span>
                        </div>
                        
                        <Progress value={breakdown.percentage} className="w-full h-2" />
                        
                        {breakdown.factors.length > 0 && (
                          <div className="ml-5 space-y-1">
                            <div className="text-sm font-medium text-gray-700">Matched Factors:</div>
                            <div className="flex flex-wrap gap-1">
                              {breakdown.factors.map((factor, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scoring Rules */}
            <TabsContent value="rules" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Scoring Rules</CardTitle>
                  <p className="text-sm text-gray-600">
                    Rules used to calculate the lead score based on lead attributes and behavior.
                  </p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rule Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Matched</TableHead>
                        <TableHead>Criteria</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {SCORING_RULES.filter(rule => rule.isActive).map((rule) => {
                        const isMatched = evaluateRule(rule, lead);
                        return (
                          <TableRow key={rule.id}>
                            <TableCell className="font-medium">{rule.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{rule.category}</Badge>
                            </TableCell>
                            <TableCell>+{rule.points}</TableCell>
                            <TableCell>
                              {isMatched ? (
                                <Badge className="bg-green-100 text-green-800">✓ Matched</Badge>
                              ) : (
                                <Badge variant="outline">Not Matched</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {rule.criteria.map(c => `${c.field} ${c.operator} ${c.value}`).join(' OR ')}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Score History */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Score History</CardTitle>
                  <p className="text-sm text-gray-600">
                    Track how the lead score has changed over time.
                  </p>
                </CardHeader>
                <CardContent>
                  {scoringHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No scoring history available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scoringHistory.map((entry) => (
                        <div key={entry.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`text-lg font-medium ${getScoreColor(entry.newScore)}`}>
                                {entry.newScore}
                              </div>
                              <div className="text-sm text-gray-600">
                                (was {entry.previousScore})
                              </div>
                              <div className={`text-sm font-medium ${
                                entry.newScore > entry.previousScore ? 'text-green-600' : 
                                entry.newScore < entry.previousScore ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {entry.newScore > entry.previousScore ? '+' : ''}
                                {entry.newScore - entry.previousScore}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(entry.changedAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {entry.reason}
                          </div>
                          
                          {entry.factors && entry.factors.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Contributing Factors:</div>
                              <div className="flex flex-wrap gap-1">
                                {entry.factors.map((factor, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {factor.factor} (+{factor.points})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveScore}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={isCalculating}
            >
              Update Lead Score
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}