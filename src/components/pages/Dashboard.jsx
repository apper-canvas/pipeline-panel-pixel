import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import { format } from "date-fns";

const Dashboard = () => {
const { onMenuClick } = useOutletContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [dealAnalytics, setDealAnalytics] = useState(null);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const loadDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [contacts, analytics] = await Promise.all([
        contactService.getAll(),
        dealService.getAnalytics()
      ]);
      
      const totalContacts = contacts.length;
      const activeContacts = contacts.filter(c => c.status === "active").length;
      
      // Get recent contacts (last 5)
      const recent = contacts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setDashboardData({
        totalContacts,
        activeContacts,
        recentContactsCount: recent.length
      });
      
      setDealAnalytics(analytics);
      setRecentContacts(recent);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with your contacts."
          onMenuClick={onMenuClick}
        />
        <div className="p-6">
          <Loading variant="dashboard" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          title="Dashboard"
          onMenuClick={onMenuClick}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your contacts."
        onMenuClick={onMenuClick}
      />
      
      <div className="p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Contacts"
            value={dashboardData?.totalContacts || 0}
            icon="Users"
            gradient="from-blue-500 to-blue-600"
            change="+12%"
            changeType="positive"
          />
<MetricCard
            title="Active Deals"
            value={dealAnalytics?.totalDeals || 0}
            icon="Target"
            gradient="from-green-500 to-green-600"
            change={dealAnalytics?.dealChange}
            changeType={dealAnalytics?.dealChange?.startsWith('+') ? "positive" : "negative"}
          />
          <MetricCard
            title="Pipeline Value"
            value={dealAnalytics?.totalPipelineValue || "$0"}
            icon="DollarSign"
            gradient="from-purple-500 to-purple-600"
            change={dealAnalytics?.valueChange}
            changeType={dealAnalytics?.valueChange?.startsWith('+') ? "positive" : "negative"}
          />
          <MetricCard
            title="Avg. Cycle Time"
            value={dealAnalytics ? `${dealAnalytics.avgDaysInPipeline} days` : "0 days"}
            icon="Clock"
            gradient="from-orange-500 to-orange-600"
            change={dealAnalytics?.cycleTimeChange}
            changeType={dealAnalytics?.cycleTimeChange?.startsWith('-') ? "positive" : "negative"}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Contacts</h3>
                <ApperIcon name="Users" size={20} className="text-gray-400" />
              </div>
            </div>
            
            <div className="p-6">
              {recentContacts.length > 0 ? (
                <div className="space-y-4">
                  {recentContacts.map((contact, index) => (
                    <motion.div
                      key={contact.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-medium text-sm">
                          {contact.firstName?.charAt(0)?.toUpperCase()}
                          {contact.lastName?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{contact.company}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(contact.createdAt), "MMM dd")}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Users" size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No contacts yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <ApperIcon name="Zap" size={20} className="text-gray-400" />
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px -8px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="UserPlus" size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Add New Contact</p>
                  <p className="text-sm text-gray-600">Create a new contact entry</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px -8px rgba(16, 185, 129, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="Target" size={20} className="text-white" />
                </div>
<div className="text-left">
                  <p className="font-medium text-gray-900">Create New Deal</p>
                  <p className="text-sm text-gray-600">Track sales opportunities</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px -8px rgba(168, 85, 247, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="BarChart3" size={20} className="text-white" />
                </div>
<div className="text-left">
                  <p className="font-medium text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-600">Analyze sales performance</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;