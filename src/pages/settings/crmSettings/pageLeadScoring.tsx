import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, MoreHorizontal, Eye, EyeOff, ArrowLeft, AlertCircle, X, Award } from "lucide-react";
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
import { showToast } from "../../../layout/layout";
import DeleteCRMItemModal from "../../../components/settings/DeleteCRMItemModal";

interface LeadScoringCriteria {
  id: string;
  name: string;
  maxPoints: number;
  percentage: number;
  is_active: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

const PageLeadScoring: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<LeadScoringCriteria | null>(null);
  const [deletingCriteria, setDeletingCriteria] = useState<LeadScoringCriteria | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCriteria = (): LeadScoringCriteria[] => {
    const stored = localStorage.getItem('leadScoringCriteria');
    if (stored) {
      return JSON.parse(stored);
    }
    // Default criteria matching the LeadScoring component
    return [
      { id: '1', name: 'Interest Level', maxPoints: 20, percentage: 25, is_active: true, createdAt: new Date().toISOString(), createdBy: 'System' },
      { id: '2', name: 'Budget', maxPoints: 15, percentage: 18.75, is_active: true, createdAt: new Date().toISOString(), createdBy: 'System' },
      { id: '3', name: 'Authority', maxPoints: 15, percentage: 18.75, is_active: true, createdAt: new Date().toISOString(), createdBy: 'System' },
      { id: '4', name: 'Timeline', maxPoints: 15, percentage: 18.75, is_active: true, createdAt: new Date().toISOString(), createdBy: 'System' },
      { id: '5', name: 'Product Fit', maxPoints: 15, percentage: 18.75, is_active: true, createdAt: new Date().toISOString(), createdBy: 'System' }
    ];
  };

  const [criteria, setCriteria] = useState<LeadScoringCriteria[]>(loadCriteria());

  const [formData, setFormData] = useState({
    name: "",
    maxPoints: 0,
    percentage: 0,
    is_active: true
  });

