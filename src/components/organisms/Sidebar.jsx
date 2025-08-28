import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: "LayoutDashboard", label: "Dashboard", path: "/" },
    { icon: "Users", label: "Contacts", path: "/contacts" },
    { icon: "Target", label: "Deals", path: "/deals" },
    { icon: "Building2", label: "Companies", path: "/companies" },
    { icon: "BarChart3", label: "Reports", path: "/reports" },
    { icon: "Settings", label: "Settings", path: "/settings" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  // Desktop sidebar (static)
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-gradient-to-b lg:from-blue-800 lg:to-blue-900 lg:shadow-xl">
      <div className="flex items-center justify-center h-16 px-6 border-b border-blue-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={20} className="text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-white">Pipeline Pro</h1>
        </motion.div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-white text-blue-800 shadow-lg"
                  : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r"
                />
              )}
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className={`mr-3 ${isActive ? "text-blue-600" : "text-blue-200 group-hover:text-white"}`} 
              />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );

  // Mobile sidebar (overlay with transform)
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="lg:hidden fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-800 to-blue-900 shadow-xl z-50"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-white">Pipeline Pro</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-blue-200 hover:text-white transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </motion.button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-blue-800 shadow-lg"
                    : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveIndicator"
                    className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r"
                  />
                )}
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className={`mr-3 ${isActive ? "text-blue-600" : "text-blue-200 group-hover:text-white"}`} 
                />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;