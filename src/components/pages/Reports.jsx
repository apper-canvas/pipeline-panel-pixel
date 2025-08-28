import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  const { onMenuClick } = useOutletContext();

  const reportTypes = [
    {
      title: "Sales Performance",
      description: "Track revenue trends, conversion rates, and deal velocity",
      icon: "TrendingUp",
      color: "from-green-400 to-green-500",
      features: ["Revenue Analytics", "Conversion Tracking", "Deal Velocity"]
    },
    {
      title: "Contact Analytics",
      description: "Analyze contact engagement and relationship strength",
      icon: "Users",
      color: "from-blue-400 to-blue-500",
      features: ["Contact Growth", "Engagement Metrics", "Activity Timeline"]
    },
    {
      title: "Pipeline Insights",
      description: "Visualize deal flow and identify bottlenecks",
      icon: "BarChart3",
      color: "from-purple-400 to-purple-500",
      features: ["Stage Analysis", "Bottleneck Detection", "Forecasting"]
    },
    {
      title: "Team Performance",
      description: "Monitor individual and team productivity metrics",
      icon: "Award",
      color: "from-orange-400 to-orange-500",
      features: ["Individual Stats", "Team Rankings", "Activity Reports"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Reports"
        subtitle="Analytics and insights for your sales performance"
        onMenuClick={onMenuClick}
      />
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-indigo-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="BarChart3" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
                <p className="text-gray-600">Coming soon - Comprehensive reporting suite</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg border border-indigo-200 mb-4">
              <ApperIcon name="Clock" size={20} className="text-indigo-600 mr-2" />
              <span className="text-indigo-800 font-medium">Advanced analytics in development</span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're building powerful analytics tools to help you understand your sales performance, 
              track key metrics, and make data-driven decisions to grow your business.
            </p>
          </div>
        </motion.div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report, index) => (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${report.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <ApperIcon name={report.icon} size={24} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-gray-600 mb-4">{report.description}</p>
                  
                  <div className="space-y-2">
                    {report.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                        <ApperIcon name="Check" size={16} className="text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Coming Soon</span>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Preview Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">What to Expect</h3>
            <p className="text-gray-600">Our reporting suite will include these powerful features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="PieChart" size={28} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Visual Charts</h4>
              <p className="text-sm text-gray-600">Interactive charts and graphs for better insights</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Download" size={28} className="text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Export Data</h4>
              <p className="text-sm text-gray-600">Download reports in various formats</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Calendar" size={28} className="text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Scheduled Reports</h4>
              <p className="text-sm text-gray-600">Automated reporting delivered to your inbox</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;