import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";

interface Employee {
  name: string;
  position: string;
  department: string;
}

interface LeaveEntitlement {
  id: string;
  employee: Employee;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  carryForward: number;
  fiscalYear: string;
}

const LeaveEntitlementPage = () => {
  const [entitlements, setEntitlements] = useState<LeaveEntitlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setEntitlements([
          {
            id: '1',
            employee: {
              name: 'John Doe',
              position: 'Software Engineer',
              department: 'Engineering'
            },
            leaveType: 'Annual Leave',
            totalDays: 20,
            usedDays: 5,
            remainingDays: 15,
            carryForward: 5,
            fiscalYear: '2023-2024'
          },
          {
            id: '2',
            employee: {
              name: 'Jane Smith',
              position: 'Product Manager',
              department: 'Product'
            },
            leaveType: 'Sick Leave',
            totalDays: 10,
            usedDays: 2,
            remainingDays: 8,
            carryForward: 0,
            fiscalYear: '2023-2024'
          },
          {
            id: '3',
            employee: {
              name: 'Robert Johnson',
              position: 'HR Specialist',
              department: 'Human Resources'
            },
            leaveType: 'Annual Leave',
            totalDays: 20,
            usedDays: 10,
            remainingDays: 10,
            carryForward: 3,
            fiscalYear: '2023-2024'
          }
        ]);
        setLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  // Get simple initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .slice(0, 2) // Only take first two parts
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 p-4 border-b">
        <CardTitle className="text-lg font-semibold">Leave Entitlements</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 text-center">Loading entitlements...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="font-medium">Employee</TableHead>
                <TableHead className="font-medium">Department</TableHead>
                <TableHead className="font-medium">Leave Type</TableHead>
                <TableHead className="font-medium">Total Days</TableHead>
                <TableHead className="font-medium">Used Days</TableHead>
                <TableHead className="font-medium">Remaining Days</TableHead>
                <TableHead className="font-medium">Carry Forward</TableHead>
                <TableHead className="font-medium">Fiscal Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entitlements.map((entitlement) => (
                <TableRow key={entitlement.id} className="hover:bg-gray-50">
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 text-blue-800 font-medium">
                        {getInitials(entitlement.employee.name)}
                      </div>
                      <div>
                        <div className="font-medium">{entitlement.employee.name}</div>
                        <div className="text-sm text-gray-500">
                          {entitlement.employee.position}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Badge variant="outline">
                      {entitlement.employee.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-block">
                      {entitlement.leaveType}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">{entitlement.totalDays}</TableCell>
                  <TableCell className="py-3 px-4">{entitlement.usedDays}</TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-block">
                      {entitlement.remainingDays} days
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">{entitlement.carryForward}</TableCell>
                  <TableCell className="py-3 px-4">{entitlement.fiscalYear}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveEntitlementPage;