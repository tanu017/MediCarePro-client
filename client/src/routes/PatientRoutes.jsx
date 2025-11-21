import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientAppointments from '../pages/patient/PatientAppointments';
import PatientBills from '../pages/patient/PatientBills';
import PatientPrescriptions from '../pages/patient/PatientPrescriptions';
import PatientProfile from '../pages/patient/PatientProfile';

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<PatientDashboard />} />
      <Route path="/appointments" element={<PatientAppointments />} />
      <Route path="/bills" element={<PatientBills />} />
      <Route path="/billing" element={<PatientBills />} />
      <Route path="/prescriptions" element={<PatientPrescriptions />} />
      <Route path="/profile" element={<PatientProfile />} />
      <Route path="*" element={<PatientDashboard />} />
    </Routes>
  );
};

export default PatientRoutes;
