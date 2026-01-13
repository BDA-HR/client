import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MessageSquare, Calendar, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import LeadOverview from './LeadOverview';
import SalesOverview from './SalesOverview';
import ActivityOverview from './ActivityOverview';
import ContactOverview from './ContactOverview';
import MarketingOverview from './MarketingOverview';
import SupportOverview from './SupportOverview';
import AnalyticsOverview from './AnalyticsOverview';
import { mockLeads, mockOpportunities, mockContacts, mockSupportTickets, mockActivities, mockCampaigns } from '../../data/crmMockData';

export default function CRMDashboard() {
  // Calculate key metrics
  const totalLeads = mockLeads.length;
  const qualifiedLeads = mockLeads.filter(lead => lead.status === 'Qualified').length;
  const totalOpportunities = mockOpportunities.length;
  const pipelineValue = mockOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const totalContacts = mockContacts.length;
  const activeContacts = mockContacts.filter(contact => contact.isActive).length;
  const openTickets = mockSupportTickets.filter(ticket => ['Open', 'In Progress', 'Pending'].includes(ticket.status)).length;
  const pendingActivities = mockActivities.filter(activity => activity.status === 'Pending').length;
  const activeCampaigns = mockCampaigns.filter(campaign => campaign.status === 'Active').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600">Comprehensive view of your customer relationship management</p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-orange-600">{totalLeads}</p>
                <p className="text-xs text-gray-500 mt-1">{qualifiedLeads} qualified</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-green-600">${pipelineValue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{totalOpportunities} opportunities</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Contacts</p>
                <p className="text-2xl font-bold text-blue-600">{activeContacts}</p>
                <p className="text-xs text-gray-500 mt-1">of {totalContacts} total</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-red-600">{openTickets}</p>
                <p className="text-xs text-gray-500 mt-1">{pendingActivities} pending tasks</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-xl font-bold text-purple-600">{activeCampaigns}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Activities</p>
                <p className="text-xl font-bold text-yellow-600">{pendingActivities}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-xl font-bold text-indigo-600">24.5%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadOverview />
        <SalesOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContactOverview />
        <MarketingOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityOverview />
        <SupportOverview />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnalyticsOverview />
      </div>
    </motion.div>
  );
}