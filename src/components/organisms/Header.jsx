import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ 
  title, 
  subtitle, 
  onMenuClick, 
  showSearch = false, 
  onSearch,
  searchPlaceholder = "Search...",
  actionButton = null 
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            <ApperIcon name="Menu" size={24} />
          </motion.button>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {showSearch && (
            <SearchBar
              onSearch={onSearch}
              placeholder={searchPlaceholder}
              className="hidden md:block w-80"
            />
          )}
{actionButton && (
            <div className="hidden sm:block">
              {actionButton}
            </div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center cursor-pointer"
          >
            <ApperIcon name="User" size={20} className="text-blue-700" />
          </motion.div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      {showSearch && (
        <div className="md:hidden mt-4">
          <SearchBar
            onSearch={onSearch}
            placeholder={searchPlaceholder}
          />
        </div>
      )}
      
      {/* Mobile action button */}
{actionButton && (
        <div className="sm:hidden mt-4">
          {actionButton}
        </div>
      )}
    </motion.header>
  );
};

export default Header;