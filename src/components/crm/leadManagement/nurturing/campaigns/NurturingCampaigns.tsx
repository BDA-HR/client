import React, { useState } from 'react';
import { Plus, Play, Pause, Edit, Trash2, Mail, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card';
import { Badge } from '../../../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../ui/table';
import { Progress } from '../../../../ui/progress';

interface NurturingCampaign {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Paused' | 'Draft' | 'Completed';
  type: 'Email Sequence' | 'Drip Campaign' | 'Event-Based' | 'Manual';
  totalLeads: number;
  activeLeads: number;
  completedLeads: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  createdAt: string;
  lastActivity: string;
}

interface NurturingCampaignsProps {
  campaigns: NurturingCampaign[];
  onAddCampaign: () => void;
  onEditCampaign: (campaign: NurturingCampaign) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onToggleCampaign: (campaignId: string, action: 'play' | 'pause') => void;
}

export default function NurturingCampaigns({
  campaigns,
  onAddCampaign,
  onEditCampaign,
  onDeleteCampaign,
  onToggleCampaign
}: NurturingCampaignsProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true;
    return campaign.status.toLowerCase() === filter;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Paused': 'bg-yellow-100 text-yellow-800',
      'Draft': 'bg-gray-100 text-gray-800',
      'Completed': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Email Sequence': 'bg-purple-100 text-purple-800',
      'Drip Campaign': 'bg-blue-100 text-blue-800',
      'Event-Based': 'bg-orange-100 text-orange-800',
      'Manual': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteWithConfirmation = (campaign: NurturingCampaign) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the campaign "${campaign.name}"? This action cannot be undone.`
    );
    if (confirmed) {
      onDeleteCampaign(campaign.id);
    }
  };

  const totalStats = campaigns.reduce(
    (acc, campaign) => ({
      totalLeads: acc.totalLeads + campaign.totalLeads,
      activeLeads: acc.activeLeads + campaign.activeLeads,
      completedLeads: acc.completedLeads + campaign.completedLeads,
      avgOpenRate: acc.avgOpenRate + campaign.openRate,
      avgClickRate: acc.avgClickRate + campaign.clickRate,
      avgConversionRate: acc.avgConversionRate + campaign.conversionRate
    }),
    { totalLeads: 0, activeLeads: 0, completedLeads: 0, avgOpenRate: 0, avgClickRate: 0, avgConversionRate: 0 }
  );

  if (campaigns.length > 0) {
    totalStats.avgOpenRate /= campaigns.length;
    totalStats.avgClickRate /= campaigns.length;
    totalStats.avgConversionRate /= campaigns.length;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Nurturing Campaigns</h2>
          <p className="text-gray-600 mt-1">
            Automated campaigns to nurture and convert leads
          </p>
        </div>
        <Button onClick={onAddCampaign} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalLeads.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.avgOpenRate.toFixed(1)}%</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.avgClickRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.avgConversionRate.toFixed(1)}%</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        {['all', 'active', 'paused', 'draft'].map((filterOption) => (
          <Button
            key={filterOption}
            variant={filter === filterOption ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterOption as any)}
            className={filter === filterOption ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </Button>
        ))}
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns ({filteredCampaigns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-500 mb-4">
                Create your first nurturing campaign to engage leads
              </p>
              <Button onClick={onAddCampaign} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(campaign.type)}>
                        {campaign.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Active: {campaign.activeLeads}</span>
                          <span>Total: {campaign.totalLeads}</span>
                        </div>
                        <Progress 
                          value={(campaign.activeLeads / campaign.totalLeads) * 100} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>Open: {campaign.openRate}%</div>
                        <div>Click: {campaign.clickRate}%</div>
                        <div>Convert: {campaign.conversionRate}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(campaign.lastActivity).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {campaign.status === 'Active' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleCampaign(campaign.id, 'pause')}
                            title="Pause campaign"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleCampaign(campaign.id, 'play')}
                            title="Start campaign"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditCampaign(campaign)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWithConfirmation(campaign)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}