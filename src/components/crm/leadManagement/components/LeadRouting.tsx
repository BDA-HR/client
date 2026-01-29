import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Route, Users, Settings, Plus, Edit, Trash2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Alert, AlertDescription } from '../../../ui/alert';
import { showToast } from '../../../../layout/layout';
import { mockLeadAssignmentRules } from '../../../../data/crmMockData';
import type { RoutingRule, RoutingCondition } from '../../../../types/crm';

interface LeadRoutingProps {
  isOpen: boolean;
  onClose: () => void;
  onRulesUpdate: (rules: RoutingRule[]) => void;
}

const FIELD_OPTIONS = [
  { value: 'industry', label: 'Industry' },
  { value: 'companySize', label: 'Company Size' },
  { value: 'budget', label: 'Budget' },
  { value: 'state', label: 'State' },
  { value: 'country', label: 'Country' },
  { value: 'source', label: 'Lead Source' },
  { value: 'score', label: 'Lead Score' },
  { value: 'jobTitle', label: 'Job Title' }
];

const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'in', label: 'In List' }
];

const SALES_REPS = [
  { value: 'sarah-johnson', label: 'Sarah Johnson' },
  { value: 'mike-wilson', label: 'Mike Wilson' },
  { value: 'emily-davis', label: 'Emily Davis' },
  { value: 'round-robin', label: 'Round Robin' },
  { value: 'load-balancing', label: 'Load Balancing' }
];

