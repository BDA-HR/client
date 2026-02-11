import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, MoreHorizontal, Eye, EyeOff, ArrowLeft, AlertCircle, X, Shield, ToggleLeft, ToggleRight, TestTube } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { RoutingService } from "../../../services/routingService";
import { showToast } from "../../../layout/layout";

interface RoutingRule {
  id: string;
  name: string;
  description: string;
  conditions: RoutingCondition[];
  assignTo: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

interface RoutingCondition {
  field: string;
  operator: string;
  value: string;
}

interface FormData {
  name: string;
  description: string;
  conditions: RoutingCondition[];
  assignTo: string;
  priority: number;
  isActive: boolean;
}

const salesReps = [
  'Sarah Johnson',
  'Mike Wilson',
  'Emily Davis',
  'Robert Chen',
  'Lisa Anderson'
];

const conditionFields = [
  { value: 'source', label: 'Lead Source' },
  { value: 'industry', label: 'Industry' },
  { value: 'budget', label: 'Budget' },
  { value: 'score', label: 'Lead Score' },
  { value: 'company', label: 'Company Name' },
  { value: 'location', label: 'Location' }
];

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' }
];

const PageRoutingRules: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null);
  const [deletingRule, setDeletingRule] = useState<RoutingRule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load routing rules from localStorage
  const loadRoutingRules = (): RoutingRule[] => {
    const stored = localStorage.getItem('routingRules');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing routing rules:', error);
      }
    }
    return [];
  };

  const [routingRules, setRoutingRules] = useState<RoutingRule[]>(loadRoutingRules());

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    conditions: [{ field: "", operator: "", value: "" }],
    assignTo: "",
    priority: 1,
    isActive: true
  });

  const saveRoutingRules = (rules: RoutingRule[]) => {
    localStorage.setItem('routingRules', JSON.stringify(rules));
    setRoutingRules(rules);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      conditions: [{ field: "", operator: "", value: "" }],
      assignTo: "",
      priority: routingRules.length + 1,
      isActive: true
    });
  };

  const handleBack = () => {
    navigate('/settings/crm');
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setEditingRule(null);
    resetForm();
    setError(null);
  };

  const handleAdd = () => {
    setEditingRule(null);
    resetForm();
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (rule: RoutingRule) => {
    setFormData({
      name: rule.name,
      description: rule.description,
      conditions: rule.conditions,
      assignTo: rule.assignTo,
      priority: rule.priority,
      isActive: rule.isActive
    });
    setEditingRule(rule);
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleAddCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: "", operator: "", value: "" }]
    }));
  };

  const handleRemoveCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleConditionChange = (index: number, field: keyof RoutingCondition, value: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Please enter a rule name");
      return;
    }

    if (!formData.assignTo) {
      setError("Please select a sales rep to assign to");
      return;
    }

    // Validate conditions
    const validConditions = formData.conditions.filter(c => c.field && c.operator && c.value);
    if (validConditions.length === 0) {
      setError("Please add at least one valid condition");
      return;
    }

    // Check for duplicate names
    const duplicateExists = routingRules.some(rule => 
      rule.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      rule.id !== editingRule?.id
    );

    if (duplicateExists) {
      setError("A routing rule with this name already exists");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newRule: RoutingRule = {
        id: editingRule?.id || Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        conditions: validConditions,
        assignTo: formData.assignTo,
        priority: formData.priority,
        isActive: formData.isActive,
        createdAt: editingRule?.createdAt || new Date().toISOString(),
        createdBy: editingRule?.createdBy || 'Current User',
        updatedAt: editingRule ? new Date().toISOString() : undefined,
        updatedBy: editingRule ? 'Current User' : undefined
      };

      const updatedRules = editingRule
        ? routingRules.map(rule => rule.id === editingRule.id ? newRule : rule)
        : [...routingRules, newRule];

      saveRoutingRules(updatedRules);
      
      showToast.success(
        editingRule ? "Routing rule updated successfully" : "Routing rule added successfully"
      );
      
      handleCancel();
    } catch (error) {
      setError("Failed to save routing rule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (rule: RoutingRule) => {
    setDeletingRule(rule);
  };

  const handleDeleteConfirm = () => {
    if (deletingRule) {
      const updatedRules = routingRules.filter(r => r.id !== deletingRule.id);
      saveRoutingRules(updatedRules);
      showToast.success("Routing rule deleted successfully");
      setDeletingRule(null);
    }
  };

  const handleToggleActive = (rule: RoutingRule) => {
    const updatedRules = routingRules.map(r =>
      r.id === rule.id ? { ...r, isActive: !r.isActive } : r
    );
    saveRoutingRules(updatedRules);
    showToast.success(`Routing rule ${!rule.isActive ? 'activated' : 'deactivated'}`);
  };

  // Filter and sort rules
  const filteredRules = routingRules.filter(rule =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRules = filteredRules.sort((a, b) => a.priority - b.priority);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6 min-h-screen"
    >
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="mb-4 flex items-center gap-3"
      >
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <Shield className="w-6 h-6 text-orange-600" />
          <h1 className="text-2xl font-bold text-black">
            <span className="bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
              Lead Routing
            </span>
          </h1>
        </motion.div>
      </motion.div>

      {/* Search and Add */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-4 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search routing rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      </motion.div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Rule Name</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Assign To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                      {rule.description && (
                        <p className="text-sm text-gray-500">{rule.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {rule.conditions.slice(0, 2).map((condition, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">
                          {conditionFields.find(f => f.value === condition.field)?.label} {condition.operator} {condition.value}
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
                      onClick={() => handleToggleActive(rule)}
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
                  <TableCell className="text-sm text-gray-500">
                    {new Date(rule.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(rule)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(rule)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRules.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Routing Rules Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "No routing rules match your search."
                  : "Get started by creating your first routing rule."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Routing Rule
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog 
        open={isAddModalOpen} 
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            handleCancel();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Edit Routing Rule" : "Add Routing Rule"}
            </DialogTitle>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="h-auto p-0 text-destructive hover:text-destructive/80"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-gray-500">
                  Rule Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Enterprise Leads"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm text-gray-500">
                  Priority <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                  min="1"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm text-gray-500">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe when this rule should be applied"
                rows={2}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignTo" className="text-sm text-gray-500">
                Assign To <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.assignTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignTo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sales rep" />
                </SelectTrigger>
                <SelectContent>
                  {salesReps.map((rep) => (
                    <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-500">
                  Conditions <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCondition}
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Condition
                </Button>
              </div>

              {formData.conditions.map((condition, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    <Select 
                      value={condition.field} 
                      onValueChange={(value) => handleConditionChange(index, 'field', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Select 
                      value={condition.operator} 
                      onValueChange={(value) => handleConditionChange(index, 'operator', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Input
                      value={condition.value}
                      onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                      placeholder="Value"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-1">
                    {formData.conditions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCondition(index)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
                disabled={isSubmitting}
              />
              <Label htmlFor="isActive" className="text-sm text-gray-500">Active</Label>
            </div>

            <div className="flex justify-center items-center gap-1.5 pt-4">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingRule ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingRule ? "Update Rule" : "Save Rule"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="cursor-pointer px-6"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingRule} onOpenChange={() => setDeletingRule(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Routing Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the routing rule "{deletingRule?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeletingRule(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
};

export default PageRoutingRules;