import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, CreditCard, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doctorAPI } from '../api/doctorApi';
import { receptionistAPI } from '../api/receptionistApi';
import { appointmentAPI } from '../api/appointmentApi';
import { billingAPI } from '../api/billingApi';
import AppointmentConfirmationModal from './AppointmentConfirmationModal';

const BookAppointmentModal = ({ 
  isOpen, 
  onClose, 
  onAppointmentBooked, 
  userRole = 'PATIENT' // Default to patient, can be 'RECEPTIONIST'
}) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [consultationFee, setConsultationFee] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Determine if this is for receptionist (can select patients) or patient (uses logged-in user)
  const isReceptionistMode = userRole === 'RECEPTIONIST';

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isReceptionistMode) {
        loadPatientsAndDoctors();
      } else {
        loadDoctors();
      }
      resetForm();
    }
  }, [isOpen, isReceptionistMode]);

  // Load available time slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const resetForm = () => {
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setNotes('');
    setAvailableSlots([]);
    setError('');
    setSuccess('');
    setShowPayment(false);
    setConsultationFee(0);
    setShowConfirmation(false);
    setPatientSearchTerm('');
    setDoctorSearchTerm('');
    setFilteredPatients([]);
    setFilteredDoctors([]);
  };

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAvailableDoctors();
      setDoctors(response.doctors || []);
    } catch (error) {
      setError('Failed to load doctors');
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientsAndDoctors = async () => {
    try {
      setLoading(true);
      const [patientsRes, doctorsRes] = await Promise.all([
        receptionistAPI.getPatients(),
        receptionistAPI.getDoctors()
      ]);
      setPatients(patientsRes || []);
      setDoctors(doctorsRes || []);
    } catch (error) {
      setError('Failed to load patients and doctors');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getDoctorAvailability(selectedDoctor._id, selectedDate);
      if (response.success) {
        setAvailableSlots(response.timeSlots || []);
        setBookedSlots(response.bookedSlots || []);
        setAllSlots(response.allSlots || []);
        setConsultationFee(response.doctor.consultationFee || 0);
        setError('');
      } else {
        setAvailableSlots([]);
        setBookedSlots([]);
        setAllSlots([]);
        setError(response.message || 'No available slots for this date');
      }
    } catch (error) {
      setError('Failed to load available time slots');
      console.error('Error loading time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // Patient search functionality (only for receptionist mode)
  const handlePatientSearch = (searchTerm) => {
    setPatientSearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredPatients([]);
    } else {
      const filtered = patients.filter(patient => {
        const name = patient.userId?.name || patient.name || '';
        const email = patient.userId?.email || patient.email || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredPatients(filtered);
    }
  };

  // Doctor search functionality (only for receptionist mode)
  const handleDoctorSearch = (searchTerm) => {
    setDoctorSearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredDoctors([]);
    } else {
      const filtered = doctors.filter(doctor => {
        const name = doctor.userId?.name || doctor.name || '';
        const specialization = doctor.specialization || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               specialization.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredDoctors(filtered);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearchTerm(patient.userId?.name || patient.name);
    setFilteredPatients([]);
    setError('');
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    if (isReceptionistMode) {
      setDoctorSearchTerm(doctor.userId?.name || doctor.name);
      setFilteredDoctors([]);
    }
    setSelectedDate('');
    setSelectedTime('');
    setAvailableSlots([]);
    setError('');
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setError('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setError('');
  };

  const handleBookAppointment = async () => {
    // Validation based on mode
    if (isReceptionistMode) {
      if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime) {
        setError('Please select patient, doctor, date, and time');
        return;
      }
    } else {
      if (!selectedDoctor || !selectedDate || !selectedTime) {
        setError('Please select doctor, date, and time');
        return;
      }
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the appointment');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Prepare appointment data
      const appointmentData = {
        doctorId: selectedDoctor._id,
        date: selectedDate,
        time: selectedTime,
        reason: reason.trim(),
        notes: notes.trim()
      };

      // Add patientId for receptionist mode
      if (isReceptionistMode) {
        appointmentData.patientId = selectedPatient._id;
      }

      // Book the appointment using appropriate API
      const appointmentResponse = isReceptionistMode 
        ? await receptionistAPI.createAppointment(appointmentData)
        : await appointmentAPI.bookAppointment(appointmentData);
      
      if (appointmentResponse.success) {
        // Create bill for the appointment
        const billData = {
          appointmentId: appointmentResponse.appointment._id,
          doctorId: selectedDoctor._id,
          amount: consultationFee
        };

        // Add patientId for receptionist mode
        if (isReceptionistMode) {
          billData.patientId = selectedPatient._id;
        }

        const billResponse = await billingAPI.createAppointmentBill(billData);
        
        if (billResponse.success) {
          setShowPayment(true);
          setSuccess('Appointment booked successfully! Please proceed with payment.');
        } else {
          setError('Appointment booked but failed to create bill');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulate payment processing
      const paymentData = {
        method: 'card',
        cardNumber: '**** **** **** 1234',
        expiryDate: '12/25',
        cvv: '123',
        nameOnCard: isReceptionistMode 
          ? (selectedPatient?.userId?.name || selectedPatient?.name)
          : user.name
      };

      // In a real application, you would integrate with a payment gateway here
      setShowPayment(false);
      setShowConfirmation(true);
      
    } catch (error) {
      setError('Payment failed. Please try again.');
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = () => {
    // Call the callback to refresh appointments
    if (onAppointmentBooked) {
      onAppointmentBooked();
    }
    
    // Close modal and reset form
    onClose();
    resetForm();
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full max-h-[98vh] sm:max-h-[90vh] overflow-y-auto mx-1 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {!showPayment ? (
            <div className="space-y-6">
              {/* Select Patient - Only for Receptionist Mode */}
              {isReceptionistMode && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Select Patient
                  </h3>
                  
                  {selectedPatient ? (
                    <div className="p-4 border border-blue-500 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {selectedPatient.userId?.name || selectedPatient.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {selectedPatient.userId?.email || selectedPatient.email}
                          </p>
                          {selectedPatient.contactNumber && (
                            <p className="text-sm text-gray-500">
                              {selectedPatient.contactNumber}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPatient(null);
                            setPatientSearchTerm('');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="Search patients by name or email..."
                        value={patientSearchTerm}
                        onChange={(e) => handlePatientSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      
                      {filteredPatients.length > 0 && (
                        <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                          {filteredPatients.map((patient) => (
                            <div
                              key={patient._id}
                              className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => handlePatientSelect(patient)}
                            >
                              <h4 className="font-medium text-gray-900">
                                {patient.userId?.name || patient.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {patient.userId?.email || patient.email}
                              </p>
                              {patient.contactNumber && (
                                <p className="text-sm text-gray-500">
                                  {patient.contactNumber}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {patientSearchTerm && filteredPatients.length === 0 && (
                        <div className="mt-2 text-center py-4 text-gray-500">
                          No patients found matching "{patientSearchTerm}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Select Doctor */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Select Doctor
                </h3>
                
                {isReceptionistMode ? (
                  // Receptionist mode - with search
                  selectedDoctor ? (
                    <div className="p-4 border border-blue-500 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {selectedDoctor.userId?.name || selectedDoctor.name}
                          </h4>
                          <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                          <p className="text-sm text-gray-500">{selectedDoctor.qualification}</p>
                          <p className="text-sm text-gray-500">{selectedDoctor.experienceYears} years experience</p>
                          <p className="text-sm font-medium text-green-600">₹{selectedDoctor.consultationFee}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedDoctor(null);
                            setDoctorSearchTerm('');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="Search doctors by name or specialization..."
                        value={doctorSearchTerm}
                        onChange={(e) => handleDoctorSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      
                      {filteredDoctors.length > 0 && (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {filteredDoctors.map((doctor) => (
                            <div
                              key={doctor._id}
                              className="p-3 sm:p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                              onClick={() => handleDoctorSelect(doctor)}
                            >
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                                {doctor.userId?.name || doctor.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600">{doctor.specialization}</p>
                              <p className="text-xs sm:text-sm text-gray-500">{doctor.qualification}</p>
                              <p className="text-xs sm:text-sm text-gray-500">{doctor.experienceYears} years experience</p>
                              <p className="text-xs sm:text-sm font-medium text-green-600">₹{doctor.consultationFee}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {doctorSearchTerm && filteredDoctors.length === 0 && (
                        <div className="mt-2 text-center py-4 text-gray-500">
                          No doctors found matching "{doctorSearchTerm}"
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  // Patient mode - simple grid
                  loading && doctors.length === 0 ? (
                    <div className="text-center py-4">Loading doctors...</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor._id}
                          className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedDoctor?._id === doctor._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleDoctorSelect(doctor)}
                        >
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">{doctor.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{doctor.specialization}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{doctor.qualification}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{doctor.experienceYears} years experience</p>
                          <p className="text-xs sm:text-sm font-medium text-green-600">₹{doctor.consultationFee}</p>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>

              {/* Select Date */}
              {selectedDoctor && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Select Date
                  </h3>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Select Time */}
              {selectedDate && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Select Time
                  </h3>
                  {loading ? (
                    <div className="text-center py-4">Loading available slots...</div>
                  ) : allSlots.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {allSlots.map((slot) => {
                          const isAvailable = availableSlots.includes(slot);
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = selectedTime === slot;
                          
                          return (
                            <button
                              key={slot}
                              onClick={() => isAvailable ? handleTimeSelect(slot) : null}
                              disabled={!isAvailable}
                              className={`px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded-md transition-colors ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : isAvailable
                                  ? 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
                                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                              title={isBooked ? 'This time slot is already booked' : isAvailable ? 'Click to select this time slot' : 'Not available'}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-gray-600">Available</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                          <span className="text-gray-400">Booked</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-2">No time slots available for this date.</p>
                      <p className="text-sm text-gray-400">The doctor may not be available on this day.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Appointment Details */}
              {selectedTime && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Visit *
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={isReceptionistMode 
                          ? "Please describe the symptoms or reason for the appointment"
                          : "Please describe your symptoms or reason for the appointment"
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional information you'd like to share"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>
                    {reason.trim() && (
                      <button
                        onClick={handleBookAppointment}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Book Appointment
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Payment Section */
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {isReceptionistMode && selectedPatient && (
                    <p><strong>Patient:</strong> {selectedPatient?.userId?.name || selectedPatient?.name}</p>
                  )}
                  <p><strong>Doctor:</strong> {selectedDoctor?.userId?.name || selectedDoctor?.name}</p>
                  <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Consultation Fee:</strong> ₹{consultationFee}</p>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay ₹' + consultationFee}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AppointmentConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmBooking}
        appointmentDetails={{
          selectedDoctor,
          selectedDate,
          selectedTime,
          consultationFee,
          selectedPatient: isReceptionistMode ? selectedPatient : null
        }}
      />
    </div>
  );
};

export default BookAppointmentModal;