export default function LeadRouting({ isOpen, onClose, onRulesUpdate }: LeadRoutingProps) {
  const [rules, setRules] = useState<RoutingRule[]>(mockLeadAssignmentRules as RoutingRule[]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<RoutingRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<RoutingRule>>({
    name: '',
    conditions: [],
    assignTo: '',
    priority: 1,
    isActive: true
  });

  const handleAddCondition = (rule: Partial<RoutingRule>) => {
    const newCondition: RoutingCondition = {
      field: '',
      operator: 'equals',
      value: '',
      weight: 1
    };
    
    return {
      ...rule,
      conditions: [...(rule.conditions || []), newCondition]
    };
  };

  const handleRemoveCondition = (rule: Partial<RoutingRule>, index: number) => {
    return {
      ...rule,
      conditions: rule.conditions?.filter((_, i) => i !== index) || []
    };
  };

  const handleConditionChange = (
    rule: Partial<RoutingRule>, 
    index: number, 
    field: keyof RoutingCondition, 
    value: any
  ) => {
    const updatedConditions = [...(rule.conditions || [])];
    updatedConditions[index] = { ...updatedConditions[index], [field]: value };
    
    return {
      ...rule,
      conditions: updatedConditions
    };
  };

  const handleSaveRule = () => {
    if (!newRule.name || !newRule.assignTo || !newRule.conditions?.length) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const rule: RoutingRule = {
      id: Date.now().toString(),
      name: newRule.name!,
      conditions: newRule.conditions!,
      assignTo: newRule.assignTo!,
      priority: newRule.priority || 1,
      isActive: newRule.isActive || true,
      matchCount: 0
    };

    const updatedRules = [...rules, rule];
    setRules(updatedRules);
    onRulesUpdate(updatedRules);
    
    setNewRule({
      name: '',
      conditions: [],
      assignTo: '',
      priority: 1,
      isActive: true
    });
    setIsAddDialogOpen(false);
    showToast('Routing rule added successfully', 'success');
  };

  const handleEditRule = () => {
    if (!selectedRule || !newRule.name || !newRule.assignTo || !newRule.conditions?.length) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const updatedRules = rules.map(rule => 
      rule.id === selectedRule.id 
        ? { ...rule, ...newRule }
        : rule
    );
    
    setRules(updatedRules);
    onRulesUpdate(updatedRules);
    
    setSelectedRule(null);
    setNewRule({
      name: '',
      conditions: [],
      assignTo: '',
      priority: 1,
      isActive: true
    });
    setIsEditDialogOpen(false);
    showToast('Routing rule updated successfully', 'success');
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    setRules(updatedRules);
    onRulesUpdate(updatedRules);
    showToast('Routing rule deleted successfully', 'success');
  };

  const handleToggleRule = (ruleId: string) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    );
    setRules(updatedRules);
    onRulesUpdate(updatedRules);
  };

  const openEditDialog = (rule: RoutingRule) => {
    setSelectedRule(rule);
    setNewRule({
      name: rule.name,
      conditions: rule.conditions,
      assignTo: rule.assignTo,
      priority: rule.priority,
      isActive: rule.isActive
    });
    setIsEditDialogOpen(true);
  };

  const RuleForm = ({ rule, onChange }: { rule: Partial<RoutingRule>, onChange: (rule: Partial<RoutingRule>) => void }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ruleName">Rule Name *</Label>
          <Input
            id="ruleName"
            value={rule.name || ''}
            onChange={(e) => onChange({ ...rule, name: e.target.value })}
            placeholder="Enter rule name"
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Input
            id="priority"
            type="number"
            value={rule.priority || 1}
            onChange={(e) => onChange({ ...rule, priority: parseInt(e.target.value) })}
            min="1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="assignTo">Assign To *</Label>
        <Select
          value={rule.assignTo || ''}
          onValueChange={(value) => onChange({ ...rule, assignTo: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select assignee" />
          </SelectTrigger>
          <SelectContent>
            {SALES_REPS.map(rep => (
              <SelectItem key={rep.value} value={rep.label}>
                {rep.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Conditions *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(handleAddCondition(rule))}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Condition
          </Button>
        </div>
        
        {rule.conditions?.map((condition, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 items-end mb-2">
            <div>
              <Select
                value={condition.field}
                onValueChange={(value) => onChange(handleConditionChange(rule, index, 'field', value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map(field => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={condition.operator}
                onValueChange={(value) => onChange(handleConditionChange(rule, index, 'operator', value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATOR_OPTIONS.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Input
                value={condition.value}
                onChange={(e) => onChange(handleConditionChange(rule, index, 'value', e.target.value))}
                placeholder="Value"
              />
            </div>
            
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange(handleRemoveCondition(rule, index))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {(!rule.conditions || rule.conditions.length === 0) && (
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Add at least one condition to define when this rule should apply.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Route className="w-5 h-5 text-orange-600" />
        <h2 className="text-2xl font-bold">Lead Routing & Assignment</h2>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rules">Routing Rules</TabsTrigger>
          <TabsTrigger value="settings">Assignment Settings</TabsTrigger>
        </TabsList>

          <TabsContent value="rules" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Assignment Rules</h3>
                <p className="text-sm text-gray-600">
                  Configure automatic lead assignment based on criteria
                </p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Conditions</TableHead>
                      <TableHead>Assign To</TableHead>
                      <TableHead>Matches</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules
                      .sort((a, b) => a.priority - b.priority)
                      .map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell>
                            <Badge variant="outline">#{rule.priority}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{rule.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {rule.conditions.map((condition, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                  {condition.field} {condition.operator} {condition.value}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{rule.assignTo}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{rule.matchCount}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleRule(rule.id)}
                            >
                              {rule.isActive ? (
                                <ToggleRight className="w-4 h-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-4 h-4 text-gray-400" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(rule)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRule(rule.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Settings</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure global lead assignment behavior
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultMethod">Default Assignment Method</Label>
                    <Select defaultValue="round-robin">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="round-robin">Round Robin</SelectItem>
                        <SelectItem value="load-balancing">Load Balancing</SelectItem>
                        <SelectItem value="territory">Territory Based</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="autoAssign">Auto Assignment</Label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                        <SelectItem value="business-hours">Business Hours Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime" className="text-sm">Start Time</Label>
                      <Input id="startTime" type="time" defaultValue="09:00" />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="text-sm">End Time</Label>
                      <Input id="endTime" type="time" defaultValue="17:00" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america-los_angeles">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-los_angeles">America/Los_Angeles</SelectItem>
                      <SelectItem value="america-new_york">America/New_York</SelectItem>
                      <SelectItem value="america-chicago">America/Chicago</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Rule Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Routing Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <RuleForm rule={newRule} onChange={setNewRule} />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveRule} className="bg-orange-600 hover:bg-orange-700">
                  Save Rule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Rule Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Routing Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <RuleForm rule={newRule} onChange={setNewRule} />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditRule} className="bg-orange-600 hover:bg-orange-700">
                  Update Rule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}