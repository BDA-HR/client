import React from "react";
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Card, CardContent } from "../../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import type { LeadScoringCriteria } from "./LeadScoringSection";

interface LeadScoringTableProps {
  criteria: LeadScoringCriteria[];
  onEdit: (criteria: LeadScoringCriteria) => void;
  onDelete: (criteria: LeadScoringCriteria) => void;
  onToggleActive: (criteria: LeadScoringCriteria) => void;
}

const LeadScoringTable: React.FC<LeadScoringTableProps> = ({
  criteria,
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
              <TableHead>Criteria Name</TableHead>
              <TableHead>Max Points</TableHead>
              <TableHead>Weight (%)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((criteriaItem) => (
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
                    onClick={() => onToggleActive(criteriaItem)}
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
                      <DropdownMenuItem onClick={() => onEdit(criteriaItem)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActive(criteriaItem)}>
                        {criteriaItem.is_active ? (
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
                        onClick={() => onDelete(criteriaItem)}
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

export default LeadScoringTable;
