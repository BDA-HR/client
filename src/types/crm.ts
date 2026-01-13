// CRM Types and Interfaces

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  source: 'Website' | 'Email' | 'Phone' | 'Social Media' | 'Referral' | 'Event';
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Closed Won' | 'Closed Lost';
  score: number;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  budget: number;
  timeline: string;
  industry: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  tags: string[];
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastContactDate: string;
  notes: string;
  isActive: boolean;
}

export interface Opportunity {
  id: string;
  name: string;
  accountId: string;
  contactId: string;
  stage: 'Qualification' | 'Needs Analysis' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  amount: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  products: string[];
  competitors: string[];
  nextStep: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'Email' | 'SMS' | 'Social Media' | 'Webinar' | 'Event';
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  startDate: string;
  endDate: string;
  budget: number;
  targetAudience: string;
  description: string;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdAt: string;
  createdBy: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Technical' | 'Billing' | 'General' | 'Feature Request';
  customerId: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaDeadline: string;
  tags: string[];
  attachments: string[];
}

// Activity interface - explicitly exported
export interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Task' | 'Note';
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  relatedTo: {
    type: 'Lead' | 'Contact' | 'Opportunity' | 'Account';
    id: string;
    name: string;
  };
  scheduledDate: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
  reminder: boolean;
  reminderTime?: string;
}

export interface CRMAnalytics {
  leadConversionRate: number;
  averageDealSize: number;
  salesCycleLength: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  pipelineValue: number;
  winRate: number;
  activityMetrics: {
    callsMade: number;
    emailsSent: number;
    meetingsHeld: number;
    tasksCompleted: number;
  };
}

// Re-export all types for better module resolution
export type {
  Lead as CRMLead,
  Contact as CRMContact,
  Opportunity as CRMOpportunity,
  Campaign as CRMCampaign,
  SupportTicket as CRMSupportTicket,
  Activity as CRMActivity,
  CRMAnalytics as CRMAnalyticsType
};