import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Target, Filter, Download, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Progress } from '../../../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { mockLeadSources, mockLeadReports } from '../../../../data/crmMockData';

interface LeadAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

export default function LeadAnalytics({ isOpen, onClose }: LeadAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedRep, setSelectedRep] = useState('all');

  const metrics: MetricCard[] = [
    {
      title: 'Total Leads',
      value: '2,456',
      change: 12.5,
      changeType: 'increase',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600'
    },
    {
      title: 'Qualified Leads',
      value: '892',
      change: 8.3,
      changeType: 'increase',
      icon: <Target className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Conversion Rate',
      value: '24.5%',
      change: -2.1,
      changeType: 'decrease',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-600'
    },
    {
      title: 'Avg. Lead Score',
      value: '72',
      change: 5.2,
      changeType: 'increase',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-purple-600'
    }
  ];

  const leadSourceData = mockLeadSources.map(source => ({
    ...source,
    conversionRate: ((source.metrics.convertedLeads / source.metrics.totalLeads) * 100).toFixed(1)
  }));

  const repPerformanceData = [
    {
      name: 'Sarah Johnson',
      leadsAssigned: 145,
      leadsContacted: 132,
      leadsQualified: 67,
      conversionRate: 46.2,
      avgResponseTime: '2.3 hours',
      avgLeadScore: 78
    },
    {
      name: 'Mike Wilson',
      leadsAssigned: 134,
      leadsContacted: 128,
      leadsQualified: 58,
      conversionRate: 43.3,
      avgResponseTime: '3.1 hours',
      avgLeadScore: 74
    },
    {
      name: 'Emily Davis',
      leadsAssigned: 156,
      leadsContacted: 142,
      leadsQualified: 71,
      conversionRate: 45.5,
      avgResponseTime: '1.8 hours',
      avgLeadScore: 81
    }
  ];

  const pipelineData = [
    { stage: 'New', count: 456, value: 2280000, avgDays: 0 },
    { stage: 'Contacted', count: 234, value: 1872000, avgDays: 3 },
    { stage: 'Qualified', count: 123, value: 1476000, avgDays: 7 },
    { stage: 'Proposal', count: 67, value: 1072000, avgDays: 14 },
    { stage: 'Negotiation', count: 34, value: 680000, avgDays: 21 },
    { stage: 'Closed Won', count: 18, value: 360000, avgDays: 28 }
  ];

  const handleExportReport = () => {
    // Mock export functionality
    const csvContent = [
      ['Metric', 'Value', 'Change'],
      ...metrics.map(metric => [metric.title, metric.value, `${metric.change}%`])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lead-analytics-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold">Lead Analytics & Reporting</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className={`flex items-center text-sm ${
                        metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>{metric.changeType === 'increase' ? '+' : ''}{metric.change}%</span>
                        <span className="ml-1 text-gray-500">vs last period</span>
                      </div>
                    </div>
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="sources" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sources">Lead Sources</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
              <TabsTrigger value="performance">Rep Performance</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* Lead Sources Analysis */}
            <TabsContent value="sources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Source Performance</CardTitle>
                  <p className="text-sm text-gray-600">
                    Analyze the effectiveness of different lead sources
                  </p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Total Leads</TableHead>
                        <TableHead>Qualified</TableHead>
                        <TableHead>Converted</TableHead>
                        <TableHead>Conversion Rate</TableHead>
                        <TableHead>Cost per Lead</TableHead>
                        <TableHead>ROI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leadSourceData.map((source) => (
                        <TableRow key={source.id}>
                          <TableCell className="font-medium">{source.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{source.category}</Badge>
                          </TableCell>
                          <TableCell>{source.metrics.totalLeads.toLocaleString()}</TableCell>
                          <TableCell>{source.metrics.qualifiedLeads}</TableCell>
                          <TableCell>{source.metrics.convertedLeads}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{source.conversionRate}%</span>
                              <Progress 
                                value={parseFloat(source.conversionRate)} 
                                className="w-16 h-2" 
                              />
                            </div>
                          </TableCell>
                          <TableCell>${source.metrics.costPerLead.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={
                              source.metrics.roi > 200 ? 'bg-green-100 text-green-800' :
                              source.metrics.roi > 100 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {source.metrics.roi}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pipeline Analysis */}
            <TabsContent value="pipeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Pipeline Analysis</CardTitle>
                  <p className="text-sm text-gray-600">
                    Track leads through each stage of your pipeline
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pipelineData.map((stage, index) => (
                      <div key={stage.stage} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{stage.stage}</div>
                            <div className="text-sm text-gray-600">
                              Avg. {stage.avgDays} days in stage
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <div className="text-lg font-bold">{stage.count}</div>
                            <div className="text-sm text-gray-600">Leads</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">${(stage.value / 1000000).toFixed(1)}M</div>
                            <div className="text-sm text-gray-600">Value</div>
                          </div>
                          <div className="w-32">
                            <Progress 
                              value={(stage.count / pipelineData[0].count) * 100} 
                              className="h-2" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rep Performance */}
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Rep Performance</CardTitle>
                  <p className="text-sm text-gray-600">
                    Individual performance metrics for lead management
                  </p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rep Name</TableHead>
                        <TableHead>Leads Assigned</TableHead>
                        <TableHead>Leads Contacted</TableHead>
                        <TableHead>Leads Qualified</TableHead>
                        <TableHead>Conversion Rate</TableHead>
                        <TableHead>Avg Response Time</TableHead>
                        <TableHead>Avg Lead Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repPerformanceData.map((rep) => (
                        <TableRow key={rep.name}>
                          <TableCell className="font-medium">{rep.name}</TableCell>
                          <TableCell>{rep.leadsAssigned}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{rep.leadsContacted}</span>
                              <Badge variant="outline" className="text-xs">
                                {((rep.leadsContacted / rep.leadsAssigned) * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{rep.leadsQualified}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{rep.conversionRate}%</span>
                              <Progress 
                                value={rep.conversionRate} 
                                className="w-16 h-2" 
                              />
                            </div>
                          </TableCell>
                          <TableCell>{rep.avgResponseTime}</TableCell>
                          <TableCell>
                            <Badge className={
                              rep.avgLeadScore >= 80 ? 'bg-green-100 text-green-800' :
                              rep.avgLeadScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {rep.avgLeadScore}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trends */}
            <TabsContent value="trends" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Volume Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { month: 'Jan', leads: 234, change: 12 },
                        { month: 'Feb', leads: 267, change: 14 },
                        { month: 'Mar', leads: 298, change: 12 },
                        { month: 'Apr', leads: 245, change: -18 },
                        { month: 'May', leads: 289, change: 18 }
                      ].map((data) => (
                        <div key={data.month} className="flex items-center justify-between">
                          <span className="font-medium">{data.month}</span>
                          <div className="flex items-center space-x-2">
                            <span>{data.leads}</span>
                            <Badge className={
                              data.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }>
                              {data.change > 0 ? '+' : ''}{data.change}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quality Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { month: 'Jan', score: 68, qualified: 89 },
                        { month: 'Feb', score: 71, qualified: 98 },
                        { month: 'Mar', score: 74, qualified: 112 },
                        { month: 'Apr', score: 69, qualified: 95 },
                        { month: 'May', score: 76, qualified: 118 }
                      ].map((data) => (
                        <div key={data.month} className="flex items-center justify-between">
                          <span className="font-medium">{data.month}</span>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-sm font-medium">{data.score}</div>
                              <div className="text-xs text-gray-500">Avg Score</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">{data.qualified}</div>
                              <div className="text-xs text-gray-500">Qualified</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
    </div>
  );
}