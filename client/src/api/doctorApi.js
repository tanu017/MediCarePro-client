import { apiClient } from './api.js';

// Doctor-specific API functions
export const doctorAPI = {
    // Get doctor profile
    getProfile: async () => {
        return apiClient.get('/doctors/profile/me');
    },

    // Update doctor profile
    updateProfile: async (profileData) => {
        return apiClient.put('/doctors/profile/me', profileData);
    },

    // Change password
    changePassword: async (passwordData) => {
        return apiClient.put('/doctors/change-password', passwordData);
    },

    // Get doctor's appointments
    getAppointments: async () => {
        const response = await apiClient.get('/doctors/appointments/me');
        return response.appointments || [];
    },

    // Get doctor dashboard statistics
    getDashboardStats: async () => {
        return apiClient.get('/doctors/dashboard/stats');
    },

    // Update appointment status
    updateAppointment: async (appointmentId, status) => {
        return apiClient.put(`/doctors/appointments/${appointmentId}`, { status });
    },

    // Create prescription
    createPrescription: async (prescriptionData) => {
        return apiClient.post('/prescriptions', prescriptionData);
    },

    // Get today's appointments
    getTodayAppointments: async () => {
        const response = await apiClient.get('/doctors/appointments/me');
        const appointments = response.appointments || [];
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        return appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= startOfDay && appointmentDate < endOfDay;
        });
    },

    // Get upcoming appointments (next 7 days)
    getUpcomingAppointments: async () => {
        const response = await apiClient.get('/doctors/appointments/me');
        const appointments = response.appointments || [];
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        return appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= today && appointmentDate <= nextWeek;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    // Get available doctors for booking (for patients)
    getAvailableDoctors: async () => {
        return apiClient.get('/doctors/available');
    }
};

export default doctorAPI;
