import { motion } from "framer-motion";
import DealCard from "./DealCard";
import ApperIcon from "@/components/ApperIcon";

const DealColumn = ({ 
stage, 
  deals, 
  analytics,
  onEditDeal, 
  onDeleteDeal, 
  onDragStart, 
  onDragEnd, 
  onDrop, 
  draggedDeal,
  index 
}) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== stage.id) {
      onDrop(stage.id, draggedDeal);
    }
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 bg-gradient-to-r ${stage.color} rounded-full`} />
            <h3 className="font-semibold text-gray-900">{stage.name}</h3>
            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
              {deals.length}
            </span>
          </div>
        </div>
        
<div className="space-y-1">
          {totalValue > 0 && (
            <div className="text-sm text-gray-600 flex items-center">
              <ApperIcon name="DollarSign" size={14} className="mr-1" />
              <span className="font-medium">{formatCurrency(totalValue)}</span>
            </div>
          )}
          {analytics && (
            <div className="text-xs text-gray-500 flex items-center">
              <ApperIcon name="Clock" size={12} className="mr-1" />
              <span>{analytics.avgDaysInStage} days avg</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {deals.map((deal) => (
          <DealCard
            key={deal.Id}
            deal={deal}
            onEdit={onEditDeal}
            onDelete={onDeleteDeal}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedDeal?.Id === deal.Id}
          />
        ))}
        
        {deals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
              <ApperIcon name="Plus" size={20} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No deals in this stage</p>
            <p className="text-xs text-gray-400 mt-1">Drag deals here to move them</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DealColumn;