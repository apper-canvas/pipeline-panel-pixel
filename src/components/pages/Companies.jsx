import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

const Companies = () => {
  const { onMenuClick } = useOutletContext();

  const companyTypes = [
    { name: "Enterprise", count: 25, color: "from-purple-400 to-purple-500", icon: "Building2" },
    { name: "Mid-Market", count: 48, color: "from-blue-400 to-blue-500", icon: "Building" },
    { name: "Small Business", count: 127, color: "from-green-400 to-green-500", icon: "Store" },
    { name: "Startups", count: 89, color: "from-orange-400 to-orange-500", icon: "Zap" }
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Companies"
        subtitle="Manage company profiles and relationships"
        onMenuClick={onMenuClick}
      />
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Building2" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Company Directory</h2>
                <p className="text-gray-600">Coming soon - Comprehensive company management</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {companyTypes.map((type, index) => (
                <motion.div
                  key={type.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                    <ApperIcon name={type.icon} size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-2xl font-bold text-gray-700 mb-1">{type.count}</p>
                  <p className="text-sm text-gray-500">companies</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg border border-purple-200">
                <ApperIcon name="Clock" size={20} className="text-purple-600 mr-2" />
                <span className="text-purple-800 font-medium">Company profiles coming soon</span>
              </div>
              <p className="text-gray-600 mt-3 max-w-md mx-auto">
                Manage detailed company information, track relationships, and organize your business network 
                with comprehensive company profiles and hierarchy mapping.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Preview Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={20} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Mapping</h3>
            </div>
            <p className="text-gray-600">
              Link contacts to companies and visualize organizational relationships.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={20} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Company Insights</h3>
            </div>
            <p className="text-gray-600">
              Track company growth, deal history, and engagement metrics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Globe" size={20} className="text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Industry Analysis</h3>
            </div>
            <p className="text-gray-600">
              Categorize companies by industry and analyze market segments.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Companies;