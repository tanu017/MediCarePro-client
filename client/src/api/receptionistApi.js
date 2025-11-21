import { apiClient } from './api.js';

// Receptionist-specific API functions
export const receptionistAPI = {
    // Patient Management
    // Get all patients
    getPatients: async () => {
        const response = await apiClient.get('/patients');
        return response.patients || [];
    },

    // Get patient by ID
    getPatientById: async (patientId) => {
        return apiClient.get(`/patients/${patientId}`);
    },

    // Create new patient
    createPatient: async (patientData) => {
        return apiClient.post('/patients', patientData);
    },

    // Update patient
    updatePatient: async (patientId, patientData) => {
        return apiClient.put(`/patients/${patientId}`, patientData);
    },

    // Appointment Management
    // Get all appointments
    getAppointments: async () => {
        const response = await apiClient.get('/appointments');
        return response.appointments || [];
    },

    // Get appointment by ID
    getAppointmentById: async (appointmentId) => {
        return apiClient.get(`/appointments/${appointmentId}`);
    },

    // Create appointment
    createAppointment: async (appointmentData) => {
        return apiClient.post('/appointments', appointmentData);
    },

    // Update appointment
    updateAppointment: async (appointmentId, appointmentData) => {
        return apiClient.put(`/appointments/${appointmentId}`, appointmentData);
    },

    // Cancel appointment (receptionist can cancel but not confirm)
    cancelAppointment: async (appointmentId, reason) => {
        return apiClient.put(`/appointments/${appointmentId}/cancel`, { reason });
    },

    // Get doctors for appointment booking
    getDoctors: async () => {
        const response = await apiClient.get('/doctors');
        return response.doctors || [];
    },

    // Receptionist Profile Management
    // Get receptionist profile
    getProfile: async () => {
        return apiClient.get('/receptionists/profile');
    },

    // Update receptionist profile
    updateProfile: async (profileData) => {
        return apiClient.put('/receptionists/profile', profileData);
    },

    // Change password
    changePassword: async (passwordData) => {
        return apiClient.put('/receptionists/change-password', passwordData);
    }
};

export default receptionistAPI;
