import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const contactService = {
  // Get all contacts
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...contacts];
  },

  // Get contact by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  // Create new contact
  create: async (contactData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newContact = {
      ...contactData,
      Id: Math.max(...contacts.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactedAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    return { ...newContact };
  },

  // Update existing contact
  update: async (id, contactData) => {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    contacts[index] = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...contacts[index] };
  },

  // Delete contact
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const deletedContact = contacts.splice(index, 1)[0];
    return { ...deletedContact };
  }
};

export default contactService;