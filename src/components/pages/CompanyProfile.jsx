import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ContactCard from "@/components/molecules/ContactCard";
import DealCard from "@/components/molecules/DealCard";
import CompanyModal from "@/components/organisms/CompanyModal";
import DealModal from "@/components/organisms/DealModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import companyService from "@/services/api/companyService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onMenuClick } = useOutletContext();
const [company, setCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [dealStats, setDealStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
useEffect(() => {
    loadCompanyData();
    loadAllContacts();
    loadCompanyDeals();
  }, [id]);

const loadCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const companyData = await companyService.getById(id);
      setCompany(companyData);
      
      // Load associated contacts
      if (companyData.contacts && companyData.contacts.length > 0) {
        const allContactsData = await contactService.getAll();
        const associatedContacts = allContactsData.filter(contact => 
          companyData.contacts.includes(contact.Id)
        );
        setContacts(associatedContacts);
      } else {
        setContacts([]);
      }
    } catch (err) {
      setError("Failed to load company details. Please try again.");
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyDeals = async () => {
    try {
      const companyDeals = await dealService.getByCompany(company?.name || '');
      setDeals(companyDeals);
      
      // Calculate deal statistics
      const activeDeals = companyDeals.filter(deal => deal.stage !== 'closed-won');
      const closedDeals = companyDeals.filter(deal => deal.stage === 'closed-won');
      const totalPipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
      const totalClosedValue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);
      
      setDealStats({
        totalDeals: companyDeals.length,
        activeDeals: activeDeals.length,
        closedDeals: closedDeals.length,
        pipelineValue: totalPipelineValue,
        closedValue: totalClosedValue,
        avgDealSize: companyDeals.length > 0 ? Math.round((totalPipelineValue + totalClosedValue) / companyDeals.length) : 0
      });
    } catch (err) {
      console.error("Failed to load company deals:", err);
    }
  };

  const loadAllContacts = async () => {
    try {
      const allContactsData = await contactService.getAll();
      setAllContacts(allContactsData);
    } catch (err) {
      console.error("Failed to load contacts for association:", err);
    }
  };

const handleEditCompany = () => {
    setIsModalOpen(true);
  };

  const handleSaveCompany = async (companyData) => {
    try {
      await companyService.update(company.Id, companyData);
      await loadCompanyData();
      toast.success("Company updated successfully");
    } catch (error) {
      throw new Error("Failed to update company");
    }
  };

  const handleAssociateContact = async (contactId) => {
    try {
      await companyService.addContact(company.Id, contactId);
      await loadCompanyData();
      toast.success("Contact associated successfully");
    } catch (error) {
      toast.error("Failed to associate contact");
    }
  };

  const handleRemoveContact = async (contactId) => {
    if (!confirm("Are you sure you want to remove this contact from the company?")) {
      return;
    }

    try {
      await companyService.removeContact(company.Id, contactId);
      await loadCompanyData();
      toast.success("Contact removed successfully");
    } catch (error) {
      toast.error("Failed to remove contact");
    }
  };

  const handleCreateDeal = () => {
    setSelectedDeal(null);
    setIsDealModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setIsDealModalOpen(true);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      const dealPayload = {
        ...dealData,
        company: company.name,
        contactId: dealData.contactId || (contacts.length > 0 ? contacts[0].Id : null),
        contactName: dealData.contactName || (contacts.length > 0 ? `${contacts[0].firstName} ${contacts[0].lastName}` : '')
      };

      if (selectedDeal) {
        await dealService.update(selectedDeal.Id, dealPayload);
        toast.success("Deal updated successfully");
      } else {
        await dealService.create(dealPayload);
        toast.success("Deal created successfully");
      }
      
      await loadCompanyDeals();
    } catch (error) {
      throw new Error(selectedDeal ? "Failed to update deal" : "Failed to create deal");
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    try {
      await dealService.delete(dealId);
      await loadCompanyDeals();
      toast.success("Deal deleted successfully");
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSizeColor = (size) => {
    const colors = {
      "Enterprise": "bg-purple-100 text-purple-800",
      "Mid-Market": "bg-blue-100 text-blue-800",
      "Small Business": "bg-green-100 text-green-800",
      "Startup": "bg-orange-100 text-orange-800"
    };
    return colors[size] || "bg-gray-100 text-gray-800";
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      "Technology": "Laptop",
      "Software Development": "Code",
      "Investment": "TrendingUp",
      "Retail Technology": "ShoppingCart",
      "Financial Services": "DollarSign",
      "Healthcare Technology": "Heart",
      "Education Technology": "BookOpen",
      "Logistics & Supply Chain": "Truck",
      "Marketing & Advertising": "Megaphone"
    };
    return icons[industry] || "Building2";
  };

  const unassociatedContacts = allContacts.filter(contact => 
    !company?.contacts?.includes(contact.Id)
  );

  const editButton = (
<div className="flex items-center space-x-3">
      <Button
        onClick={handleCreateDeal}
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
      >
        <ApperIcon name="Plus" size={16} className="mr-2" />
        New Deal
      </Button>
      <Button
        onClick={handleEditCompany}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
      >
        <ApperIcon name="Edit2" size={16} className="mr-2" />
        Edit Company
      </Button>
    </div>
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanyData} />;
  if (!company) return <Error message="Company not found" />;

  return (
    <div className="min-h-screen">
      <Header
        title={company.name}
        subtitle={`${company.industry} • ${company.size}`}
        onMenuClick={onMenuClick}
actionButton={editButton}
      />

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ApperIcon name="Building2" size={16} className="inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'deals'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ApperIcon name="TrendingUp" size={16} className="inline mr-2" />
            Deals & Activities
            {deals.length > 0 && (
              <Badge className="ml-2 bg-indigo-100 text-indigo-800 text-xs">{deals.length}</Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'contacts'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ApperIcon name="Users" size={16} className="inline mr-2" />
            Contacts
            {contacts.length > 0 && (
              <Badge className="ml-2 bg-indigo-100 text-indigo-800 text-xs">{contacts.length}</Badge>
            )}
          </button>
        </div>
      </div>

<div className="p-6">
        {/* Company Overview - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6"
        >
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <ApperIcon name={getIndustryIcon(company.industry)} size={32} className="text-white" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h2>
                <p className="text-gray-600 leading-relaxed">{company.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getSizeColor(company.size)}>
                  {company.size}
                </Badge>
                {company.tags?.map((tag, index) => (
                  <Badge key={index} className="bg-gray-100 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Deal Statistics Cards - Always visible */}
        {dealStats.totalDeals > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pipeline</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(dealStats.pipelineValue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Closed Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(dealStats.closedValue)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="DollarSign" size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Deals</p>
                  <p className="text-2xl font-bold text-orange-600">{dealStats.activeDeals}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Activity" size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(dealStats.avgDealSize)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                
                <div className="space-y-4">
                  {company.website && (
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Globe" size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Website</p>
                        <a href={company.website} target="_blank" rel="noopener noreferrer" 
                           className="text-indigo-600 hover:text-indigo-800 text-sm break-all">
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {company.email && (
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Mail" size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <a href={`mailto:${company.email}`} className="text-indigo-600 hover:text-indigo-800 text-sm">
                          {company.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {company.phone && (
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="Phone" size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <a href={`tel:${company.phone}`} className="text-indigo-600 hover:text-indigo-800 text-sm">
                          {company.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {company.address && (
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="MapPin" size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-600">{company.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Stats */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Stats</h3>
                
                <div className="space-y-4">
                  {company.founded && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Founded</span>
                      <span className="text-sm font-medium text-gray-900">{company.founded}</span>
                    </div>
                  )}
                  
                  {company.employees && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Employees</span>
                      <span className="text-sm font-medium text-gray-900">{company.employees}</span>
                    </div>
                  )}
                  
                  {company.revenue && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="text-sm font-medium text-gray-900">{company.revenue}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Contacts</span>
                    <span className="text-sm font-medium text-gray-900">{contacts.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Deals</span>
                    <span className="text-sm font-medium text-gray-900">{dealStats.activeDeals || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                
                {deals.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h4>
                    <p className="text-gray-600 mb-4">Start tracking your relationship by creating the first deal.</p>
                    <Button
                      onClick={handleCreateDeal}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Create First Deal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deals
                      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                      .slice(0, 5)
                      .map((deal, index) => (
                      <motion.div
                        key={deal.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            deal.stage === 'closed-won' ? 'bg-green-500' : 
                            deal.stage === 'negotiation' ? 'bg-orange-500' :
                            deal.stage === 'proposal' ? 'bg-blue-500' :
                            deal.stage === 'qualified' ? 'bg-purple-500' : 'bg-gray-500'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">{deal.title}</p>
                            <p className="text-sm text-gray-600">
                              {deal.stage === 'closed-won' ? 'Closed' : 
                               deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)} • 
                               {format(new Date(deal.updatedAt), "MMM dd")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(deal.value)}</p>
                          {deal.stage !== 'closed-won' && (
                            <p className="text-sm text-gray-600">{deal.probability}% likely</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {deals.length > 5 && (
                      <button
                        onClick={() => setActiveTab('deals')}
                        className="w-full text-center py-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View all {deals.length} deals →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Deal Timeline</h3>
                    <p className="text-sm text-gray-600">Track all deals and activities for {company.name}</p>
                  </div>
                  <Button
                    onClick={handleCreateDeal}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    New Deal
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {deals.length === 0 ? (
                  <div className="text-center py-12">
                    <ApperIcon name="TrendingUp" size={64} className="text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-medium text-gray-900 mb-2">No deals yet</h4>
                    <p className="text-gray-600 mb-6">Start tracking your sales relationship by creating the first deal with this company.</p>
                    <Button
                      onClick={handleCreateDeal}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Create First Deal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Active Deals */}
                    {deals.filter(deal => deal.stage !== 'closed-won').length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <ApperIcon name="Clock" size={18} className="mr-2 text-orange-500" />
                          Active Deals ({deals.filter(deal => deal.stage !== 'closed-won').length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {deals
                            .filter(deal => deal.stage !== 'closed-won')
                            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                            .map((deal, index) => (
                            <motion.div
                              key={deal.Id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <DealCard
                                deal={deal}
                                onEdit={handleEditDeal}
                                onDelete={handleDeleteDeal}
                                onDragStart={() => {}}
                                onDragEnd={() => {}}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Closed Deals */}
                    {deals.filter(deal => deal.stage === 'closed-won').length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <ApperIcon name="CheckCircle" size={18} className="mr-2 text-green-500" />
                          Closed Deals ({deals.filter(deal => deal.stage === 'closed-won').length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {deals
                            .filter(deal => deal.stage === 'closed-won')
                            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                            .map((deal, index) => (
                            <motion.div
                              key={deal.Id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <DealCard
                                deal={deal}
                                onEdit={handleEditDeal}
                                onDelete={handleDeleteDeal}
                                onDragStart={() => {}}
                                onDragEnd={() => {}}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Communication History */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ApperIcon name="MessageSquare" size={18} className="mr-2 text-blue-500" />
                        Communication History
                      </h4>
                      <div className="space-y-3">
                        {deals
                          .filter(deal => deal.notes && deal.notes.trim())
                          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                          .map((deal, index) => (
                          <motion.div
                            key={`${deal.Id}-note`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{deal.title}</span>
                                <Badge className={`text-xs ${
                                  deal.stage === 'closed-won' ? 'bg-green-100 text-green-800' : 
                                  deal.stage === 'negotiation' ? 'bg-orange-100 text-orange-800' :
                                  deal.stage === 'proposal' ? 'bg-blue-100 text-blue-800' :
                                  deal.stage === 'qualified' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1).replace('-', ' ')}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-500">
                                {format(new Date(deal.updatedAt), "MMM dd, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{deal.notes}</p>
                          </motion.div>
                        ))}
                        
                        {deals.filter(deal => deal.notes && deal.notes.trim()).length === 0 && (
                          <div className="text-center py-8">
                            <ApperIcon name="MessageSquare" size={48} className="text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No communication history yet. Add notes to your deals to track conversations.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Associated Contacts</h3>
                    <p className="text-sm text-gray-600">{contacts.length} contacts linked to this company</p>
                  </div>
                  <Button
                    onClick={() => setShowAddContact(!showAddContact)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Contact
                  </Button>
                </div>
              </div>

              {/* Add Contact Section */}
              {showAddContact && unassociatedContacts.length > 0 && (
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Available Contacts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {unassociatedContacts.map(contact => (
                      <div key={contact.Id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-xs text-gray-600">{contact.position || contact.email}</p>
                        </div>
                        <Button
                          onClick={() => handleAssociateContact(contact.Id)}
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6">
                {contacts.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="Users" size={48} className="text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h4>
                    <p className="text-gray-600 mb-4">Start building relationships by adding contacts to this company.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contacts.map((contact, index) => (
                      <motion.div
                        key={contact.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ContactCard
                          contact={contact}
                          onClick={() => navigate(`/contacts`)}
                          onDelete={() => handleRemoveContact(contact.Id)}
                          showCompany={false}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
<CompanyModal
        company={company}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompany}
      />

      <DealModal
        deal={selectedDeal}
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
        onSave={handleSaveDeal}
        preSelectedCompany={company?.name}
        availableContacts={contacts}
      />
    </div>
  );
};

export default CompanyProfile;