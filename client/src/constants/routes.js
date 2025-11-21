// Route constants for better maintainability
export const ROUTES = {
    // Public routes
    HOME: '/',
    SIGN_IN: '/signin',
    SIGN_UP: '/signup',

    // General dashboard
    DASHBOARD: '/dashboard',

    // Role-based routes
    PATIENT: {
        DASHBOARD: '/patient/dashboard',
        APPOINTMENTS: '/patient/appointments',
        BILLS: '/patient/bills',
        PRESCRIPTIONS: '/patient/prescriptions',
        PROFILE: '/patient/profile',
    },

    DOCTOR: {
        DASHBOARD: '/doctor/dashboard',
        APPOINTMENTS: '/doctor/appointments',
        PROFILE: '/doctor/profile',
    },

    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        DOCTORS: '/admin/doctors',
        RECEPTIONISTS: '/admin/receptionists',
        PATIENTS: '/admin/patients',
        BILLING: '/admin/billing',
        PROFILE: '/admin/profile',
    },

    RECEPTIONIST: {
        DASHBOARD: '/receptionist/dashboard',
        PATIENTS: '/receptionist/patients',
        APPOINTMENTS: '/receptionist/appointments',
        BILLS: '/receptionist/bills',
        PROFILE: '/receptionist/profile',
    },
};

// Role-based default routes
export const getDefaultRouteForRole = (role) => {
    switch (role) {
        case 'PATIENT':
            return ROUTES.PATIENT.DASHBOARD;
        case 'DOCTOR':
            return ROUTES.DOCTOR.DASHBOARD;
        case 'ADMIN':
            return ROUTES.ADMIN.DASHBOARD;
        case 'RECEPTIONIST':
            return ROUTES.RECEPTIONIST.DASHBOARD;
        default:
            return ROUTES.SIGN_IN;
    }
};

// Role hierarchy for permission checking
export const ROLE_HIERARCHY = {
    ADMIN: 4,
    DOCTOR: 3,
    RECEPTIONIST: 2,
    PATIENT: 1,
};

export const hasPermission = (userRole, requiredRole) => {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
