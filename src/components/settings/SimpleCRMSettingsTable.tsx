import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, MoreHorizontal, Eye, EyeOff, ArrowLeft, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Alert, AlertDescription } from "../ui/alert";
import { showToast } from "../../layout/layout";
import DeleteCRMItemModal from "./DeleteCRMItemModal";

interface SimpleCRMItem {
  id: string;
  name: string;
  is_active: boolean;
  priority?: number; // Only for Lead Statuses
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

interface SimpleCRMSettingsTableProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  buttonColor: string;
  data: SimpleCRMItem[];
  onSave: (data: SimpleCRMItem[]) => Promise<void>;
  showPriority?: boolean; // Only for Lead Statuses
  singularName: string; // e.g., "Lead Source", "Industry", etc.
}

interface FormData {
  name: string;
  is_active: boolean;
  priority?: number;
}

const SimpleCRMSettingsTable: React.FC<SimpleCRMSettingsTableProps> = ({
  title,
  description,
  icon: Icon,
  iconColor,
  buttonColor,
  data,
  onSave,
  showPriority = false,
  singularName
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SimpleCRMItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<SimpleCRMItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    is_active: true,
    priority: 1
  });

  const resetForm = () => {
    setFormData({
      name: "",
      is_active: true,
      priority: showPriority ? (data.length + 1) : undefined
    });
  };

  const handleBack = () => {
    navigate('/settings/crm');
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
    resetForm();
    setError(null);
  };

  const handleAdd = () => {
    setEditingItem(null);
    resetForm();
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (item: SimpleCRMItem) => {
    setFormData({
      name: item.name,
      is_active: item.is_active,
      priority: item.priority
    });
    setEditingItem(item);
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Please enter a name");
      return;
    }

    // Check for duplicate names
    const duplicateExists = data.some(item => 
      item.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      item.id !== editingItem?.id
    );

    if (duplicateExists) {
      setError(`A ${singularName.toLowerCase()} with this name already exists`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newItem: SimpleCRMItem = {
        id: editingItem?.id || Date.now().toString(),
        name: formData.name.trim(),
        is_active: formData.is_active,
        priority: showPriority ? formData.priority : undefined,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
        createdBy: editingItem?.createdBy || 'Current User',
        updatedAt: editingItem ? new Date().toISOString() : undefined,
        updatedBy: editingItem ? 'Current User' : undefined
      };

      const updatedData = editingItem
        ? data.map(item => item.id === editingItem.id ? newItem : item)
        : [...data, newItem];

      await onSave(updatedData);
      
      showToast.success(
        editingItem ? `${singularName} updated successfully` : `${singularName} added successfully`
      );
      
      // Close modal and reset form
      handleCancel();
    } catch (error) {
      setError(`Failed to save ${singularName.toLowerCase()}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: SimpleCRMItem) => {
    setDeletingItem(item);
  };

  const handleDeleteConfirm = async (item: SimpleCRMItem) => {
    try {
      const updatedData = data.filter(d => d.id !== item.id);
      await onSave(updatedData);
      showToast.success(`${singularName} deleted successfully`);
      setDeletingItem(null);
    } catch (error) {
      showToast.error(`Failed to delete ${singularName.toLowerCase()}`);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingItem(null);
  };

  const handleToggleActive = async (item: SimpleCRMItem) => {
    try {
      const updatedData = data.map(d =>
        d.id === item.id ? { ...d, is_active: !d.is_active } : d
      );
      await onSave(updatedData);
      showToast.success(`${singularName} ${!item.is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      showToast.error(`Failed to update ${singularName.toLowerCase()}`);
    }
  };

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data by priority if available, otherwise by name
  const sortedData = filteredData.sort((a, b) => {
    if (showPriority && a.priority !== undefined && b.priority !== undefined) {
      return a.priority - b.priority;
    }
    return a.name.localeCompare(b.name);
  });

  const getPlaceholder = () => {
    switch (singularName.toLowerCase()) {
      case 'lead source':
        return 'e.g., Website, Email Campaign, Social Media';
      case 'lead status':
        return 'e.g., New, Contacted, Qualified';
      case 'lead qualification status':
        return 'e.g., Unqualified, Marketing Qualified, Sales Qualified';
      case 'lead category':
        return 'e.g., Hot Lead, Warm Lead, Cold Lead';
      case 'industry':
        return 'e.g., Technology, Healthcare, Finance';
      case 'contact method':
        return 'e.g., Email, Phone, SMS, LinkedIn';
      case 'activity type':
        return 'e.g., Call, Email, Meeting, Demo';
      case 'assignment mode':
        return 'e.g., Round Robin, Manual, Territory Based';
      case 'conversion target':
        return 'e.g., Lead to Opportunity, Trial to Customer';
      default:
        return `Enter ${singularName.toLowerCase()} name`;
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6 min-h-screen"
    >
      {/* Header - Only Back Button and Title */}
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
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <h1 className="text-2xl font-bold text-black">
            <span className={`bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent`}>
              {title}
            </span>
          </h1>
        </motion.div>
      </motion.div>

      {/* Search and Add Button */}
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
              placeholder={`Search ${title.toLowerCase()}...`}
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
          <Button onClick={handleAdd} className={`${buttonColor} cursor-pointer`}>
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
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                {showPriority && <TableHead>Priority</TableHead>}
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(item)}
                      className={item.is_active ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-500"}
                    >
                      {item.is_active ? (
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
                  {showPriority && (
                    <TableCell>
                      <Badge variant="outline">{item.priority}</Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(item)}
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
          
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {title} Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? `No ${title.toLowerCase()} match your search.`
                  : `Get started by creating your first ${singularName.toLowerCase()}.`}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd} className={buttonColor}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {singularName}
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
              {editingItem ? `Edit ${singularName}` : `Add ${singularName}`}
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
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={getPlaceholder()}
                className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            {showPriority && (
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm text-gray-500">
                  Priority <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority || 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                  min="1"
                  placeholder="Enter priority number"
                  className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

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
                    {editingItem ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingItem ? "Update" : "Save"
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
      <DeleteCRMItemModal
        item={deletingItem}
        isOpen={!!deletingItem}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        singularName={singularName}
      />
    </motion.section>
  );
};

export default SimpleCRMSettingsTable;