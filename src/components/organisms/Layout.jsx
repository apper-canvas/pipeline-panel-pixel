import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="lg:pl-64">
        <main className="min-h-screen">
          <Outlet context={{ onMenuClick: () => setIsSidebarOpen(true) }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;