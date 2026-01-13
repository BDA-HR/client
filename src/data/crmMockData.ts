import type { Lead, Contact, Opportunity, Campaign, SupportTicket, Activity, CRMAnalytics } from '../types/crm';

// Mock Data for CRM Module

export const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Solutions',
    jobTitle: 'IT Director',
    source: 'Website',
    status: 'New',
    score: 85,
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    notes: 'Interested in enterprise software solutions',
    budget: 50000,
    timeline: 'Q2 2024',
    industry: 'Technology'
  },
  {
    id: '2',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@retailplus.com',
    phone: '+1-555-0124',
    company: 'RetailPlus Inc',
    jobTitle: 'Operations Manager',
    source: 'Email',
    status: 'Contacted',
    score: 72,
    assignedTo: 'Mike Wilson',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    notes: 'Looking for inventory management system',
    budget: 25000,
    timeline: 'Q1 2024',
    industry: 'Retail'
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Chen',
    email: 'robert.chen@manufacturing.com',
    phone: '+1-555-0125',
    company: 'Global Manufacturing',
    jobTitle: 'Plant Manager',
    source: 'Referral',
    status: 'Qualified',
    score: 91,
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-12T11:45:00Z',
    updatedAt: '2024-01-17T16:30:00Z',
    notes: 'High priority lead, ready to move forward',
    budget: 100000,
    timeline: 'Immediate',
    industry: 'Manufacturing'
  }
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1-555-0201',
    company: 'Innovation Labs',
    jobTitle: 'CEO',
    address: '123 Business Ave',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    tags: ['VIP', 'Decision Maker'],
    socialMedia: {
      linkedin: 'https://linkedin.com/in/alicejohnson',
      twitter: '@alicejohnson'
    },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
    lastContactDate: '2024-01-18T12:00:00Z',
    notes: 'Key decision maker for technology purchases',
    isActive: true,
    stage: 'Customer',
    owner: 'Sarah Johnson',
    teamVisibility: 'team',
    consentStatus: 'granted',
    customFields: {
      industry: 'Technology',
      companySize: '50-100'
    },
    relationshipScore: 85,
    lastInteractionType: 'meeting',
    segmentIds: ['enterprise', 'tech-leaders']
  },
  {
    id: '2',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@techstart.com',
    phone: '+1-555-0202',
    company: 'TechStart Solutions',
    jobTitle: 'CTO',
    address: '456 Tech Street',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    country: 'USA',
    tags: ['Technical', 'Influencer'],
    socialMedia: {
      linkedin: 'https://linkedin.com/in/davidbrown'
    },
    createdAt: '2024-01-08T10:30:00Z',
    updatedAt: '2024-01-17T15:45:00Z',
    lastContactDate: '2024-01-16T14:20:00Z',
    notes: 'Technical expert, influences purchasing decisions',
    isActive: true,
    stage: 'Prospect',
    owner: 'Mike Wilson',
    teamVisibility: 'public',
    consentStatus: 'granted',
    customFields: {
      industry: 'Software',
      companySize: '20-50'
    },
    relationshipScore: 72,
    lastInteractionType: 'email',
    segmentIds: ['mid-market', 'technical-buyers']
  },
  {
    id: '3',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@globalcorp.com',
    phone: '+1-555-0203',
    company: 'Global Manufacturing',
    jobTitle: 'Operations Director',
    address: '789 Industrial Blvd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    tags: ['Budget Holder', 'Champion'],
    socialMedia: {
      linkedin: 'https://linkedin.com/in/mariagarcia'
    },
    createdAt: '2024-01-12T14:15:00Z',
    updatedAt: '2024-01-19T09:30:00Z',
    lastContactDate: '2024-01-19T09:30:00Z',
    notes: 'Strong advocate for our solutions, has budget authority',
    isActive: true,
    stage: 'Lead',
    owner: 'Emily Davis',
    teamVisibility: 'team',
    consentStatus: 'granted',
    customFields: {
      industry: 'Manufacturing',
      companySize: '500+'
    },
    relationshipScore: 91,
    lastInteractionType: 'call',
    segmentIds: ['enterprise', 'manufacturing']
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Enterprise ERP Implementation',
    accountId: '1',
    contactId: '1',
    stage: 'Proposal',
    amount: 150000,
    probability: 75,
    expectedCloseDate: '2024-03-15',
    assignedTo: 'Sarah Johnson',
    source: 'Inbound Lead',
    description: 'Complete ERP system implementation for mid-size company',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:30:00Z',
    products: ['ERP Core', 'CRM Module', 'Finance Module'],
    competitors: ['SAP', 'Oracle'],
    nextStep: 'Schedule technical demo',
    weightedAmount: 112500, // amount * probability
    salesVelocity: 8.5, // days per stage
    daysInStage: 12,
    lastActivityDate: '2024-01-18T11:30:00Z',
    winProbabilityAI: 78,
    lostReason: undefined,
    approvalStatus: 'approved',
    discountApproved: false,
    commissionRate: 0.05,
    forecastCategory: 'commit',
    crossSellOpportunities: ['Training Services', 'Support Package'],
    upsellPotential: 25000
  },
  {
    id: '2',
    name: 'CRM System Upgrade',
    accountId: '2',
    contactId: '2',
    stage: 'Negotiation',
    amount: 75000,
    probability: 85,
    expectedCloseDate: '2024-02-28',
    assignedTo: 'Mike Wilson',
    source: 'Existing Customer',
    description: 'Upgrade existing CRM system with new features',
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-17T16:45:00Z',
    products: ['CRM Advanced', 'Analytics Module'],
    competitors: ['Salesforce', 'HubSpot'],
    nextStep: 'Final contract review',
    weightedAmount: 63750, // amount * probability
    salesVelocity: 6.2,
    daysInStage: 8,
    lastActivityDate: '2024-01-17T16:45:00Z',
    winProbabilityAI: 88,
    lostReason: undefined,
    approvalStatus: 'approved',
    discountApproved: true,
    commissionRate: 0.04,
    forecastCategory: 'commit',
    crossSellOpportunities: ['Data Migration', 'Custom Integration'],
    upsellPotential: 15000
  },
  {
    id: '3',
    name: 'Manufacturing Process Optimization',
    accountId: '3',
    contactId: '3',
    stage: 'Qualification',
    amount: 200000,
    probability: 45,
    expectedCloseDate: '2024-04-30',
    assignedTo: 'Emily Davis',
    source: 'Referral',
    description: 'Complete manufacturing process optimization and automation',
    createdAt: '2024-01-12T10:15:00Z',
    updatedAt: '2024-01-19T14:20:00Z',
    products: ['Manufacturing Suite', 'IoT Sensors', 'Analytics Platform'],
    competitors: ['Siemens', 'GE Digital'],
    nextStep: 'Conduct needs assessment',
    weightedAmount: 90000, // amount * probability
    salesVelocity: 12.3,
    daysInStage: 7,
    lastActivityDate: '2024-01-19T14:20:00Z',
    winProbabilityAI: 52,
    lostReason: undefined,
    approvalStatus: 'pending',
    discountApproved: false,
    commissionRate: 0.06,
    forecastCategory: 'best-case',
    crossSellOpportunities: ['Maintenance Contract', 'Training Program'],
    upsellPotential: 50000
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Product Launch Campaign',
    type: 'Email',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    budget: 15000,
    targetAudience: 'Enterprise customers',
    description: 'Promoting new ERP features to existing and potential customers',
    metrics: {
      sent: 5000,
      delivered: 4850,
      opened: 1940,
      clicked: 485,
      converted: 97
    },
    createdAt: '2023-12-15T10:00:00Z',
    createdBy: 'Marketing Team',
    automationRules: [
      {
        id: '1',
        name: 'Welcome Series',
        trigger: 'email_opened',
        conditions: [
          { field: 'email_opened', operator: 'equals', value: 'true' }
        ],
        actions: [
          { type: 'send_email', parameters: { templateId: 'welcome-2', delay: '24h' } }
        ],
        isActive: true
      }
    ],
    emailTemplate: {
      id: '1',
      name: 'Product Launch Template',
      subject: 'Introducing Our Latest ERP Features',
      htmlContent: '<html><body><h1>New Features Available</h1></body></html>',
      textContent: 'New Features Available - Check out our latest ERP updates',
      variables: ['firstName', 'companyName', 'productName']
    },
    leadScoringRules: [
      {
        id: '1',
        name: 'Email Engagement',
        criteria: [
          { field: 'email_opened', operator: 'equals', value: 'true' }
        ],
        points: 10,
        isActive: true
      }
    ],
    abTestVariants: [
      {
        id: '1',
        name: 'Variant A',
        percentage: 50,
        template: {
          id: '1a',
          name: 'Template A',
          subject: 'Introducing Our Latest ERP Features',
          htmlContent: '<html><body><h1>Version A</h1></body></html>',
          textContent: 'Version A content',
          variables: ['firstName']
        },
        metrics: { sent: 2500, opened: 970, clicked: 242, converted: 48 }
      }
    ],
    landingPageUrl: 'https://example.com/product-launch',
    conversionGoals: [
      {
        id: '1',
        name: 'Demo Request',
        type: 'form_submit',
        value: 100,
        url: 'https://example.com/demo-request'
      }
    ],
    segmentIds: ['enterprise', 'existing-customers'],
    triggerConditions: [
      {
        id: '1',
        type: 'contact_created',
        parameters: { source: 'website' }
      }
    ]
  },
  {
    id: '2',
    name: 'Webinar Series - CRM Best Practices',
    type: 'Webinar',
    status: 'Completed',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    budget: 5000,
    targetAudience: 'SMB customers',
    description: 'Educational webinar about CRM best practices',
    metrics: {
      sent: 2000,
      delivered: 1950,
      opened: 780,
      clicked: 390,
      converted: 78
    },
    createdAt: '2024-01-01T09:00:00Z',
    createdBy: 'Sarah Johnson',
    automationRules: [
      {
        id: '2',
        name: 'Webinar Follow-up',
        trigger: 'form_submitted',
        conditions: [
          { field: 'webinar_attended', operator: 'equals', value: 'true' }
        ],
        actions: [
          { type: 'send_email', parameters: { templateId: 'webinar-followup', delay: '2h' } }
        ],
        isActive: true
      }
    ],
    emailTemplate: {
      id: '2',
      name: 'Webinar Invitation',
      subject: 'Join Our CRM Best Practices Webinar',
      htmlContent: '<html><body><h1>Webinar Invitation</h1></body></html>',
      textContent: 'Join our webinar on CRM best practices',
      variables: ['firstName', 'webinarDate', 'webinarTime']
    },
    leadScoringRules: [
      {
        id: '2',
        name: 'Webinar Attendance',
        criteria: [
          { field: 'webinar_attended', operator: 'equals', value: 'true' }
        ],
        points: 25,
        isActive: true
      }
    ],
    abTestVariants: [
      {
        id: '2',
        name: 'Variant B',
        percentage: 100,
        template: {
          id: '2b',
          name: 'Webinar Template',
          subject: 'Join Our CRM Best Practices Webinar',
          htmlContent: '<html><body><h1>Webinar</h1></body></html>',
          textContent: 'Webinar content',
          variables: ['firstName']
        },
        metrics: { sent: 2000, opened: 780, clicked: 390, converted: 78 }
      }
    ],
    landingPageUrl: 'https://example.com/webinar-registration',
    conversionGoals: [
      {
        id: '2',
        name: 'Webinar Registration',
        type: 'form_submit',
        value: 50,
        url: 'https://example.com/webinar-register'
      }
    ],
    segmentIds: ['smb', 'prospects'],
    triggerConditions: [
      {
        id: '2',
        type: 'tag_added',
        parameters: { tag: 'webinar-interest' }
      }
    ]
  }
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    title: 'Login Issues with CRM Module',
    description: 'Users unable to access CRM dashboard after recent update. Multiple users reporting the same issue across different browsers.',
    status: 'In Progress',
    priority: 'High',
    category: 'Technical',
    customerId: '1',
    assignedTo: 'Tech Support Team',
    createdAt: '2024-01-18T09:30:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    resolvedAt: undefined,
    slaDeadline: '2024-01-19T09:30:00Z',
    tags: ['login', 'crm', 'urgent'],
    attachments: ['screenshot1.png', 'error_log.txt'],
    customerSatisfaction: undefined,
    escalationLevel: 1,
    responseTime: 45, // 45 minutes
    resolutionTime: undefined,
    channel: 'email',
    internalNotes: [
      {
        id: '1',
        content: 'Initial investigation shows this might be related to the recent authentication update',
        createdBy: 'John Doe',
        createdAt: '2024-01-18T10:15:00Z',
        isInternal: true
      }
    ],
    publicReplies: [
      {
        id: '1',
        content: 'Thank you for reporting this issue. We are currently investigating and will update you shortly.',
        createdBy: 'Tech Support Team',
        createdAt: '2024-01-18T10:15:00Z',
        isFromCustomer: false,
        attachments: []
      }
    ],
    relatedTickets: [],
    knowledgeBaseArticles: ['2'],
    slaPolicy: {
      id: '1',
      name: 'High Priority SLA',
      responseTime: 60, // 1 hour
      resolutionTime: 480, // 8 hours
      priority: 'High',
      businessHoursOnly: true
    },
    customerInfo: {
      name: 'Alice Johnson',
      email: 'alice.johnson@innovation-labs.com',
      phone: '+1-555-0201',
      company: 'Innovation Labs',
      tier: 'Enterprise'
    }
  },
  {
    id: '2',
    title: 'Feature Request: Custom Fields',
    description: 'Customer requesting ability to add custom fields to contact forms to better track industry-specific information',
    status: 'Open',
    priority: 'Medium',
    category: 'Feature Request',
    customerId: '2',
    assignedTo: 'Product Team',
    createdAt: '2024-01-17T11:15:00Z',
    updatedAt: '2024-01-17T11:15:00Z',
    resolvedAt: undefined,
    slaDeadline: '2024-01-24T11:15:00Z',
    tags: ['enhancement', 'custom-fields', 'contacts'],
    attachments: [],
    customerSatisfaction: undefined,
    escalationLevel: 0,
    responseTime: 120, // 2 hours
    resolutionTime: undefined,
    channel: 'web',
    internalNotes: [],
    publicReplies: [
      {
        id: '1',
        content: 'Thank you for your feature request. We have added this to our product roadmap for consideration.',
        createdBy: 'Product Team',
        createdAt: '2024-01-17T13:30:00Z',
        isFromCustomer: false,
        attachments: []
      }
    ],
    relatedTickets: [],
    knowledgeBaseArticles: [],
    slaPolicy: {
      id: '2',
      name: 'Standard SLA',
      responseTime: 240, // 4 hours
      resolutionTime: 1440, // 24 hours
      priority: 'Medium',
      businessHoursOnly: true
    },
    customerInfo: {
      name: 'David Brown',
      email: 'david.brown@techstart.com',
      phone: '+1-555-0202',
      company: 'TechStart Solutions',
      tier: 'Premium'
    }
  },
  {
    id: '3',
    title: 'Billing Discrepancy - Overcharged',
    description: 'Customer reports being charged twice for the same month. Invoice #12345 shows duplicate charges.',
    status: 'Resolved',
    priority: 'High',
    category: 'Billing',
    customerId: '3',
    assignedTo: 'Customer Success',
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-16T16:45:00Z',
    resolvedAt: '2024-01-16T16:45:00Z',
    slaDeadline: '2024-01-16T14:20:00Z',
    tags: ['billing', 'refund', 'duplicate-charge'],
    attachments: ['invoice_12345.pdf'],
    customerSatisfaction: 4.5,
    escalationLevel: 0,
    responseTime: 30, // 30 minutes
    resolutionTime: 1545, // 25 hours 45 minutes
    channel: 'phone',
    internalNotes: [
      {
        id: '1',
        content: 'Confirmed duplicate charge in billing system. Processing refund.',
        createdBy: 'Billing Team',
        createdAt: '2024-01-16T09:30:00Z',
        isInternal: true
      }
    ],
    publicReplies: [
      {
        id: '1',
        content: 'We have identified the duplicate charge and processed a full refund. You should see the credit within 3-5 business days.',
        createdBy: 'Customer Success',
        createdAt: '2024-01-16T16:45:00Z',
        isFromCustomer: false,
        attachments: ['refund_confirmation.pdf']
      }
    ],
    relatedTickets: [],
    knowledgeBaseArticles: ['3'],
    slaPolicy: {
      id: '1',
      name: 'High Priority SLA',
      responseTime: 60, // 1 hour
      resolutionTime: 480, // 8 hours
      priority: 'High',
      businessHoursOnly: true
    },
    customerInfo: {
      name: 'Maria Garcia',
      email: 'maria.garcia@globalcorp.com',
      phone: '+1-555-0203',
      company: 'Global Manufacturing',
      tier: 'Enterprise'
    }
  },
  {
    id: '4',
    title: 'Password Reset Not Working',
    description: 'Customer unable to reset password using the forgot password link. Email is not being received.',
    status: 'Pending',
    priority: 'Medium',
    category: 'Technical',
    customerId: '4',
    assignedTo: 'Tech Support Team',
    createdAt: '2024-01-19T08:45:00Z',
    updatedAt: '2024-01-19T10:30:00Z',
    resolvedAt: undefined,
    slaDeadline: '2024-01-20T08:45:00Z',
    tags: ['password', 'email', 'authentication'],
    attachments: [],
    customerSatisfaction: undefined,
    escalationLevel: 0,
    responseTime: 105, // 1 hour 45 minutes
    resolutionTime: undefined,
    channel: 'chat',
    internalNotes: [
      {
        id: '1',
        content: 'Checked email delivery logs. Email is being sent but may be going to spam folder.',
        createdBy: 'Tech Support',
        createdAt: '2024-01-19T10:30:00Z',
        isInternal: true
      }
    ],
    publicReplies: [
      {
        id: '1',
        content: 'Please check your spam/junk folder for the password reset email. If you still cannot find it, we can manually reset your password.',
        createdBy: 'Tech Support Team',
        createdAt: '2024-01-19T10:30:00Z',
        isFromCustomer: false,
        attachments: []
      }
    ],
    relatedTickets: [],
    knowledgeBaseArticles: ['1'],
    slaPolicy: {
      id: '2',
      name: 'Standard SLA',
      responseTime: 240, // 4 hours
      resolutionTime: 1440, // 24 hours
      priority: 'Medium',
      businessHoursOnly: true
    },
    customerInfo: {
      name: 'Robert Chen',
      email: 'robert.chen@manufacturing.com',
      phone: '+1-555-0125',
      company: 'Global Manufacturing',
      tier: 'Basic'
    }
  },
  {
    id: '5',
    title: 'Data Export Functionality Missing',
    description: 'Customer cannot find the data export feature that was mentioned in the documentation.',
    status: 'Closed',
    priority: 'Low',
    category: 'General',
    customerId: '5',
    assignedTo: 'Customer Success',
    createdAt: '2024-01-14T16:30:00Z',
    updatedAt: '2024-01-15T11:20:00Z',
    resolvedAt: '2024-01-15T11:20:00Z',
    slaDeadline: '2024-01-17T16:30:00Z',
    tags: ['export', 'documentation', 'feature-location'],
    attachments: ['export_guide.pdf'],
    customerSatisfaction: 5.0,
    escalationLevel: 0,
    responseTime: 180, // 3 hours
    resolutionTime: 1130, // 18 hours 50 minutes
    channel: 'email',
    internalNotes: [],
    publicReplies: [
      {
        id: '1',
        content: 'The data export feature is located in the Settings > Data Management section. I have attached a detailed guide.',
        createdBy: 'Customer Success',
        createdAt: '2024-01-15T11:20:00Z',
        isFromCustomer: false,
        attachments: ['export_guide.pdf']
      }
    ],
    relatedTickets: [],
    knowledgeBaseArticles: ['4'],
    slaPolicy: {
      id: '3',
      name: 'Low Priority SLA',
      responseTime: 480, // 8 hours
      resolutionTime: 2880, // 48 hours
      priority: 'Low',
      businessHoursOnly: true
    },
    customerInfo: {
      name: 'Emily Davis',
      email: 'emily.davis@retailplus.com',
      phone: '+1-555-0124',
      company: 'RetailPlus Inc',
      tier: 'Premium'
    }
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'Call',
    title: 'Follow-up call with TechCorp',
    description: 'Discuss proposal details and answer technical questions',
    status: 'Completed',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
    relatedTo: {
      type: 'Lead',
      id: '1',
      name: 'John Smith - TechCorp Solutions'
    },
    scheduledDate: '2024-01-18T14:00:00Z',
    completedDate: '2024-01-18T14:30:00Z',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    reminder: true,
    reminderTime: '2024-01-18T13:45:00Z'
  },
  {
    id: '2',
    type: 'Meeting',
    title: 'Product Demo for RetailPlus',
    description: 'Demonstrate inventory management features',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: 'Mike Wilson',
    relatedTo: {
      type: 'Lead',
      id: '2',
      name: 'Emily Davis - RetailPlus Inc'
    },
    scheduledDate: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    reminder: true,
    reminderTime: '2024-01-20T09:30:00Z'
  },
  {
    id: '3',
    type: 'Task',
    title: 'Prepare Q1 presentation',
    description: 'Create slides for quarterly business review meeting',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'Emily Davis',
    relatedTo: {
      type: 'Opportunity',
      id: '1',
      name: 'Enterprise ERP Implementation'
    },
    scheduledDate: '2024-01-19T16:00:00Z',
    createdAt: '2024-01-18T11:30:00Z',
    updatedAt: '2024-01-19T09:15:00Z',
    reminder: true,
    reminderTime: '2024-01-19T15:30:00Z'
  },
  {
    id: '4',
    type: 'Email',
    title: 'Send proposal to Global Manufacturing',
    description: 'Send detailed proposal with pricing and implementation timeline',
    status: 'Completed',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
    relatedTo: {
      type: 'Contact',
      id: '3',
      name: 'Maria Garcia - Global Manufacturing'
    },
    scheduledDate: '2024-01-17T09:00:00Z',
    completedDate: '2024-01-17T09:30:00Z',
    createdAt: '2024-01-16T15:20:00Z',
    updatedAt: '2024-01-17T09:30:00Z',
    reminder: false
  },
  {
    id: '5',
    type: 'Task',
    title: 'Update CRM contact records',
    description: 'Clean up and update contact information in the CRM system',
    status: 'Pending',
    priority: 'Low',
    assignedTo: 'John Smith',
    relatedTo: {
      type: 'Account',
      id: '1',
      name: 'TechCorp Solutions'
    },
    scheduledDate: '2024-01-22T11:00:00Z',
    createdAt: '2024-01-19T14:45:00Z',
    updatedAt: '2024-01-19T14:45:00Z',
    reminder: true,
    reminderTime: '2024-01-22T10:30:00Z'
  },
  {
    id: '6',
    type: 'Call',
    title: 'Discovery call with new prospect',
    description: 'Initial discovery call to understand business needs and pain points',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: 'Mike Wilson',
    relatedTo: {
      type: 'Lead',
      id: '4',
      name: 'Robert Chen - Manufacturing Corp'
    },
    scheduledDate: '2024-01-21T15:30:00Z',
    createdAt: '2024-01-19T16:20:00Z',
    updatedAt: '2024-01-19T16:20:00Z',
    reminder: true,
    reminderTime: '2024-01-21T15:15:00Z'
  },
  {
    id: '7',
    type: 'Meeting',
    title: 'Team standup meeting',
    description: 'Weekly team standup to discuss progress and blockers',
    status: 'Completed',
    priority: 'Low',
    assignedTo: 'Emily Davis',
    relatedTo: {
      type: 'Account',
      id: '2',
      name: 'Internal Team'
    },
    scheduledDate: '2024-01-19T09:00:00Z',
    completedDate: '2024-01-19T09:30:00Z',
    createdAt: '2024-01-18T17:00:00Z',
    updatedAt: '2024-01-19T09:30:00Z',
    reminder: true,
    reminderTime: '2024-01-19T08:45:00Z'
  },
  {
    id: '8',
    type: 'Note',
    title: 'Document client requirements',
    description: 'Document detailed requirements gathered from client meeting',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: 'Lisa Chen',
    relatedTo: {
      type: 'Opportunity',
      id: '2',
      name: 'CRM System Upgrade'
    },
    scheduledDate: '2024-01-20T14:00:00Z',
    createdAt: '2024-01-19T11:30:00Z',
    updatedAt: '2024-01-19T13:45:00Z',
    reminder: false
  }
];

export const mockAnalytics: CRMAnalytics = {
  leadConversionRate: 24.5,
  averageDealSize: 87500,
  salesCycleLength: 45,
  customerAcquisitionCost: 2500,
  customerLifetimeValue: 125000,
  pipelineValue: 450000,
  winRate: 68.2,
  activityMetrics: {
    callsMade: 156,
    emailsSent: 342,
    meetingsHeld: 28,
    tasksCompleted: 89
  }
};