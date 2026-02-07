import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Phone, Mail, Building } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { showToast } from '../../layout/layout';
import { mockContacts } from '../../data/crmMockData';
import ContactOverview from '../../components/crm/contactManagement/components/ContactOverview';
import ContactActivities from '../../components/crm/contactManagement/components/ContactActivities';
import ContactOpportunities from '../../components/crm/contactManagement/components/ContactOpportunities';
import ContactNotes from '../../components/crm/contactManagement/components/ContactNotes';
import ContactForm from '../../components/crm/contactManagement/components/ContactForm';
import AccountForm from '../../components/crm/accountManagement/components/AccountForm';
import type { Contact, Account } from '../../types/crm';

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
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
            navigate('/crm/contacts');
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
          navigate('/crm/contacts');
        }
      }
    } else {
      // Fallback to mock data
      const foundContact = mockContacts.find(c => c.id === id);
      if (foundContact) {
        setContact(foundContact);
      } else {
        showToast.error('Contact not found');
        navigate('/crm/contacts');
      }
    }
  }, [id, navigate]);

  const handleEditContact = (contactData: Partial<Contact>) => {
    if (contact) {
      const updatedContact = { 
        ...contact, 
        ...contactData, 
        updatedAt: new Date().toISOString() 
      };
      setContact(updatedContact);
      
      // Update localStorage
      const storedContacts = localStorage.getItem('contacts');
      if (storedContacts) {
        try {
          const contacts = JSON.parse(storedContacts);
          const updatedContacts = contacts.map((c: Contact) => 
            c.id === contact.id ? updatedContact : c
          );
          localStorage.setItem('contacts', JSON.stringify(updatedContacts));
        } catch (error) {
          console.error('Error updating contact in localStorage:', error);
        }
      }
      
      showToast.success('Contact updated successfully');
    }
  };

  const handleCreateAccount = () => {
    setIsAccountDialogOpen(true);
  };

  const handleAccountCreate = (accountData: Partial<Account>) => {
    if (!contact) return;

    try {
      // Create new account
      const newAccountId = Date.now().toString();
      const newAccount: Account = {
        id: newAccountId,
        name: accountData.name || contact.company,
        industry: accountData.industry || '',
        website: accountData.website || '',
        phone: accountData.phone || contact.phone,
        email: accountData.email || contact.email,
        address: accountData.address || contact.address,
        city: accountData.city || contact.city,
        state: accountData.state || contact.state,
        zipCode: accountData.zipCode || contact.zipCode,
        country: accountData.country || contact.country,
        accountType: accountData.accountType || 'Customer',
        owner: accountData.owner || contact.owner,
        isActive: true,
        primaryContactId: contact.id,
        contactIds: [contact.id],
        opportunityIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: accountData.notes || '',
        customFields: accountData.customFields || {},
        tags: accountData.tags || []
      };

      // Save account to localStorage
      const storedAccounts = localStorage.getItem('accounts');
      const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
      accounts.push(newAccount);
      localStorage.setItem('accounts', JSON.stringify(accounts));

      // Update contact with account ID
      const updatedContact = {
        ...contact,
        accountId: newAccountId,
        updatedAt: new Date().toISOString()
      };
      setContact(updatedContact);

      // Update contact in localStorage
      const storedContacts = localStorage.getItem('contacts');
      if (storedContacts) {
        const contacts = JSON.parse(storedContacts);
        const updatedContacts = contacts.map((c: Contact) => 
          c.id === contact.id ? updatedContact : c
        );
        localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      }

      showToast.success('Account created successfully and linked to contact');
      setIsAccountDialogOpen(false);
    } catch (error) {
      console.error('Error creating account:', error);
      showToast.error('Failed to create account. Please try again.');
    }
  };

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
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
            onClick={() => navigate('/crm/contacts')}
            className="hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
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
            onClick={() => window.open(`mailto:${contact.email}`, '_self')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          {!contact.accountId && (
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              onClick={() => handleCreateAccount()}
            >
              <Building className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          )}
          <Button
            onClick={() => setIsEditDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Contact
          </Button>
        </div>
      </div>

      {/* Contact Summary Card */}
      {/* <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {contact.firstName} {contact.lastName}
                </h3>
                <Badge className={stageColors[contact.stage]}>
                  {contact.stage}
                </Badge>
              </div>
            </div>

         
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{contact.city}, {contact.state}</span>
              </div>
            </div>

         
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{contact.company}</span>
              </div>
              <div className="text-sm text-gray-600">{contact.jobTitle}</div>
              <div className="text-sm text-gray-500">
                Owner: {contact.owner}
              </div>
            </div>

            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-500">Relationship Score</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${contact.relationshipScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{contact.relationshipScore}</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Last Contact</span>
                <div className="flex items-center space-x-1 mt-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs">
                    {new Date(contact.lastContactDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

        
          {contact.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

        
          {(contact.socialMedia.linkedin || contact.socialMedia.twitter || contact.socialMedia.facebook) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Social Media:</span>
                {contact.socialMedia.linkedin && (
                  <a
                    href={contact.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {contact.socialMedia.twitter && (
                  <a
                    href={`https://twitter.com/${contact.socialMedia.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-600 text-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Twitter</span>
                  </a>
                )}
                {contact.socialMedia.facebook && (
                  <a
                    href={contact.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-800 hover:text-blue-900 text-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Facebook</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex ">
        <TabsList className="bg-green-50 gap-5 border border-gray-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Activities
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ContactOverview contact={contact} />
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

      {/* Edit Contact Form */}
      <ContactForm
        contact={contact}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditContact}
        mode="edit"
      />

      {/* Create Account Form */}
      <AccountForm
        isOpen={isAccountDialogOpen}
        onClose={() => setIsAccountDialogOpen(false)}
        onSubmit={handleAccountCreate}
        mode="add"
        initialData={{
          name: contact.company,
          phone: contact.phone,
          email: contact.email,
          address: contact.address,
          city: contact.city,
          state: contact.state,
          zipCode: contact.zipCode,
          country: contact.country,
          owner: contact.owner
        }}
      />
    </motion.div>
  );
}