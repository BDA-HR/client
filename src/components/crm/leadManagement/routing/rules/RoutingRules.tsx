import React, { useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card';
import { Badge } from '../../../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../ui/table';

interface RoutingRule {
  id: string;
  name: string;
  conditions: string[];
  assignTo: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  lastModified: string;
}

interface RoutingRulesProps {
  rules: RoutingRule[];
  onAddRule: () => void;
  onEditRule: (rule: RoutingRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string, isActive: boolean) => void;
}

export default function RoutingRules({
  rules,
  onAddRule,
  onEditRule,
  onDeleteRule,
  onToggleRule
}: RoutingRulesProps) {
  const [sortBy, setSortBy] = useState<'priority' | 'name' | 'createdAt'>('priority');

  const sortedRules = [...rules].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return a.priority - b.priority;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleDeleteWithConfirmation = (rule: RoutingRule) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the routing rule "${rule.name}"? This action cannot be undone.`
    );
    if (confirmed) {
      onDeleteRule(rule.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Routing Rules</h2>
          <p className="text-gray-600 mt-1">
            Automatically assign leads to sales reps based on criteria
          </p>
        </div>
        <Button onClick={onAddRule} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
              <p className="text-sm text-gray-600">Total Rules</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {rules.filter(r => r.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Active Rules</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-400">
                {rules.filter(r => !r.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Inactive Rules</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Routing Rules</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="priority">Priority</option>
                <option value="name">Name</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedRules.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No routing rules</h3>
              <p className="text-gray-500 mb-4">
                Create your first routing rule to automatically assign leads
              </p>
              <Button onClick={onAddRule} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Rule
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Assign To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Badge variant="outline">#{rule.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-sm text-gray-500">
                          Modified {new Date(rule.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {rule.conditions.slice(0, 2).map((condition, index) => (
                          <Badge key={index} variant="secondary" className="mr-1">
                            {condition}
                          </Badge>
                        ))}
                        {rule.conditions.length > 2 && (
                          <Badge variant="secondary">
                            +{rule.conditions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{rule.assignTo}</span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => onToggleRule(rule.id, !rule.isActive)}
                        className="flex items-center space-x-2"
                      >
                        {rule.isActive ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-400">Inactive</span>
                          </>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRule(rule)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWithConfirmation(rule)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}