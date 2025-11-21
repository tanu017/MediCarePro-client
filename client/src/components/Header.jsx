import React from "react";
import { Activity, Menu, X, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Check current path
  const isOnSignIn = location.pathname === "/signin";
  const isOnSignUp = location.pathname === "/signup";

  // Decide button text and target
  const authButton = isOnSignIn
    ? { text: "Sign Up", to: "/signup" }
    : { text: "Sign In", to: "/signin" };

  return (
    <header className="shadow-sm backdrop-blur-xl bg-gradient-to-r from-blue-600/90 to-blue-800/90 border-b border-white/20 fixed top-0 w-full z-50">
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center md:h-18 h-16 p-3">
          {/* Left side - Logo and Menu Button */}
          <div className="flex items-center">
            {isAuthenticated && (
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="md:hidden p-1.5 sm:p-2 rounded-md text-white hover:text-gray-200 hover:bg-white/20 mr-2"
              >
                {isDrawerOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            )}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <Link to="/" className="text-md md:text-xl font-bold text-gray-50">MediCarePro</Link>
                {!isAuthenticated && (
                  <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">Healthcare Dashboard</p>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Auth Button or User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isAuthenticated ? (
              <Link
                to={authButton.to}
                className="bg-white text-xs md:text-md text-blue-700 px-3 md:px-6 py-3 m-2 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                {authButton.text}
              </Link>
            ) : (
              <>
                <button className="p-1.5 sm:p-2 text-white hover:text-gray-500 relative">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;