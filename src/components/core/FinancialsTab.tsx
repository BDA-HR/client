import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Download, Plus, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';


interface BranchFinancial {
  id: number;
  account: string;
  balance: number;
  currency: string;
  lastTransaction: string;
}

const branchFinancials: BranchFinancial[] = [
  { id: 1, account: 'Operating Account', balance: 125000.50, currency: 'USD', lastTransaction: 'Today' },
  { id: 2, account: 'Payroll Account', balance: 75000.00, currency: 'USD', lastTransaction: 'Yesterday' },
  { id: 3, account: 'Tax Account', balance: 42500.75, currency: 'USD', lastTransaction: '2 days ago' }
];

const FinancialsTab = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Branch Financials</CardTitle>
            <CardDescription>
              View and manage financial accounts for this branch
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Download size={14} />
              Export
            </Button>
            <Button size="sm" className="gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20">
              <Plus size={14} />
              New Account
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {branchFinancials.map((account) => (
            <Card key={account.id} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {account.account}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {account.currency} {account.balance.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Last transaction: {account.lastTransaction}
                </p>
              </CardContent>
              <CardFooter className="border-t px-6 py-3">
                <Button variant="ghost" size="sm" className="text-emerald-600">
                  View Transactions <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Today, 10:30 AM</TableCell>
              <TableCell>Office Supplies Purchase</TableCell>
              <TableCell>Operating Account</TableCell>
              <TableCell className="text-right text-red-600">- $1,250.00</TableCell>
              <TableCell><Badge variant="default">Completed</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Yesterday, 2:15 PM</TableCell>
              <TableCell>Client Payment - Acme Corp</TableCell>
              <TableCell>Operating Account</TableCell>
              <TableCell className="text-right text-green-600">+ $5,750.00</TableCell>
              <TableCell><Badge variant="default">Completed</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Yesterday, 9:00 AM</TableCell>
              <TableCell>Payroll Processing</TableCell>
              <TableCell>Payroll Account</TableCell>
              <TableCell className="text-right text-red-600">- $32,450.00</TableCell>
              <TableCell><Badge variant="default">Completed</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2 days ago, 4:30 PM</TableCell>
              <TableCell>Tax Payment</TableCell>
              <TableCell>Tax Account</TableCell>
              <TableCell className="text-right text-red-600">- $12,500.00</TableCell>
              <TableCell><Badge variant="default">Completed</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
        <Button variant="ghost" className="text-emerald-600">
          View All Transactions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinancialsTab;