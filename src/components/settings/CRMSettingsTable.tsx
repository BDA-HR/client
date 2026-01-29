import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { showToast } from "../../layout/layout";
import type { DropdownOption } from "../../types/crm";

interface CRMSettingsTableProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  buttonColor: string;
  data: DropdownOption[];
  onSave: (data: DropdownOption[]) => Promise<void>;
  showColorField?: boolean;
  showDescriptionField?: boolean;
}

interface FormData {
  label: string;
  value: string;
  description?: string;
  color?: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
}

const CRMSettingsTable: React.FC<CRMSettingsTableProps> = ({
  title,
  description,
  icon: Icon,
  iconColor,
  buttonColor,
  data,
  onSave,
  showColorField = false,
  showDescriptionField = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DropdownOption | null>(null);
  const [formData, setFormData] = useState<FormData>({
    label: "",
    value: "",
    description: "",
    color: "#3B82F6",
    isActive: true,
    isDefault: false,
    sortOrder: 1
  });

  const resetForm = () => {
    setFormData({
      label: "",
      value: "",
      description: "",
      color: "#3B82F6",
      isActive: true,
      isDefault: false,
      sortOrder: data.length + 1
    });
  };

  const handleAdd = () => {
    resetForm();
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (item: DropdownOption) => {
    setFormData({
      label: item.label,
      value: item.value,
      description: item.description || "",
      color: item.color || "#3B82F6",
      isActive: item.isActive,
      isDefault: item.isDefault || false,
      sortOrder: item.sortOrder
    });
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label.trim() || !formData.value.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      const newItem: DropdownOption = {
        id: editingItem?.id || Date.now().toString(),
        label: formData.label,
        value: formData.value.toLowerCase().replace(/\s+/g, '_'),
        description: showDescriptionField ? formData.description : undefined,
        color: showColorField ? formData.color : undefined,
        isActive: formData.isActive,
        isDefault: formData.isDefault,
        sortOrder: formData.sortOrder,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
        createdBy: editingItem?.createdBy || 'Current User',
        updatedAt: editingItem ? new Date().toISOString() : undefined,
        updatedBy: editingItem ? 'Current User' : undefined
      };

      const updatedData = editingItem
        ? data.map(item => item.id === editingItem.id ? newItem : item)
        : [...data, newItem];

      await onSave(updatedData);
      
      showToast(
        editingItem ? `${title.slice(0, -1)} updated successfully` : `${title.slice(0, -1)} added successfully`,
        "success"
      );
      
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      showToast(`Failed to save ${title.toLowerCase().slice(0, -1)}`, "error");
    }
  };

  const handleDelete = async (item: DropdownOption) => {
    if (window.confirm(`Are you sure you want to delete "${item.label}"?`)) {
      try {
        const updatedData = data.filter(d => d.id !== item.id);
        await onSave(updatedData);
        showToast(`${title.slice(0, -1)} deleted successfully`, "success");
      } catch (error) {
        showToast(`Failed to delete ${title.toLowerCase().slice(0, -1)}`, "error");
      }
    }
  };

  const handleToggleActive = async (item: DropdownOption) => {
    try {
      const updatedData = data.map(d =>
        d.id === item.id ? { ...d, isActive: !d.isActive } : d
      );
      await onSave(updatedData);
      showToast(`${title.slice(0, -1)} ${!item.isActive ? 'activated' : 'deactivated'}`, "success");
    } catch (error) {
      showToast(`Failed to update ${title.toLowerCase().slice(0, -1)}`, "error");
    }
  };

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6 min-h-screen p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-8 h-8 ${iconColor}`} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
        <Button onClick={handleAdd} className={buttonColor}>
          <Plus className="w-4 h-4 mr-2" />
          Add {title.slice(0, -1)}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Value</TableHead>
                {showDescriptionField && <TableHead>Description</TableHead>}
                {showColorField && <TableHead>Color</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {showColorField && item.color && (
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: item.color }}
                          />
                        )}
                        {item.label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{item.value}</code>
                    </TableCell>
                    {showDescriptionField && (
                      <TableCell className="max-w-xs truncate">
                        {item.description || "-"}
                      </TableCell>
                    )}
                    {showColorField && (
                      <TableCell>
                        {item.color && (
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-500">{item.color}</span>
                          </div>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(item)}
                        className={item.isActive ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-500"}
                      >
                        {item.isActive ? (
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
                    <TableCell>
                      {item.isDefault && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.sortOrder}</TableCell>
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
                  : `Get started by creating your first ${title.toLowerCase().slice(0, -1)}.`}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd} className={buttonColor}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {title.slice(0, -1)}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => {
                  const label = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    label,
                    value: label.toLowerCase().replace(/\s+/g, '_')
                  }));
                }}
                placeholder="e.g., Technology"
                required
              />
            </div>

            <div>
              <Label htmlFor="value">Value *</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="e.g., technology"
                required
              />
            </div>

            {showDescriptionField && (
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {showColorField && (
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                  min="1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked as boolean }))}
                />
                <Label htmlFor="isDefault">Default</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className={buttonColor}>
                {editingItem ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
};

export default CRMSettingsTable;