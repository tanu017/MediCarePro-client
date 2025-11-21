# Routing & Authentication Guide

## Overview
This project uses a modern, centralized routing system with role-based access control. The authentication and routing logic has been consolidated into a few key files for better maintainability.

## Key Files

### 1. `constants/routes.js`
- **Purpose**: Centralized route constants and helper functions
- **Contains**: 
  - All route paths as constants
  - Role-based default route mapping
  - Permission checking utilities

### 2. `auth/AuthGuard.jsx`
- **Purpose**: Unified authentication guard component
- **Features**:
  - Single component handling all auth scenarios
  - Convenience components: `ProtectedRoute`, `PublicRoute`, `RoleRoute`
  - Consistent loading states and error handling
  - Automatic redirects based on user role

### 3. `routes/AppRoutes.jsx`
- **Purpose**: Main routing component that determines which role-based routes to render
- **Features**:
  - Replaces the complex Dashboard.jsx logic
  - Clean separation of concerns
  - Role-based route delegation

### 4. `routes/[Role]Routes.jsx`
- **Purpose**: Individual route components for each role
- **Files**: `PatientRoutes.jsx`, `DoctorRoutes.jsx`, `AdminRoutes.jsx`, `ReceptionistRoutes.jsx`
- **Features**:
  - Clean, focused routing for each role
  - Easy to maintain and extend
  - Consistent structure across all roles

## Usage Examples

### Public Routes (Only accessible when NOT logged in)
```jsx
<Route path="/signin" element={
  <PublicRoute>
    <SignIn />
  </PublicRoute>
} />
```

### Protected Routes (Require authentication)
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <AppRoutes />
  </ProtectedRoute>
} />
```

### Role-Specific Routes
```jsx
<Route path="/admin/*" element={
  <RoleRoute requiredRole="ADMIN">
    <AppRoutes />
  </RoleRoute>
} />
```

### Multiple Role Access
```jsx
<Route path="/shared" element={
  <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
    <SharedComponent />
  </ProtectedRoute>
} />
```

## Route Structure

### Public Routes
- `/` - Home page
- `/home` - Home page (alias)
- `/signin` - Sign in page
- `/signup` - Sign up page

### Protected Routes
- `/dashboard` - General dashboard (redirects to role-specific dashboard)
- `/patient/*` - Patient-specific routes
- `/doctor/*` - Doctor-specific routes
- `/admin/*` - Admin-specific routes
- `/receptionist/*` - Receptionist-specific routes

### Role-Specific Sub-routes
Each role has its own set of sub-routes:
- `/dashboard` - Main dashboard for the role
- `/appointments` - Appointments management
- `/profile` - User profile
- Role-specific additional routes (bills, patients, etc.)

## Best Practices

1. **Use Route Constants**: Always use constants from `routes.js` instead of hardcoded strings
2. **Consistent Guards**: Use the appropriate guard component for each route type
3. **Role Separation**: Keep role-specific logic in their respective route files
4. **Error Handling**: The system automatically handles loading states and access denied scenarios
5. **Extensibility**: Adding new routes is as simple as updating the appropriate route file

## Migration from Old System

The old system had multiple auth files with duplicated logic:
- ❌ `RequireAuth.jsx`
- ❌ `PublicGuard.jsx` 
- ❌ `RoleGuard.jsx`
- ❌ `DefaultRedirect.jsx`
- ❌ `ProtectedRoute.jsx`
- ❌ `PublicRoute.jsx`
- ❌ `Dashboard.jsx` (complex routing logic)

The new system consolidates everything into:
- ✅ `AuthGuard.jsx` (unified auth logic)
- ✅ `AppRoutes.jsx` (main routing logic)
- ✅ `[Role]Routes.jsx` (role-specific routes)
- ✅ `routes.js` (constants and utilities)

This results in:
- **Fewer files** to maintain
- **Less duplication** of code
- **Better separation** of concerns
- **Easier testing** and debugging
- **More consistent** user experience