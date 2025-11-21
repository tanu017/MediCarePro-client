import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReceptionistDashboard from '../pages/receptionist/ReceptionistDashboard';
import ReceptionistPatients from '../pages/receptionist/ReceptionistPatients';
import ReceptionistAppointments from '../pages/receptionist/ReceptionistAppointments';
import ReceptionistBills from '../pages/receptionist/ReceptionistBills';
import ReceptionistProfile from '../pages/receptionist/ReceptionistProfile';

const ReceptionistRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ReceptionistDashboard />} />
      <Route path="/patients" element={<ReceptionistPatients />} />
      <Route path="/appointments" element={<ReceptionistAppointments />} />
      <Route path="/bills" element={<ReceptionistBills />} />
      <Route path="/billing" element={<ReceptionistBills />} />
      <Route path="/profile" element={<ReceptionistProfile />} />
      <Route path="*" element={<ReceptionistDashboard />} />
    </Routes>
  );
};

export default ReceptionistRoutes;
