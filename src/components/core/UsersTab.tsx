import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Edit, Trash2, MoreHorizontal, Key } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { Search, Filter, Download, Plus } from 'lucide-react';

interface BranchUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

const branchUsers: BranchUser[] = [
  { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Admin', department: 'IT', lastLogin: '2 hours ago', status: 'active' },
  { id: 2, name: 'Jane Doe', email: 'jane@company.com', role: 'Finance Manager', department: 'Finance', lastLogin: '1 day ago', status: 'active' },
  { id: 3, name: 'Robert Johnson', email: 'robert@company.com', role: 'HR Specialist', department: 'Human Resources', lastLogin: '3 days ago', status: 'active' },
  { id: 4, name: 'Emily Davis', email: 'emily@company.com', role: 'Sales Associate', department: 'Sales', lastLogin: '1 week ago', status: 'inactive' },
  { id: 5, name: 'Michael Chen', email: 'michael@company.com', role: 'Operations Lead', department: 'Operations', lastLogin: 'Yesterday', status: 'active' }
];

const UsersTab = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Branch Users</CardTitle>
            <CardDescription>
              Manage user access and permissions for this branch
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-9 w-[200px]"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter size={14} />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download size={14} />
              Export
            </Button>
            <Button size="sm" className="gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20">
              <Plus size={14} />
              Add User
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branchUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'active' ? 'default' : 'outline'} 
                    className="capitalize"
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing 1 to {branchUsers.length} of {branchUsers.length} users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UsersTab;