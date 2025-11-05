import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Plus, 
  RefreshCw, 
  DoorOpen, 
  CheckCircle, 
  XCircle,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import api from '../../services/api.js';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Single'
  });

  // Fetch all rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/rooms');
      console.log('Rooms API Response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setRooms(response.data.data);
      } else {
        console.error('Unexpected response structure:', response.data);
        setRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Error fetching rooms');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Create or update room
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.r_id}`, formData);
        toast.success('Room updated successfully!');
      } else {
        await api.post('/rooms', formData);
        toast.success('Room created successfully!');
      }
      
      setShowModal(false);
      setEditingRoom(null);
      setFormData({ name: '', type: 'Single' });
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error(error.response?.data?.error || 'Error saving room');
    }
  };

  // Update room status
  const updateRoomStatus = async (roomId, isActive) => {
    try {
      await api.patch(`/rooms/${roomId}/status`, { status: isActive });
      fetchRooms();
      toast.success('Room status updated!');
    } catch (error) {
      console.error('Error updating room status:', error);
      toast.error(error.response?.data?.error || 'Error updating room status');
    }
  };

  // Delete room with proper toast notifications
  const deleteRoom = async (roomId) => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-red-100 rounded-full">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
        </div>
        <p className="text-gray-600 mb-4">Are you sure you want to delete this room? This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await api.delete(`/rooms/${roomId}`);
                fetchRooms();
                toast.success('Room deleted successfully!');
                toast.dismiss(t);
              } catch (error) {
                console.error('Error deleting room:', error);
                toast.error(error.response?.data?.error || 'Error deleting room');
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

  // Edit room
  const editRoom = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      type: room.type
    });
    setShowModal(true);
  };

  // Open modal for new room
  const openNewRoomModal = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      type: 'Single'
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setFormData({
      name: '',
      type: 'Single'
    });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <DoorOpen className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Rooms Management</h1>
        </div>
        <button
          onClick={openNewRoomModal}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add New Room
        </button>
      </div>

      {/* Beautiful Modal with Blur Background */}
      {showModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
          {/* Blur Background */}
          <div 
            className="absolute inset-0 bg-white/80 backdrop-blur-md transition-all duration-300"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Room Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter room name (e.g., Room 101)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Room Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Executive">Executive</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">All Rooms</h2>
          <button
            onClick={fetchRooms}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="animate-spin w-8 h-8 text-green-600 mx-auto" />
            <p className="text-gray-600 mt-2">Loading rooms...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.r_id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{room.r_id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{room.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.type === 'Suite' ? 'bg-purple-100 text-purple-800' :
                        room.type === 'Deluxe' ? 'bg-yellow-100 text-yellow-800' :
                        room.type === 'Executive' ? 'bg-blue-100 text-blue-800' :
                        room.type === 'Presidential' ? 'bg-red-100 text-red-800' :
                        room.type === 'Double' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {room.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(room.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {room.is_active ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          room.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {room.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-1">
                      <button
                        onClick={() => updateRoomStatus(room.r_id, !room.is_active)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                          room.is_active 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {room.is_active ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => editRoom(room)}
                        className="inline-flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-all duration-200"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRoom(room.r_id)}
                        className="inline-flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-all duration-200"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rooms.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <DoorOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                No rooms found. Add your first room above.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;