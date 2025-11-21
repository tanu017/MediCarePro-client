import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const BillDetailsModal = ({ 
  bill, 
  isOpen, 
  onClose, 
  getStatusColor, 
  getStatusIcon,
  showPatientInfo = true,
  showDoctorInfo = true,
  showAppointmentInfo = true,
  showPaymentInfo = true,
  currency = 'INR'
}) => {
  if (!isOpen || !bill) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const defaultGetStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const defaultGetStatusIcon = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const statusColor = getStatusColor || defaultGetStatusColor;
  const statusIcon = getStatusIcon || defaultGetStatusIcon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bill Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Bill Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bill ID</label>
                  <p className="text-sm text-gray-900">{bill.billId || `#${bill._id.slice(-6)}`}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-sm text-gray-900 font-semibold">{formatCurrency(bill.amount || 0)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(bill.paymentStatus)}`}>
                    {statusIcon(bill.paymentStatus)}
                    <span className="ml-1 capitalize">{bill.paymentStatus}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <p className="text-sm text-gray-900">{formatDate(bill.createdAt)}</p>
                </div>
                {bill.dueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <p className="text-sm text-gray-900">{formatDate(bill.dueDate)}</p>
                  </div>
                )}
                {bill.description && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{bill.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Patient Information */}
            {showPatientInfo && bill.patientId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{bill.patientId?.userId?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{bill.patientId?.userId?.email || 'No email'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{bill.patientId?.userId?.phone || bill.patientId?.contactNumber || 'No phone'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Information */}
            {showDoctorInfo && bill.doctorId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    {/* FIX: Added a fallback check, but the main fix is on the backend. */}
                    <p className="text-sm text-gray-900">{bill.doctorId?.userId?.name || bill.doctorId?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <p className="text-sm text-gray-900">{bill.doctorId?.specialization || 'General Medicine'}</p>
                  </div>
                  {bill.doctorId?.department && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <p className="text-sm text-gray-900">{bill.doctorId.department}</p>
                    </div>
                  )}
                  {bill.doctorId?.consultationFee && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                      <p className="text-sm text-gray-900">{formatCurrency(bill.doctorId.consultationFee)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Appointment Information */}
            {showAppointmentInfo && bill.appointmentId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Appointment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="text-sm text-gray-900">{formatDate(bill.appointmentId.date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <p className="text-sm text-gray-900">{bill.appointmentId.time || bill.appointmentId.timeSlot || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                    <p className="text-sm text-gray-900">{bill.appointmentId.reason || 'Consultation'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm text-gray-900 capitalize">{bill.appointmentId.status || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {showPaymentInfo && bill.paymentStatus === 'paid' && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bill.razorpayPaymentId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment ID</label>
                      <p className="text-sm text-gray-900">{bill.razorpayPaymentId}</p>
                    </div>
                  )}
                  {bill.razorpayOrderId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order ID</label>
                      <p className="text-sm text-gray-900">{bill.razorpayOrderId}</p>
                    </div>
                  )}
                  {bill.paidAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Paid Date</label>
                      <p className="text-sm text-gray-900">{formatDate(bill.paidAt)}</p>
                    </div>
                  )}
                  {bill.paymentMethod && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <p className="text-sm text-gray-900">{bill.paymentMethod}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetailsModal;