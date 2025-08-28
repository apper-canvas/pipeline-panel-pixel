import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ContactCard from "@/components/molecules/ContactCard";
import CompanyModal from "@/components/organisms/CompanyModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import companyService from "@/services/api/companyService";
import contactService from "@/services/api/contactService";
import { toast } from "react-toastify";

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onMenuClick } = useOutletContext();
  const [company, setCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    loadCompanyData();
    loadAllContacts();
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
    <Button
      onClick={handleEditCompany}
      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
    >
      <ApperIcon name="Edit2" size={16} className="mr-2" />
      Edit Company
    </Button>
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

      <div className="p-6">
        {/* Company Overview */}
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
              </div>
            </div>
          </motion.div>

          {/* Associated Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
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
        </div>
      </div>

      <CompanyModal
        company={company}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompany}
      />
    </div>
  );
};

export default CompanyProfile;