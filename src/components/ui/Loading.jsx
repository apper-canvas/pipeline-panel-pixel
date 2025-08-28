import { motion } from "framer-motion";

const Loading = ({ variant = "default" }) => {
  if (variant === "contacts") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0.4, 0.8, 0.4], y: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500 font-medium"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;