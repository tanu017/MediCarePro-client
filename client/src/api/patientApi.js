import { apiClient } from './api.js';

// Patient-specific API functions
export const patientAPI = {
    // Get patient profile
    getProfile: async () => {
        return apiClient.get('/patients/profile/me');
    },

    // Update patient profile
    updateProfile: async (profileData) => {
        return apiClient.put('/patients/profile/me', profileData);
    },

    // Change password
    changePassword: async (passwordData) => {
        return apiClient.put('/patients/change-password', passwordData);
    },

    // Get patient's appointments
    getAppointments: async () => {
        const response = await apiClient.get('/patients/appointments/me');
        return response.appointments || [];
    },

    // Book new appointment
    bookAppointment: async (appointmentData) => {
        return apiClient.post('/appointments/book', appointmentData);
    },

    // Cancel appointment
    cancelAppointment: async (appointmentId) => {
        return apiClient.put(`/appointments/${appointmentId}/cancel`);
    },

    // Get patient dashboard statistics
    getDashboardStats: async () => {
        return apiClient.get('/patients/dashboard/stats');
    },

    // Get patient's prescriptions
    getPrescriptions: async () => {
        const response = await apiClient.get('/patients/prescriptions/me');
        return response.prescriptions || [];
    },

    // Get patient's bills
    getBills: async () => {
        const response = await apiClient.get('/patients/bills/me');
        return response.bills || [];
    },

    // Pay bill
    payBill: async (billId, paymentData) => {
        return apiClient.post(`/billing/${billId}/pay`, paymentData);
    },

    // Get upcoming appointments (next 7 days)
    getUpcomingAppointments: async () => {
        const response = await apiClient.get('/patients/appointments/me');
        const appointments = response.appointments || [];
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        return appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= today && appointmentDate <= nextWeek && appointment.status === 'booked';
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    // Get recent prescriptions (last 30 days)
    getRecentPrescriptions: async () => {
        const response = await apiClient.get('/patients/prescriptions/me');
        const prescriptions = response.prescriptions || [];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return prescriptions.filter(prescription => {
            const prescriptionDate = new Date(prescription.createdAt);
            return prescriptionDate >= thirtyDaysAgo;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Get pending bills
    getPendingBills: async () => {
        const response = await apiClient.get('/patients/bills/me');
        const bills = response.bills || [];
        return bills.filter(bill => bill.status === 'pending');
    }
};

export default patientAPI;
