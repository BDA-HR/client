import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { showToast } from '../../../layout/layout';
import ContactForm from '../../../components/crm/contactManagement/contacts/ContactForm';
import type { Contact } from '../../../types/crm';

export default function AddContactPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddContact = async (contactData: Partial<Contact>) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      showToast.success('Contact created successfully');
      navigate('/crm/contacts');
    } catch (error) {
      showToast.error('Failed to create contact');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Add New Contact</h1>
          <p className="text-gray-600">Create a new contact in your CRM system</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl">
        <ContactForm
          isOpen={true}
          onClose={() => navigate('/crm/contacts')}
          onSubmit={handleAddContact}
          mode="add"
          isSubmitting={isSubmitting}
          isPage={true}
        />
      </div>
    </motion.div>
  );
}
