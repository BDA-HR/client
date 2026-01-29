import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Target, Calendar, BarChart3, PieChart, Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Progress } from '../../../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import type { Opportunity } from '../../../../types/crm';

interface SalesForecastingProps {
  opportunities: Opportunity[];
}

export default function SalesForecasting({ opportunities }: SalesForecastingProps) {
  const [forecastPeriod, setForecastPeriod] = useState('quarter');
  const [forecastType, setForecastType] = useState('weighted');

  // Calculate forecast metrics
  const getForecastMetrics = () => {
    const now = new Date();
    let periodStart: Date, periodEnd: Date;

    switch (forecastPeriod) {
      case 'month':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        periodStart = new Date(now.getFullYear(), quarterStart, 1);
        periodEnd = new Date(now.getFullYear(), quarterStart + 3, 0);
        break;
      case 'year':
        periodStart = new Date(now.getFullYear(), 0, 1);
        periodEnd = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        periodStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        periodEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
    }

    const periodOpportunities = opportunities.filter(opp => {
      const closeDate = new Date(opp.expectedCloseDate);
      return closeDate >= periodStart && closeDate <= periodEnd && !['Closed Lost'].includes(opp.stage);
    });

    // Forecast categories
    const commitOpportunities = periodOpportunities.filter(opp => 
      opp.forecastCategory === 'commit' || opp.probability >= 70
    );
    const bestCaseOpportunities = periodOpportunities.filter(opp => 
      opp.forecastCategory === 'best-case' || (opp.probability >= 40 && opp.probability < 70)
    );
    const pipelineOpportunities = periodOpportunities.filter(opp => 
      opp.forecastCategory === 'pipeline' || opp.probability < 40
    );

    // Calculate forecast amounts
    const commitAmount = commitOpportunities.reduce((sum, opp) => sum + (opp.weightedAmount || opp.amount * (opp.probability / 100)), 0);
    const bestCaseAmount = bestCaseOpportunities.reduce((sum, opp) => sum + (opp.weightedAmount || opp.amount * (opp.probability / 100)), 0);
    const pipelineAmount = pipelineOpportunities.reduce((sum, opp) => sum + (opp.weightedAmount || opp.amount * (opp.probability / 100)), 0);

    const totalWeightedAmount = commitAmount + bestCaseAmount + pipelineAmount;
    const totalAmount = periodOpportunities.reduce((sum, opp) => sum + opp.amount, 0);

    // Sales velocity metrics
    const avgSalesVelocity = periodOpportunities.length > 0 
      ? periodOpportunities.reduce((sum, opp) => sum + (opp.salesVelocity || 8.5), 0) / periodOpportunities.length
      : 0;

    const avgDealSize = periodOpportunities.length > 0 
      ? totalAmount / periodOpportunities.length 
      : 0;

    // Win rate calculation
    const closedOpportunities = opportunities.filter(opp => ['Closed Won', 'Closed Lost'].includes(opp.stage));
    const wonOpportunities = closedOpportunities.filter(opp => opp.stage === 'Closed Won');
    const winRate = closedOpportunities.length > 0 ? (wonOpportunities.length / closedOpportunities.length) * 100 : 0;

    return {
      periodStart,
      periodEnd,
      totalOpportunities: periodOpportunities.length,
      commitAmount,
      bestCaseAmount,
      pipelineAmount,
      totalWeightedAmount,
      totalAmount,
      avgSalesVelocity,
      avgDealSize,
      winRate,
      commitCount: commitOpportunities.length,
      bestCaseCount: bestCaseOpportunities.length,
      pipelineCount: pipelineOpportunities.length
    };
  };

  const metrics = getForecastMetrics();

  // Sales rep performance
  const getRepPerformance = () => {
    const repMap = new Map();
    
    opportunities.forEach(opp => {
      if (!repMap.has(opp.assignedTo)) {
        repMap.set(opp.assignedTo, {
          name: opp.assignedTo,
          opportunities: 0,
          totalAmount: 0,
          weightedAmount: 0,
          avgProbability: 0,
          wonDeals: 0,
          lostDeals: 0
        });
      }
      
      const rep = repMap.get(opp.assignedTo);
      rep.opportunities++;
      rep.totalAmount += opp.amount;
      rep.weightedAmount += (opp.weightedAmount || opp.amount * (opp.probability / 100));
      rep.avgProbability += opp.probability;
      
      if (opp.stage === 'Closed Won') rep.wonDeals++;
      if (opp.stage === 'Closed Lost') rep.lostDeals++;
    });

    return Array.from(repMap.values()).map(rep => ({
      ...rep,
      avgProbability: rep.avgProbability / rep.opportunities,
      winRate: rep.wonDeals + rep.lostDeals > 0 ? (rep.wonDeals / (rep.wonDeals + rep.lostDeals)) * 100 : 0
    })).sort((a, b) => b.weightedAmount - a.weightedAmount);
  };

  const repPerformance = getRepPerformance();

  // Stage analysis
  const getStageAnalysis = () => {
    const stages = ['Qualification', 'Needs Analysis', 'Proposal', 'Negotiation'];
    return stages.map(stage => {
      const stageOpps = opportunities.filter(opp => opp.stage === stage);
      const stageAmount = stageOpps.reduce((sum, opp) => sum + opp.amount, 0);
      const stageWeightedAmount = stageOpps.reduce((sum, opp) => sum + (opp.weightedAmount || opp.amount * (opp.probability / 100)), 0);
      const avgDaysInStage = stageOpps.length > 0 
        ? stageOpps.reduce((sum, opp) => sum + (opp.daysInStage || 0), 0) / stageOpps.length 
        : 0;

      return {
        stage,
        count: stageOpps.length,
        amount: stageAmount,
        weightedAmount: stageWeightedAmount,
        avgDaysInStage
      };
    });
  };

  const stageAnalysis = getStageAnalysis();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPeriod = () => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      year: 'numeric' 
    };
    
    if (forecastPeriod === 'month') {
      return metrics.periodStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (forecastPeriod === 'quarter') {
      const quarter = Math.floor(metrics.periodStart.getMonth() / 3) + 1;
      return `Q${quarter} ${metrics.periodStart.getFullYear()}`;
    } else {
      return metrics.periodStart.getFullYear().toString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Forecast Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sales Forecast - {formatPeriod()}</h2>
          <p className="text-gray-600">Revenue forecasting and pipeline analysis</p>
        </div>
        <div className="flex space-x-3">
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={forecastType} onValueChange={setForecastType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weighted">Weighted</SelectItem>
              <SelectItem value="best-case">Best Case</SelectItem>
              <SelectItem value="worst-case">Worst Case</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Forecast Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commit Forecast</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.commitAmount)}</p>
                <p className="text-xs text-gray-500">{metrics.commitCount} opportunities</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Case</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(metrics.bestCaseAmount)}</p>
                <p className="text-xs text-gray-500">{metrics.bestCaseCount} opportunities</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(metrics.pipelineAmount)}</p>
                <p className="text-xs text-gray-500">{metrics.pipelineCount} opportunities</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Weighted</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.totalWeightedAmount)}</p>
                <p className="text-xs text-gray-500">{metrics.totalOpportunities} total</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <span>Forecast by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="font-medium text-gray-900">Commit</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{formatCurrency(metrics.commitAmount)}</div>
                  <div className="text-xs text-gray-500">
                    {metrics.totalWeightedAmount > 0 ? ((metrics.commitAmount / metrics.totalWeightedAmount) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
              <Progress value={metrics.totalWeightedAmount > 0 ? (metrics.commitAmount / metrics.totalWeightedAmount) * 100 : 0} className="h-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="font-medium text-gray-900">Best Case</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{formatCurrency(metrics.bestCaseAmount)}</div>
                  <div className="text-xs text-gray-500">
                    {metrics.totalWeightedAmount > 0 ? ((metrics.bestCaseAmount / metrics.totalWeightedAmount) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
              <Progress value={metrics.totalWeightedAmount > 0 ? (metrics.bestCaseAmount / metrics.totalWeightedAmount) * 100 : 0} className="h-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="font-medium text-gray-900">Pipeline</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{formatCurrency(metrics.pipelineAmount)}</div>
                  <div className="text-xs text-gray-500">
                    {metrics.totalWeightedAmount > 0 ? ((metrics.pipelineAmount / metrics.totalWeightedAmount) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
              <Progress value={metrics.totalWeightedAmount > 0 ? (metrics.pipelineAmount / metrics.totalWeightedAmount) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Key Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Average Deal Size</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(metrics.avgDealSize)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Sales Velocity</span>
                <span className="text-lg font-bold text-gray-900">{metrics.avgSalesVelocity.toFixed(1)} days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Win Rate</span>
                <span className="text-lg font-bold text-gray-900">{metrics.winRate.toFixed(1)}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Forecast Accuracy</span>
                <span className="text-lg font-bold text-green-600">87.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Rep Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Sales Rep Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sales Rep</TableHead>
                <TableHead>Opportunities</TableHead>
                <TableHead>Pipeline Value</TableHead>
                <TableHead>Weighted Amount</TableHead>
                <TableHead>Avg Probability</TableHead>
                <TableHead>Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repPerformance.map((rep, index) => (
                <TableRow key={rep.name}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {index < 3 && <Award className="w-4 h-4 text-yellow-500" />}
                      <span className="font-medium">{rep.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{rep.opportunities}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(rep.totalAmount)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-blue-600">{formatCurrency(rep.weightedAmount)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      rep.avgProbability >= 70 ? 'bg-green-100 text-green-800' :
                      rep.avgProbability >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {rep.avgProbability.toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      rep.winRate >= 60 ? 'text-green-600' :
                      rep.winRate >= 40 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {rep.winRate.toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pipeline Stage Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Pipeline Stage Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stageAnalysis.map((stage) => (
              <div key={stage.stage} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{stage.stage}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Count:</span>
                    <span className="font-medium">{stage.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-medium">{formatCurrency(stage.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weighted:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(stage.weightedAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Days:</span>
                    <span className="font-medium">{stage.avgDaysInStage.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}