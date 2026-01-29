import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, Play, Pause, Edit, Trash2, ArrowRight, Settings } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Switch } from '../../../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { showToast } from '../../../../layout/layout';
import type { Campaign, AutomationRule } from '../../../../types/crm';

interface AutomationRulesProps {
  campaigns: Campaign[];
}

// Mock automation rules
const mockAutomationRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Welcome Email Series',
    trigger: 'email_opened',
    conditions: [
      { field: 'email_opened', operator: 'equals', value: 'true' },
      { field: 'first_time_opener', operator: 'equals', value: 'true' }
    ],
    actions: [
      { type: 'send_email', parameters: { templateId: 'welcome-1', delay: '1h' } },
      { type: 'add_tag', parameters: { tag: 'engaged' } }
    ],
    isActive: true
  },
  {
    id: '2',
    name: 'Lead Scoring - High Engagement',
    trigger: 'link_clicked',
    conditions: [
      { field: 'link_clicked', operator: 'equals', value: 'true' },
      { field: 'click_count', operator: 'greater_than', value: '3' }
    ],
    actions: [
      { type: 'change_stage', parameters: { stage: 'qualified' } },
      { type: 'assign_to', parameters: { userId: 'sales-team' } }
    ],
    isActive: true
  },
  {
    id: '3',
    name: 'Re-engagement Campaign',
    trigger: 'time_delay',
    conditions: [
      { field: 'last_opened', operator: 'greater_than', value: '30' },
      { field: 'status', operator: 'equals', value: 'subscribed' }
    ],
    actions: [
      { type: 'send_email', parameters: { templateId: 'reengagement', delay: '0h' } },
      { type: 'add_tag', parameters: { tag: 'inactive' } }
    ],
    isActive: false
  },
  {
    id: '4',
    name: 'Demo Request Follow-up',
    trigger: 'form_submitted',
    conditions: [
      { field: 'form_name', operator: 'equals', value: 'demo_request' }
    ],
    actions: [
      { type: 'send_email', parameters: { templateId: 'demo-confirmation', delay: '5m' } },
      { type: 'create_task', parameters: { title: 'Follow up on demo request', assignTo: 'sales' } },
      { type: 'change_stage', parameters: { stage: 'demo-requested' } }
    ],
    isActive: true
  }
];

export default function AutomationRules({ campaigns }: AutomationRulesProps) {
  const [rules, setRules] = useState<AutomationRule[]>(mockAutomationRules);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
    
    const rule = rules.find(r => r.id === ruleId);
    showToast.success(`Rule "${rule?.name}" ${rule?.isActive ? 'deactivated' : 'activated'}`);
  };

  const deleteRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    showToast.success(`Rule "${rule?.name}" deleted`);
  };

  const getTriggerIcon = (trigger: AutomationRule['trigger']) => {
    switch (trigger) {
      case 'email_opened': return '📧';
      case 'link_clicked': return '🔗';
      case 'form_submitted': return '📝';
      case 'page_visited': return '👁️';
      case 'time_delay': return '⏰';
      default: return '⚡';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'send_email': return '📧';
      case 'add_tag': return '🏷️';
      case 'change_stage': return '📊';
      case 'assign_to': return '👤';
      case 'create_task': return '✅';
      default: return '⚡';
    }
  };

  const formatTrigger = (trigger: AutomationRule['trigger']) => {
    return trigger.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatAction = (action: any) => {
    switch (action.type) {
      case 'send_email':
        return `Send email (${action.parameters.templateId}) after ${action.parameters.delay}`;
      case 'add_tag':
        return `Add tag: ${action.parameters.tag}`;
      case 'change_stage':
        return `Change stage to: ${action.parameters.stage}`;
      case 'assign_to':
        return `Assign to: ${action.parameters.userId}`;
      case 'create_task':
        return `Create task: ${action.parameters.title}`;
      default:
        return action.type;
    }
  };

  const activeRules = rules.filter(rule => rule.isActive).length;
  const totalExecutions = 1247; // Mock data
  const successRate = 94.2; // Mock data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Automation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-purple-600">{activeRules}</p>
                <p className="text-xs text-gray-500">of {rules.length} total</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-blue-600">{totalExecutions.toLocaleString()}</p>
                <p className="text-xs text-gray-500">this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{successRate}%</p>
                <p className="text-xs text-gray-500">automation success</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span>Automation Rules</span>
            </CardTitle>
            <Button 
              onClick={() => setShowRuleBuilder(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`border rounded-lg p-4 ${rule.isActive ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{getTriggerIcon(rule.trigger)}</div>
                      <div>
                        <h3 className="font-medium text-gray-900">{rule.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {formatTrigger(rule.trigger)}
                          </Badge>
                          <Badge className={rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Rule Flow */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <span className="font-medium">When:</span>
                      <span>{formatTrigger(rule.trigger)}</span>
                      {rule.conditions.length > 0 && (
                        <>
                          <span>and</span>
                          <span>{rule.conditions.length} condition{rule.conditions.length > 1 ? 's' : ''}</span>
                        </>
                      )}
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Then:</span>
                      <span>{rule.actions.length} action{rule.actions.length > 1 ? 's' : ''}</span>
                    </div>

                    {/* Actions Preview */}
                    <div className="flex flex-wrap gap-2">
                      {rule.actions.slice(0, 3).map((action, index) => (
                        <div key={index} className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                          <span>{getActionIcon(action.type)}</span>
                          <span>{formatAction(action)}</span>
                        </div>
                      ))}
                      {rule.actions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{rule.actions.length - 3} more
                        </Badge>
                      )}
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
                      onClick={() => setSelectedRule(rule)}
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

      {/* Rule Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Rule Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Avg Response Time</TableHead>
                <TableHead>Last Executed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.filter(rule => rule.isActive).map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTriggerIcon(rule.trigger)}</span>
                      <span className="font-medium">{rule.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{Math.floor(Math.random() * 500) + 100}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-green-600">
                        {(Math.random() * 20 + 80).toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {(Math.random() * 2 + 0.5).toFixed(1)}s
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {Math.floor(Math.random() * 24)} hours ago
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Rule Builder Placeholder */}
      {showRuleBuilder && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Rule Builder</CardTitle>
              <Button variant="outline" onClick={() => setShowRuleBuilder(false)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Rule Builder</h3>
              <p className="text-gray-500">Visual rule builder interface would be implemented here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}