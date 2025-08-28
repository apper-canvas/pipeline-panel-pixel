import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const DealCard = ({ 
  deal, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd, 
  isDragging,
  onClick
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return "success";
    if (probability >= 60) return "warning";
    if (probability >= 40) return "primary";
    return "default";
  };

  const isOverdue = new Date(deal.expectedCloseDate) < new Date();

  return (
<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
      }}
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
        isDragging ? "opacity-50 transform rotate-2" : ""
      }`}
      draggable
      onDragStart={() => onDragStart(deal)}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(deal)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">
            {deal.title}
          </h4>
          <p className="text-xs text-gray-600 mt-1">{deal.company}</p>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
onClick={(e) => {
              e.stopPropagation();
              onEdit(deal);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
          >
            <ApperIcon name="Edit2" size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(deal.Id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
          >
            <ApperIcon name="Trash2" size={14} />
          </motion.button>
        </div>
      </div>

<div className="space-y-2">
        <div className="flex items-center text-gray-600 text-xs">
          <ApperIcon name="User" size={12} className="mr-1.5" />
          <span className="truncate">{deal.contactName}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-xs">
          <ApperIcon name="DollarSign" size={12} className="mr-1.5" />
          <span className="font-semibold text-green-600">
            {formatCurrency(deal.value)}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 text-xs">
          <ApperIcon name="Calendar" size={12} className="mr-1.5" />
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            {format(new Date(deal.expectedCloseDate), "MMM dd, yyyy")}
          </span>
          {isOverdue && (
            <Badge variant="destructive" size="sm" className="ml-2 text-xs">
              Overdue
            </Badge>
          )}
        </div>

        {deal.stageChangedAt && (
          <div className="flex items-center text-gray-500 text-xs">
            <ApperIcon name="Clock" size={12} className="mr-1.5" />
            <span>
              In stage {Math.ceil((new Date() - new Date(deal.stageChangedAt)) / (1000 * 60 * 60 * 24))} days
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <Badge 
            variant={getProbabilityColor(deal.probability)} 
            size="sm"
            className="text-xs"
          >
            {deal.probability}% likely
          </Badge>
          
          <div className="flex items-center text-gray-400">
            <ApperIcon name="GripVertical" size={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DealCard;