import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';
import DoctorProfile from '../pages/doctor/DoctorProfile';
import DoctorBilling from '../pages/doctor/DoctorBilling';

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DoctorDashboard />} />
      <Route path="/appointments" element={<DoctorAppointments />} />
      <Route path="/billing" element={<DoctorBilling />} />
      <Route path="/profile" element={<DoctorProfile />} />
      <Route path="*" element={<DoctorDashboard />} />
    </Routes>
  );
};

export default DoctorRoutes;
