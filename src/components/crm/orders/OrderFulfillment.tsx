import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface OrderFulfillmentProps {
  order: any;
  onUpdate: (updatedOrder: any) => void;
}

const OrderFulfillment: React.FC<OrderFulfillmentProps> = ({ order, onUpdate }) => {
  const [fulfillmentData, setFulfillmentData] = useState({
    inventoryStatus: 'Available',
    warehouse: 'Main Warehouse',
    packingStatus: 'Pending',
    shippingMethod: 'Standard Shipping',
    trackingId: '',
    estimatedDelivery: order.expectedDelivery
  });

  const fulfillmentSteps = [
    { id: 'pending', label: 'Order Pending', icon: Clock, status: 'completed' },
    { id: 'processing', label: 'Processing', icon: Package, status: order.status === 'Confirmed' ? 'current' : 'completed' },
    { id: 'ready', label: 'Ready to Ship', icon: CheckCircle, status: order.status === 'In Production' ? 'current' : order.status === 'Shipped' || order.status === 'Delivered' ? 'completed' : 'pending' },
    { id: 'shipped', label: 'Shipped', icon: Truck, status: order.status === 'Shipped' ? 'current' : order.status === 'Delivered' ? 'completed' : 'pending' },
    { id: 'delivered', label: 'Delivered', icon: MapPin, status: order.status === 'Delivered' ? 'completed' : 'pending' }
  ];

  const handleStatusUpdate = (newStatus: string) => {
    const updatedOrder = { ...order, status: newStatus };
    onUpdate(updatedOrder);
  };

  const handleTrackingUpdate = () => {
    if (fulfillmentData.trackingId) {
      handleStatusUpdate('Shipped');
    }
  };

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Fulfillment Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Fulfillment Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {fulfillmentSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepStatus(step.status)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm mt-2 text-center">{step.label}</span>
                  {index < fulfillmentSteps.length - 1 && (
                    <div className={`w-16 h-1 mt-4 ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fulfillment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory & Warehouse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Inventory Status</Label>
              <Select value={fulfillmentData.inventoryStatus} onValueChange={(value) => setFulfillmentData({...fulfillmentData, inventoryStatus: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Warehouse</Label>
              <Select value={fulfillmentData.warehouse} onValueChange={(value) => setFulfillmentData({...fulfillmentData, warehouse: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                  <SelectItem value="East Coast">East Coast</SelectItem>
                  <SelectItem value="West Coast">West Coast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Packing Status</Label>
              <Select value={fulfillmentData.packingStatus} onValueChange={(value) => setFulfillmentData({...fulfillmentData, packingStatus: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping & Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Shipping Method</Label>
              <Select value={fulfillmentData.shippingMethod} onValueChange={(value) => setFulfillmentData({...fulfillmentData, shippingMethod: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard Shipping">Standard Shipping</SelectItem>
                  <SelectItem value="Express Shipping">Express Shipping</SelectItem>
                  <SelectItem value="Overnight">Overnight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tracking ID</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  value={fulfillmentData.trackingId}
                  onChange={(e) => setFulfillmentData({...fulfillmentData, trackingId: e.target.value})}
                  placeholder="Enter tracking number"
                />
                <Button onClick={handleTrackingUpdate} disabled={!fulfillmentData.trackingId}>
                  Update
                </Button>
              </div>
            </div>
            <div>
              <Label>Estimated Delivery</Label>
              <Input
                type="date"
                value={fulfillmentData.estimatedDelivery}
                onChange={(e) => setFulfillmentData({...fulfillmentData, estimatedDelivery: e.target.value})}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            {order.status === 'Confirmed' && (
              <Button onClick={() => handleStatusUpdate('In Production')} className="bg-blue-600 hover:bg-blue-700">
                Start Production
              </Button>
            )}
            {order.status === 'In Production' && (
              <Button onClick={() => handleStatusUpdate('Shipped')} className="bg-green-600 hover:bg-green-700">
                Mark as Shipped
              </Button>
            )}
            {order.status === 'Shipped' && (
              <Button onClick={() => handleStatusUpdate('Delivered')} className="bg-purple-600 hover:bg-purple-700">
                Mark as Delivered
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderFulfillment;