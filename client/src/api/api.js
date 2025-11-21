import axios from 'axios';

// ============================================================
// URL CONFIGURATION
// ============================================================
// 1. Get the domain from environment variables (Vercel) or use Localhost
const DOMAIN = import.meta.env.VITE_API_URL || 'http://localhost:5050';

// 2. Append '/api' because your Backend app.js defines routes like app.use("/api/auth"...)
// This ensures requests go to https://your-backend.com/api/auth/login
const API_BASE_URL = `${DOMAIN}/api`;

// Create axios instance with default configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors and token expiration
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired) - only for authenticated users
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Only handle 401 for authenticated users, not during login/signup
            const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/signup');

            if (!isAuthEndpoint && authAPI.isAuthenticated()) {
                originalRequest._retry = true;

                // Token refresh not implemented, clear auth data and redirect to signin
                authAPI.clearAuthData();
                // Use window.location for authenticated users to avoid React Router issues
                window.location.href = '/signin';
                return Promise.reject(error);
            }
        }

        // Handle common error cases
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || 'Something went wrong';
            throw new Error(message);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Network error. Please check your connection.');
        } else {
            // Something else happened
            throw new Error(error.message || 'An unexpected error occurred');
        }
    }
);

// Export the axios instance for direct use if needed
export { apiClient };

// Auth API functions
export const authAPI = {
    // Patient signup
    signup: async (userData) => {
        const {
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            password,
            userType,
            gender,
            address,
            emergencyContact,
            medicalHistory
        } = userData;

        // Map form data to API expected format
        const signupData = {
            name: `${firstName} ${lastName}`,
            email,
            password,
            phone,
            dob: dateOfBirth,
            gender: gender, // Now using the actual selected gender
            address: address,
            emergencyContact: emergencyContact,
            medicalHistory: medicalHistory
        };

        return apiClient.post('/auth/signup', signupData);
    },

    // User login
    login: async (credentials) => {
        const { email, password } = credentials;

        return apiClient.post('/auth/login', { email, password });
    },

    // Get current user profile
    getMe: async () => {
        return apiClient.get('/auth/me');
    },

    // Update user profile
    updateMe: async (userData) => {
        return apiClient.put('/auth/me', userData);
    },

    // Logout (client-side only)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Get stored user data
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Store user data and token
    storeAuthData: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    },

    // Clear authentication data
    clearAuthData: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    // Note: Token refresh is not implemented on the server
    // Users will need to re-login when token expires
};

// Note: Doctor-specific API functions have been moved to doctorApi.js

// Export authAPI as default
export default {
    authAPI
};
