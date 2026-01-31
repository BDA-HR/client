import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, Mail, Phone, Users, DollarSign, Target, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Progress } from '../../../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { showToast } from '../../../../layout/layout';
import { mockLeadSources } from '../../../../data/crmMockData';

interface LeadSourceTrackingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeadSource {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  trackingCode: string;
  metrics: {
    totalLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    conversionRate: number;
    averageScore: number;
    averageValue: number;
    cost: number;
    costPerLead: number;
    roi: number;
  };
}

export default function LeadSourceTracking({ isOpen, onClose }: LeadSourceTrackingProps) {
  const [sources, setSources] = useState<LeadSource[]>(mockLeadSources as LeadSource[]);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);
  const [newSource, setNewSource] = useState<Partial<LeadSource>>({
    name: '',
    description: '',
    category: 'Digital',
    isActive: true,
    trackingCode: '',
    metrics: {
      totalLeads: 0,
      qualifiedLeads: 0,
      convertedLeads: 0,
      conversionRate: 0,
      averageScore: 0,
      averageValue: 0,
      cost: 0,
      costPerLead: 0,
      roi: 0
    }
  });

  const categories = [
    'Digital',
    'Paid Advertising',
    'Social Media',
    'Email',
    'Referral',
    'Events',
    'Direct',
    'Other'
  ];

  const handleAddSource = () => {
    if (!newSource.name || !newSource.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const source: LeadSource = {
      id: Date.now().toString(),
      name: newSource.name!,
      description: newSource.description!,
      category: newSource.category || 'Digital',
      isActive: true,
      trackingCode: newSource.trackingCode || `SRC${Date.now()}`,
      metrics: newSource.metrics!
    };

    setSources([...sources, source]);
    setNewSource({
      name: '',
      description: '',
      category: 'Digital',
      isActive: true,
      trackingCode: '',
      metrics: {
        totalLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        averageScore: 0,
        averageValue: 0,
        cost: 0,
        costPerLead: 0,
        roi: 0
      }
    });
    setIsAddDialogOpen(false);
    showToast('Lead source added successfully', 'success');
  };

  const handleEditSource = () => {
    if (!selectedSource || !newSource.name || !newSource.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const updatedSources = sources.map(source => 
      source.id === selectedSource.id 
        ? { ...source, ...newSource }
        : source
    );
    
    setSources(updatedSources);
    setSelectedSource(null);
    setNewSource({
      name: '',
      description: '',
      category: 'Digital',
      isActive: true,
      trackingCode: '',
      metrics: {
        totalLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        averageScore: 0,
        averageValue: 0,
        cost: 0,
        costPerLead: 0,
        roi: 0
      }
    });
    setIsEditDialogOpen(false);
    showToast('Lead source updated successfully', 'success');
  };

  const handleDeleteSource = (sourceId: string) => {
    setSources(sources.filter(source => source.id !== sourceId));
    showToast('Lead source deleted successfully', 'success');
  };

  const handleToggleSource = (sourceId: string) => {
    setSources(sources.map(source => 
      source.id === sourceId 
        ? { ...source, isActive: !source.isActive }
        : source
    ));
  };

  const openEditDialog = (source: LeadSource) => {
    setSelectedSource(source);
    setNewSource(source);
    setIsEditDialogOpen(true);
  };

  const getSourceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'digital': return <Globe className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'social media': return <Users className="w-5 h-5" />;
      case 'events': return <Target className="w-5 h-5" />;
      case 'referral': return <TrendingUp className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Digital': 'bg-blue-100 text-blue-800',
      'Paid Advertising': 'bg-purple-100 text-purple-800',
      'Social Media': 'bg-pink-100 text-pink-800',
      'Email': 'bg-green-100 text-green-800',
      'Referral': 'bg-yellow-100 text-yellow-800',
      'Events': 'bg-indigo-100 text-indigo-800',
      'Direct': 'bg-gray-100 text-gray-800',
      'Other': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getROIColor = (roi: number) => {
    if (roi > 200) return 'text-green-600';
    if (roi > 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalMetrics = sources.reduce((acc, source) => ({
    totalLeads: acc.totalLeads + source.metrics.totalLeads,
    qualifiedLeads: acc.qualifiedLeads + source.metrics.qualifiedLeads,
    convertedLeads: acc.convertedLeads + source.metrics.convertedLeads,
    totalCost: acc.totalCost + source.metrics.cost,
    totalValue: acc.totalValue + (source.metrics.convertedLeads * source.metrics.averageValue)
  }), { totalLeads: 0, qualifiedLeads: 0, convertedLeads: 0, totalCost: 0, totalValue: 0 });

  const overallConversionRate = totalMetrics.totalLeads > 0 
    ? (totalMetrics.convertedLeads / totalMetrics.totalLeads) * 100 
    : 0;

  const overallROI = totalMetrics.totalCost > 0 
    ? ((totalMetrics.totalValue - totalMetrics.totalCost) / totalMetrics.totalCost) * 100 
    : 0;

  const SourceForm = ({ 
    source, 
    onChange 
  }: { 
    source: Partial<LeadSource>, 
    onChange: (source: Partial<LeadSource>) => void 
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sourceName">Source Name *</Label>
          <Input
            id="sourceName"
            value={source.name || ''}
            onChange={(e) => onChange({ ...source, name: e.target.value })}
            placeholder="Enter source name"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={source.category || 'Digital'}
            onValueChange={(value) => onChange({ ...source, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Input
          id="description"
          value={source.description || ''}
          onChange={(e) => onChange({ ...source, description: e.target.value })}
          placeholder="Describe this lead source"
        />
      </div>

      <div>
        <Label htmlFor="trackingCode">Tracking Code</Label>
        <Input
          id="trackingCode"
          value={source.trackingCode || ''}
          onChange={(e) => onChange({ ...source, trackingCode: e.target.value })}
          placeholder="Enter tracking code (optional)"
        />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Lead Source Tracking</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Leads</p>
                      <p className="text-2xl font-bold">{totalMetrics.totalLeads.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Qualified Leads</p>
                      <p className="text-2xl font-bold">{totalMetrics.qualifiedLeads.toLocaleString()}</p>
                    </div>
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold">{overallConversionRate.toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overall ROI</p>
                      <p className={`text-2xl font-bold ${getROIColor(overallROI)}`}>
                        {overallROI.toFixed(0)}%
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sources
                    .sort((a, b) => b.metrics.roi - a.metrics.roi)
                    .slice(0, 5)
                    .map((source) => (
                      <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-orange-600">
                            {getSourceIcon(source.category)}
                          </div>
                          <div>
                            <div className="font-medium">{source.name}</div>
                            <Badge className={getCategoryColor(source.category)}>
                              {source.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{source.metrics.totalLeads}</div>
                            <div className="text-gray-500">Leads</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{source.metrics.conversionRate.toFixed(1)}%</div>
                            <div className="text-gray-500">Conversion</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-medium ${getROIColor(source.metrics.roi)}`}>
                              {source.metrics.roi}%
                            </div>
                            <div className="text-gray-500">ROI</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sources Management */}
          <TabsContent value="sources" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Lead Sources</h3>
                <p className="text-sm text-gray-600">
                  Manage and track your lead sources
                </p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Source
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Tracking Code</TableHead>
                      <TableHead>Total Leads</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead>Cost per Lead</TableHead>
                      <TableHead>ROI</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="text-orange-600">
                              {getSourceIcon(source.category)}
                            </div>
                            <div>
                              <div className="font-medium">{source.name}</div>
                              <div className="text-sm text-gray-500">{source.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(source.category)}>
                            {source.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {source.trackingCode}
                          </code>
                        </TableCell>
                        <TableCell>{source.metrics.totalLeads.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{source.metrics.conversionRate.toFixed(1)}%</span>
                            <Progress 
                              value={source.metrics.conversionRate} 
                              className="w-16 h-2" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>${source.metrics.costPerLead.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={getROIColor(source.metrics.roi)}>
                            {source.metrics.roi}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={source.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {source.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(source)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSource(source.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Analysis */}
          <TabsContent value="performance" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Performance Analysis</h3>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Source Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sources.map((source) => (
                      <div key={source.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{source.name}</span>
                          <span>{source.metrics.conversionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={source.metrics.conversionRate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ROI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sources
                      .sort((a, b) => b.metrics.roi - a.metrics.roi)
                      .map((source) => (
                        <div key={source.id} className="flex justify-between items-center">
                          <span className="font-medium">{source.name}</span>
                          <span className={`font-bold ${getROIColor(source.metrics.roi)}`}>
                            {source.metrics.roi}%
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Source Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Lead Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <SourceForm source={newSource} onChange={setNewSource} />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSource} className="bg-orange-600 hover:bg-orange-700">
                  Add Source
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Source Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Lead Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <SourceForm source={newSource} onChange={setNewSource} />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditSource} className="bg-orange-600 hover:bg-orange-700">
                  Update Source
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}