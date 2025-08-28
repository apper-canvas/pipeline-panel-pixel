import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import contactService from "@/services/api/contactService";
import { toast } from "react-toastify";

const DealModal = ({ deal, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    contactId: "",
    contactName: "",
    value: "",
    stage: "lead",
    expectedCloseDate: "",
    probability: 50,
    description: "",
    notes: ""
  });

  const [contacts, setContacts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const stages = [
    { id: "lead", name: "Lead" },
    { id: "qualified", name: "Qualified" },
    { id: "proposal", name: "Proposal" },
    { id: "negotiation", name: "Negotiation" },
    { id: "closed-won", name: "Closed Won" }
  ];

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        company: deal.company || "",
        contactId: deal.contactId || "",
        contactName: deal.contactName || "",
        value: deal.value || "",
        stage: deal.stage || "lead",
        expectedCloseDate: deal.expectedCloseDate || "",
        probability: deal.probability || 50,
        description: deal.description || "",
        notes: deal.notes || ""
      });
    } else {
      setFormData({
        title: "",
        company: "",
        contactId: "",
        contactName: "",
        value: "",
        stage: "lead",
        expectedCloseDate: "",
        probability: 50,
        description: "",
        notes: ""
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const loadContacts = async () => {
    try {
      setLoadingContacts(true);
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      toast.error("Failed to load contacts");
    } finally {
      setLoadingContacts(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Contact selection is required";
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0";
    }
    
    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleContactChange = (contactId) => {
    const selectedContact = contacts.find(c => c.Id === parseInt(contactId));
    setFormData(prev => ({
      ...prev,
      contactId: contactId,
      contactName: selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : "",
      company: selectedContact ? (selectedContact.company || prev.company) : prev.company
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: parseInt(formData.contactId),
        probability: parseInt(formData.probability),
        Id: deal?.Id
      };
      
      await onSave(dealData);
      onClose();
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {deal ? "Edit Deal" : "Add New Deal"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Deal Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    error={errors.title}
                    placeholder="Enter deal title"
                  />
                  <Input
                    label="Company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    error={errors.company}
                    placeholder="Enter company name"
                  />
                </div>

                {/* Contact Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  {loadingContacts ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <select
                      value={formData.contactId}
                      onChange={(e) => handleContactChange(e.target.value)}
                      className={`w-full px-4 py-3 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.contactId ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select a contact</option>
                      {contacts.map(contact => (
                        <option key={contact.Id} value={contact.Id}>
                          {contact.firstName} {contact.lastName} - {contact.company}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.contactId && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactId}</p>
                  )}
                </div>

                {/* Value and Stage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Deal Value ($)"
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    error={errors.value}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => handleInputChange("stage", e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {stages.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date and Probability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Expected Close Date"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                    error={errors.expectedCloseDate}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Probability ({formData.probability}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.probability}
                      onChange={(e) => handleInputChange("probability", e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the deal opportunity..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 hover:shadow-sm resize-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Add internal notes about this deal..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 hover:shadow-sm resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    {deal ? "Update Deal" : "Create Deal"}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DealModal;