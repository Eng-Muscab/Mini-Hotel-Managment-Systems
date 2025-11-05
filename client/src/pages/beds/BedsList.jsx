import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Plus, 
  RefreshCw, 
  Bed, 
  CheckCircle, 
  XCircle,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import api from '../../services/api.js';

const Beds = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBed, setEditingBed] = useState(null);
  const [formData, setFormData] = useState({
    bed_serial: '',
    type: 'standard'
  });

  // Fetch all beds
  const fetchBeds = async () => {
    setLoading(true);
    try {
      const response = await api.get('/beds');
      console.log('API Response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setBeds(response.data.data);
      } else {
        console.error('Unexpected response structure:', response.data);
        setBeds([]);
      }
    } catch (error) {
      console.error('Error fetching beds:', error);
      toast.error('Error fetching beds');
      setBeds([]);
    } finally {
      setLoading(false);
    }
  };

  // Create or update bed
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBed) {
        await api.put(`/beds/${editingBed.b_id}`, formData);
        toast.success('Bed updated successfully!');
      } else {
        await api.post('/beds', formData);
        toast.success('Bed created successfully!');
      }
      
      setShowModal(false);
      setEditingBed(null);
      setFormData({ bed_serial: '', type: 'standard' });
      fetchBeds();
    } catch (error) {
      console.error('Error saving bed:', error);
      toast.error(error.response?.data?.error || 'Error saving bed');
    }
  };

  // Update bed status
  const updateBedStatus = async (bedId, isAvailable) => {
    try {
      await api.patch(`/beds/${bedId}/status`, { status: isAvailable });
      fetchBeds();
      toast.success('Bed status updated!');
    } catch (error) {
      console.error('Error updating bed status:', error);
      toast.error(error.response?.data?.error || 'Error updating bed status');
    }
  };

  // Delete bed with proper toast notifications
  const deleteBed = async (bedId) => {
    // Show confirmation toast instead of native confirm
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-red-100 rounded-full">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Are you sure to remove this bed?</h3>
        </div>
        <p className="text-gray-600 mb-4">Are you sure you want to delete this bed? This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await api.delete(`/beds/${bedId}`);
                fetchBeds();
                toast.success('Bed deleted successfully!');
                toast.dismiss(t);
              } catch (error) {
                console.error('Error deleting bed:', error);
                toast.error(error.response?.data?.error || 'Error deleting bed');
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
      duration: 10000, // 10 seconds
    });
  };

  // Edit bed
  const editBed = (bed) => {
    setEditingBed(bed);
    setFormData({
      bed_serial: bed.bed_serial,
      type: bed.type
    });
    setShowModal(true);
  };

  // Open modal for new bed
  const openNewBedModal = () => {
    setEditingBed(null);
    setFormData({
      bed_serial: '',
      type: 'standard'
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingBed(null);
    setFormData({
      bed_serial: '',
      type: 'standard'
    });
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Bed className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Room Beds</h1>
        </div>
        <button
          onClick={openNewBedModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add New Bed
        </button>
      </div>

      {/* Beautiful Modal with Proper Blur Background */}
      {showModal && (
        <div className="fixed inset-0 z-1 flex items-center justify-center p-4">
          {/* Fixed: Light blur background without black overlay */}
          <div 
            className="absolute inset-0 bg-white/10 backdrop-blur-md transition-all duration-300"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingBed ? 'Edit Bed' : 'Add New Bed'}
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
                  Serial Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.bed_serial}
                  onChange={(e) => setFormData({...formData, bed_serial: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter bed serial number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Bed Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {editingBed ? 'Update Bed' : 'Create Bed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Beds Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">All Beds</h2>
          <button
            onClick={fetchBeds}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="animate-spin w-8 h-8 text-blue-600 mx-auto" />
            <p className="text-gray-600 mt-2">Loading beds...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {beds.map((bed) => (
                  <tr key={bed.b_id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{bed.b_id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{bed.bed_serial}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bed.type === 'premium' ? 'bg-purple-100 text-purple-800' :
                        bed.type === 'deluxe' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {bed.type?.charAt(0).toUpperCase() + bed.type?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {bed.is_available ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bed.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bed.is_available ? 'Available' : 'Occupied'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-1">
                      <button
                        onClick={() => updateBedStatus(bed.b_id, !bed.is_available)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                          bed.is_available 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {bed.is_available ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            Occupied
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Available
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => editBed(bed)}
                        className="inline-flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-all duration-200"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBed(bed.b_id)}
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
            {beds.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bed className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                No beds found. Add your first bed above.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Beds;