import { apiClient } from './api.js';

// Appointment-specific API functions
export const appointmentAPI = {
    // Book appointment (for patients)
    bookAppointment: async (appointmentData) => {
        return apiClient.post('/appointments/book', appointmentData);
    },

    // Get patient's appointments
    getMyAppointments: async () => {
        return apiClient.get('/appointments/patient/my-appointments');
    },

    // Get doctor availability for a specific date
    getDoctorAvailability: async (doctorId, date) => {
        return apiClient.get(`/appointments/availability/${doctorId}/${date}`);
    },

    // Cancel appointment
    cancelAppointment: async (appointmentId, reason) => {
        return apiClient.put(`/appointments/${appointmentId}/cancel`, { reason });
    },

    // Get appointment by ID
    getAppointmentById: async (appointmentId) => {
        return apiClient.get(`/appointments/${appointmentId}`);
    }
};

export default appointmentAPI;
