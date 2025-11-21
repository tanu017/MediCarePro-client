import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Download,
  FileText,
  Stethoscope,
  Heart,
  Activity,
  X
} from 'lucide-react';
import { patientAPI } from '../../api/patientApi';
import { PrescriptionDetailsModal } from '../../components/patient';
import { SuccessDialog } from '../../components/common';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch prescriptions on component mount
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getPrescriptions();
      setPrescriptions(response);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError(err.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setSelectedPrescription(null);
  };

  // Calculate prescription status based on date and duration
  const calculatePrescriptionStatus = (prescription) => {
    const prescriptionDate = new Date(prescription.createdAt);
    const today = new Date();
    
    // Find the maximum duration from all medications
    let maxDurationDays = 0;
    prescription.medications?.forEach(medication => {
      if (medication.duration) {
        // Extract number from duration string (e.g., "7 days" -> 7, "2 weeks" -> 14)
        const durationMatch = medication.duration.match(/(\d+)/);
        if (durationMatch) {
          const duration = parseInt(durationMatch[1]);
          if (medication.duration.toLowerCase().includes('week')) {
            maxDurationDays = Math.max(maxDurationDays, duration * 7);
          } else if (medication.duration.toLowerCase().includes('day')) {
            maxDurationDays = Math.max(maxDurationDays, duration);
          } else {
            // Assume days if no unit specified
            maxDurationDays = Math.max(maxDurationDays, duration);
          }
        }
      }
    });

    if (maxDurationDays === 0) {
      return 'progress'; // Default to progress if no duration specified
    }

    const daysSincePrescription = Math.floor((today - prescriptionDate) / (1000 * 60 * 60 * 24));
    
    if (daysSincePrescription >= maxDurationDays) {
      return 'completed';
    } else {
      return 'progress';
    }
  };

  // Filter prescriptions based on status and search term
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const calculatedStatus = calculatePrescriptionStatus(prescription);
    const matchesStatus = filterStatus === 'all' || calculatedStatus === filterStatus;
    const matchesSearch = searchTerm === '' || 
      prescription.medications?.some(med => med.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      prescription.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Sort prescriptions by date (most recent first)
  const sortedPrescriptions = filteredPrescriptions.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMedicationCount = (prescription) => {
    return prescription.medications?.length || 0;
  };

  const getActivePrescriptions = () => {
    return prescriptions.filter(prescription => calculatePrescriptionStatus(prescription) === 'progress').length;
  };

  const getCompletedPrescriptions = () => {
    return prescriptions.filter(prescription => calculatePrescriptionStatus(prescription) === 'completed').length;
  };

  const getTotalMedications = () => {
    return prescriptions.reduce((total, prescription) => total + getMedicationCount(prescription), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Prescriptions</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPrescriptions}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-7xl mx-auto md:pl-16 px-2 sm:px-4 lg:px-8">
        <div className="py-4 sm:py-6 m-2 sm:m-4 md:pl-16 lg:mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Prescriptions</h1>
                <p className="text-sm sm:text-base text-gray-600">View and manage your medical prescriptions</p>
              </div>
              <button
                onClick={fetchPrescriptions}
                className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          {prescriptions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Prescription Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{prescriptions.length}</div>
                  <div className="text-sm text-gray-500">Total Prescriptions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{getActivePrescriptions()}</div>
                  <div className="text-sm text-gray-500">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{getCompletedPrescriptions()}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{getTotalMedications()}</div>
                  <div className="text-sm text-gray-500">Total Medications</div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by medication name or doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prescriptions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {sortedPrescriptions.length > 0 ? (
              sortedPrescriptions.map((prescription) => (
                <div 
                  key={prescription._id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 transition-all duration-200 hover:shadow-md hover:border-blue-300 cursor-pointer"
                  onClick={() => handleCardClick(prescription)}
                >
                  {/* Header */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {prescription.doctorId?.userId?.name || 'Unknown Doctor'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{getMedicationCount(prescription)} medication(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      {getStatusIcon(calculatePrescriptionStatus(prescription))}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(calculatePrescriptionStatus(prescription))}`}>
                        {calculatePrescriptionStatus(prescription)}
                      </span>
                    </div>
                  </div>

                  {/* Date and Doctor Info */}
                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{formatDate(prescription.createdAt)}</span>
                    </div>
                    {prescription.doctorId?.specialization && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm truncate">{prescription.doctorId.specialization}</span>
                      </div>
                    )}
                    {prescription.appointmentId && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{prescription.appointmentId.reason || 'Appointment'}</span>
                      </div>
                    )}
                  </div>

                  {/* Medications Preview */}
                  <div className="space-y-2 mb-4">
                    {prescription.medications?.slice(0, 2).map((medication, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-600">
                        <Pill className="h-3 w-3" />
                        <span className="text-sm truncate">{medication.name}</span>
                        {medication.dosage && (
                          <span className="text-xs text-gray-500">({medication.dosage})</span>
                        )}
                      </div>
                    ))}
                    {prescription.medications?.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{prescription.medications.length - 2} more medication(s)
                      </div>
                    )}
                  </div>

                  {/* Status Message */}
                  <div className="pt-4 border-t border-gray-100">
                    {prescription.status === 'active' && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Currently active</span>
                      </div>
                    )}
                    {prescription.status === 'completed' && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Treatment completed</span>
                      </div>
                    )}
                    {prescription.status === 'expired' && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Prescription expired</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'You don\'t have any prescriptions yet.'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Prescription Details Modal */}
      <PrescriptionDetailsModal
        isOpen={showDetailsModal}
        onClose={closeModals}
        prescription={selectedPrescription}
        onDownload={() => {
          // In a real app, this would generate a PDF
          setSuccessMessage('Prescription downloaded successfully!');
          setShowSuccessDialog(true);
        }}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        message={successMessage}
      />
    </div>
  );
};

export default PatientPrescriptions;
