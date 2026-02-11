import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex ">
        <TabsList className="bg-orange-50 gap-5 border border-gray-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Activities
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ContactOverview contact={contact} onEdit={() => {}} />
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <ContactActivities contactId={contact.id} />
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <ContactOpportunities contactId={contact.id} hasAccount={!!contact.accountId} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <ContactNotes contactId={contact.id} />
        </TabsContent>
      </Tabs>

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

