import { Edit, Trash2, Settings } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import type { ContactGroup } from './ContactGroupingSection';

interface ContactGroupingTableProps {
  contactGroups: ContactGroup[];
  onEdit: (group: ContactGroup) => void;
  onDelete: (groupId: string) => void;
  onConditionClick: (group: ContactGroup) => void;
}

export default function ContactGroupingTable({
  contactGroups,
  onEdit,
  onDelete,
  onConditionClick
}: ContactGroupingTableProps) {
  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead># Contacts</TableHead>
            <TableHead>Conditions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contactGroups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No contact groups found. Create your first group to get started.
              </TableCell>
            </TableRow>
          ) : (
            contactGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.code}</TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  <Badge className={group.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {group.status}
                  </Badge>
                </TableCell>
                <TableCell>{group.contactCount}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onConditionClick(group)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
