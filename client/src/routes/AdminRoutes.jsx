import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminDoctors from '../pages/admin/AdminDoctors';
import AdminReceptionists from '../pages/admin/AdminReceptionists';
import AdminPatients from '../pages/admin/AdminPatients';
import AdminBilling from '../pages/admin/AdminBilling';
import AdminProfile from '../pages/admin/AdminProfile';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/doctors" element={<AdminDoctors />} />
      <Route path="/receptionists" element={<AdminReceptionists />} />
      <Route path="/patients" element={<AdminPatients />} />
      <Route path="/billing" element={<AdminBilling />} />
      <Route path="/profile" element={<AdminProfile />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;
