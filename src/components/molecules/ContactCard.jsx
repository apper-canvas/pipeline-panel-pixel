import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const ContactCard = ({ contact, onClick, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
      }}
      className="bg-white rounded-xl border border-gray-100 p-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg"
      onClick={() => onClick(contact)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <span className="text-blue-700 font-semibold text-lg">
              {contact.firstName?.charAt(0)?.toUpperCase() || "?"}
              {contact.lastName?.charAt(0)?.toUpperCase() || ""}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-gray-600 text-sm">{contact.position}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contact);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="Edit2" size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contact.Id);
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="Trash2" size={16} />
          </motion.button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600 text-sm">
          <ApperIcon name="Building2" size={16} className="mr-2" />
          <span>{contact.company || "No company"}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <ApperIcon name="Mail" size={16} className="mr-2" />
          <span className="truncate">{contact.email}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <ApperIcon name="Phone" size={16} className="mr-2" />
          <span>{contact.phone || "No phone"}</span>
        </div>
      </div>
      
      {contact.tags && contact.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="primary" size="sm">
              {tag}
            </Badge>
          ))}
          {contact.tags.length > 3 && (
            <Badge variant="default" size="sm">
              +{contact.tags.length - 3} more
            </Badge>
          )}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Added {format(new Date(contact.createdAt), "MMM dd, yyyy")}</span>
          <Badge 
            variant={contact.status === "active" ? "success" : "default"} 
            size="sm"
          >
            {contact.status}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;