import React, { useState } from 'react';
import { Target, Award } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../ui/dialog';
import { Label } from '../../../../ui/label';
import { Input } from '../../../../ui/input';
import { Textarea } from '../../../../ui/textarea';
import { Badge } from '../../../../ui/badge';
import type { Lead } from '../../../../../types/crm';

interface LeadScoringProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onScoreUpdate: (leadId: string, newScore: number, scoreData: any) => void;
}

export default function LeadScoring({ 
  lead, 
  isOpen, 
  onClose, 
  onScoreUpdate 
}: LeadScoringProps) {
  const [interest, setInterest] = useState(10);
  const [budget, setBudget] = useState(8);
  const [authority, setAuthority] = useState(8);
  const [timeline, setTimeline] = useState(8);
  const [productFit, setProductFit] = useState(8);
  const [notes, setNotes] = useState('');

  // Calculate total score (max 80)
  const totalScore = interest + budget + authority + timeline + productFit;
  // Convert to percentage for display
  const scorePercentage = Math.round((totalScore / 80) * 100);

  const handleSaveScore = () => {
    const scoreData = {
      interest,
      budget,
      authority,
      timeline,
      productFit,
      totalScore,
      notes,
      scoredAt: new Date().toISOString()
    };
    
    onScoreUpdate(lead.id, scorePercentage, scoreData);
    onClose();
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Hot Lead', color: 'bg-red-100 text-red-800' };
    if (score >= 60) return { label: 'Warm Lead', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Cold Lead', color: 'bg-blue-100 text-blue-800' };
  };

  const scoreBadge = getScoreBadge(scorePercentage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span>Update Lead Score</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={scoreBadge.color}>
                {scoreBadge.label}
              </Badge>
              <div className="text-2xl font-bold text-orange-600">
                {scorePercentage}%
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Score Inputs Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Interest */}
            <div>
              <Label htmlFor="interest" className="text-sm font-medium">
                Interest Level
                <span className="text-gray-500 ml-1">(0-20)</span>
              </Label>
              <Input
                id="interest"
                type="number"
                min="0"
                max="20"
                value={interest}
                onChange={(e) => setInterest(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                className="mt-1.5"
              />
            </div>

            {/* Budget */}
            <div>
              <Label htmlFor="budget" className="text-sm font-medium">
                Budget
                <span className="text-gray-500 ml-1">(0-15)</span>
              </Label>
              <Input
                id="budget"
                type="number"
                min="0"
                max="15"
                value={budget}
                onChange={(e) => setBudget(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))}
                className="mt-1.5"
              />
            </div>

            {/* Authority */}
            <div>
              <Label htmlFor="authority" className="text-sm font-medium">
                Authority
                <span className="text-gray-500 ml-1">(0-15)</span>
              </Label>
              <Input
                id="authority"
                type="number"
                min="0"
                max="15"
                value={authority}
                onChange={(e) => setAuthority(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))}
                className="mt-1.5"
              />
            </div>

            {/* Timeline */}
            <div>
              <Label htmlFor="timeline" className="text-sm font-medium">
                Timeline
                <span className="text-gray-500 ml-1">(0-15)</span>
              </Label>
              <Input
                id="timeline"
                type="number"
                min="0"
                max="15"
                value={timeline}
                onChange={(e) => setTimeline(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))}
                className="mt-1.5"
              />
            </div>

            {/* Product Fit */}
            <div className="col-span-2">
              <Label htmlFor="productFit" className="text-sm font-medium">
                Product Fit
                <span className="text-gray-500 ml-1">(0-15)</span>
              </Label>
              <Input
                id="productFit"
                type="number"
                min="0"
                max="15"
                value={productFit}
                onChange={(e) => setProductFit(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes <span className="text-gray-500">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this score..."
              rows={3}
              className="mt-1.5"
            />
          </div>
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