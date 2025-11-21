import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import DesktopSidebar from "./DesktopSidebar";
import MobileDrawer from "./MobileDrawer";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const Navigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    handleLogout();
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      <Header 
        isDrawerOpen={isDrawerOpen} 
        setIsDrawerOpen={setIsDrawerOpen} 
      />
      
      <DesktopSidebar onLogoutClick={handleLogoutClick} />
      
      <MobileDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onLogoutClick={handleLogoutClick}
      />
      
      <LogoutConfirmationModal
        isOpen={showLogoutDialog}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
};

export default Navigation;
