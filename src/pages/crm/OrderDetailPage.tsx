import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Package, CreditCard, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import OrderFulfillment from '../../components/crm/orders/OrderFulfillment';
import OrderInvoicePayment from '../../components/crm/orders/OrderInvoicePayment';
import OrderPostSales from '../../components/crm/orders/OrderPostSales';

// Mock order data
const mockOrder = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  opportunityId: '1',
  opportunityName: 'Enterprise Software License',
  accountName: 'TechCorp Solutions',
  contactName: 'Alice Johnson',
  amount: 125000,
  status: 'In Production',
  paymentStatus: 'Paid',
  expectedDelivery: '2024-02-15',
  progress: 65,
  items: 3,
  createdAt: '2024-01-20'
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Confirmed': 'bg-blue-100 text-blue-800',
    'In Production': 'bg-yellow-100 text-yellow-800',
    'Shipped': 'bg-green-100 text-green-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Completed': 'bg-purple-100 text-purple-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState(mockOrder);
  const [activeTab, setActiveTab] = useState('fulfillment');

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/crm/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/crm/orders')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Orders</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{order.opportunityName}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{order.accountName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">${order.amount.toLocaleString()}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Status</p>
                  <p className="text-2xl font-bold text-green-600">{order.paymentStatus}</p>
                </div>
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivery Date</p>
                  <p className="text-2xl font-bold text-purple-600">{new Date(order.expectedDelivery).toLocaleDateString()}</p>
                </div>
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-orange-600">{order.progress}%</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-lg shadow">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="fulfillment" 
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none py-4"
                >
                  Fulfillment & Delivery
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none py-4"
                >
                  Invoice & Payment
                </TabsTrigger>
                <TabsTrigger 
                  value="postsales" 
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none py-4"
                >
                  Post-Sales & Follow-up
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="fulfillment" className="mt-0">
                <OrderFulfillment order={order} onUpdate={setOrder} />
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <OrderInvoicePayment orderId={order.id} />
              </TabsContent>

              <TabsContent value="postsales" className="mt-0">
                <OrderPostSales orderId={order.id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailPage;