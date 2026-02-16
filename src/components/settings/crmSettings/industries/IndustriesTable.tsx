import React from "react";
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Card, CardContent } from "../../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import type { Industry } from "./IndustriesSection";

interface IndustriesTableProps {
  industries: Industry[];
  onEdit: (industry: Industry) => void;
  onDelete: (industry: Industry) => void;
  onToggleActive: (industry: Industry) => void;
}

const IndustriesTable: React.FC<IndustriesTableProps> = ({
  industries,
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
              <TableHead>Industry Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {industries.map((industry) => (
              <TableRow key={industry.id}>
                <TableCell className="font-medium">{industry.name}</TableCell>
                <TableCell>
                  {industry.is_active ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(industry.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(industry)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActive(industry)}>
                        {industry.is_active ? (
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
                        onClick={() => onDelete(industry)}
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

export default IndustriesTable;
