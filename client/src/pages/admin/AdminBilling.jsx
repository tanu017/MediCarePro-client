import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  CreditCard,
  Receipt,
  TrendingUp,
  TrendingDown,
  Filter,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { adminBillingAPI } from '../../api/adminApi';
import {
  PageHeader,
  SearchBar,
  BillingStatsCard,
  EmptyState
} from '../../components/admin';
import { BillDetailsModal, ErrorDisplay, LoadingSpinner } from '../../components/common';

const AdminBilling = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billingStats, setBillingStats] = useState({
    totalRevenue: 0,
    paidRevenue: 0,
    pendingRevenue: 0,
    totalBills: 0,
    paidBills: 0,
    pendingBills: 0
  });

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    let filtered = bills;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.patientId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.billId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bill => bill.paymentStatus === statusFilter);
    }

    setFilteredBills(filtered);
  }, [bills, searchTerm, statusFilter]);

  const fetchBills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminBillingAPI.getAllBills();
      const billsData = response.bills || [];
      setBills(billsData);

      // Calculate statistics
      const totalRevenue = billsData.reduce((sum, bill) => sum + (bill.amount || 0), 0);
      const paidBills = billsData.filter(bill => bill.paymentStatus === 'paid');
      const pendingBills = billsData.filter(bill => bill.paymentStatus === 'pending');
      const paidRevenue = paidBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
      const pendingRevenue = pendingBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);

      setBillingStats({
        totalRevenue,
        paidRevenue,
        pendingRevenue,
        totalBills: billsData.length,
        paidBills: paidBills.length,
        pendingBills: pendingBills.length
      });
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load billing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'failed':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading billing data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-18">
      <div className="max-w-full md:pl-16 px-4 sm:px-6 lg:px-8">
        <div className="py-8 m-4 md:pl-16 lg:mx-auto">
        <PageHeader
          title="Billing Management"
          subtitle="View and manage all billing records"
          onBackClick={() => navigate('/admin')}
        />

        {/* Billing Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <BillingStatsCard
            title="Total Revenue"
            value={`₹${billingStats.totalRevenue.toLocaleString()}`}
            icon={Receipt}
            color="bg-green-100"
            iconColor="text-green-600"
          />
          <BillingStatsCard
            title="Paid Revenue"
            value={`₹${billingStats.paidRevenue.toLocaleString()}`}
            icon={TrendingUp}
            color="bg-green-100"
            iconColor="text-green-600"
          />
          <BillingStatsCard
            title="Pending Revenue"
            value={`₹${billingStats.pendingRevenue.toLocaleString()}`}
            icon={TrendingDown}
            color="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <BillingStatsCard
            title="Total Bills"
            value={billingStats.totalBills}
            icon={CreditCard}
            color="bg-blue-100"
            iconColor="text-blue-600"
            subtitle={`${billingStats.paidBills} paid, ${billingStats.pendingBills} pending`}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <SearchBar
            placeholder="Search bills by patient name, doctor name, or bill ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            focusColor="focus:ring-orange-500"
            className="flex-1"
          />
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <ErrorDisplay error={error} onDismiss={() => setError(null)} />

        {/* Bills Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <CreditCard className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {bill.billId || `#${bill._id.slice(-6)}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bill.appointmentId ? `Appointment: ${bill.appointmentId._id?.slice(-6)}` : 'No appointment'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {bill.patientId?.userId?.name || 'Unknown Patient'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bill.patientId?.userId?.email || 'No email'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {bill.doctorId?.userId?.name || 'Unknown Doctor'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bill.doctorId?.specialization || 'General Medicine'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{bill.amount?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bill.paymentStatus)}`}>
                        {getStatusIcon(bill.paymentStatus)}
                        <span className="ml-1 capitalize">{bill.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewBill(bill)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredBills.length === 0 && !isLoading && (
          <EmptyState
            icon={CreditCard}
            title="No bills found"
            description={searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'No billing records available'}
          />
        )}

        <BillDetailsModal
          bill={selectedBill}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;
