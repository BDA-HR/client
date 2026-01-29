import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, DollarSign, TrendingUp, Calendar, User, Building, Target } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Progress } from '../../ui/progress';
import { mockOpportunities } from '../../../data/crmMockData';
import type { Opportunity } from '../../../types/crm';

const stageColors = {
  'Qualification': 'bg-blue-100 text-blue-800',
  'Needs Analysis': 'bg-yellow-100 text-yellow-800',
  'Proposal': 'bg-orange-100 text-orange-800',
  'Negotiation': 'bg-purple-100 text-purple-800',
  'Closed Won': 'bg-green-100 text-green-800',
  'Closed Lost': 'bg-red-100 text-red-800'
};

const stageOrder = ['Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function SalesManagement() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newOpportunity, setNewOpportunity] = useState<Partial<Opportunity>>({
    name: '',
    accountId: '',
    contactId: '',
    stage: 'Qualification',
    amount: 0,
    probability: 0,
    expectedCloseDate: '',
    assignedTo: '',
    source: '',
    description: '',
    products: [],
    competitors: [],
    nextStep: ''
  });

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = 
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  // Calculate metrics
  const totalPipelineValue = opportunities
    .filter(opp => !['Closed Won', 'Closed Lost'].includes(opp.stage))
    .reduce((sum, opp) => sum + opp.amount, 0);

  const closedWonValue = opportunities
    .filter(opp => opp.stage === 'Closed Won')
    .reduce((sum, opp) => sum + opp.amount, 0);

  const averageDealSize = opportunities.length > 0 
    ? opportunities.reduce((sum, opp) => sum + opp.amount, 0) / opportunities.length 
    : 0;

  const winRate = opportunities.length > 0
    ? (opportunities.filter(opp => opp.stage === 'Closed Won').length / 
       opportunities.filter(opp => ['Closed Won', 'Closed Lost'].includes(opp.stage)).length) * 100
    : 0;

  const handleAddOpportunity = () => {
    const opportunity: Opportunity = {
      ...newOpportunity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Opportunity;
    
    setOpportunities([...opportunities, opportunity]);
    setNewOpportunity({
      name: '',
      accountId: '',
      contactId: '',
      stage: 'Qualification',
      amount: 0,
      probability: 0,
      expectedCloseDate: '',
      assignedTo: '',
      source: '',
      description: '',
      products: [],
      competitors: [],
      nextStep: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditOpportunity = () => {
    if (selectedOpportunity) {
      const updatedOpportunities = opportunities.map(opp => 
        opp.id === selectedOpportunity.id 
          ? { ...selectedOpportunity, updatedAt: new Date().toISOString() }
          : opp
      );
      setOpportunities(updatedOpportunities);
      setIsEditDialogOpen(false);
      setSelectedOpportunity(null);
    }
  };

  const handleStageChange = (oppId: string, newStage: Opportunity['stage']) => {
    const updatedOpportunities = opportunities.map(opp => 
      opp.id === oppId 
        ? { ...opp, stage: newStage, updatedAt: new Date().toISOString() }
        : opp
    );
    setOpportunities(updatedOpportunities);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600">Track and manage your sales opportunities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Opportunity</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Opportunity Name</Label>
                <Input
                  id="name"
                  value={newOpportunity.name}
                  onChange={(e) => setNewOpportunity({...newOpportunity, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newOpportunity.amount}
                  onChange={(e) => setNewOpportunity({...newOpportunity, amount: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={newOpportunity.probability}
                  onChange={(e) => setNewOpportunity({...newOpportunity, probability: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  value={newOpportunity.expectedCloseDate}
                  onChange={(e) => setNewOpportunity({...newOpportunity, expectedCloseDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={newOpportunity.assignedTo}
                  onChange={(e) => setNewOpportunity({...newOpportunity, assignedTo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={newOpportunity.source}
                  onChange={(e) => setNewOpportunity({...newOpportunity, source: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select value={newOpportunity.stage} onValueChange={(value) => setNewOpportunity({...newOpportunity, stage: value as Opportunity['stage']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stageOrder.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newOpportunity.description}
                  onChange={(e) => setNewOpportunity({...newOpportunity, description: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="nextStep">Next Step</Label>
                <Input
                  id="nextStep"
                  value={newOpportunity.nextStep}
                  onChange={(e) => setNewOpportunity({...newOpportunity, nextStep: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOpportunity} className="bg-orange-600 hover:bg-orange-700">
                Add Opportunity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalPipelineValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed Won</p>
                <p className="text-2xl font-bold text-green-600">${closedWonValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">${averageDealSize.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-purple-600">{winRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stageOrder.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Opportunities ({filteredOpportunities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Next Step</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{opportunity.name}</div>
                      <div className="text-sm text-gray-500">{opportunity.source}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{opportunity.amount.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={opportunity.stage}
                      onValueChange={(value) => handleStageChange(opportunity.id, value as Opportunity['stage'])}
                    >
                      <SelectTrigger className="w-36">
                        <Badge className={stageColors[opportunity.stage]}>
                          {opportunity.stage}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {stageOrder.map(stage => (
                          <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={opportunity.probability} className="w-16" />
                      <span className="text-sm font-medium">{opportunity.probability}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{opportunity.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{opportunity.nextStep}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOpportunity(opportunity);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Opportunity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
          </DialogHeader>
          {selectedOpportunity && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="editName">Opportunity Name</Label>
                <Input
                  id="editName"
                  value={selectedOpportunity.name}
                  onChange={(e) => setSelectedOpportunity({...selectedOpportunity, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editAmount">Amount ($)</Label>
                <Input
                  id="editAmount"
                  type="number"
                  value={selectedOpportunity.amount}
                  onChange={(e) => setSelectedOpportunity({...selectedOpportunity, amount: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="editProbability">Probability (%)</Label>
                <Input
                  id="editProbability"
                  type="number"
                  min="0"
                  max="100"
                  value={selectedOpportunity.probability}
                  onChange={(e) => setSelectedOpportunity({...selectedOpportunity, probability: Number(e.target.value)})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="editNextStep">Next Step</Label>
                <Input
                  id="editNextStep"
                  value={selectedOpportunity.nextStep}
                  onChange={(e) => setSelectedOpportunity({...selectedOpportunity, nextStep: e.target.value})}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditOpportunity} className="bg-orange-600 hover:bg-orange-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}