import React, { useState } from 'react';
import { Target, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card';
import { Badge } from '../../../../ui/badge';
import { Slider } from '../../../../ui/slider';
import { Progress } from '../../../../ui/progress';
import type { Lead } from '../../../../../types/crm';

interface ScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  weight: number;
  description: string;
}

interface LeadScoringProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onScoreUpdate: (leadId: string, newScore: number, breakdown: ScoreBreakdown[]) => void;
}

export default function LeadScoring({ 
  lead, 
  isOpen, 
  onClose, 
  onScoreUpdate 
}: LeadScoringProps) {
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown[]>([
    {
      category: 'Company Fit',
      score: 8,
      maxScore: 10,
      weight: 25,
      description: 'How well the company matches our ideal customer profile'
    },
    {
      category: 'Budget Authority',
      score: 7,
      maxScore: 10,
      weight: 20,
      description: 'Decision-making power and budget availability'
    },
    {
      category: 'Need Urgency',
      score: 6,
      maxScore: 10,
      weight: 20,
      description: 'How urgent is their need for a solution'
    },
    {
      category: 'Engagement Level',
      score: 9,
      maxScore: 10,
      weight: 15,
      description: 'Level of engagement with our content and communications'
    },
    {
      category: 'Timeline',
      score: 5,
      maxScore: 10,
      weight: 10,
      description: 'Expected timeline for making a decision'
    },
    {
      category: 'Competition',
      score: 7,
      maxScore: 10,
      weight: 10,
      description: 'Competitive landscape and our position'
    }
  ]);

  const calculateTotalScore = (breakdown: ScoreBreakdown[]) => {
    return Math.round(
      breakdown.reduce((total, item) => {
        const weightedScore = (item.score / item.maxScore) * item.weight;
        return total + weightedScore;
      }, 0)
    );
  };

  const currentScore = calculateTotalScore(scoreBreakdown);

  const handleScoreChange = (categoryIndex: number, newScore: number[]) => {
    const updatedBreakdown = [...scoreBreakdown];
    updatedBreakdown[categoryIndex].score = newScore[0];
    setScoreBreakdown(updatedBreakdown);
  };

  const handleSaveScore = () => {
    const newTotalScore = calculateTotalScore(scoreBreakdown);
    onScoreUpdate(lead.id, newTotalScore, scoreBreakdown);
    onClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Hot Lead', color: 'bg-red-100 text-red-800' };
    if (score >= 60) return { label: 'Warm Lead', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Cold Lead', color: 'bg-blue-100 text-blue-800' };
  };

  const scoreBadge = getScoreBadge(currentScore);

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
                <span>Current Lead Score</span>
                <Badge className={scoreBadge.color}>
                  {scoreBadge.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
                    {currentScore}
                  </div>
                  <div className="text-sm text-gray-500">out of 100</div>
                </div>
                <div className="flex-1">
                  <Progress value={currentScore} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Cold (0-59)</span>
                    <span>Warm (60-79)</span>
                    <span>Hot (80-100)</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    {currentScore > (lead.score || 0) ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : currentScore < (lead.score || 0) ? (
                      <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className="text-sm text-gray-500">
                      {currentScore > (lead.score || 0) && '+'}
                      {currentScore - (lead.score || 0)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">vs previous</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {scoreBreakdown.map((item, index) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.category}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {item.score}/{item.maxScore}
                        </div>
                        <div className="text-sm text-gray-500">
                          Weight: {item.weight}%
                        </div>
                      </div>
                    </div>
                    <div className="px-2">
                      <Slider
                        value={[item.score]}
                        onValueChange={(value) => handleScoreChange(index, value)}
                        max={item.maxScore}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span>{item.maxScore}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scoring Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Scoring Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Company Fit (25%)</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Industry alignment</li>
                    <li>• Company size</li>
                    <li>• Geographic location</li>
                    <li>• Technology stack</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Budget Authority (20%)</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Decision maker identified</li>
                    <li>• Budget confirmed</li>
                    <li>• Procurement process</li>
                    <li>• Financial capacity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Need Urgency (20%)</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Pain point severity</li>
                    <li>• Current solution gaps</li>
                    <li>• Business impact</li>
                    <li>• Implementation timeline</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Engagement Level (15%)</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Email interactions</li>
                    <li>• Website activity</li>
                    <li>• Content downloads</li>
                    <li>• Meeting participation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveScore}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Award className="w-4 h-4 mr-2" />
            Update Score
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}