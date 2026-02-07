import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Send,
  Plus,
  CreditCard,
  Receipt
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

interface OrderInvoicePaymentProps {
  orderId: string;
}

const OrderInvoicePayment: React.FC<OrderInvoicePaymentProps> = ({ orderId }) => {
  const [invoices] = useState([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      amount: 125000,
      status: 'Paid' as const,
      dueDate: '2024-02-15',
      paidDate: '2024-02-10',
      createdAt: '2024-01-25'
    },
    {
      id: '2', 
      invoiceNumber: 'INV-2024-002',
      amount: 25000,
      status: 'Pending' as const,
      dueDate: '2024-03-15',
      paidDate: null,
      createdAt: '2024-02-01'
    }
  ]);

  const [payments] = useState([
    {
      id: '1',
      invoiceId: '1',
      amount: 125000,
      method: 'Bank Transfer',
      reference: 'TXN-2024-001',
      paidDate: '2024-02-10',
      status: 'Completed' as const
    }
  ]);

  const getInvoiceStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Sent': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Paid': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoiced</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvoiced)}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalOutstanding)}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Invoices Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Invoices</span>
            </CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge className={getInvoiceStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      {invoice.status === 'Draft' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Send className="w-3 h-3 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment History</span>
            </CardTitle>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const invoice = invoices.find(inv => inv.id === payment.invoiceId);
                return (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.paidDate)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{payment.reference}</TableCell>
                    <TableCell>{invoice?.invoiceNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderInvoicePayment;