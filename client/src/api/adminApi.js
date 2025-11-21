import { apiClient } from './api.js';

// Admin API functions for managing all entities

// Dashboard Statistics
export const getAdminDashboardStats = async () => {
    return apiClient.get('/admin/dashboard/stats');
};

// Doctor Management
export const adminDoctorAPI = {
    // Get all doctors
    getAllDoctors: async () => {
        return apiClient.get('/doctors');
    },

    // Get doctor by ID
    getDoctorById: async (id) => {
        return apiClient.get(`/doctors/${id}`);
    },

    // Create new doctor
    createDoctor: async (doctorData) => {
        return apiClient.post('/doctors', doctorData);
    },

    // Update doctor
    updateDoctor: async (id, doctorData) => {
        return apiClient.put(`/doctors/${id}`, doctorData);
    },

    // Delete doctor
    deleteDoctor: async (id) => {
        return apiClient.delete(`/doctors/${id}`);
    }
};

// Receptionist Management
export const adminReceptionistAPI = {
    // Get all receptionists
    getAllReceptionists: async () => {
        return apiClient.get('/receptionists');
    },

    // Get receptionist by ID
    getReceptionistById: async (id) => {
        return apiClient.get(`/receptionists/${id}`);
    },

    // Create new receptionist
    createReceptionist: async (receptionistData) => {
        return apiClient.post('/receptionists', receptionistData);
    },

    // Update receptionist
    updateReceptionist: async (id, receptionistData) => {
        return apiClient.put(`/receptionists/${id}`, receptionistData);
    },

    // Delete receptionist
    deleteReceptionist: async (id) => {
        return apiClient.delete(`/receptionists/${id}`);
    }
};

// Patient Management
export const adminPatientAPI = {
    // Get all patients
    getAllPatients: async () => {
        return apiClient.get('/patients');
    },

    // Get patient by ID
    getPatientById: async (id) => {
        return apiClient.get(`/patients/${id}`);
    },

    // Create new patient
    createPatient: async (patientData) => {
        return apiClient.post('/patients', patientData);
    },

    // Update patient
    updatePatient: async (id, patientData) => {
        return apiClient.put(`/patients/${id}`, patientData);
    },

    // Delete patient
    deletePatient: async (id) => {
        return apiClient.delete(`/patients/${id}`);
    }
};

// Billing Management
export const adminBillingAPI = {
    // Get all bills
    getAllBills: async () => {
        return apiClient.get('/billing');
    },

    // Get bill by ID
    getBillById: async (id) => {
        return apiClient.get(`/billing/${id}`);
    },

    // Note: Billing stats endpoint not implemented on server

    // Update bill
    updateBill: async (id, billData) => {
        return apiClient.put(`/billing/${id}`, billData);
    },

    // Delete bill
    deleteBill: async (id) => {
        return apiClient.delete(`/billing/${id}`);
    }
};

// User Management (General)
export const adminUserAPI = {
    // Get all users
    getAllUsers: async () => {
        return apiClient.get('/auth');
    },

    // Get user by ID
    getUserById: async (id) => {
        return apiClient.get(`/auth/${id}`);
    },

    // Delete user
    deleteUser: async (id) => {
        return apiClient.delete(`/auth/${id}`);
    }
};

// Appointment Management
export const adminAppointmentAPI = {
    // Get all appointments
    getAllAppointments: async () => {
        return apiClient.get('/appointments');
    },

    // Get appointment by ID
    getAppointmentById: async (id) => {
        return apiClient.get(`/appointments/${id}`);
    },

    // Update appointment
    updateAppointment: async (id, appointmentData) => {
        return apiClient.put(`/appointments/${id}`, appointmentData);
    },

    // Delete appointment
    deleteAppointment: async (id) => {
        return apiClient.delete(`/appointments/${id}`);
    }
};

// Admin Profile Management
export const adminProfileAPI = {
    // Get admin profile
    getProfile: async () => {
        return apiClient.get('/auth/me');
    },

    // Update admin profile
    updateProfile: async (profileData) => {
        return apiClient.put('/auth/me', profileData);
    },

    // Change admin password
    changePassword: async (passwordData) => {
        return apiClient.put('/auth/me', passwordData);
    }
};

// Export all admin APIs
export default {
    getAdminDashboardStats,
    adminDoctorAPI,
    adminReceptionistAPI,
    adminPatientAPI,
    adminBillingAPI,
    adminUserAPI,
    adminAppointmentAPI,
    adminProfileAPI
};
