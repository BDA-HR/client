import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { showToast } from '../../../layout/layout';
import ContactForm from '../../../components/crm/contactManagement/contacts/ContactForm';
import { mockContacts } from '../../../data/crmMockData';
import type { Contact } from '../../../types/crm';

export default function EditContactPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, [id, navigate]);

  const handleEditContact = async (contactData: Partial<Contact>) => {
    setIsSubmitting(true);
    
    try {
      // Update contact in localStorage
      const storedContacts = localStorage.getItem('contacts');
      if (storedContacts) {
        const contacts = JSON.parse(storedContacts);
        const updatedContacts = contacts.map((c: Contact) => 
          c.id === id 
            ? { ...c, ...contactData, updatedAt: new Date().toISOString() }
            : c
        );
        localStorage.setItem('contacts', JSON.stringify(updatedContacts));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('contactsUpdated'));
      }
      
      showToast.success('Contact updated successfully');
      navigate('/crm/contacts');
    } catch (error) {
      showToast.error('Failed to update contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading contact...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Contact</h1>
          <p className="text-gray-600">Update contact information</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl">
        <ContactForm
          contact={contact}
          isOpen={true}
          onClose={() => navigate('/crm/contacts')}
          onSubmit={handleEditContact}
          mode="edit"
          isSubmitting={isSubmitting}
          isPage={true}
        />
      </div>
    </motion.div>
  );
}

