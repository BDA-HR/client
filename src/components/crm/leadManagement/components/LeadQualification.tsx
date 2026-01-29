import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Target, User, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Progress } from '../../../ui/progress';
import { Textarea } from '../../../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../../ui/radio-group';
import { Checkbox } from '../../../ui/checkbox';
import { showToast } from '../../../../layout/layout';
import { mockQualificationWorkflows } from '../../../../data/crmMockData';
import type { Lead } from '../../../../types/crm';

interface LeadQualificationProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onQualificationComplete: (leadId: string, result: QualificationResult) => void;
}

interface QualificationResult {
  workflowId: string;
  score: number;
  passed: boolean;
  responses: Record<string, any>;
  nextStage: string;
  notes: string;
  completedAt: string;
}

interface QualificationResponse {
  stepId: string;
  questionId: string;
  response: any;
  score: number;
}

export default function LeadQualification({ lead, isOpen, onClose, onQualificationComplete }: LeadQualificationProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState(mockQualificationWorkflows[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const currentStep = selectedWorkflow.steps[currentStepIndex];
  const isLastStep = currentStepIndex === selectedWorkflow.steps.length - 1;

  const handleResponseChange = (questionIndex: number, value: any) => {
    const questionKey = `${currentStep.id}_${questionIndex}`;
    setResponses(prev => ({
      ...prev,
      [questionKey]: value
    }));
  };

  const getStepScore = (stepId: string) => {
    const step = selectedWorkflow.steps.find(s => s.id === stepId);
    if (!step) return 0;

    let score = 0;
    let totalQuestions = 0;

    step.criteria.forEach((criterion, index) => {
      const questionKey = `${stepId}_${index}`;
      const response = responses[questionKey];
      totalQuestions++;

      if (response !== undefined && response !== '') {
        if (criterion.type === 'boolean' && response === true) {
          score++;
        } else if (criterion.type === 'select' && response) {
          // Score based on select value quality
          const qualityScores: Record<string, number> = {
            'Critical': 1, 'Important': 0.7, 'Nice to Have': 0.3,
            'Immediately': 1, 'Within 3 months': 0.8, 'Within 6 months': 0.6,
            'Decision Maker': 1, 'Influencer': 0.7, 'User': 0.4,
            '$100K+': 1, '$50K-$100K': 0.8, '$10K-$50K': 0.6
          };
          score += qualityScores[response] || 0.5;
        } else if (criterion.type === 'text' && response.trim()) {
          score += 0.8; // Give partial credit for text responses
        }
      }
    });

    return totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  };

  const calculateOverallScore = () => {
    let totalScore = 0;
    let totalWeight = 0;

    selectedWorkflow.steps.forEach(step => {
      const stepScore = getStepScore(step.id);
      totalScore += stepScore * step.weight;
      totalWeight += step.weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  };

  const canProceedToNextStep = () => {
    const stepScore = getStepScore(currentStep.id);
    const requiredResponses = currentStep.criteria.filter(c => c.required);
    
    // Check if all required questions are answered
    const allRequiredAnswered = requiredResponses.every((criterion, index) => {
      const questionKey = `${currentStep.id}_${index}`;
      const response = responses[questionKey];
      return response !== undefined && response !== '';
    });

    return allRequiredAnswered && stepScore >= (currentStep.passingScore / currentStep.criteria.length) * 100;
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      if (isLastStep) {
        handleCompleteQualification();
      } else {
        setCurrentStepIndex(prev => prev + 1);
      }
    } else {
      showToast('Please complete all required questions to proceed', 'error');
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleCompleteQualification = async () => {
    setIsCompleting(true);
    
    const overallScore = calculateOverallScore();
    const passed = overallScore >= selectedWorkflow.qualificationThreshold;
    
    const result: QualificationResult = {
      workflowId: selectedWorkflow.id,
      score: overallScore,
      passed,
      responses,
      nextStage: passed ? selectedWorkflow.nextStageOnPass : selectedWorkflow.nextStageOnFail,
      notes,
      completedAt: new Date().toISOString()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onQualificationComplete(lead.id, result);
    setIsCompleting(false);
    onClose();
    
    showToast(
      passed 
        ? `Lead qualified successfully! Score: ${overallScore.toFixed(1)}%`
        : `Lead did not meet qualification criteria. Score: ${overallScore.toFixed(1)}%`,
      passed ? 'success' : 'warning'
    );
  };

  const renderQuestion = (criterion: any, index: number) => {
    const questionKey = `${currentStep.id}_${index}`;
    const value = responses[questionKey];

    switch (criterion.type) {
      case 'boolean':
        return (
          <RadioGroup
            value={value?.toString()}
            onValueChange={(val) => handleResponseChange(index, val === 'true')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${questionKey}_yes`} />
              <Label htmlFor={`${questionKey}_yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${questionKey}_no`} />
              <Label htmlFor={`${questionKey}_no`}>No</Label>
            </div>
          </RadioGroup>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={(val) => handleResponseChange(index, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {criterion.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleResponseChange(index, e.target.value)}
            placeholder="Enter your response..."
            rows={3}
          />
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleResponseChange(index, e.target.value)}
            placeholder="Enter your response..."
          />
        );
    }
  };

  const getStepIcon = (stepName: string) => {
    if (stepName.toLowerCase().includes('budget')) return <DollarSign className="w-5 h-5" />;
    if (stepName.toLowerCase().includes('authority')) return <User className="w-5 h-5" />;
    if (stepName.toLowerCase().includes('need')) return <Target className="w-5 h-5" />;
    if (stepName.toLowerCase().includes('timeline')) return <Calendar className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  const progress = ((currentStepIndex + 1) / selectedWorkflow.steps.length) * 100;
  const overallScore = calculateOverallScore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Lead Qualification - {lead.firstName} {lead.lastName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workflow Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qualification Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedWorkflow.id}
                onValueChange={(value) => {
                  const workflow = mockQualificationWorkflows.find(w => w.id === value);
                  if (workflow) {
                    setSelectedWorkflow(workflow);
                    setCurrentStepIndex(0);
                    setResponses({});
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockQualificationWorkflows.map(workflow => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-2">
                {selectedWorkflow.description}
              </p>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">
                  Step {currentStepIndex + 1} of {selectedWorkflow.steps.length}
                </span>
              </div>
              <Progress value={progress} className="w-full h-2" />
              
              <div className="flex justify-between mt-4">
                {selectedWorkflow.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-1 ${
                      index <= currentStepIndex ? 'text-orange-600' : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < currentStepIndex ? 'bg-green-100 text-green-600' :
                      index === currentStepIndex ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {index < currentStepIndex ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        getStepIcon(step.name)
                      )}
                    </div>
                    <span className="text-xs text-center max-w-16">{step.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Step */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {getStepIcon(currentStep.name)}
                  <span>{currentStep.name}</span>
                </CardTitle>
                <Badge variant="outline">
                  Score: {getStepScore(currentStep.id).toFixed(1)}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{currentStep.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStep.criteria.map((criterion, index) => (
                <div key={index} className="space-y-2">
                  <Label className="flex items-center space-x-1">
                    <span>{criterion.question}</span>
                    {criterion.required && <span className="text-red-500">*</span>}
                  </Label>
                  {renderQuestion(criterion, index)}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle>Qualification Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span>Overall Score</span>
                <span className={`font-bold ${
                  overallScore >= selectedWorkflow.qualificationThreshold 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {overallScore.toFixed(1)}%
                </span>
              </div>
              <Progress value={overallScore} className="w-full h-3" />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Threshold: {selectedWorkflow.qualificationThreshold}%</span>
                <span>
                  {overallScore >= selectedWorkflow.qualificationThreshold ? (
                    <Badge className="bg-green-100 text-green-800">Qualified</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Not Qualified</Badge>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this qualification..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStepIndex === 0}
              >
                Previous
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
            
            <div className="flex space-x-2">
              {!canProceedToNextStep() && (
                <div className="flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Complete required questions</span>
                </div>
              )}
              <Button
                onClick={handleNextStep}
                disabled={!canProceedToNextStep() || isCompleting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isCompleting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : isLastStep ? (
                  'Complete Qualification'
                ) : (
                  'Next Step'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}