import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon, 
  gradient = "from-blue-500 to-blue-600",
  isPlaceholder = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
      }}
      className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
        
        {!isPlaceholder && change && (
          <div className={`flex items-center text-sm font-medium ${
            changeType === "positive" ? "text-green-600" : "text-red-600"
          }`}>
            <ApperIcon 
              name={changeType === "positive" ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              className="mr-1" 
            />
            {change}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {isPlaceholder ? (
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-400">Coming Soon</p>
            <p className="text-xs text-gray-500">Feature in development</p>
          </div>
        ) : (
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {value}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;