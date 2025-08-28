import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ContactCard from "@/components/molecules/ContactCard";
import ContactModal from "@/components/organisms/ContactModal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import { toast } from "react-toastify";

const Contacts = () => {
  const { onMenuClick } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const loadContacts = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact => 
      contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredContacts(filtered);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      await loadContacts();
      toast.success("Contact deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.Id, contactData);
      } else {
        await contactService.create(contactData);
      }
      await loadContacts();
    } catch (error) {
      throw new Error("Failed to save contact");
    }
  };

  const handleContactClick = (contact) => {
    // For now, just open the edit modal
    handleEditContact(contact);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Contacts"
          subtitle={`Manage your customer relationships`}
          onMenuClick={onMenuClick}
          showSearch={true}
          onSearch={handleSearch}
          searchPlaceholder="Search contacts..."
        />
        <div className="p-6">
          <Loading variant="contacts" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="Contacts"
          onMenuClick={onMenuClick}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadContacts} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Contacts"
        subtitle={`${contacts.length} total contacts`}
        onMenuClick={onMenuClick}
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Search contacts..."
        actionButton={
          <Button onClick={handleAddContact}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Contact
          </Button>
        }
      />
      
      <div className="p-6">
        {filteredContacts.length === 0 && contacts.length === 0 ? (
          <Empty
            title="No contacts yet"
            description="Start building your network by adding your first contact. Track relationships, manage communications, and grow your business."
            actionLabel="Add First Contact"
            onAction={handleAddContact}
            icon="Users"
          />
        ) : filteredContacts.length === 0 ? (
          <Empty
            title="No contacts found"
            description="Try adjusting your search terms or add a new contact."
            actionLabel="Add Contact"
            onAction={handleAddContact}
            icon="Search"
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ContactCard
                  contact={contact}
                  onClick={handleContactClick}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
      />
    </div>
  );
};

export default Contacts;