import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { MoreHorizontal} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

interface Budget {
  id: string;
  name: string;
  period: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected" | "Locked";
  lastUpdated: string;
  createdBy: string;
  department: string;
  departmentHead: string;
  amount: number;
  usedAmount: number;
  version: string;
}

export default function BudgetList() {
  
  const [showFullHistory, setShowFullHistory] = useState(false);
  
  // Base budgets always shown
  const baseBudgets: Budget[] = [
    {
      id: "BGT-2025",
      name: "2025 Annual Budget",
      period: "Jan 2025 - Dec 2025",
      status: "Pending Approval",
      lastUpdated: "2024-06-15",
      createdBy: "Sarah Johnson",
      department: "Corporate",
      departmentHead: "Michael Chen",
      amount: 12500000,
      usedAmount: 2850000,
      version: "V2"
    },
    {
      id: "BGT-Q3-2024",
      name: "Q3 2024 Marketing",
      period: "Jul 2024 - Sep 2024",
      status: "Approved",
      lastUpdated: "2024-05-20",
      createdBy: "Alex Rivera",
      department: "Marketing",
      departmentHead: "Jennifer Kim",
      amount: 350000,
      usedAmount: 125000,
      version: "V1"
    },
    {
      id: "BGT-RF-2024",
      name: "2024 Revised Forecast",
      period: "Jul 2024 - Dec 2024",
      status: "Locked",
      lastUpdated: "2024-04-30",
      createdBy: "Thomas Wright",
      department: "Operations",
      departmentHead: "Robert Garcia",
      amount: 8700000,
      usedAmount: 4200000,
      version: "V3"
    }
  ];
  
  // Additional budgets shown when viewing full history
  const additionalBudgets: Budget[] = [
    {
      id: "BGT-Q2-2024",
      name: "Q2 2024 R&D",
      period: "Apr 2024 - Jun 2024",
      status: "Approved",
      lastUpdated: "2024-03-15",
      createdBy: "Emma Wilson",
      department: "R&D",
      departmentHead: "David Lee",
      amount: 2100000,
      usedAmount: 1950000,
      version: "V1"
    },
    {
      id: "BGT-2024-ADJ",
      name: "2024 Mid-Year Adjustment",
      period: "Jul 2024 - Dec 2024",
      status: "Rejected",
      lastUpdated: "2024-05-05",
      createdBy: "James Miller",
      department: "Finance",
      departmentHead: "Lisa Anderson",
      amount: 5500000,
      usedAmount: 0,
      version: "V2"
    },
    {
      id: "BGT-Q1-2024",
      name: "Q1 2024 Operations",
      period: "Jan 2024 - Mar 2024",
      status: "Locked",
      lastUpdated: "2024-04-10",
      createdBy: "Olivia Brown",
      department: "Operations",
      departmentHead: "Robert Garcia",
      amount: 3200000,
      usedAmount: 3100000,
      version: "V1"
    }
  ];

  // Combine base and additional budgets when viewing full history
  const budgets = showFullHistory ? [...baseBudgets, ...additionalBudgets] : baseBudgets;

  // Calculate financial metrics
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalUsed = budgets.reduce((sum, budget) => sum + budget.usedAmount, 0);
  const totalRemaining = totalBudgeted - totalUsed;
  const utilizationPercentage = totalBudgeted > 0 ? (totalUsed / totalBudgeted) * 100 : 0;

  const handleStatusChange = (id: string, newStatus: Budget["status"]) => {
    // Status changes would be handled here in a real application
    console.log(`Changing status for ${id} to ${newStatus}`);
  };



  const toggleFullHistory = () => {
    setShowFullHistory(!showFullHistory);
  };



  const getBadgeVariant = (status: Budget["status"]) => {
    switch(status) {
      case "Approved": return "default";
      case "Rejected": return "destructive";
      case "Locked": return "secondary";
      case "Pending Approval": return "default";
      default: return "outline";
    }
  };

  const getBadgeColorClass = (status: Budget["status"]) => {
    switch(status) {
      case "Approved": return "bg-green-500 hover:bg-green-600 text-white";
      case "Pending Approval": return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "Rejected": return "bg-red-500 hover:bg-red-600 text-white";
      default: return "";
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Budget Management</h1>
          <p className="text-sm text-gray-500">
            Manage budgets, forecasts, and approval workflows
          </p>
        </div>

      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-700">BUDGETED AMOUNT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalBudgeted / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-blue-600 mt-1">Total allocated funds</p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-purple-700">USED AMOUNT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalUsed / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-purple-600 mt-1">Actual spend from GL/AP</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-700">REMAINING BALANCE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRemaining / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-green-600 mt-1">Available for allocation</p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-amber-700">UTILIZATION</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationPercentage.toFixed(1)}%</div>
            <Progress value={utilizationPercentage} className="mt-2 h-2" />
            <p className="text-xs text-amber-600 mt-1">Budgeted vs Actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget List Table */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Budget List</h2>
          <span className="text-sm text-gray-500">{budgets.length} budgets</span>
        </div>
        
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Budget Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Department Head</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Budgeted</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => {
                const remaining = budget.amount - budget.usedAmount;
                const utilization = budget.amount > 0 ? (budget.usedAmount / budget.amount) * 100 : 0;
                
                return (
                  <TableRow key={budget.id}>
                    <TableCell>
                      <div className="font-medium">{budget.name}</div>
                      <div className="text-sm text-gray-500">{budget.period}</div>
                    </TableCell>
                    <TableCell>{budget.department}</TableCell>
                    <TableCell>{budget.departmentHead}</TableCell>
                    <TableCell>{budget.createdBy}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{budget.version}</Badge>
                    </TableCell>
                    <TableCell>{budget.lastUpdated}</TableCell>
                    <TableCell className="font-medium">${(budget.amount / 1000).toFixed(1)}K</TableCell>
                    <TableCell>
                      <div>${(budget.usedAmount / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-gray-500">{utilization.toFixed(1)}%</div>
                    </TableCell>
                    <TableCell className={remaining < 0 ? "text-red-500 font-medium" : "font-medium"}>
                      ${(remaining / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getBadgeVariant(budget.status)}
                        className={`${getBadgeColorClass(budget.status)}`}
                      >
                        {budget.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {budget.status === "Pending Approval" && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(budget.id, "Approved")}
                                className="text-green-600"
                              >
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(budget.id, "Rejected")}
                                className="text-red-600"
                              >
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {budget.status === "Draft" && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(budget.id, "Pending Approval")}
                            >
                              Submit for Approval
                            </DropdownMenuItem>
                          )}
                          {(budget.status === "Approved" || budget.status === "Rejected") && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(budget.id, "Draft")}
                            >
                              Reopen
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Create Revision</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* View Full History Button */}
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline"
            onClick={toggleFullHistory}
          >
            {showFullHistory ? "Show Less" : "View Full History"}
          </Button>
        </div>
      </div>

      
    </div>
  );
}