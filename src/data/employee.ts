import type { Employee } from '../types/employee';

export const initialEmployees: Employee[] = [
    {
    id: 'emp-1',
    employeeId: '1219484SH3',
    firstName: 'Jane',
    middleName: 'Marie',
    lastName: 'Cooper',
    email: 'janecoop@gmail.com',
    role: 'Sr. Accountant',
    phone: '+1 555-123-4567',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'USA',
    dateOfBirth: '1985-06-15',
    gender: 'Female',
    maritalStatus: 'Married',
    emergencyContact: {
      name: 'John Cooper',
      relationship: 'Spouse',
      phone: '+1 555-987-6543'
    },
    department: 'Finance',
    jobTitle: 'Senior Accountant',
    jobGrade: 'G6',
    employeeCategory: 'Professional',
    reportingTo: 'CFO',
    manager: 'Emily Wong',
    team: 'Financial Reporting',
    joiningDate: '2020-02-15',
    contractType: "Full-time",
    employmentStatus: "Active",
    status: "active",
    workLocation: 'HQ Building',
    workSchedule: '9am-5pm',
    salary: 120000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Bank of America',
      accountNumber: '****5678',
      branchCode: '123456'
    },
    taxInformation: 'Single-2',
    lastCheckIn: '2023-05-15 08:58:00',
    lastCheckOut: '2023-05-15 17:05:00',
    totalLeavesTaken: 8,
    leaveBalance: 12,
    attendancePercentage: 96.5,
    performanceRating: 4.7,
    lastAppraisalDate: '2023-01-15',
    nextAppraisalDate: '2024-01-15',
    keyPerformanceIndicators: [
      {
        name: 'Financial Reporting Accuracy',
        target: '100%',
        actual: '99.8%',
        weight: 40
      },
      {
        name: 'Process Improvement',
        target: '2 initiatives',
        actual: '3 completed',
        weight: 30
      }
    ],
    skills: ['Financial Analysis', 'GAAP', 'Excel'],
    competencies: ['Leadership', 'Strategic Thinking'],
    trainings: [
      {
        name: 'Advanced Financial Reporting',
        date: '2023-03-10',
        duration: '2 days',
        status: "Completed",
        certification: 'CFR-2023'
      }
    ],
    previousRoles: [
      {
        jobTitle: 'Accountant',
        department: 'Finance',
        startDate: '2018-01-10',
        endDate: '2020-02-14',
        responsibilities: 'General ledger maintenance and reporting'
      }
    ],
    documents: [
      {
        type: 'Contract',
        name: 'Employment Agreement',
        issueDate: '2020-02-10',
        status: 'Active'
      }
    ],
    createdAt: '2020-02-10 09:30:00',
    updatedAt: '2023-05-15 10:15:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-2',
    employeeId: 'BHABHD127',
    firstName: 'Brooklyn',
    middleName: 'James',
    lastName: 'Simmons',
    email: 'brookjynsmms@gmail.com',
    role: 'Lead Back End Dev',
    phone: '+1 555-234-5678',
    address: '456 Tech Avenue',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'USA',
    dateOfBirth: '1990-08-22',
    gender: 'Male',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Sarah Simmons',
      relationship: 'Sister',
      phone: '+1 555-876-5432'
    },
    department: 'Engineering',
    jobTitle: 'Lead Backend Developer',
    jobGrade: 'G7',
    employeeCategory: 'Professional',
    reportingTo: 'CTO',
    manager: 'Michael Chen',
    team: 'Backend Services',
    joiningDate: '2025-02-18',
    contractType: "Freelance",
    employmentStatus: "Active",
    status: "on-leave",
    workLocation: 'Remote',
    workSchedule: 'Flexible',
    salary: 150000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Chase',
      accountNumber: '****9012',
      branchCode: '789012'
    },
    taxInformation: 'Single-1',
    lastCheckIn: '2023-05-14 09:15:00',
    lastCheckOut: '2023-05-14 18:30:00',
    totalLeavesTaken: 5,
    leaveBalance: 15,
    attendancePercentage: 95.0,
    performanceRating: 4.5,
    lastAppraisalDate: '2023-02-01',
    nextAppraisalDate: '2024-02-01',
    keyPerformanceIndicators: [
      {
        name: 'API Development',
        target: '95% uptime',
        actual: '99.9% uptime',
        weight: 50
      },
      {
        name: 'Code Quality',
        target: '<1% bug rate',
        actual: '0.5% bug rate',
        weight: 30
      }
    ],
    skills: ['Node.js', 'Python', 'AWS', 'Docker'],
    competencies: ['Problem Solving', 'Team Leadership'],
    trainings: [
      {
        name: 'Advanced Cloud Architecture',
        date: '2023-01-15',
        duration: '3 days',
        status: "Completed",
        certification: 'ACA-2023'
      }
    ],
    previousRoles: [
      {
        jobTitle: 'Senior Backend Developer',
        department: 'Engineering',
        startDate: '2020-03-10',
        endDate: '2025-02-17',
        responsibilities: 'API development and maintenance'
      }
    ],
    documents: [
      {
        type: 'Contract',
        name: 'Freelance Agreement',
        issueDate: '2025-02-10',
        status: 'Active'
      }
    ],
    createdAt: '2025-02-10 10:00:00',
    updatedAt: '2023-05-15 11:20:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-3',
    employeeId: '182194DANJ',
    firstName: 'Leslie',
    middleName: 'Ann',
    lastName: 'Alexander',
    email: 'alexanderis@gmail.com',
    role: 'Jr. Technical Product',
    phone: '+1 555-345-6789',
    address: '789 Product Lane',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94110',
    country: 'USA',
    dateOfBirth: '1995-03-30',
    gender: 'Female',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Robert Alexander',
      relationship: 'Father',
      phone: '+1 555-765-4321'
    },
    department: 'Product',
    jobTitle: 'Junior Technical Product Manager',
    jobGrade: 'G3',
    employeeCategory: 'Intern',
    reportingTo: 'VP Product',
    manager: 'Grande Ariana',
    team: 'Product Development',
    joiningDate: '2024-12-25',
    contractType: "Internship",
    employmentStatus: "Active",
    status: "active",
    workLocation: 'HQ Building',
    workSchedule: '9am-5pm',
    salary: 60000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Wells Fargo',
      accountNumber: '****3456',
      branchCode: '456789'
    },
    taxInformation: 'Single-0',
    lastCheckIn: '2023-05-15 08:45:00',
    lastCheckOut: '2023-05-15 17:15:00',
    totalLeavesTaken: 2,
    leaveBalance: 8,
    attendancePercentage: 98.0,
    performanceRating: 4.2,
    lastAppraisalDate: '2023-03-01',
    nextAppraisalDate: '2023-09-01',
    keyPerformanceIndicators: [
      {
        name: 'Feature Delivery',
        target: 'On time',
        actual: 'Ahead of schedule',
        weight: 60
      },
      {
        name: 'Stakeholder Feedback',
        target: 'Positive',
        actual: 'Very Positive',
        weight: 40
      }
    ],
    skills: ['Product Management', 'Agile', 'JIRA'],
    competencies: ['Communication', 'Analytical Thinking'],
    trainings: [
      {
        name: 'Product Management Fundamentals',
        date: '2024-12-28',
        duration: '5 days',
        status: "Completed",
        certification: 'PMF-2024'
      }
    ],
    previousRoles: [],
    documents: [
      {
        type: 'Contract',
        name: 'Internship Agreement',
        issueDate: '2024-12-20',
        status: 'Active'
      }
    ],
    createdAt: '2024-12-20 11:00:00',
    updatedAt: '2023-05-15 09:30:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-4',
    employeeId: 'MMZKAOB11',
    firstName: 'Esther',
    middleName: 'Louise',
    lastName: 'Howard',
    email: 'esthinhovard@gmail.com',
    role: 'Lead Accountant',
    phone: '+1 555-456-7890',
    address: '321 Finance Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94108',
    country: 'USA',
    dateOfBirth: '1988-11-12',
    gender: 'Female',
    maritalStatus: 'Divorced',
    emergencyContact: {
      name: 'Mark Howard',
      relationship: 'Brother',
      phone: '+1 555-654-3210'
    },
    department: 'Finance',
    jobTitle: 'Lead Accountant',
    jobGrade: 'G7',
    employeeCategory: 'Professional',
    reportingTo: 'CFO',
    manager: 'Emily Wong',
    team: 'Financial Operations',
    joiningDate: '2025-01-10',
    contractType: "Part-time",
    employmentStatus: "Active",
    status: "on-leave",
    workLocation: 'HQ Building',
    workSchedule: '10am-3pm',
    salary: 90000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Citibank',
      accountNumber: '****7890',
      branchCode: '567890'
    },
    taxInformation: 'Head of Household-1',
    lastCheckIn: '2023-05-10 10:05:00',
    lastCheckOut: '2023-05-10 15:00:00',
    totalLeavesTaken: 10,
    leaveBalance: 5,
    attendancePercentage: 90.0,
    performanceRating: 4.3,
    lastAppraisalDate: '2023-02-15',
    nextAppraisalDate: '2024-02-15',
    keyPerformanceIndicators: [
      {
        name: 'Month-end Close',
        target: '5 business days',
        actual: '4 business days',
        weight: 50
      },
      {
        name: 'Audit Findings',
        target: '0 major findings',
        actual: '0 major findings',
        weight: 30
      }
    ],
    skills: ['Accounting', 'QuickBooks', 'Financial Reporting'],
    competencies: ['Attention to Detail', 'Time Management'],
    trainings: [
      {
        name: 'Advanced Taxation',
        date: '2025-01-20',
        duration: '2 days',
        status: "Completed",
        certification: 'ATX-2025'
      }
    ],
    previousRoles: [
      {
        jobTitle: 'Senior Accountant',
        department: 'Finance',
        startDate: '2020-06-15',
        endDate: '2025-01-09',
        responsibilities: 'Financial reporting and analysis'
      }
    ],
    documents: [
      {
        type: 'Contract',
        name: 'Part-time Agreement',
        issueDate: '2025-01-05',
        status: 'Active'
      }
    ],
    createdAt: '2025-01-05 09:15:00',
    updatedAt: '2023-05-12 14:30:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-5',
    employeeId: 'HSASH8188',
    firstName: 'Cameron',
    middleName: 'David',
    lastName: 'Williamson',
    email: 'williamcn@gmail.com',
    role: 'Sr. DevOps',
    phone: '+1 555-567-8901',
    address: '654 Cloud Road',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94109',
    country: 'USA',
    dateOfBirth: '1987-04-25',
    gender: 'Male',
    maritalStatus: 'Married',
    emergencyContact: {
      name: 'Lisa Williamson',
      relationship: 'Spouse',
      phone: '+1 555-543-2109'
    },
    department: 'Engineering',
    jobTitle: 'Senior DevOps Engineer',
    jobGrade: 'G6',
    employeeCategory: 'Professional',
    reportingTo: 'CTO',
    manager: 'Michael Chen',
    team: 'Platform Engineering',
    joiningDate: '2025-03-30',
    contractType: "Freelance",
    employmentStatus: "Active",
    status: "active",
    workLocation: 'Remote',
    workSchedule: 'Flexible',
    salary: 140000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Bank of America',
      accountNumber: '****2345',
      branchCode: '345678'
    },
    taxInformation: 'Married-2',
    lastCheckIn: '2023-05-15 09:00:00',
    lastCheckOut: '2023-05-15 17:30:00',
    totalLeavesTaken: 3,
    leaveBalance: 17,
    attendancePercentage: 97.5,
    performanceRating: 4.8,
    lastAppraisalDate: '2023-03-20',
    nextAppraisalDate: '2024-03-20',
    keyPerformanceIndicators: [
      {
        name: 'System Uptime',
        target: '99.99%',
        actual: '100%',
        weight: 60
      },
      {
        name: 'Deployment Frequency',
        target: 'Daily',
        actual: 'Multiple times daily',
        weight: 40
      }
    ],
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    competencies: ['Automation', 'Cloud Architecture'],
    trainings: [
      {
        name: 'Advanced Kubernetes',
        date: '2025-04-05',
        duration: '3 days',
        status: "Completed",
        certification: 'AKS-2025'
      }
    ],
    previousRoles: [
      {
        jobTitle: 'DevOps Engineer',
        department: 'Engineering',
        startDate: '2021-01-10',
        endDate: '2025-03-29',
        responsibilities: 'Infrastructure management and automation'
      }
    ],
    documents: [
      {
        type: 'Contract',
        name: 'Freelance Agreement',
        issueDate: '2025-03-25',
        status: 'Active'
      }
    ],
    createdAt: '2025-03-25 10:30:00',
    updatedAt: '2023-05-15 16:45:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-6',
    employeeId: 'NXAHCH100',
    firstName: 'Albert',
    middleName: 'George',
    lastName: 'Flores',
    email: 'albertfirs@gmail.com',
    role: 'Jr. Digital Marketing',
    phone: '+1 555-678-9012',
    address: '987 Marketing Blvd',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94111',
    country: 'USA',
    dateOfBirth: '1993-07-18',
    gender: 'Male',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Maria Flores',
      relationship: 'Mother',
      phone: '+1 555-432-1098'
    },
    department: 'Marketing',
    jobTitle: 'Junior Digital Marketing Specialist',
    jobGrade: 'G3',
    employeeCategory: 'Professional',
    reportingTo: 'CMO',
    manager: 'Dafene Robertson',
    team: 'Digital Marketing',
    joiningDate: '2024-10-04',
    contractType: "Part-time",
    employmentStatus: "Active",
    status: "active",
    workLocation: 'HQ Building',
    workSchedule: '1pm-5pm',
    salary: 50000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Chase',
      accountNumber: '****4567',
      branchCode: '678901'
    },
    taxInformation: 'Single-1',
    lastCheckIn: '2023-05-15 13:05:00',
    lastCheckOut: '2023-05-15 17:00:00',
    totalLeavesTaken: 4,
    leaveBalance: 6,
    attendancePercentage: 94.0,
    performanceRating: 4.0,
    lastAppraisalDate: '2023-04-01',
    nextAppraisalDate: '2023-10-01',
    keyPerformanceIndicators: [
      {
        name: 'Campaign Performance',
        target: '10% conversion',
        actual: '12% conversion',
        weight: 50
      },
      {
        name: 'Content Engagement',
        target: '5% increase',
        actual: '8% increase',
        weight: 30
      }
    ],
    skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
    competencies: ['Creativity', 'Data Analysis'],
    trainings: [
      {
        name: 'Digital Marketing Certification',
        date: '2024-10-10',
        duration: '4 weeks',
        status: "Completed",
        certification: 'DMC-2024'
      }
    ],
    previousRoles: [
      {
        jobTitle: 'Marketing Intern',
        department: 'Marketing',
        startDate: '2024-06-01',
        endDate: '2024-10-03',
        responsibilities: 'Assisting with digital campaigns'
      }
    ],
    documents: [
      {
        type: 'Contract',
        name: 'Part-time Agreement',
        issueDate: '2024-09-28',
        status: 'Active'
      }
    ],
    createdAt: '2024-09-28 14:00:00',
    updatedAt: '2023-05-15 15:20:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-7',
    employeeId: 'SJABV81742',
    firstName: 'Annette',
    middleName: 'Rose',
    lastName: 'Black',
    email: 'annetblack@gmail.com',
    role: 'Jr. Front End Dev',
    phone: '+1 555-789-0123',
    address: '753 Code Lane',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94112',
    country: 'USA',
    dateOfBirth: '1996-01-30',
    gender: 'Female',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Thomas Black',
      relationship: 'Father',
      phone: '+1 555-321-0987'
    },
    department: 'Engineering',
    jobTitle: 'Junior Frontend Developer',
    jobGrade: 'G2',
    employeeCategory: 'Intern',
    reportingTo: 'Engineering Manager',
    manager: 'Michael Chen',
    team: 'Frontend Development',
    joiningDate: '2024-12-19',
    contractType: "Internship",
    employmentStatus: "Active",
    status: "on-leave",
    workLocation: 'HQ Building',
    workSchedule: '9am-5pm',
    salary: 45000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Wells Fargo',
      accountNumber: '****5678',
      branchCode: '789012'
    },
    taxInformation: 'Single-0',
    lastCheckIn: '2023-05-10 08:50:00',
    lastCheckOut: '2023-05-10 17:10:00',
    totalLeavesTaken: 7,
    leaveBalance: 3,
    attendancePercentage: 92.5,
    performanceRating: 3.9,
    lastAppraisalDate: '2023-04-15',
    nextAppraisalDate: '2023-10-15',
    keyPerformanceIndicators: [
      {
        name: 'Feature Implementation',
        target: 'On schedule',
        actual: 'Slightly ahead',
        weight: 60
      },
      {
        name: 'Code Reviews',
        target: 'Positive feedback',
        actual: 'Mostly positive',
        weight: 40
      }
    ],
    skills: ['React', 'JavaScript', 'HTML/CSS'],
    competencies: ['Learning Agility', 'Teamwork'],
    trainings: [
      {
        name: 'Frontend Development Bootcamp',
        date: '2024-12-22',
        duration: '2 weeks',
        status: "Completed",
        certification: 'FDB-2024'
      }
    ],
    previousRoles: [],
    documents: [
      {
        type: 'Contract',
        name: 'Internship Agreement',
        issueDate: '2024-12-15',
        status: 'Active'
      }
    ],
    createdAt: '2024-12-15 09:45:00',
    updatedAt: '2023-05-12 11:10:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-8',
    employeeId: '71738KAON',
    firstName: 'Dafene',
    middleName: 'Marie',
    lastName: 'Robertson',
    email: 'dafenerobert@gmail.com',
    role: 'Sr. Content Writer',
    phone: '+1 555-890-1234',
    address: '159 Content Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94113',
    country: 'USA',
    dateOfBirth: '1989-09-15',
    gender: 'Female',
    maritalStatus: 'Married',
    emergencyContact: {
      name: 'James Robertson',
      relationship: 'Spouse',
      phone: '+1 555-210-9876'
    },
    department: 'Marketing',
    jobTitle: 'Senior Content Writer',
    jobGrade: 'G5',
    employeeCategory: 'Professional',
    reportingTo: 'CMO',
    manager: 'CMO',
    team: 'Content Marketing',
    joiningDate: '2025-01-28',
    contractType: "Full-time",
    employmentStatus: "Active",
    status: "active",
    workLocation: 'HQ Building',
    workSchedule: '9am-5pm',
    salary: 85000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Bank of America',
      accountNumber: '****6789',
      branchCode: '890123'
    },
    taxInformation: 'Married-1',
    lastCheckIn: '2023-05-15 08:55:00',
    lastCheckOut: '2023-05-15 17:05:00',
    totalLeavesTaken: 5,
    leaveBalance: 15,
    attendancePercentage: 96.0,
    performanceRating: 4.6,
    lastAppraisalDate: '2023-03-10',
    nextAppraisalDate: '2024-03-10',
    keyPerformanceIndicators: [
      {
        name: 'Content Output',
        target: '8 articles/month',
        actual: '10 articles/month',
        weight: 40
      },
      {
        name: 'Engagement Metrics',
        target: '15% increase',
        actual: '20% increase',
        weight: 60
      }
    ],
    skills: ['Content Writing', 'SEO', 'Copywriting', 'Editing'],
    competencies: ['Creativity', 'Communication'],
    trainings: [
      {
        name: 'Advanced SEO Writing',
        date: '2025-02-05',
        duration: '2 days',
        status: "Completed",
        certification: 'ASW-2025'
      }
    ],
    previousRoles: [
      {
        jobTitle: 'Content Writer',
        department: 'Marketing',
        startDate: '2022-05-10',
        endDate: '2025-01-27',
        responsibilities: 'Creating marketing content'
      }
    ],
    documents: [
      {
        type: 'Contract',
        name: 'Employment Agreement',
        issueDate: '2025-01-25',
        status: 'Active'
      }
    ],
    createdAt: '2025-01-25 10:15:00',
    updatedAt: '2023-05-15 14:40:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-9',
    employeeId: 'JJHDC6661',
    firstName: 'Grande',
    middleName: 'Sophia',
    lastName: 'Ariana',
    email: 'grandeari@gmail.com',
    role: 'Lead Product Manager',
    phone: '+1 555-901-2345',
    address: '357 Product Avenue',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94114',
    country: 'USA',
    dateOfBirth: '1984-12-05',
    gender: 'Female',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Sophia Grande',
      relationship: 'Mother',
      phone: '+1 555-109-8765'
    },
    department: 'Product',
    jobTitle: 'Lead Product Manager',
    jobGrade: 'G8',
    employeeCategory: 'Professional',
    reportingTo: 'CEO',
    manager: 'CEO',
    team: 'Product Leadership',
    joiningDate: '2025-02-12',
    contractType: "Full-time",
    employmentStatus: "Active",
    status: "active",
    workLocation: 'HQ Building',
    workSchedule: '9am-5pm',
    salary: 160000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Chase',
      accountNumber: '****7890',
      branchCode: '901234'
    },
    taxInformation: 'Single-3',
    lastCheckIn: '2023-05-15 08:45:00',
    lastCheckOut: '2023-05-15 17:15:00',
    totalLeavesTaken: 2,
    leaveBalance: 18,
    attendancePercentage: 98.5,
    performanceRating: 4.9,
    lastAppraisalDate: '2023-04-01',
    nextAppraisalDate: '2024-04-01',
    keyPerformanceIndicators: [
      {
        name: 'Product Success',
        target: 'Meet KPIs',
        actual: 'Exceeded KPIs',
        weight: 70
      },
      {
        name: 'Team Satisfaction',
        target: 'High',
        actual: 'Very High',
        weight: 30
      }
    ],
    skills: ['Product Strategy', 'Roadmapping', 'User Research'],
    competencies: ['Leadership', 'Strategic Thinking'],
    trainings: [
      {
        name: 'Advanced Product Leadership',
        date: '2025-02-20',
        duration: '3 days',
        status: "Completed",
        certification: 'APL-2025'
      }
    ],
    previousRoles: [
      {
        jobTitle: 'Senior Product Manager',
        department: 'Product',
        startDate: '2020-08-15',
        endDate: '2025-02-11',
        responsibilities: 'Leading product development'
      }
    ],
    documents: [
      {
        type: 'Contract',
        name: 'Employment Agreement',
        issueDate: '2025-02-10',
        status: 'Active'
      }
    ],
    createdAt: '2025-02-10 08:30:00',
    updatedAt: '2023-05-15 16:20:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-10',
    employeeId: 'LAKD89137',
    firstName: 'Aliene',
    middleName: 'Grace',
    lastName: 'McCoy',
    email: 'mccoyariene@gmail.com',
    role: 'Sr. UI/UX Designer',
    phone: '+1 555-012-3456',
    address: '852 Design Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94115',
    country: 'USA',
    dateOfBirth: '1991-05-20',
    gender: 'Female',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Grace McCoy',
      relationship: 'Mother',
      phone: '+1 555-987-6543'
    },
    department: 'Product',
    jobTitle: 'Senior UI/UX Designer',
    jobGrade: 'G5',
    employeeCategory: 'Professional',
    reportingTo: 'Lead Product Manager',
    manager: 'Grande Ariana',
    team: 'Design Team',
    joiningDate: '2024-11-10',
    contractType: "Part-time",
    employmentStatus: "Active",
    status: "on-leave",
    workLocation: 'Remote',
    workSchedule: 'Flexible',
    salary: 75000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Wells Fargo',
      accountNumber: '****8901',
      branchCode: '012345'
    },
    taxInformation: 'Single-2',
    lastCheckIn: '2023-05-08 09:30:00',
    lastCheckOut: '2023-05-08 16:45:00',
    totalLeavesTaken: 8,
    leaveBalance: 7,
    attendancePercentage: 93.0,
    performanceRating: 4.4,
    lastAppraisalDate: '2023-03-15',
    nextAppraisalDate: '2023-09-15',
    keyPerformanceIndicators: [
      {
        name: 'Design Quality',
        target: 'High satisfaction',
        actual: 'Very high satisfaction',
        weight: 60
      },
      {
        name: 'Project Delivery',
        target: 'On time',
        actual: 'Mostly on time',
        weight: 40
      }
    ],
    skills: ['Figma', 'User Research', 'Prototyping', 'UI Design'],
    competencies: ['Creativity', 'User Empathy'],
    trainings: [
      {
        name: 'Advanced UX Research',
        date: '2024-11-20',
        duration: '2 days',
        status: "Completed",
        certification: 'AUR-2024'
      }
    ],
    previousRoles: [
      {
        jobTitle: 'UI/UX Designer',
        department: 'Product',
        startDate: '2022-01-15',
        endDate: '2024-11-09',
        responsibilities: 'Designing user interfaces'
      }
    ],
    documents: [
      {
        type: 'Contract',
        name: 'Part-time Agreement',
        issueDate: '2024-11-05',
        status: 'Active'
      }
    ],
    createdAt: '2024-11-05 11:30:00',
    updatedAt: '2023-05-12 10:15:00',
    updatedBy: 'admin'
  },
  {
    id: 'emp-11',
    employeeId: 'LAKD89138',
    firstName: 'Tom',
    middleName: 'Michael',
    lastName: 'McCoy',
    email: 'tom@gmail.com',
    role: 'Sr. UI/UX Designer',
    phone: '+1 555-123-4567',
    address: '951 Design Avenue',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94116',
    country: 'USA',
    dateOfBirth: '1986-08-12',
    gender: 'Male',
    maritalStatus: 'Married',
    emergencyContact: {
      name: 'Sarah McCoy',
      relationship: 'Spouse',
      phone: '+1 555-876-5432'
    },
    department: 'Product',
    jobTitle: 'Senior UI/UX Designer',
    jobGrade: 'G5',
    employeeCategory: 'Professional',
    reportingTo: 'Lead Product Manager',
    manager: 'Grande Ariana',
    team: 'Design Team',
    joiningDate: '2024-11-10',
    contractType: "Part-time",
    employmentStatus: "Active",
    status: "active",
    workLocation: 'Remote',
    workSchedule: 'Flexible',
    salary: 80000,
    currency: 'USD',
    paymentMethod: 'Direct Deposit',
    bankDetails: {
      bankName: 'Bank of America',
      accountNumber: '****9012',
      branchCode: '123456'
    },
    taxInformation: 'Married-2',
    lastCheckIn: '2023-05-15 09:15:00',
    lastCheckOut: '2023-05-15 17:00:00',
    totalLeavesTaken: 5,
    leaveBalance: 10,
    attendancePercentage: 95.5,
    performanceRating: 4.5,
    lastAppraisalDate: '2023-03-20',
    nextAppraisalDate: '2023-09-20',
    keyPerformanceIndicators: [
      {
        name: 'Design Quality',
        target: 'High satisfaction',
        actual: 'Very high satisfaction',
        weight: 60
      },
      {
        name: 'Project Delivery',
        target: 'On time',
        actual: 'Ahead of schedule',
        weight: 40
      }
    ],
    skills: ['Sketch', 'Adobe XD', 'User Testing', 'Interaction Design'],
    competencies: ['Problem Solving', 'Collaboration'],
    trainings: [
      {
        name: 'Advanced Interaction Design',
        date: '2024-12-01',
        duration: '3 days',
        status: "Completed",
        certification: 'AID-2024'
      }
    ],
    previousRoles: [
      {
        jobTitle: 'UI Designer',
        department: 'Product',
        startDate: '2021-06-10',
        endDate: '2024-11-09',
        responsibilities: 'Creating user interfaces'
      }
    ],
    documents: [
      {
        type: 'Contract',
        name: 'Part-time Agreement',
        issueDate: '2024-11-05',
        status: 'Active'
      }
    ],
    createdAt: '2024-11-05 12:45:00',
    updatedAt: '2023-05-15 15:30:00',
    updatedBy: 'admin'
  }
]