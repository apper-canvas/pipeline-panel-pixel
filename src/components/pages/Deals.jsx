import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

const Deals = () => {
  const { onMenuClick } = useOutletContext();

  const pipelineStages = [
    { name: "Prospecting", count: 12, color: "from-blue-400 to-blue-500" },
    { name: "Qualification", count: 8, color: "from-yellow-400 to-yellow-500" },
    { name: "Proposal", count: 5, color: "from-orange-400 to-orange-500" },
    { name: "Negotiation", count: 3, color: "from-red-400 to-red-500" },
    { name: "Closed Won", count: 15, color: "from-green-400 to-green-500" }
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Deals"
        subtitle="Track your sales pipeline and opportunities"
        onMenuClick={onMenuClick}
      />
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Target" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
                <p className="text-gray-600">Coming soon - Visual deal tracking</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {pipelineStages.map((stage, index) => (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${stage.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                    <span className="text-white font-semibold text-sm">{stage.count}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{stage.name}</h3>
                  <p className="text-sm text-gray-500">{stage.count} deals</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-blue-200">
                <ApperIcon name="Clock" size={20} className="text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">Pipeline visualization coming soon</span>
              </div>
              <p className="text-gray-600 mt-3 max-w-md mx-auto">
                We're building a powerful kanban board to help you visualize and manage your sales pipeline. 
                Track deals through each stage and never miss an opportunity.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" size={20} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Tracking</h3>
            </div>
            <p className="text-gray-600">
              Monitor deal values and revenue forecasts across your pipeline stages.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={20} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
            </div>
            <p className="text-gray-600">
              Track interactions, calls, meetings, and follow-ups for each deal.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Deals;