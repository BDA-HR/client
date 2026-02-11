import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, MoreHorizontal, Eye, EyeOff, ArrowLeft, AlertCircle, X, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Textarea } from "../../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { showToast } from "../../../layout/layout";
import DeleteCRMItemModal from "../../../components/settings/DeleteCRMItemModal";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  is_active: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

const PageEmailTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<EmailTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTemplates = (): EmailTemplate[] => {
    const stored = localStorage.getItem('emailTemplates');
    return stored ? JSON.parse(stored) : [];
  };

  const [templates, setTemplates] = useState<EmailTemplate[]>(loadTemplates());

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    is_active: true
  });

  const saveTemplates = (updatedTemplates: EmailTemplate[]) => {
    localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      body: "",
      is_active: true
    });
  };

  const handleBack = () => navigate('/settings/crm');
  
  const handleCancel = () => {
    setIsAddModalOpen(false);
    setEditingTemplate(null);
    resetForm();
    setError(null);
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    resetForm();
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      is_active: template.is_active
    });
    setEditingTemplate(template);
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Please enter a template name");
      return;
    }

    if (!formData.subject.trim()) {
      setError("Please enter email subject");
      return;
    }

    if (!formData.body.trim()) {
      setError("Please enter email body");
      return;
    }

    const duplicateExists = templates.some(template => 
      template.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      template.id !== editingTemplate?.id
    );

    if (duplicateExists) {
      setError("A template with this name already exists");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newTemplate: EmailTemplate = {
        id: editingTemplate?.id || Date.now().toString(),
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        body: formData.body.trim(),
        is_active: formData.is_active,
        createdAt: editingTemplate?.createdAt || new Date().toISOString(),
        createdBy: editingTemplate?.createdBy || 'Current User',
        updatedAt: editingTemplate ? new Date().toISOString() : undefined,
        updatedBy: editingTemplate ? 'Current User' : undefined
      };

      const updatedTemplates = editingTemplate
        ? templates.map(template => template.id === editingTemplate.id ? newTemplate : template)
        : [...templates, newTemplate];

      saveTemplates(updatedTemplates);
      showToast.success(editingTemplate ? "Template updated successfully" : "Template added successfully");
      handleCancel();
    } catch (error) {
      setError("Failed to save template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (template: EmailTemplate) => {
    setDeletingTemplate(template);
  };

  const handleDeleteConfirm = async (template: EmailTemplate) => {
    try {
      const updatedTemplates = templates.filter(t => t.id !== template.id);
      saveTemplates(updatedTemplates);
      showToast.success("Template deleted successfully");
      setDeletingTemplate(null);
    } catch (error) {
      showToast.error("Failed to delete template");
    }
  };

  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      const updatedTemplates = templates.map(t =>
        t.id === template.id ? { ...t, is_active: !t.is_active } : t
      );
      saveTemplates(updatedTemplates);
      showToast.success(`Template ${!template.is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      showToast.error("Failed to update template");
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Mail className="w-6 h-6 text-orange-600" />
          <h1 className="text-2xl font-bold text-black">
            <span className="bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
              Email Templates
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
              placeholder="Search email templates..."
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
                <TableHead>Template Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-md truncate">
                    {template.subject}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(template)}
                      className={template.is_active ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-500"}
                    >
                      {template.is_active ? (
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
                    {new Date(template.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(template)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(template)}
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
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Email Templates Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "No templates match your search."
                  : "Get started by creating your first email template."}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Email Template" : "Add Email Template"}
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
                Template Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Welcome Email, Follow-up"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm text-gray-500">
                Email Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Welcome to {{company_name}}"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Use variables: {"{"}{"{"} contact_name {"}"}{"}"},  {"{"}{"{"} company_name {"}"}{"}"},  {"{"}{"{"} lead_source {"}"}{"}"} 
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body" className="text-sm text-gray-500">
                Email Body <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Enter email body content..."
                rows={10}
                required
                disabled={isSubmitting}
                className="text-sm"
              />
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
                    {editingTemplate ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingTemplate ? "Update" : "Save"
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
        item={deletingTemplate}
        isOpen={!!deletingTemplate}
        onClose={() => setDeletingTemplate(null)}
        onConfirm={handleDeleteConfirm}
        singularName="Email Template"
      />
    </motion.section>
  );
};

export default PageEmailTemplates;
