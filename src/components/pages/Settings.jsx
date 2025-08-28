import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  const { onMenuClick } = useOutletContext();

  const settingsSections = [
    {
      title: "Profile Settings",
      description: "Manage your personal information and preferences",
      icon: "User",
      color: "from-blue-400 to-blue-500",
      options: ["Personal Information", "Email Preferences", "Password & Security"]
    },
    {
      title: "Team Management",
      description: "Add team members and manage permissions",
      icon: "Users",
      color: "from-green-400 to-green-500",
      options: ["Team Members", "Roles & Permissions", "Access Control"]
    },
    {
      title: "Pipeline Configuration",
      description: "Customize your sales pipeline and deal stages",
      icon: "Settings",
      color: "from-purple-400 to-purple-500",
      options: ["Deal Stages", "Custom Fields", "Automation Rules"]
    },
    {
      title: "Integrations",
      description: "Connect with your favorite tools and services",
      icon: "Link",
      color: "from-orange-400 to-orange-500",
      options: ["Email Integration", "Calendar Sync", "Third-party Apps"]
    },
    {
      title: "Notifications",
      description: "Control how and when you receive updates",
      icon: "Bell",
      color: "from-red-400 to-red-500",
      options: ["Email Notifications", "Push Notifications", "Activity Alerts"]
    },
    {
      title: "Data & Privacy",
      description: "Manage your data preferences and privacy settings",
      icon: "Shield",
      color: "from-indigo-400 to-indigo-500",
      options: ["Data Export", "Privacy Settings", "Account Deletion"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Settings"
        subtitle="Configure your CRM preferences and account settings"
        onMenuClick={onMenuClick}
      />
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Settings" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Configuration Panel</h2>
                <p className="text-gray-600">Coming soon - Comprehensive settings management</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg border border-slate-200 mb-4">
              <ApperIcon name="Clock" size={20} className="text-slate-600 mr-2" />
              <span className="text-slate-800 font-medium">Settings panel in development</span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're building a comprehensive settings panel where you'll be able to customize every aspect 
              of your CRM experience, manage team permissions, and configure integrations.
            </p>
          </div>
        </motion.div>

        {/* Settings Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center shadow-md`}>
                  <ApperIcon name={section.icon} size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">{section.description}</p>
              
              <div className="space-y-2">
                {section.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center text-sm text-gray-500">
                    <ApperIcon name="Circle" size={12} className="text-gray-300 mr-2" />
                    {option}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Coming Soon</span>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Download" size={16} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Export Data</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="RefreshCw" size={16} className="text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Sync Data</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="HelpCircle" size={16} className="text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Get Help</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;