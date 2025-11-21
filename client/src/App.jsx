import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileImageProvider } from './contexts/ProfileImageContext';
import Navigation from './components/Navigation';
import ConditionalFooter from './components/ConditionalFooter';
import { ProtectedRoute, PublicRoute, RoleRoute, DefaultRedirect } from './auth/AuthGuard';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <ProfileImageProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white">
            <Navigation />
          
          <main className="flex-grow">
            <Routes>
              {/* Public routes - only accessible when NOT logged in */}
              <Route path="/" element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              } />
              <Route path="/home" element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              } />
              <Route path="/signin" element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              } />
              
              {/* General dashboard route - redirects to role-specific dashboard */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppRoutes />
                </ProtectedRoute>
              } />
              
              {/* Role-specific routes with strict role guards */}
              <Route path="/patient/*" element={
                <RoleRoute requiredRole="PATIENT">
                  <AppRoutes />
                </RoleRoute>
              } />
              <Route path="/doctor/*" element={
                <RoleRoute requiredRole="DOCTOR">
                  <AppRoutes />
                </RoleRoute>
              } />
              <Route path="/admin/*" element={
                <RoleRoute requiredRole="ADMIN">
                  <AppRoutes />
                </RoleRoute>
              } />
              <Route path="/receptionist/*" element={
                <RoleRoute requiredRole="RECEPTIONIST">
                  <AppRoutes />
                </RoleRoute>
              } />
              
              {/* Catch all route - redirect based on authentication status */}
              <Route path="*" element={<DefaultRedirect />} />
            </Routes>
          </main>
          
            <ConditionalFooter />
          </div>
        </Router>
      </ProfileImageProvider>
    </AuthProvider>
  );
}

export default App;
