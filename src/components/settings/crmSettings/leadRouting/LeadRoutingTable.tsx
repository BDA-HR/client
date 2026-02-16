import React from "react";
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff, Settings, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Card, CardContent } from "../../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import type { RoutingRule } from "./LeadRoutingSection";

interface LeadRoutingTableProps {
  rules: RoutingRule[];
  onEdit: (rule: RoutingRule) => void;
  onDelete: (rule: RoutingRule) => void;
  onToggleActive: (rule: RoutingRule) => void;
  onManageConditions: (rule: RoutingRule) => void;
}

const LeadRoutingTable: React.FC<LeadRoutingTableProps> = ({
  rules,
  onEdit,
  onDelete,
  onToggleActive,
  onManageConditions
}) => {
  return (
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
            {rules.map((rule) => (
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageConditions(rule)}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Manage ({rule.conditions.length})
                  </Button>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{rule.assignTo}</span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onToggleActive(rule)}
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
                      <DropdownMenuItem onClick={() => onEdit(rule)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActive(rule)}>
                        {rule.isActive ? (
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
                        onClick={() => onDelete(rule)}
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

export default LeadRoutingTable;
