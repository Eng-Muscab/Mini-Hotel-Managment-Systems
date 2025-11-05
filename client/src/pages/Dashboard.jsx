import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Building, 
  Users, 
  Bed, 
  Calendar,
  TrendingUp,
  Star,
  DoorOpen,
  UserCheck
} from 'lucide-react';
import api from '../services/api.js';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [countBeds, setCountBeds] = useState(0);
  const [countRooms, setCountRooms] = useState(0);
  const [countCustomers, setCountCustomers] = useState(0);
  const [countBookings, setCountBookings] = useState(0);
  const [availableBeds, setAvailableBeds] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchingDashboard = async () => {
    try {
      setLoading(true);
      
      // Fetch all counts in parallel
      const [bedsRes, roomsRes, customersRes, bookingsRes, bedsListRes, roomsListRes] = await Promise.all([
        api.get('/beds/count'),
        api.get('/rooms/count'),
        api.get('/customers/count'),
        api.get('/booking/count').catch(() => ({ data: { count: 0 } })), // Fallback if booking not implemented
        api.get('/beds'),
        api.get('/rooms')
      ]);

      // Set basic counts
      setCountBeds(bedsRes.data.count || bedsRes.data.total || 0);
      setCountRooms(roomsRes.data.count || roomsRes.data.total || 0);
      setCountCustomers(customersRes.data.count || customersRes.data.total || 0);
      setCountBookings(bookingsRes.data.count || bookingsRes.data.total || 0);

      // Calculate available beds and rooms
      if (bedsListRes.data.success && Array.isArray(bedsListRes.data.data)) {
        const availableBedsCount = bedsListRes.data.data.filter(bed => bed.is_available).length;
        setAvailableBeds(availableBedsCount);
      }

      if (roomsListRes.data.success && Array.isArray(roomsListRes.data.data)) {
        const availableRoomsCount = roomsListRes.data.data.filter(room => room.is_active).length;
        setAvailableRooms(availableRoomsCount);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingDashboard();
  }, []);

  // Refresh dashboard data
  const refreshDashboard = () => {
    fetchingDashboard();
  };

  const stats = [
    { 
      icon: Bed, 
      label: 'Total Beds', 
      value: countBeds, 
      available: availableBeds,
      change: '+2', 
      color: 'blue',
      description: `${availableBeds} available`
    },
    { 
      icon: DoorOpen, 
      label: 'Total Rooms', 
      value: countRooms, 
      available: availableRooms,
      change: '+1', 
      color: 'green',
      description: `${availableRooms} active`
    },
    { 
      icon: Users, 
      label: 'Total Customers', 
      value: countCustomers, 
      change: '+5', 
      color: 'purple',
      description: 'Registered customers'
    },
    { 
      icon: Calendar, 
      label: 'Total Bookings', 
      value: countBookings, 
      change: '+3', 
      color: 'orange',
      description: 'All bookings'
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' }
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard content */}
      <div className="p-6 space-y-6"> 
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}! 👋</h1>
            <p className="text-indigo-100 text-lg">Here's what's happening in your hotel today.</p>
          </div>
          <div className="absolute right-6 top-6">
            <button
              onClick={refreshDashboard}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const color = getColorClasses(stat.color);
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    {stat.available !== undefined && (
                      <p className="text-gray-500 text-xs mt-1">{stat.description}</p>
                    )}
                  </div>
                  <div className={`${color.bg} p-3 rounded-xl`}>
                    <stat.icon className={`w-6 h-6 ${color.text}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                  </div>
                  <div className="text-xs text-gray-500">today</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl transition-colors duration-200 text-left">
                <Bed className="w-6 h-6 mb-2" />
                <div className="font-medium">Add Bed</div>
                <Link to="/beds" className="text-sm text-blue-600">Register new bed</Link>
              </button>
              <button className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-xl transition-colors duration-200 text-left">
                <DoorOpen className="w-6 h-6 mb-2" />
                <div className="font-medium">Add Room</div>
                <Link to="/rooms" className="text-sm text-green-600">Create new room</Link>
              </button>
              <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-xl transition-colors duration-200 text-left">
                <Users className="w-6 h-6 mb-2" />
                <div className="font-medium">Add Customer</div>
                <Link to="/customers" className="text-sm text-purple-600">Register customer</Link>
              </button>
              <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-xl transition-colors duration-200 text-left">
                <Calendar className="w-6 h-6 mb-2" />
                <div className="font-medium">New Booking</div>
                <Link to="/bookings" className="text-sm text-orange-600">Create booking</Link>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Beds Module</span>
                </div>
                <span className="text-green-600 text-sm font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Rooms Module</span>
                </div>
                <span className="text-green-600 text-sm font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Customers Module</span>
                </div>
                <span className="text-green-600 text-sm font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Bookings Module</span>
                </div>
                <span className="text-blue-600 text-sm font-medium">Developing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;