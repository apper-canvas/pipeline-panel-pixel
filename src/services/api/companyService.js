import companiesData from "@/services/mockData/companies.json";

let companies = [...companiesData];

const companyService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return companies.map(company => ({ ...company }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error("Company not found");
    }
    return { ...company };
  },

  async create(companyData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newCompany = {
      ...companyData,
      Id: Math.max(...companies.map(c => c.Id), 0) + 1,
      contacts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    companies.push(newCompany);
    return { ...newCompany };
  },

  async update(id, companyData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    
    companies[index] = {
      ...companies[index],
      ...companyData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...companies[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    
    companies.splice(index, 1);
    return true;
  },

  async addContact(companyId, contactId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const company = companies.find(c => c.Id === parseInt(companyId));
    if (!company) {
      throw new Error("Company not found");
    }
    
    if (!company.contacts.includes(parseInt(contactId))) {
      company.contacts.push(parseInt(contactId));
      company.updatedAt = new Date().toISOString();
    }
    
    return { ...company };
  },

  async removeContact(companyId, contactId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const company = companies.find(c => c.Id === parseInt(companyId));
    if (!company) {
      throw new Error("Company not found");
    }
    
    company.contacts = company.contacts.filter(id => id !== parseInt(contactId));
    company.updatedAt = new Date().toISOString();
    
    return { ...company };
  },

  async searchByName(query) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.map(company => ({
      Id: company.Id,
      name: company.name,
      industry: company.industry,
      size: company.size
    }));
  }
};

export default companyService;