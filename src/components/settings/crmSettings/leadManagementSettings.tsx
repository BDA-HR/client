import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Edit, Download, Upload } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Textarea } from "../../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { showToast } from "../../../layout/layout";

interface LeadSource {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trackingCode?: string;
}

interface LeadStatus {
  id: string;
  name: string;
  description: string;
  isConversion: boolean;
  color: string;
  order: number;
}

interface ScoringRule {
  id: string;
  name: string;
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: string | number;
  points: number;
  isActive: boolean;
}

interface RoutingRule {
  id: string;
  name: string;
  conditions: {
    field: string;
    operator: string;
    value: string;
  }[];
  assignTo: string;
  priority: number;
  isActive: boolean;
}

export default function LeadManagementSettings() {
  const [sources, setSources] = useState<LeadSource[]>([
    {
      id: "1",
      name: "Website",
      description: "Website form submissions",
      isActive: true,
      trackingCode: "website",
    },
    { id: "2", name: "Email", description: "Email campaigns", isActive: true },
    { id: "3", name: "Phone", description: "Incoming calls", isActive: true },
    {
      id: "4",
      name: "Social Media",
      description: "Social media platforms",
      isActive: true,
    },
  ]);

  const [statuses, setStatuses] = useState<LeadStatus[]>([
    {
      id: "1",
      name: "New",
      description: "New leads",
      isConversion: false,
      color: "#3b82f6",
      order: 1,
    },
    {
      id: "2",
      name: "Contacted",
      description: "Initial contact made",
      isConversion: false,
      color: "#f59e0b",
      order: 2,
    },
    {
      id: "3",
      name: "Qualified",
      description: "Lead is qualified",
      isConversion: false,
      color: "#10b981",
      order: 3,
    },
    {
      id: "4",
      name: "Closed Won",
      description: "Lead converted to customer",
      isConversion: true,
      color: "#059669",
      order: 4,
    },
    {
      id: "5",
      name: "Closed Lost",
      description: "Lead lost",
      isConversion: true,
      color: "#ef4444",
      order: 5,
    },
  ]);

  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([
    {
      id: "1",
      name: "Email Engagement",
      field: "email_opened",
      operator: "equals",
      value: "true",
      points: 10,
      isActive: true,
    },
    {
      id: "2",
      name: "High Budget",
      field: "budget",
      operator: "greater_than",
      value: "10000",
      points: 20,
      isActive: true,
    },
    {
      id: "3",
      name: "Immediate Timeline",
      field: "timeline",
      operator: "equals",
      value: "Immediate",
      points: 15,
      isActive: true,
    },
    {
      id: "4",
      name: "Key Industry",
      field: "industry",
      operator: "contains",
      value: "Technology",
      points: 10,
      isActive: true,
    },
  ]);

  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([
    {
      id: "1",
      name: "Enterprise Leads",
      conditions: [
        { field: "companySize", operator: "equals", value: "Enterprise" },
      ],
      assignTo: "Sarah Johnson",
      priority: 1,
      isActive: true,
    },
    {
      id: "2",
      name: "Technical Leads",
      conditions: [
        { field: "industry", operator: "equals", value: "Technology" },
      ],
      assignTo: "Mike Wilson",
      priority: 2,
      isActive: true,
    },
  ]);

  const [newSource, setNewSource] = useState<Partial<LeadSource>>({});
  const [newStatus, setNewStatus] = useState<Partial<LeadStatus>>({});
  const [newRule, setNewRule] = useState<Partial<ScoringRule>>({});
  const [newRouting, setNewRouting] = useState<Partial<RoutingRule>>({});

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    showToast.success("Lead management settings saved successfully");
  };

  const handleImportLeads = (file: File) => {
    // Handle CSV/Excel import
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Parse CSV/Excel and process leads
      showToast.success("Leads imported successfully");
    };
    reader.readAsText(file);
  };

  const handleExportLeads = () => {
    // Export leads logic
    showToast.success("Leads exported successfully");
  };

  const fieldOptions = [
    "email_opened",
    "website_visited",
    "form_submitted",
    "budget",
    "timeline",
    "industry",
    "companySize",
    "jobTitle",
    "source",
    "score",
  ];

  const operatorOptions = [
    { value: "equals", label: "Equals" },
    { value: "contains", label: "Contains" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "not_equals", label: "Not equals" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Lead Management Settings
        </h1>
        <p className="text-gray-600">
          Configure lead capture, scoring, routing and automation rules
        </p>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="statuses">Lead Statuses</TabsTrigger>
          <TabsTrigger value="scoring">Scoring Rules</TabsTrigger>
          <TabsTrigger value="routing">Routing Rules</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>

        {/* Lead Sources Tab */}
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
              <CardDescription>
                Configure where leads come from and tracking codes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Source */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="sourceName">Source Name</Label>
                      <Input
                        id="sourceName"
                        value={newSource.name || ""}
                        onChange={(e) =>
                          setNewSource({ ...newSource, name: e.target.value })
                        }
                        placeholder="e.g., LinkedIn, Trade Show"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sourceDescription">Description</Label>
                      <Input
                        id="sourceDescription"
                        value={newSource.description || ""}
                        onChange={(e) =>
                          setNewSource({
                            ...newSource,
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief description"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label htmlFor="trackingCode">Tracking Code</Label>
                        <Input
                          id="trackingCode"
                          value={newSource.trackingCode || ""}
                          onChange={(e) =>
                            setNewSource({
                              ...newSource,
                              trackingCode: e.target.value,
                            })
                          }
                          placeholder="Optional"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          if (newSource.name) {
                            setSources([
                              ...sources,
                              {
                                id: Date.now().toString(),
                                name: newSource.name!,
                                description: newSource.description || "",
                                trackingCode: newSource.trackingCode,
                                isActive: true,
                              },
                            ]);
                            setNewSource({});
                          }
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sources List */}
              <div className="space-y-4">
                <h3 className="font-medium">Active Lead Sources</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Tracking Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">
                          {source.name}
                        </TableCell>
                        <TableCell>{source.description}</TableCell>
                        <TableCell>{source.trackingCode || "-"}</TableCell>
                        <TableCell>
                          <Switch
                            checked={source.isActive}
                            onCheckedChange={(checked) => {
                              setSources(
                                sources.map((s) =>
                                  s.id === source.id
                                    ? { ...s, isActive: checked }
                                    : s
                                )
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (window.confirm("Delete this source?")) {
                                setSources(
                                  sources.filter((s) => s.id !== source.id)
                                );
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lead Statuses Tab */}
        <TabsContent value="statuses">
          <Card>
            <CardHeader>
              <CardTitle>Lead Statuses</CardTitle>
              <CardDescription>
                Define the stages in your lead management pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Status */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="statusName">Status Name</Label>
                      <Input
                        id="statusName"
                        value={newStatus.name || ""}
                        onChange={(e) =>
                          setNewStatus({ ...newStatus, name: e.target.value })
                        }
                        placeholder="e.g., Negotiation, Proposal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="statusDescription">Description</Label>
                      <Input
                        id="statusDescription"
                        value={newStatus.description || ""}
                        onChange={(e) =>
                          setNewStatus({
                            ...newStatus,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="statusColor">Color</Label>
                      <Input
                        id="statusColor"
                        type="color"
                        value={newStatus.color || "#3b82f6"}
                        onChange={(e) =>
                          setNewStatus({ ...newStatus, color: e.target.value })
                        }
                        className="h-10"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isConversion"
                          checked={newStatus.isConversion || false}
                          onCheckedChange={(checked) =>
                            setNewStatus({
                              ...newStatus,
                              isConversion: checked,
                            })
                          }
                        />
                        <Label htmlFor="isConversion">Is Conversion</Label>
                      </div>
                      <Button
                        onClick={() => {
                          if (newStatus.name) {
                            setStatuses([
                              ...statuses,
                              {
                                id: Date.now().toString(),
                                name: newStatus.name!,
                                description: newStatus.description || "",
                                color: newStatus.color || "#3b82f6",
                                isConversion: newStatus.isConversion || false,
                                order: statuses.length + 1,
                              },
                            ]);
                            setNewStatus({});
                          }
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statuses List */}
              <div className="space-y-4">
                <h3 className="font-medium">Lead Status Pipeline</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Conversion Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statuses
                      .sort((a, b) => a.order - b.order)
                      .map((status) => (
                        <TableRow key={status.id}>
                          <TableCell>{status.order}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: status.color }}
                              />
                              <span className="font-medium">{status.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{status.description}</TableCell>
                          <TableCell>
                            <input
                              type="color"
                              value={status.color}
                              onChange={(e) => {
                                setStatuses(
                                  statuses.map((s) =>
                                    s.id === status.id
                                      ? { ...s, color: e.target.value }
                                      : s
                                  )
                                );
                              }}
                              className="w-8 h-8"
                            />
                          </TableCell>
                          <TableCell>
                            {status.isConversion ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (window.confirm("Delete this status?")) {
                                    setStatuses(
                                      statuses.filter((s) => s.id !== status.id)
                                    );
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scoring Rules Tab */}
        <TabsContent value="scoring">
          <Card>
            <CardHeader>
              <CardTitle>Lead Scoring Rules</CardTitle>
              <CardDescription>
                Define rules to automatically score leads based on behavior and
                attributes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Rule */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="ruleName">Rule Name</Label>
                      <Input
                        id="ruleName"
                        value={newRule.name || ""}
                        onChange={(e) =>
                          setNewRule({ ...newRule, name: e.target.value })
                        }
                        placeholder="e.g., High Budget Lead"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ruleField">Field</Label>
                      <select
                        id="ruleField"
                        value={newRule.field || ""}
                        onChange={(e) =>
                          setNewRule({ ...newRule, field: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select field</option>
                        {fieldOptions.map((field) => (
                          <option key={field} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="ruleOperator">Operator</Label>
                      <select
                        id="ruleOperator"
                        value={newRule.operator || ""}
                        onChange={(e) =>
                          setNewRule({
                            ...newRule,
                            operator: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select operator</option>
                        {operatorOptions.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="ruleValue">Value</Label>
                      <Input
                        id="ruleValue"
                        value={newRule.value || ""}
                        onChange={(e) =>
                          setNewRule({ ...newRule, value: e.target.value })
                        }
                        placeholder="Comparison value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rulePoints">Points</Label>
                      <Input
                        id="rulePoints"
                        type="number"
                        value={newRule.points || 0}
                        onChange={(e) =>
                          setNewRule({
                            ...newRule,
                            points: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={() => {
                          if (
                            newRule.name &&
                            newRule.field &&
                            newRule.operator
                          ) {
                            setScoringRules([
                              ...scoringRules,
                              {
                                id: Date.now().toString(),
                                name: newRule.name!,
                                field: newRule.field!,
                                operator: newRule.operator!,
                                value: newRule.value || "",
                                points: newRule.points || 0,
                                isActive: true,
                              },
                            ]);
                            setNewRule({});
                          }
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Rule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rules List */}
              <div className="space-y-4">
                <h3 className="font-medium">Active Scoring Rules</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scoringRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">
                          {rule.name}
                        </TableCell>
                        <TableCell>
                          {rule.field} {rule.operator} {rule.value}
                        </TableCell>
                        <TableCell>{rule.points}</TableCell>
                        <TableCell>
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={(checked) => {
                              setScoringRules(
                                scoringRules.map((r) =>
                                  r.id === rule.id
                                    ? { ...r, isActive: checked }
                                    : r
                                )
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (window.confirm("Delete this rule?")) {
                                setScoringRules(
                                  scoringRules.filter((r) => r.id !== rule.id)
                                );
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routing Rules Tab */}
        <TabsContent value="routing">
          <Card>
            <CardHeader>
              <CardTitle>Lead Routing Rules</CardTitle>
              <CardDescription>
                Automatically assign leads based on territory, expertise, or
                workload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Routing Rule */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="routingName">Rule Name</Label>
                        <Input
                          id="routingName"
                          value={newRouting.name || ""}
                          onChange={(e) =>
                            setNewRouting({
                              ...newRouting,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., Enterprise Leads to Senior Reps"
                        />
                      </div>
                      <div>
                        <Label htmlFor="routingAssign">Assign To</Label>
                        <Input
                          id="routingAssign"
                          value={newRouting.assignTo || ""}
                          onChange={(e) =>
                            setNewRouting({
                              ...newRouting,
                              assignTo: e.target.value,
                            })
                          }
                          placeholder="User or Team"
                        />
                      </div>
                      <div>
                        <Label htmlFor="routingPriority">Priority</Label>
                        <Input
                          id="routingPriority"
                          type="number"
                          value={newRouting.priority || 1}
                          onChange={(e) =>
                            setNewRouting({
                              ...newRouting,
                              priority: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Conditions</Label>
                      <Textarea
                        placeholder="e.g., companySize = 'Enterprise' AND industry = 'Technology'"
                        value={JSON.stringify(newRouting.conditions || [])}
                        onChange={(e) => {
                          try {
                            setNewRouting({
                              ...newRouting,
                              conditions: JSON.parse(e.target.value),
                            });
                          } catch (error) {
                            // Handle JSON parse error
                          }
                        }}
                        rows={2}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        if (newRouting.name && newRouting.assignTo) {
                          setRoutingRules([
                            ...routingRules,
                            {
                              id: Date.now().toString(),
                              name: newRouting.name!,
                              assignTo: newRouting.assignTo!,
                              priority: newRouting.priority || 1,
                              conditions: newRouting.conditions || [],
                              isActive: true,
                            },
                          ]);
                          setNewRouting({});
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Routing Rule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Routing Rules List */}
              <div className="space-y-4">
                <h3 className="font-medium">Active Routing Rules</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Conditions</TableHead>
                      <TableHead>Assign To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routingRules
                      .sort((a, b) => a.priority - b.priority)
                      .map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell className="font-medium">
                            {rule.name}
                          </TableCell>
                          <TableCell>
                            {rule.conditions.map((cond, idx) => (
                              <div key={idx} className="text-sm">
                                {cond.field} {cond.operator} {cond.value}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>{rule.assignTo}</TableCell>
                          <TableCell>{rule.priority}</TableCell>
                          <TableCell>
                            <Switch
                              checked={rule.isActive}
                              onCheckedChange={(checked) => {
                                setRoutingRules(
                                  routingRules.map((r) =>
                                    r.id === rule.id
                                      ? { ...r, isActive: checked }
                                      : r
                                  )
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (
                                  window.confirm("Delete this routing rule?")
                                ) {
                                  setRoutingRules(
                                    routingRules.filter((r) => r.id !== rule.id)
                                  );
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import/Export Tab */}
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import & Export Leads</CardTitle>
              <CardDescription>
                Bulk import leads from CSV/Excel files or export existing leads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Import Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Import Leads</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Upload CSV or Excel files with lead data
                      </p>
                      <Input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImportLeads(file);
                          }
                        }}
                        className="hidden"
                        id="import-file"
                      />
                      <Label
                        htmlFor="import-file"
                        className="cursor-pointer inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                      >
                        Choose File
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">File Requirements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Supported formats: CSV, XLSX, XLS</li>
                        <li>
                          • Required columns: firstName, lastName, email,
                          company
                        </li>
                        <li>
                          • Optional columns: phone, jobTitle, source, industry
                        </li>
                        <li>• Maximum file size: 10MB</li>
                        <li>
                          • Download{" "}
                          <a
                            href="#"
                            className="text-orange-600 hover:underline"
                          >
                            sample template
                          </a>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Leads</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="exportFormat">Format</Label>
                        <select
                          id="exportFormat"
                          className="w-full px-3 py-2 border rounded-md"
                          defaultValue="csv"
                        >
                          <option value="csv">CSV</option>
                          <option value="xlsx">Excel</option>
                          <option value="json">JSON</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="exportFilters">
                          Apply Current Filters
                        </Label>
                        <select
                          id="exportFilters"
                          className="w-full px-3 py-2 border rounded-md"
                          defaultValue="all"
                        >
                          <option value="all">All Leads</option>
                          <option value="filtered">
                            Current Filtered View
                          </option>
                          <option value="selected">Selected Leads Only</option>
                        </select>
                      </div>

                      <div>
                        <Label>Include Fields</Label>
                        <div className="space-y-2 mt-2">
                          {[
                            "Contact Info",
                            "Company Info",
                            "Lead Score",
                            "Activities",
                            "Custom Fields",
                          ].map((field) => (
                            <div key={field} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`field-${field}`}
                                defaultChecked
                                className="mr-2"
                              />
                              <Label
                                htmlFor={`field-${field}`}
                                className="text-sm"
                              >
                                {field}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button onClick={handleExportLeads} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export Leads
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Imports */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Imports</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2024-01-18</TableCell>
                        <TableCell>leads_january.csv</TableCell>
                        <TableCell>245</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Completed
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Download Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          className="bg-orange-600 hover:bg-orange-700"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