  const saveCriteria = (updatedCriteria: LeadScoringCriteria[]) => {
    localStorage.setItem('leadScoringCriteria', JSON.stringify(updatedCriteria));
    setCriteria(updatedCriteria);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      maxPoints: 0,
      percentage: 0,
      is_active: true
    });
  };

  const handleBack = () => navigate('/settings/crm');
  
  const handleCancel = () => {
    setIsAddModalOpen(false);
    setEditingCriteria(null);
    resetForm();
    setError(null);
  };

  const handleAdd = () => {
    setEditingCriteria(null);
    resetForm();
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (criteriaItem: LeadScoringCriteria) => {
    setFormData({
      name: criteriaItem.name,
      maxPoints: criteriaItem.maxPoints,
      percentage: criteriaItem.percentage,
      is_active: criteriaItem.is_active
    });
    setEditingCriteria(criteriaItem);
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Please enter a criteria name");
      return;
    }

    if (formData.maxPoints <= 0) {
      setError("Max points must be greater than 0");
      return;
    }

    if (formData.percentage <= 0 || formData.percentage > 100) {
      setError("Percentage must be between 1 and 100");
      return;
    }

    // Check total percentage doesn't exceed 100%
    const totalPercentage = criteria
      .filter(c => c.id !== editingCriteria?.id)
      .reduce((sum, c) => sum + c.percentage, 0) + formData.percentage;

    if (totalPercentage > 100) {
      setError(`Total percentage would be ${totalPercentage}%. Cannot exceed 100%`);
      return;
    }

    const duplicateExists = criteria.some(c => 
      c.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      c.id !== editingCriteria?.id
    );

    if (duplicateExists) {
      setError("A criteria with this name already exists");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newCriteria: LeadScoringCriteria = {
        id: editingCriteria?.id || Date.now().toString(),
        name: formData.name.trim(),
        maxPoints: formData.maxPoints,
        percentage: formData.percentage,
        is_active: formData.is_active,
        createdAt: editingCriteria?.createdAt || new Date().toISOString(),
        createdBy: editingCriteria?.createdBy || 'Current User',
        updatedAt: editingCriteria ? new Date().toISOString() : undefined,
        updatedBy: editingCriteria ? 'Current User' : undefined
      };

      const updatedCriteria = editingCriteria
        ? criteria.map(c => c.id === editingCriteria.id ? newCriteria : c)
        : [...criteria, newCriteria];

      saveCriteria(updatedCriteria);
      showToast.success(editingCriteria ? "Criteria updated successfully" : "Criteria added successfully");
      handleCancel();
    } catch (error) {
      setError("Failed to save criteria. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (criteriaItem: LeadScoringCriteria) => {
    setDeletingCriteria(criteriaItem);
  };

  const handleDeleteConfirm = async (criteriaItem: LeadScoringCriteria) => {
    try {
      const updatedCriteria = criteria.filter(c => c.id !== criteriaItem.id);
      saveCriteria(updatedCriteria);
      showToast.success("Criteria deleted successfully");
      setDeletingCriteria(null);
    } catch (error) {
      showToast.error("Failed to delete criteria");
    }
  };

  const handleToggleActive = async (criteriaItem: LeadScoringCriteria) => {
    try {
      const updatedCriteria = criteria.map(c =>
        c.id === criteriaItem.id ? { ...c, is_active: !c.is_active } : c
      );
      saveCriteria(updatedCriteria);
      showToast.success(`Criteria ${!criteriaItem.is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      showToast.error("Failed to update criteria");
    }
  };

  const filteredCriteria = criteria.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPercentage = criteria.reduce((sum, c) => sum + c.percentage, 0);
  const totalMaxPoints = criteria.reduce((sum, c) => sum + c.maxPoints, 0);

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
          <Award className="w-6 h-6 text-orange-600" />
          <h1 className="text-2xl font-bold text-black">
            <span className="bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
              Lead Scoring Rules
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
              placeholder="Search lead scoring criteria..."
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

      {/* Summary Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Scoring Weight</p>
              <p className="text-2xl font-bold text-orange-600">{totalPercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Max Points</p>
              <p className="text-2xl font-bold text-gray-900">{totalMaxPoints}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Criteria</p>
              <p className="text-2xl font-bold text-gray-900">{criteria.filter(c => c.is_active).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criteria Name</TableHead>
                <TableHead>Max Points</TableHead>
                <TableHead>Weight (%)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCriteria.map((criteriaItem) => (
                <TableRow key={criteriaItem.id}>
                  <TableCell className="font-medium">{criteriaItem.name}</TableCell>
                  <TableCell>
                    <Badge className="bg-orange-100 text-orange-800">{criteriaItem.maxPoints} pts</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{criteriaItem.percentage}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(criteriaItem)}
                      className={criteriaItem.is_active ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-500"}
                    >
                      {criteriaItem.is_active ? (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Inactive
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(criteriaItem.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(criteriaItem)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(criteriaItem)}
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
          
          {filteredCriteria.length === 0 && (
            <div className="text-center py-12">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Lead Scoring Criteria Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "No criteria match your search."
                  : "Get started by creating your first scoring criteria."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCriteria ? "Edit Scoring Criteria" : "Add Scoring Criteria"}
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
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-500">
                Criteria Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Interest Level, Budget, Authority"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxPoints" className="text-sm text-gray-500">
                  Max Points <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxPoints"
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPoints: Number(e.target.value) }))}
                  placeholder="e.g., 20"
                  min="1"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentage" className="text-sm text-gray-500">
                  Weight (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="percentage"
                  type="number"
                  step="0.01"
                  value={formData.percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, percentage: Number(e.target.value) }))}
                  placeholder="e.g., 25"
                  min="0.01"
                  max="100"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-600">
                Current total: <span className="font-semibold">{totalPercentage}%</span>
                {!editingCriteria && formData.percentage > 0 && (
                  <> → New total: <span className="font-semibold">{totalPercentage + formData.percentage}%</span></>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
                disabled={isSubmitting}
              />
              <Label htmlFor="is_active" className="text-sm text-gray-500">Active</Label>
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
                    {editingCriteria ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingCriteria ? "Update" : "Save"
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

      {/* Delete Modal */}
      <DeleteCRMItemModal
        item={deletingCriteria}
        isOpen={!!deletingCriteria}
        onClose={() => setDeletingCriteria(null)}
        onConfirm={handleDeleteConfirm}
        singularName="Scoring Criteria"
      />
    </motion.section>
  );
};

export default PageLeadScoring;
