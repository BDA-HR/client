import React, { useState } from 'react';
import { InteractiveGridPattern } from '../components/ui/interactive-grid-pattern';
import { cn } from '../lib/utils';
import { 
  User, 
  Briefcase, 
  Shield, 
  MapPin,
  Mail,
  Globe,
  Phone,

  Award,
  Heart,
  Users,
  FileText,
  Clock,
  Star,
  Download
} from 'lucide-react';

// Enhanced mock data with additional fields
const mockEmployeeData = {
  // Basic Info
  photo: "/api/placeholder/150/150",
  fullName: "John Smith",
  fullNameAm: "ጆን ሚት",
  code: "EMP-001",
  gender: "Male",
  nationality: "Ethiopian",
  employmentDate: "2023-01-15",
  jobGrade: "Senior Specialist",
  position: "Senior Software Engineer",
  department: "Technology",
  pbranch: "Head Office",
  employmentType: "Full-time",
  employmentNature: "Permanent",
  workSchedule: "Standard 9-5",
  workLocation: "Hybrid",

  // Biographical
  birthDate: "1990-05-20",
  birthLocation: "Addis Ababa",
  motherFullName: "Mary Smith",
  hasBirthCert: "Yes",
  hasMarriageCert: "No",
  maritalStatus: "Single",
  tin: "123456789",
  bankAccountNo: "100023456789",
  pensionNumber: "PEN-12345",
  address: "Bole, Addis Ababa",
  telephone: "+251-911-234-567",
  email: "john.smith@company.com",
  website: "www.johnsmith.dev",

  // Emergency Contact
  conFullName: "Michael Smith",
  conFullNameAm: "ማይክል ሚት",
  conNationality: "Ethiopian",
  conGender: "Male",
  conRelation: "Brother",
  conAddress: "Bole, Addis Ababa",
  conTelephone: "+251-911-345-678",

  // Guarantor
  guaFullName: "Robert Johnson",
  guaFullNameAm: "ሮበርት ጆንሰን",
  guaNationality: "Ethiopian",
  guaGender: "Male",
  guaRelation: "Family Friend",
  guaAddress: "Kirkos, Addis Ababa",
  guaTelephone: "+251-922-123-456",
  guaFileName: "guarantor_agreement.pdf",
  guaFileSize: "2.4 MB",
  guaFileType: "PDF",

  // New Fields for Overview
  reportsTo: {
    name: "Sarah Johnson",
    position: "Tech Lead",
    email: "sarah.johnson@company.com"
  },
  directReports: [
    { name: "Alice Brown", position: "Junior Developer" },
    { name: "David Wilson", position: "Frontend Developer" }
  ],
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Agile Methodology"],
  certifications: ["AWS Certified Solutions Architect", "Scrum Master"],
  education: [
    { institution: "Addis Ababa University", degree: "BSc Computer Science", year: "2012" }
  ],
  languages: ["English", "Amharic", "French"],
  interests: ["Hiking", "Photography", "Open Source"],
  timeOffBalance: {
    vacation: 18,
    sick: 10,
    personal: 5
  },
  performanceRating: 4.5,
  currentProjects: ["HR System Redesign", "Mobile App Development"],
  team: "Frontend Development Team",
  workAnniversary: "2023-01-15",
  bio: "Passionate software engineer with 8+ years of experience in building scalable web applications. Love mentoring junior developers and contributing to open source projects."
};

const settingTabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'basic', label: 'Basic Info', icon: Briefcase },
  { id: 'bio', label: 'Biographical', icon: FileText },
  { id: 'emergency', label: 'Emergency Contact', icon: Heart },
  { id: 'guarantor', label: 'Guarantor', icon: Shield },
  { id: 'address', label: 'Address & Contact', icon: MapPin },
];

