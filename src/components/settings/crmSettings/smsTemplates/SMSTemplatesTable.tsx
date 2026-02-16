import React from "react";
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Card, CardContent } from "../../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import type { SMSTemplate } from "./SMSTemplatesSection";

interface SMSTemplatesTableProps {
  templates: SMSTemplate[];
  onEdit: (template: SMSTemplate) => void;
  onDelete: (template: SMSTemplate) => void;
  onToggleActive: (template: SMSTemplate) => void;
}

const SMSTemplatesTable: React.FC<SMSTemplatesTableProps> = ({
  templates,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead>Message Text</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell className="text-sm text-gray-600 max-w-md truncate">
                  {template.text}
                </TableCell>
                <TableCell>
                  {template.is_active ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                  )}
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
                      <DropdownMenuItem onClick={() => onEdit(template)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActive(template)}>
                        {template.is_active ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(template)}
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
      </CardContent>
    </Card>
  );
};

export default SMSTemplatesTable;
