import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, User, Calendar, Briefcase, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/button';

import { showToast } from '../../../layout/layout';
import { mockContacts } from '../../../data/crmMockData';
import ContactOverview from '../../../components/crm/contactManagement/assignedContacts/ContactOverview';
import ContactActivities from '../../../components/crm/contactManagement/assignedContacts/ContactActivities';
import ContactOpportunities from '../../../components/crm/contactManagement/assignedContacts/ContactOpportunities';
import ContactNotes from '../../../components/crm/contactManagement/assignedContacts/ContactNotes';
import ContactEmailModal from '../../../components/crm/contactManagement/assignedContacts/ContactEmailModal';
import type { Contact } from '../../../types/crm';

export default function AssignedContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load contact from localStorage
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      try {
        const contacts = JSON.parse(storedContacts);
        const foundContact = contacts.find((c: Contact) => c.id === id);
        if (foundContact) {
          setContact(foundContact);
        } else {
          // Fallback to mock data
          const mockContact = mockContacts.find(c => c.id === id);
          if (mockContact) {
            setContact(mockContact);
          } else {
            showToast.error('Contact not found');
            navigate('/crm/contacts/assigned');
          }
        }
      } catch (error) {
        console.error('Error loading contact from localStorage:', error);
        // Fallback to mock data
        const foundContact = mockContacts.find(c => c.id === id);
        if (foundContact) {
          setContact(foundContact);
        } else {
          showToast.error('Contact not found');
          navigate('/crm/contacts/assigned');
        }
      }
    } else {
      // Fallback to mock data
      const foundContact = mockContacts.find(c => c.id === id);
      if (foundContact) {
        setContact(foundContact);
      } else {
        showToast.error('Contact not found');
        navigate('/crm/contacts/assigned');
      }
    }
  }, [id, navigate]);

  const handleEmailSent = (emailData: { subject: string; message: string }) => {
    // In a real app, this would send the email via API
    console.log('Email sent:', emailData);
    showToast.success('Email sent successfully');
  };

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading contact...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/crm/contacts/assigned')}
            className="hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assigned Contacts
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h1>
            <p className="text-gray-600">{contact.jobTitle} at {contact.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`tel:${contact.phone}`, '_self')}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEmailModalOpen(true)}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-2">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-orange-50 border border-orange-300 text-orange-700 shadow-sm'
                : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
            }`}
          >
            <User className={`h-5 w-5 ${activeTab === 'overview' ? 'text-orange-600' : 'text-gray-400'}`} />
            Overview
            {activeTab === 'overview' && (
              <div className="w-2 h-2 rounded-full bg-orange-500 ml-1"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'activities'
                ? 'bg-orange-50 border border-orange-300 text-orange-700 shadow-sm'
                : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
            }`}
          >
            <Calendar className={`h-5 w-5 ${activeTab === 'activities' ? 'text-orange-600' : 'text-gray-400'}`} />
            Activities
            {activeTab === 'activities' && (
              <div className="w-2 h-2 rounded-full bg-orange-500 ml-1"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'opportunities'
                ? 'bg-orange-50 border border-orange-300 text-orange-700 shadow-sm'
                : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
            }`}
          >
            <Briefcase className={`h-5 w-5 ${activeTab === 'opportunities' ? 'text-orange-600' : 'text-gray-400'}`} />
            Opportunities
            {activeTab === 'opportunities' && (
              <div className="w-2 h-2 rounded-full bg-orange-500 ml-1"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-orange-50 border border-orange-300 text-orange-700 shadow-sm'
                : 'text-gray-500 hover:text-orange-700 hover:bg-orange-50'
            }`}
          >
            <FileText className={`h-5 w-5 ${activeTab === 'notes' ? 'text-orange-600' : 'text-gray-400'}`} />
            Notes
            {activeTab === 'notes' && (
              <div className="w-2 h-2 rounded-full bg-orange-500 ml-1"></div>
            )}
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <ContactOverview contact={contact} onEdit={() => {}} />
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            <ContactActivities contactId={contact.id} />
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            <ContactOpportunities contactId={contact.id} hasAccount={!!contact.accountId} />
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <ContactNotes contactId={contact.id} />
          </div>
        )}
      </div>

      {/* Email Modal */}
      <ContactEmailModal
        contact={contact}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onEmailSent={handleEmailSent}
      />
    </motion.div>
  );
}