const greenTheme = {
  primary: {
    light: "bg-green-50",
    icon: "text-green-600",
    border: "border-green-200"
  }
};

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard 
                icon={<Clock className="h-6 w-6" />}
                label="Tenure"
                value={`${Math.floor((new Date() - new Date(mockEmployeeData.employmentDate)) / (1000 * 60 * 60 * 24 * 365))} years`}
              />
              <StatCard 
                icon={<Star className="h-6 w-6" />}
                label="Performance"
                value={mockEmployeeData.performanceRating}
                suffix="/5"
              />
              <StatCard 
                icon={<Award className="h-6 w-6" />}
                label="Certifications"
                value={mockEmployeeData.certifications.length}
              />
              <StatCard 
                icon={<Users className="h-6 w-6" />}
                label="Team Members"
                value={mockEmployeeData.directReports.length}
              />
            </div>

            {/* Bio & Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Bio */}
                <Section title="About Me">
                  <p className="text-gray-700 leading-relaxed">{mockEmployeeData.bio}</p>
                </Section>

                {/* Skills */}
                <Section title="Skills & Expertise">
                  <div className="flex flex-wrap gap-2">
                    {mockEmployeeData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Section>

                {/* Current Projects */}
                <Section title="Current Projects">
                  <div className="space-y-2">
                    {mockEmployeeData.currentProjects.map((project, index) => (
                      <div key={index} className="flex items-center gap-3 py-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{project}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <Section title="Contact Information">
                  <div className="space-y-3">
                    <ContactField icon={<Mail className="h-4 w-4" />} value={mockEmployeeData.email} />
                    <ContactField icon={<Phone className="h-4 w-4" />} value={mockEmployeeData.telephone} />
                    <ContactField icon={<Globe className="h-4 w-4" />} value={mockEmployeeData.website} />
                    <ContactField icon={<MapPin className="h-4 w-4" />} value={mockEmployeeData.address} />
                  </div>
                </Section>

                {/* Organization */}
                <Section title="Organization">
                  <div className="space-y-3">
                    <InfoField label="Reports To" value={mockEmployeeData.reportsTo.name} />
                    <InfoField label="Department" value={mockEmployeeData.department} />
                    <InfoField label="Team" value={mockEmployeeData.team} />
                    <InfoField label="Work Location" value={mockEmployeeData.workLocation} />
                  </div>
                </Section>

                {/* Time Off */}
                <Section title="Time Off Balance">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Vacation</span>
                      <span className="font-semibold text-green-600">{mockEmployeeData.timeOffBalance.vacation} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sick Leave</span>
                      <span className="font-semibold text-blue-600">{mockEmployeeData.timeOffBalance.sick} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Personal</span>
                      <span className="font-semibold text-purple-600">{mockEmployeeData.timeOffBalance.personal} days</span>
                    </div>
                  </div>
                </Section>
              </div>
            </div>
          </div>
        );

      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Section title="Personal Information">
                <InfoField label="Full Name" value={mockEmployeeData.fullName} />
                <InfoField label="Name (Amharic)" value={mockEmployeeData.fullNameAm} />
                <InfoField label="Employee Code" value={mockEmployeeData.code} />
                <InfoField label="Gender" value={mockEmployeeData.gender} />
                <InfoField label="Nationality" value={mockEmployeeData.nationality} />
              </Section>
            </div>
            <div className="space-y-6">
              <Section title="Employment Details">
                <InfoField label="Employment Date" value={mockEmployeeData.employmentDate} />
                <InfoField label="Job Grade" value={mockEmployeeData.jobGrade} />
                <InfoField label="Position" value={mockEmployeeData.position} />
                <InfoField label="Department" value={mockEmployeeData.department} />
                <InfoField label="Branch" value={mockEmployeeData.pbranch} />
                <InfoField label="Employment Type" value={mockEmployeeData.employmentType} />
                <InfoField label="Work Schedule" value={mockEmployeeData.workSchedule} />
              </Section>
            </div>
          </div>
        );
      
      case 'bio':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Section title="Personal Details">
                <InfoField label="Birth Date" value={mockEmployeeData.birthDate} />
                <InfoField label="Birth Location" value={mockEmployeeData.birthLocation} />
                <InfoField label="Mother's Full Name" value={mockEmployeeData.motherFullName} />
                <InfoField label="Has Birth Certificate" value={mockEmployeeData.hasBirthCert} />
                <InfoField label="Marital Status" value={mockEmployeeData.maritalStatus} />
                <InfoField label="Has Marriage Certificate" value={mockEmployeeData.hasMarriageCert} />
              </Section>
              
              <Section title="Education & Languages">
                <div className="space-y-4">
                  {mockEmployeeData.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <div className="font-semibold text-gray-800">{edu.degree}</div>
                      <div className="text-gray-600">{edu.institution}</div>
                      <div className="text-gray-500 text-sm">{edu.year}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <InfoField label="Languages" value={mockEmployeeData.languages.join(', ')} />
                </div>
              </Section>
            </div>
            <div className="space-y-6">
              <Section title="Financical Details">
                <InfoField label="TIN Number" value={mockEmployeeData.tin} />
                <InfoField label="Bank Account" value={mockEmployeeData.bankAccountNo} />
                <InfoField label="Pension Number" value={mockEmployeeData.pensionNumber} />
              </Section>
              
              <Section title="Interests & Hobbies">
                <div className="flex flex-wrap gap-2">
                  {mockEmployeeData.interests.map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Certifications">
                <div className="space-y-2">
                  {mockEmployeeData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 py-1">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>
        );
      
      case 'emergency':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Section title="Emergency Contact Details">
                <InfoField label="Full Name" value={mockEmployeeData.conFullName} />
                <InfoField label="Name (Amharic)" value={mockEmployeeData.conFullNameAm} />
                <InfoField label="Nationality" value={mockEmployeeData.conNationality} />
                <InfoField label="Gender" value={mockEmployeeData.conGender} />
              </Section>
            </div>
            <div className="space-y-6">
              <Section title="Contact Information">
                <InfoField label="Relationship" value={mockEmployeeData.conRelation} />
                <InfoField label="Address" value={mockEmployeeData.conAddress} />
                <InfoField label="Telephone" value={mockEmployeeData.conTelephone} />
              </Section>
            </div>
          </div>
        );
      
      case 'guarantor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Section title="Guarantor Information">
                <InfoField label="Full Name" value={mockEmployeeData.guaFullName} />
                <InfoField label="Name (Amharic)" value={mockEmployeeData.guaFullNameAm} />
                <InfoField label="Nationality" value={mockEmployeeData.guaNationality} />
                <InfoField label="Gender" value={mockEmployeeData.guaGender} />
                <InfoField label="Relationship" value={mockEmployeeData.guaRelation} />
              </Section>
            </div>
            <div className="space-y-6">
              <Section title="Contact & Documents">
                <InfoField label="Address" value={mockEmployeeData.guaAddress} />
                <InfoField label="Telephone" value={mockEmployeeData.guaTelephone} />
                <div className="border rounded-lg p-4 bg-gray-50 mt-4">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Guarantor Document
                  </h4>
                  <div className="space-y-2">
                    <InfoField label="File Name" value={mockEmployeeData.guaFileName} />
                    <InfoField label="File Size" value={mockEmployeeData.guaFileSize} />
                    <InfoField label="File Type" value={mockEmployeeData.guaFileType} />
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mt-3">
                      <Download className="h-4 w-4" />
                      Download Document
                    </button>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        );
      
      case 'address':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Section title="Primary Address">
                <InfoField label="Address" value={mockEmployeeData.address} />
                <InfoField label="Telephone" value={mockEmployeeData.telephone} />
              </Section>
              
              <Section title="Digital Presence">
                <InfoField label="Email" value={mockEmployeeData.email} icon={<Mail className="h-4 w-4" />} />
                <InfoField label="Website" value={mockEmployeeData.website} icon={<Globe className="h-4 w-4" />} />
              </Section>
            </div>
            
            <Section title="Work Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoField label="Work Location" value={mockEmployeeData.workLocation} />
                <InfoField label="Work Schedule" value={mockEmployeeData.workSchedule} />
                <InfoField label="Employment Type" value={mockEmployeeData.employmentType} />
              </div>
            </Section>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8 -mt-6">
      <div className="relative -mt-6 w-full flex flex-col items-center justify-center overflow-hidden rounded-xl">
        {/* Decorative Pattern Layer */}
        <InteractiveGridPattern
          className={cn(
            "[mask-image:radial-gradient(ellipse_at_center,_grey,_transparent_70%)]",
            "inset-0 h-full w-full skew-y-6"
          )}
          width={22}
          height={22}
          squares={[80, 80]}
          squaresClassName="hover:fill-green-400"
        />

        {/* Floating Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-green-200 blur-[90px] opacity-30" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center p-10 flex flex-col items-center">
          {/* Profile Image */}
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 transform transition-transform duration-500 hover:scale-105">
            <img 
              src={mockEmployeeData.photo} 
              alt={mockEmployeeData.fullName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <h1 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight">
            {mockEmployeeData.fullName}
          </h1>
          <p className="text-green-600 font-semibold mt-1 text-lg">
            {mockEmployeeData.position}
          </p>
          <p className="text-gray-600 mt-1">
            {mockEmployeeData.department} • {mockEmployeeData.code}
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-2">
          <nav className="flex space-x-2 overflow-x-auto">
            {settingTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? `${greenTheme.primary.light} border border-green-300 text-green-700 shadow-sm`
                      : "text-gray-500 hover:text-green-700 hover:bg-green-50"
                  }`}
                >
                  <IconComponent
                    className={`h-5 w-5 ${
                      isActive ? greenTheme.primary.icon : "text-gray-400"
                    }`}
                  />
                  {tab.label}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-green-500 ml-1"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-8">
        {renderTabContent()}
      </div>
    </div>
  );
}

// Reusable Components
const InfoField = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="flex flex-col space-y-1 mb-4">
    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <div className="text-gray-800 font-medium">{value || 'Not provided'}</div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      {title}
    </h3>
    {children}
  </div>
);

const StatCard = ({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: string | number; suffix?: string }) => (
  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-100 text-center">
    <div className="flex justify-center text-green-600 mb-2">
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900">
      {value}{suffix}
    </div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </div>
);

const ContactField = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="text-gray-400">{icon}</div>
    <span className="text-gray-700">{value}</span>
  </div>
);

export default ProfilePage;