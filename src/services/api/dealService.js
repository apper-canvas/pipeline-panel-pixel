import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const dealService = {
  // Get all deals
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...deals];
  },

  // Get deal by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  // Create new deal
  create: async (dealData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newDeal = {
...dealData,
      Id: Math.max(...deals.map(d => d.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stageChangedAt: dealData.stage ? new Date().toISOString() : null
    };
    
    deals.push(newDeal);
    return { ...newDeal };
  },

  // Update existing deal
  update: async (id, dealData) => {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    deals[index] = {
...deals[index],
      ...dealData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString(),
      ...(dealData.stage && dealData.stage !== deals[index].stage ? {
        stageChangedAt: new Date().toISOString()
      } : {})
    };
    
    return { ...deals[index] };
  },

  // Delete deal
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const deletedDeal = deals.splice(index, 1)[0];
    return { ...deletedDeal };
  }
};

export default dealService;