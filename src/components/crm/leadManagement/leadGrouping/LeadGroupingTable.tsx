import { Edit, Trash2, Filter, Settings } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import type { LeadGroup } from './LeadGroupingSection';

interface LeadGroupingTableProps {
  leadGroups: LeadGroup[];
  onEdit: (group: LeadGroup) => void;
  onDelete: (groupId: string) => void;
  onConditionClick: (group: LeadGroup) => void;
}

export default function LeadGroupingTable({
  leadGroups,
  onEdit,
  onDelete,
  onConditionClick
}: LeadGroupingTableProps) {
  if (leadGroups.length === 0) {
    return (
      <div className="bg-white rounded-lg border text-center py-12">
        <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No lead groups yet</h3>
        <p className="text-gray-500">Create your first lead group to organize leads by conditions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead># Leads</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-center">Condition</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leadGroups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>
                <div className="flex items-center">
                  <div className="shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-medium">
                      {group.code.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {group.code}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">{group.name}</span>
              </TableCell>
              <TableCell>
                <Badge className={group.status === 'Active' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}>
                  {group.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-medium">{group.leadCount}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {new Date(group.updatedAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  onClick={() => onConditionClick(group)}
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-orange-50 hover:text-orange-600"
                >
                  <Settings size={16} />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(group)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(group.id)}
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
    </div>
  );
}
