import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingUp, Users, Star, Edit, Trash2, BarChart3 } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Progress } from '../../../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Switch } from '../../../ui/switch';
import { showToast } from '../../../../layout/layout';
import type { LeadScoringRule } from '../../../../types/crm';

// Mock lead scoring rules
const mockScoringRules: LeadScoringRule[] = [
  {
    id: '1',
    name: 'Email Engagement',
    criteria: [
      { field: 'email_opened', operator: 'equals', value: 'true' }
    ],
    points: 10,
    isActive: true
  },
  {
    id: '2',
    name: 'Website Visit',
    criteria: [
      { field: 'page_visited', operator: 'equals', value: 'pricing' }
    ],
    points: 15,
    isActive: true
  },
  {
    id: '3',
    name: 'Demo Request',
    criteria: [
      { field: 'form_submitted', operator: 'equals', value: 'demo_request' }
    ],
    points: 50,
    isActive: true
  },
  {
    id: '4',
    name: 'Company Size - Enterprise',
    criteria: [
      { field: 'company_size', operator: 'greater_than', value: '500' }
    ],
    points: 25,
    isActive: true
  },
  {
    id: '5',
    name: 'Industry - Technology',
    criteria: [
      { field: 'industry', operator: 'equals', value: 'technology' }
    ],
    points: 20,
    isActive: true
  },
  {
    id: '6',
    name: 'Multiple Page Views',
    criteria: [
      { field: 'page_views', operator: 'greater_than', value: '5' }
    ],
    points: 30,
    isActive: false
  }
];

// Mock lead scores data
const mockLeadScores = [
  { id: '1', name: 'John Smith', company: 'TechCorp Solutions', score: 85, grade: 'A', trend: 'up' },
  { id: '2', name: 'Emily Davis', company: 'RetailPlus Inc', score: 72, grade: 'B', trend: 'up' },
  { id: '3', name: 'Robert Chen', company: 'Global Manufacturing', score: 91, grade: 'A', trend: 'stable' },
  { id: '4', name: 'Sarah Wilson', company: 'StartupCo', score: 45, grade: 'C', trend: 'down' },
  { id: '5', name: 'Michael Brown', company: 'Enterprise Corp', score: 78, grade: 'B', trend: 'up' },
  { id: '6', name: 'Lisa Garcia', company: 'Innovation Labs', score: 63, grade: 'B', trend: 'stable' }
];

export default function LeadScoring() {
  const [scoringRules, setScoringRules] = useState<LeadScoringRule[]>(mockScoringRules);
  const [leadScores] = useState(mockLeadScores);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);

  const toggleRuleStatus = (ruleId: string) => {
    setScoringRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
    
    const rule = scoringRules.find(r => r.id === ruleId);
    showToast.success(`Rule "${rule?.name}" ${rule?.isActive ? 'deactivated' : 'activated'}`);
  };

  const deleteRule = (ruleId: string) => {
    const rule = scoringRules.find(r => r.id === ruleId);
    setScoringRules(prev => prev.filter(rule => rule.id !== ruleId));
    showToast.success(`Rule "${rule?.name}" deleted`);
  };

  const getScoreGrade = (score: number) => {
    if (score >= 80) return { grade: 'A', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { grade: 'B', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { grade: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { grade: 'D', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const formatCriteria = (criteria: any[]) => {
    return criteria.map(c => `${c.field} ${c.operator} ${c.value}`).join(' AND ');
  };

  const activeRules = scoringRules.filter(rule => rule.isActive).length;
  const totalPoints = scoringRules.filter(rule => rule.isActive).reduce((sum, rule) => sum + rule.points, 0);
  const avgScore = leadScores.reduce((sum, lead) => sum + lead.score, 0) / leadScores.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Lead Scoring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-purple-600">{activeRules}</p>
                <p className="text-xs text-gray-500">of {scoringRules.length} total</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Max Points</p>
                <p className="text-2xl font-bold text-blue-600">{totalPoints}</p>
                <p className="text-xs text-gray-500">possible score</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-green-600">{avgScore.toFixed(0)}</p>
                <p className="text-xs text-gray-500">across all leads</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">A-Grade Leads</p>
                <p className="text-2xl font-bold text-orange-600">
                  {leadScores.filter(lead => lead.score >= 80).length}
                </p>
                <p className="text-xs text-gray-500">high-quality leads</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-purple-600" />
            <span>Lead Scores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadScores
                .sort((a, b) => b.score - a.score)
                .map((lead) => {
                  const gradeInfo = getScoreGrade(lead.score);
                  const progressPercentage = (lead.score / totalPoints) * 100;
                  
                  return (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{lead.company}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-lg font-bold text-gray-900">{lead.score}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${gradeInfo.bgColor} ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getTrendIcon(lead.trend)}
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress value={progressPercentage} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">
                            {progressPercentage.toFixed(0)}%
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Scoring Rules */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Scoring Rules</span>
            </CardTitle>
            <Button 
              onClick={() => setShowRuleBuilder(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoringRules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`border rounded-lg p-4 ${rule.isActive ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{rule.name}</h3>
                      <Badge className={rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="font-bold text-purple-600">
                        +{rule.points} points
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">When:</span> {formatCriteria(rule.criteria)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleRuleStatus(rule.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showToast.success('Edit rule functionality would be implemented here')}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { grade: 'A', range: '80-100', count: leadScores.filter(l => l.score >= 80).length, color: 'bg-green-500' },
              { grade: 'B', range: '60-79', count: leadScores.filter(l => l.score >= 60 && l.score < 80).length, color: 'bg-blue-500' },
              { grade: 'C', range: '40-59', count: leadScores.filter(l => l.score >= 40 && l.score < 60).length, color: 'bg-yellow-500' },
              { grade: 'D', range: '0-39', count: leadScores.filter(l => l.score < 40).length, color: 'bg-red-500' }
            ].map((grade) => {
              const percentage = leadScores.length > 0 ? (grade.count / leadScores.length) * 100 : 0;
              
              return (
                <div key={grade.grade} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 w-24">
                    <div className={`w-4 h-4 rounded ${grade.color}`}></div>
                    <span className="font-medium text-gray-900">Grade {grade.grade}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{grade.range} points</span>
                      <span className="text-sm font-medium text-gray-900">
                        {grade.count} leads ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${grade.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rule Builder Placeholder */}
      {showRuleBuilder && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Scoring Rule Builder</CardTitle>
              <Button variant="outline" onClick={() => setShowRuleBuilder(false)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Scoring Rule Builder</h3>
              <p className="text-gray-500">Visual rule builder interface would be implemented here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}