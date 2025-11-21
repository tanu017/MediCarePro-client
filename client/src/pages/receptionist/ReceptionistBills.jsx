import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Download,
  Clock,
  Receipt,
  FileText,
  User,
  X,
  Users
} from 'lucide-react';
import { billingAPI } from '../../api/billingApi';
import { receptionistAPI } from '../../api/receptionistApi';
import { BillDetailsModal, SuccessDialog } from '../../components/common';

const ReceptionistBills = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPatient, setFilterPatient] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [billsRes, patientsRes] = await Promise.all([
        billingAPI.getBills(),
        receptionistAPI.getPatients()
      ]);
      
      setBills(billsRes.bills || []);
      setPatients(patientsRes || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (bill) => {
    setSelectedBill(bill);
    setShowDetailsModal(true);
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setSelectedBill(null);
  };

  // Filter bills based on all criteria
  const filteredBills = bills.filter(bill => {
    const matchesStatus = filterStatus === 'all' || bill.paymentStatus === filterStatus;
    
    const matchesPatient = filterPatient === '' || 
      bill.patientId?._id?.toString() === filterPatient;
    
    const matchesDateFrom = filterDateFrom === '' || 
      new Date(bill.createdAt) >= new Date(filterDateFrom);
    
    const matchesDateTo = filterDateTo === '' || 
      new Date(bill.createdAt) <= new Date(filterDateTo + 'T23:59:59');
    
    const matchesSearch = searchTerm === '' || 
      bill.patientId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.appointmentId?.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPatient && matchesDateFrom && matchesDateTo && matchesSearch;
  });

  // Sort bills by date (most recent first)
  const sortedBills = filteredBills.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const getStatusIcon = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (paymentStatus) => {
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

  const formatDate = (dateString) => {
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
      currency: 'INR'
    }).format(amount);
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = bills.filter(bill => bill.paymentStatus === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = bills.filter(bill => bill.paymentStatus === 'paid').reduce((sum, bill) => sum + bill.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading bills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-18 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bills</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
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
      <div className="max-w-7xl mx-auto md:pl-20 px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Billing Management</h1>
              <p className="text-gray-600 mt-1">View and manage all patient bills</p>
            </div>
            <button
              onClick={fetchData}
              className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        {bills.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{bills.length}</div>
                <div className="text-sm text-gray-500">Total Bills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
                <div className="text-sm text-gray-500">Paid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{formatCurrency(totalAmount)}</div>
                <div className="text-sm text-gray-500">Total Amount</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Search */}
            <div className="xl:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient, doctor, or bill ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Patient Filter */}
            <div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterPatient}
                  onChange={(e) => setFilterPatient(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Patients</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.userId?.name || patient.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Date From */}
            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="From Date"
                />
              </div>
            </div>

            {/* Date To */}
            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="To Date"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {sortedBills.length > 0 ? (
            sortedBills.map((bill) => (
              <div 
                key={bill._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-blue-300 cursor-pointer"
                onClick={() => handleCardClick(bill)}
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {bill.patientId?.userId?.name || 'Unknown Patient'}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">Bill #{bill._id.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    {getStatusIcon(bill.paymentStatus)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bill.paymentStatus)}`}>
                      {bill.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Receipt className="h-4 w-4" />
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(bill.amount)}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Created: {formatDate(bill.createdAt)}</span>
                  </div>
                  {bill.appointmentId && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{bill.appointmentId.reason || 'Appointment'}</span>
                    </div>
                  )}
                  {bill.doctorId && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{bill.doctorId.userId?.name || 'Unknown'}</span>
                    </div>
                  )}
                </div>

                {/* Status Message */}
                <div className="pt-4 border-t border-gray-100">
                  {bill.paymentStatus === 'pending' && (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Payment pending</span>
                    </div>
                  )}
                  {bill.paymentStatus === 'paid' && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Payment completed</span>
                    </div>
                  )}
                  {bill.paymentStatus === 'overdue' && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Payment overdue</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterPatient || filterDateFrom || filterDateTo
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No bills have been created yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bill Details Modal */}
      <BillDetailsModal
        isOpen={showDetailsModal}
        onClose={closeModals}
        bill={selectedBill}
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

export default ReceptionistBills;
