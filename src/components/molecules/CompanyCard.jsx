import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const CompanyCard = ({ company, onClick, onEdit, onDelete }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onClick && onClick(company)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <ApperIcon name={getIndustryIcon(company.industry)} size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">{company.name}</h3>
            <p className="text-sm text-gray-600">{company.industry}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(company);
            }}
            className="w-8 h-8 bg-gray-100 hover:bg-blue-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(company.Id);
            }}
            className="w-8 h-8 bg-gray-100 hover:bg-red-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600 text-sm">
          <ApperIcon name="Users" size={16} className="mr-2" />
          <span>{company.employees} employees</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <ApperIcon name="MapPin" size={16} className="mr-2" />
          <span className="truncate">{company.address}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <ApperIcon name="Globe" size={16} className="mr-2" />
          <span className="truncate">{company.website}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <Badge className={getSizeColor(company.size)}>
          {company.size}
        </Badge>
        
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Users2" size={16} className="mr-1" />
          <span>{company.contacts?.length || 0} contacts</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyCard;