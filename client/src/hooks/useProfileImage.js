import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doctorAPI } from '../api/doctorApi';
import { patientAPI } from '../api/patientApi';
import { adminProfileAPI } from '../api/adminApi';
import { receptionistAPI } from '../api/receptionistApi';

/**
 * Custom hook to fetch and manage the current user's profile image
 * @returns {Object} - { profileImage, loading, error, refetch }
 */
export const useProfileImage = () => {
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

    useEffect(() => {
        fetchProfileImage();
    }, [isAuthenticated, user]);

    const refetch = async () => {
        // Add a small delay to ensure server has processed the update
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Refetching profile image...');
        await fetchProfileImage();
    };

    return {
        profileImage,
        loading,
        error,
        refetch
    };
};
