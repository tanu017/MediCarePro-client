import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doctorAPI } from '../api/doctorApi';
import { patientAPI } from '../api/patientApi';
import { adminProfileAPI } from '../api/adminApi';
import { receptionistAPI } from '../api/receptionistApi';

const ProfileImageContext = createContext();

export const useProfileImageContext = () => {
  const context = useContext(ProfileImageContext);
  if (!context) {
    throw new Error('useProfileImageContext must be used within a ProfileImageProvider');
  }
  return context;
};

export const ProfileImageProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfileImage = async () => {
    if (!isAuthenticated || !user) {
      setProfileImage(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;
      switch (user.role) {
        case 'DOCTOR':
          response = await doctorAPI.getProfile();
          setProfileImage(response.doctor?.profileImage || response.profileImage);
          break;
        case 'PATIENT':
          response = await patientAPI.getProfile();
          console.log('Patient profile response:', response);
          const patientImage = response.patient?.profileImage || response.profileImage;
          console.log('Patient profile image:', patientImage);
          setProfileImage(patientImage);
          break;
        case 'ADMIN':
          response = await adminProfileAPI.getProfile();
          setProfileImage(response.user?.profileImage || response.profileImage);
          break;
        case 'RECEPTIONIST':
          response = await receptionistAPI.getProfile();
          setProfileImage(response.profileImage);
          break;
        default:
          setProfileImage(null);
      }
    } catch (err) {
      console.error('Error fetching profile image:', err);
      setError(err.message || 'Failed to fetch profile image');
      setProfileImage(null);
    } finally {
      setLoading(false);
    }
  };

  const refetchProfileImage = async () => {
    // Add a small delay to ensure server has processed the update
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Refetching profile image...');
    await fetchProfileImage();
  };

  useEffect(() => {
    fetchProfileImage();
  }, [isAuthenticated, user]);

  const value = {
    profileImage,
    loading,
    error,
    refetchProfileImage
  };

  return (
    <ProfileImageContext.Provider value={value}>
      {children}
    </ProfileImageContext.Provider>
  );
};
