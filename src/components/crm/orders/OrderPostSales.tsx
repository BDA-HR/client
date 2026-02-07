import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  User, 
  CheckCircle,
  Clock,
  Plus,
  Star,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Textarea } from '../../ui/textarea';

interface OrderPostSalesProps {
  orderId: string;
}

const OrderPostSales: React.FC<OrderPostSalesProps> = ({ orderId }) => {
  const [followUps] = useState([
    {
      id: '1',
      type: 'Call' as const,
      subject: 'Post-delivery satisfaction check',
      scheduledDate: '2024-02-20',
      completedDate: '2024-02-20',
      assignedTo: 'Sarah Johnson',
      status: 'Completed' as const,
      notes: 'Customer very satisfied with delivery. Discussed potential expansion.',
      outcome: 'Positive - identified upsell opportunity'
    },
    {
      id: '2',
      type: 'Email' as const,
      subject: 'Training session follow-up',
      scheduledDate: '2024-03-01',
      completedDate: null,
      assignedTo: 'Mike Wilson',
      status: 'Pending' as const,
      notes: 'Schedule training session for new features',
      outcome: null
    }
  ]);

  const [feedback] = useState([
    {
      id: '1',
      type: 'Survey Response',
      rating: 5,
      comment: 'Excellent service and product quality. Very satisfied with the implementation.',
      submittedDate: '2024-02-22',
      category: 'Product Quality'
    },
    {
      id: '2',
      type: 'Support Ticket',
      rating: 4,
      comment: 'Quick resolution to our technical issue. Support team was very helpful.',
      submittedDate: '2024-02-25',
      category: 'Customer Support'
    }
  ]);

  const [opportunities] = useState([
    {
      id: '1',
      title: 'Additional License Expansion',
      value: 50000,
      probability: 75,
      expectedCloseDate: '2024-04-15',
      status: 'Qualified' as const,
      source: 'Post-sales follow-up'
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Call': <Phone className="w-4 h-4" />,
      'Email': <Mail className="w-4 h-4" />,
      'Meeting': <Calendar className="w-4 h-4" />,
    };
    return icons[type] || <MessageSquare className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Follow-up Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Follow-up Activities</span>
            </CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Follow-up
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followUps.map((followUp) => (
                <TableRow key={followUp.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(followUp.type)}
                      <span>{followUp.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{followUp.subject}</TableCell>
                  <TableCell>{formatDate(followUp.scheduledDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{followUp.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(followUp.status)}>
                      {followUp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {followUp.status === 'Pending' ? (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          View Details
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
      {/* Customer Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ThumbsUp className="w-5 h-5" />
            <span>Customer Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.type}</span>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(item.rating)}</div>
                    <span className="text-sm text-gray-500">{formatDate(item.submittedDate)}</span>
                  </div>
                </div>
                <p className="text-gray-700">{item.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upsell Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Upsell Opportunities</span>
            </CardTitle>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Opportunity
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Expected Close</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{opportunity.title}</div>
                      <div className="text-sm text-gray-500">{opportunity.source}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(opportunity.value)}</TableCell>
                  <TableCell>{opportunity.probability}%</TableCell>
                  <TableCell>{formatDate(opportunity.expectedCloseDate)}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">
                      {opportunity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Schedule Follow-up Call</h4>
              <div className="space-y-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <Textarea
                  placeholder="Add notes for the follow-up..."
                  rows={3}
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Send Satisfaction Survey</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Send a customer satisfaction survey to gather feedback on their experience.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Survey
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPostSales;