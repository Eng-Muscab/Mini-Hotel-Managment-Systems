import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Plus, 
  RefreshCw, 
  Calendar,
  CheckCircle, 
  XCircle,
  Clock,
  Trash2,
  Edit,
  X,
  User,
  DoorOpen,
  Bed,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api.js';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [roomBeds, setroomBeds] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [room, setRoom] = useState({});
  const [formData, setFormData] = useState({
    c_id: '',
    rb_id: '',
    amount: '',
    state: 'PENDING', // Default to PENDING
    start_date: '',
    end_date: ''
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, customersRes, roomBedsRes, roomsRes] = await Promise.all([
        api.get('/booking'),
        api.get('/customers'),
        api.get('/room_beds'),
        api.get('/rooms')
      ]);

      if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
      if (customersRes.data.success) setCustomers(customersRes.data.data);
      if (roomBedsRes.data.success) setroomBeds(roomBedsRes.data.data);
      if (roomsRes.data.success) setRoom(roomsRes.data.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Get available room beds from existing bookings data
  // const getAvailableRoomBeds = async () => {
  //   try {
  //     // Extract unique room beds from bookings
  //     const bookedBedIds = new Set(
  //       bookings
  //         .filter(booking => booking.rb_id && ['BOOKED', 'CHECKED_IN'].includes(booking.state))
  //         .map(booking => booking.rb_id)
  //     );

  //     // In a real app, you'd call your room-beds API here
  //     // For now, we'll create a mock list based on what we see in bookings
  //     const allBeds = [];
  //     for (let i = 1; i <= 10; i++) {
  //       if (!bookedBedIds.has(i)) {
  //         allBeds.push({
  //           rb_id: i,
  //           room_id: Math.ceil(i / 2),
  //           bed_type: ['SINGLE', 'QUEEN', 'KING'][i % 3],
  //           is_available: true,
  //           room_name: `Room ${Math.ceil(i / 2)}`,
  //           room_type: ['Standard', 'Deluxe', 'Suite'][i % 3]
  //         });
  //       }
  //     }
  //     return allBeds;
  //   } catch (error) {
  //     console.error('Error fetching room beds:', error);
  //     return [];
  //   }
  // };

  // Check if room bed is already booked for selected dates
  const checkRoomBedAvailability = async (rb_id, start_date, end_date, excludeBookingId = null) => {
    if (!rb_id || !start_date || !end_date) return true;

    const conflictingBooking = bookings.find(booking => {
      if (booking.rb_id === parseInt(rb_id) && booking.b_id !== excludeBookingId) {
        const activeStates = ['PENDING', 'BOOKED', 'CHECKED_IN'];
        if (!activeStates.includes(booking.state)) return false;

        const newStart = new Date(start_date);
        const newEnd = new Date(end_date);
        const existingStart = new Date(booking.start_date);
        const existingEnd = new Date(booking.end_date);

        // Check for date overlap
        return (newStart <= existingEnd && newEnd >= existingStart);
      }
      return false;
    });

    return !conflictingBooking;
  };

  // Create or update booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCheckingAvailability(true);

    try {
      const bookingData = {
        ...formData,
        rb_id: formData.rb_id ? parseInt(formData.rb_id) : null,
        c_id: parseInt(formData.c_id),
        amount: parseFloat(formData.amount)
      };

      console.log('Submitting booking data:', bookingData);

      // Check room bed availability
      if (bookingData.rb_id) {
        const isAvailable = await checkRoomBedAvailability(
          bookingData.rb_id, 
          bookingData.start_date, 
          bookingData.end_date,
          editingBooking?.b_id
        );

        if (!isAvailable) {
          toast.error('This room bed is already booked for the selected dates!');
          setCheckingAvailability(false);
          return;
        }
      }

      // Validate dates
      const startDate = new Date(bookingData.start_date);
      const endDate = new Date(bookingData.end_date);
      if (endDate <= startDate) {
        toast.error('End date must be after start date!');
        setCheckingAvailability(false);
        return;
      }

      // Validate state transitions
      if (editingBooking) {
        const oldState = editingBooking.state;
        const newState = bookingData.state;
        
        if (!isValidStateTransition(oldState, newState)) {
          toast.error(`Cannot change status from ${oldState} to ${newState}`);
          setCheckingAvailability(false);
          return;
        }
      }

      if (editingBooking) {
        await api.put(`/booking/${editingBooking.b_id}`, bookingData);
        toast.success('Booking updated successfully!');
      } else {
        await api.post('/booking', bookingData);
        toast.success('Booking created successfully!');
      }
      
      setShowModal(false);
      setEditingBooking(null);
      setFormData({
        c_id: '',
        rb_id: '',
        amount: '',
        state: 'PENDING',
        start_date: '',
        end_date: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error(error.response?.data?.error || 'Error saving booking');
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Validate state transitions
  const isValidStateTransition = (fromState, toState) => {
    const validTransitions = {
      'PENDING': ['BOOKED', 'CANCELLED'],
      'BOOKED': ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
      'CHECKED_IN': ['CHECKED_OUT', 'NO_SHOW'],
      'CHECKED_OUT': [],
      'CANCELLED': [],
      'NO_SHOW': []
    };

    return validTransitions[fromState]?.includes(toState) || false;
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newState) => {
    try {
      const booking = bookings.find(b => b.b_id === bookingId);
      if (!booking) {
        toast.error('Booking not found');
        return;
      }

      if (!isValidStateTransition(booking.state, newState)) {
        toast.error(`Cannot change status from ${booking.state} to ${newState}`);
        return;
      }

      await api.patch(`/booking/${bookingId}/status`, { state: newState });
      fetchData();
      toast.success(`Booking status updated to ${newState}!`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(error.response?.data?.error || 'Error updating booking status');
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-red-100 rounded-full">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
        </div>
        <p className="text-gray-600 mb-4">Are you sure you want to delete this booking? This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await api.delete(`/booking/${id}`);
                fetchData();
                toast.success('Booking deleted successfully!');
                toast.dismiss(t);
              } catch (error) {
                console.error('Error deleting booking:', error);
                toast.error(error.response?.data?.error || 'Error deleting booking');
                toast.dismiss(t);
              }
            }}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t)}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  };

  // Edit booking
  const editBooking = (booking) => {
    setEditingBooking(booking);
    setFormData({
      c_id: booking.c_id?.toString() || '',
      rb_id: booking.rb_id?.toString() || '',
      amount: booking.amount?.toString() || '',
      state: booking.state || 'PENDING',
      start_date: booking.start_date || '',
      end_date: booking.end_date || ''
    });
    setShowModal(true);
  };

  // Open modal for new booking
  const openNewBookingModal = () => {
    setEditingBooking(null);
    setFormData({
      c_id: '',
      rb_id: '',
      amount: '',
      state: 'PENDING',
      start_date: '',
      end_date: ''
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingBooking(null);
    setFormData({
      c_id: '',
      rb_id: '',
      amount: '',
      state: 'PENDING',
      start_date: '',
      end_date: ''
    });
  };

  // Get status color and icon
  const getStatusInfo = (state) => {
    const statusConfig = {
      'PENDING': { color: 'yellow', icon: Clock, label: 'Pending', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
      'BOOKED': { color: 'blue', icon: CheckCircle, label: 'Booked', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
      'CHECKED_IN': { color: 'green', icon: CheckCircle, label: 'Checked In', bgColor: 'bg-green-100', textColor: 'text-green-800' },
      'CHECKED_OUT': { color: 'gray', icon: CheckCircle, label: 'Checked Out', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
      'CANCELLED': { color: 'red', icon: XCircle, label: 'Cancelled', bgColor: 'bg-red-100', textColor: 'text-red-800' },
      'NO_SHOW': { color: 'red', icon: XCircle, label: 'No Show', bgColor: 'bg-red-100', textColor: 'text-red-800' }
    };
    
    return statusConfig[state] || { color: 'gray', icon: Clock, label: state, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  };

  // Get available status actions for a booking
  const getAvailableStatusActions = (currentState) => {
    const actions = {
      'PENDING': [
        { state: 'BOOKED', label: 'Confirm Booking', color: 'blue' },
        { state: 'CANCELLED', label: 'Cancel', color: 'red' }
      ],
      'BOOKED': [
        { state: 'CHECKED_IN', label: 'Check In', color: 'green' },
        { state: 'CANCELLED', label: 'Cancel', color: 'red' },
        { state: 'NO_SHOW', label: 'Mark as No Show', color: 'red' }
      ],
      'CHECKED_IN': [
        { state: 'CHECKED_OUT', label: 'Check Out', color: 'gray' },
        { state: 'NO_SHOW', label: 'Mark as No Show', color: 'red' }
      ],
      'CHECKED_OUT': [],
      'CANCELLED': [],
      'NO_SHOW': []
    };

    return actions[currentState] || [];
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        </div>
        <button
          onClick={openNewBookingModal}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md transition-all duration-300" onClick={closeModal} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingBooking ? 'Edit Booking' : 'Create New Booking'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Customer *</label>
                  <select
                    required
                    value={formData.c_id}
                    onChange={(e) => setFormData({...formData, c_id: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.c_id} value={customer.c_id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Bed Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Room Bed</label>
                  <select
                    value={formData.rb_id}
                    onChange={(e) => setFormData({...formData, rb_id: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Room Bed (Optional)</option>
                    {room.map(room => (
                      <option key={room.r_id} value={room.r_id}>
                        Bed # {room.name} ({room.type})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {roomBeds.length} available room beds
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="BOOKED">Booked</option>
                    <option value="CHECKED_IN">Checked In</option>
                    <option value="CHECKED_OUT">Checked Out</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">No Show</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Validation Messages */}
              {formData.rb_id && formData.start_date && formData.end_date && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Room Bed Availability Check</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    The system will check if this room bed is available for the selected dates.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={checkingAvailability}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 disabled:bg-orange-400 transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  {checkingAvailability ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {checkingAvailability ? 'Checking Availability...' : 
                   editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">All Bookings</h2>
          <div className="flex gap-2">
            <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
              Total: {bookings.length} bookings
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="animate-spin w-8 h-8 text-orange-600 mx-auto" />
            <p className="text-gray-600 mt-2">Loading bookings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Bed</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => {
                  const statusInfo = getStatusInfo(booking.state);
                  const StatusIcon = statusInfo.icon;
                  const availableActions = getAvailableStatusActions(booking.state);
                  
                  return (
                    <tr key={booking.b_id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#{booking.b_id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{booking.customer_name}</div>
                          <div className="text-gray-500 text-xs">{booking.customer_phone}</div>
                          {booking.customer_company && (
                            <div className="text-gray-400 text-xs">{booking.customer_company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {booking.rb_id ? (
                          <div className="flex items-center gap-1">
                            <Bed className="w-3 h-3" />
                            Bed #{booking.rb_id} 
                            {booking.room_name && (
                              <span className="text-gray-500">({booking.room_name})</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No bed assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        <div>
                          <div className="font-medium">Start: {new Date(booking.start_date).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">End: {new Date(booking.end_date).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${parseFloat(booking.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm space-x-1">
                        {/* Status Action Buttons */}
                        {availableActions.map(action => (
                          <button
                            key={action.state}
                            onClick={() => updateBookingStatus(booking.b_id, action.state)}
                            className={`inline-flex items-center gap-1 ${
                              action.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                              action.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                              action.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                              'bg-gray-600 hover:bg-gray-700'
                            } text-white px-2 py-1 rounded text-xs transition-all duration-200 mb-1`}
                          >
                            {action.label}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => editBooking(booking)}
                          className="inline-flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-all duration-200"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBooking(booking.b_id)}
                          className="inline-flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-all duration-200"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                No bookings found. Create your first booking above.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;