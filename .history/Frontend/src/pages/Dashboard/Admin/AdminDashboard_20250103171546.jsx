import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaBookmark,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaList,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UsersManagement from "./UsersManagement";
import BookingsManagement from "./BookingsManagement";
import Statistics from "./Statistics";
import Settings from "./Settings";
import PlacesManagement from "./PlacesManagement";
import DashboardHeader from "../../../components/Admin/DashboardHeader";
import LoadingScreen from "../../../components/Admin/LoadingScreen";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { id: "statistics", label: "Overview", icon: <FaChartBar /> },
    { id: "users", label: "Users", icon: <FaUsers /> },
    { id: "bookings", label: "Bookings", icon: <FaBookmark /> },
    { id: "places", label: "Places", icon: <FaList /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "statistics":
        return <Statistics />;
      case "users":
        return <UsersManagement />;
      case "bookings":
        return <BookingsManagement />;
      case "places":
        return <PlacesManagement />;
      case "settings":
        return <Settings />;
      default:
        return <Statistics />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-20 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <FaTimes className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <FaBars className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {(isMobileMenuOpen || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-800 shadow-lg lg:shadow-none border-r border-gray-200 dark:border-gray-700 transform lg:transform-none ${
                isMobileMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <img src="/logo.png" alt="Trek Kings" className="h-8 w-8" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Admin Dashboard
                      </p>
                    </div>
                  </div>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay for mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={toggleMobileMenu}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:ml-72">
          <DashboardHeader user={user} toggleMobileMenu={toggleMobileMenu} />

          <div className="p-4 md:p-8 mt-16">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto space-y-6"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
