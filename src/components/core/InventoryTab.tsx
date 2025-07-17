import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Edit, Trash2, MoreHorizontal, PackagePlus, PackageMinus } from 'lucide-react';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { Search, Filter, Upload, Plus } from 'lucide-react';


interface BranchInventory {
  id: number;
  item: string;
  category: string;
  currentStock: number;
  minStock: number;
  lastUpdated: string;
}

const branchInventory: BranchInventory[] = [
  { id: 1, item: 'Laptop Pro', category: 'Electronics', currentStock: 42, minStock: 10, lastUpdated: 'Today' },
  { id: 2, item: 'Office Chair', category: 'Furniture', currentStock: 15, minStock: 5, lastUpdated: '2 days ago' },
  { id: 3, item: 'Desk', category: 'Furniture', currentStock: 8, minStock: 5, lastUpdated: '1 week ago' },
  { id: 4, item: 'Printer', category: 'Electronics', currentStock: 3, minStock: 2, lastUpdated: '3 days ago' },
  { id: 5, item: 'Stationery Set', category: 'Office Supplies', currentStock: 120, minStock: 50, lastUpdated: 'Today' }
];

const InventoryTab = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Branch Inventory</CardTitle>
            <CardDescription>
              Manage stock levels and inventory items for this branch
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inventory..."
                className="pl-9 w-[200px]"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter size={14} />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Upload size={14} />
              Import
            </Button>
            <Button size="sm" className="gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20">
              <Plus size={14} />
              Add Item
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Min Stock</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branchInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.item}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">
                  <span className={item.currentStock <= item.minStock ? 'text-red-600 font-bold' : ''}>
                    {item.currentStock}
                  </span>
                </TableCell>
                <TableCell className="text-right">{item.minStock}</TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
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
                        <PackagePlus className="mr-2 h-4 w-4" />
                        Restock
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PackageMinus className="mr-2 h-4 w-4" />
                        Use Item
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
            Showing 1 to {branchInventory.length} of {branchInventory.length} items
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

export default InventoryTab;