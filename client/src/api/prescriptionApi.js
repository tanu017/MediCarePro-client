import { apiClient } from './api.js';

// Prescription-specific API functions
export const prescriptionAPI = {
    // Get prescriptions
    getPrescriptions: async () => {
        return apiClient.get('/prescriptions');
    },

    // Create prescription
    createPrescription: async (prescriptionData) => {
        return apiClient.post('/prescriptions', prescriptionData);
    },

    // Update prescription
    updatePrescription: async (prescriptionId, prescriptionData) => {
        return apiClient.put(`/prescriptions/${prescriptionId}`, prescriptionData);
    },

    // Get patient's prescriptions
    getMyPrescriptions: async () => {
        return apiClient.get('/prescriptions/patient/my-prescriptions');
    }
};

export default prescriptionAPI;
