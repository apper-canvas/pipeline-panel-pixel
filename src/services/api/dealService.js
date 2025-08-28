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
      stageChangedAt: new Date().toISOString()
    };
    
    deals.push(newDeal);
    return { ...newDeal };
  },

  async getAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const deals = [...dealsData];
    const activeDeals = deals.filter(d => d.stage !== 'closed-won');
    const totalPipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
    
    // Calculate stage analytics
    const stageAnalytics = {};
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won'];
    
    stages.forEach(stageId => {
      const stageDeals = deals.filter(d => d.stage === stageId);
      const avgDays = stageDeals.length > 0 
        ? Math.round(stageDeals.reduce((sum, deal) => {
            if (!deal.stageChangedAt) return sum;
            const daysInStage = Math.ceil((new Date() - new Date(deal.stageChangedAt)) / (1000 * 60 * 60 * 24));
            return sum + daysInStage;
          }, 0) / stageDeals.length)
        : 0;
      
      stageAnalytics[stageId] = {
        avgDaysInStage: avgDays,
        dealCount: stageDeals.length,
        totalValue: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
      };
    });
    
    // Find bottleneck stage (highest average days)
    const bottleneckStage = Object.entries(stageAnalytics)
      .filter(([, data]) => data.dealCount > 0)
      .reduce((max, [stage, data]) => 
        data.avgDaysInStage > (stageAnalytics[max]?.avgDaysInStage || 0) ? stage : max, 
        'lead'
      );
    
    const avgDaysInPipeline = Math.round(
      activeDeals.reduce((sum, deal) => {
        if (!deal.createdAt) return sum;
        return sum + Math.ceil((new Date() - new Date(deal.createdAt)) / (1000 * 60 * 60 * 24));
      }, 0) / Math.max(activeDeals.length, 1)
    );

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(amount);
    };

    const stageNames = {
      'lead': 'Lead',
      'qualified': 'Qualified', 
      'proposal': 'Proposal',
      'negotiation': 'Negotiation',
      'closed-won': 'Closed Won'
    };

    return {
      totalPipelineValue: formatCurrency(totalPipelineValue),
      totalDeals: activeDeals.length,
      avgDaysInPipeline,
      bottleneckStage: stageNames[bottleneckStage] || 'Lead',
      bottleneckDays: stageAnalytics[bottleneckStage]?.avgDaysInStage || 0,
      stageAnalytics,
      valueChange: '+12%',
      dealChange: '+3',
      cycleTimeChange: '-2 days'
    };
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