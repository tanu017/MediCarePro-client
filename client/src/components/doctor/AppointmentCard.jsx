import React from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AppointmentCard = ({ 
  appointment, 
  onClick, 
  getStatusIcon, 
  getStatusColor, 
  formatDate, 
  formatTime 
}) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-200 ${
        appointment.status === 'booked' 
          ? 'hover:shadow-md hover:border-blue-300 cursor-pointer' 
          : appointment.status === 'completed' || appointment.status === 'cancelled'
          ? 'hover:shadow-md hover:border-gray-300 cursor-pointer'
          : 'cursor-default'
      }`}
      onClick={() => onClick(appointment)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {appointment.patientId?.userId?.name || 'Unknown Patient'}
            </h3>
            <p className="text-sm text-gray-500">{appointment.reason || 'Consultation'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:ml-auto">
          {getStatusIcon(appointment.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
      </div>

      {/* Date and Time */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{formatTime(appointment.date)}</span>
        </div>
      </div>

      {/* Patient Details */}
      <div className="space-y-2 mb-4">
        {appointment.patientId?.userId?.phone && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span className="text-sm">{appointment.patientId.userId.phone}</span>
          </div>
        )}
        {appointment.patientId?.userId?.email && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{appointment.patientId.userId.email}</span>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="pt-4 border-t border-gray-100">
        {appointment.status === 'booked' && (
          <div className="flex items-center space-x-2 text-blue-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Click to prescribe & complete</span>
          </div>
        )}
        {appointment.status === 'completed' && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Click to view details</span>
          </div>
        )}
        {appointment.status === 'cancelled' && (
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Click to view details</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
