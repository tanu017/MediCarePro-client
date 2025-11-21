import { apiClient } from './api.js';

// Billing-specific API functions
export const billingAPI = {
    // Get bills
    getBills: async () => {
        return apiClient.get('/billing');
    },

    // Create bill
    createBill: async (billData) => {
        return apiClient.post('/billing', billData);
    },

    // Update bill status
    updateBillStatus: async (billId, status) => {
        return apiClient.put(`/billing/${billId}`, { status });
    },

    // Create bill for appointment booking
    createAppointmentBill: async (billData) => {
        return apiClient.post('/billing/appointment', billData);
    },

    // Get patient's bills
    getMyBills: async () => {
        return apiClient.get('/billing/patient/my-bills');
    },

    // Pay bill
    payBill: async (billId, paymentData) => {
        return apiClient.post(`/billing/${billId}/pay`, paymentData);
    },

    // Get doctor's bills (bills for doctor's patients)
    getDoctorBills: async () => {
        return apiClient.get('/billing/doctor/my-bills');
    }
};

export default billingAPI;
