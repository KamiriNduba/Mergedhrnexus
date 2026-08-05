import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Filter, RefreshCw, X } from 'lucide-react';
import { hrApi } from '../../services/api/hr';

interface Position {
  id: number;
  title: string;
  department: string;
  status: string;
  openings: number;
  applications_count: number;
  created_at: string;
  description?: string;
}

interface Application {
  id: number;
  candidate_name: string;
  position: string;
  status: string;
  applied_at: string;
  email?: string;
  phone?: string;
}

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState<'positions' | 'applications'>('positions');
  const [positions, setPositions] = useState<Position[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [positionForm, setPositionForm] = useState({
    title: '',
    department: '',
    description: '',
    openings: 1,
  });

  // Load positions
  const loadPositions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await hrApi.listPositions();
      setPositions(data.results || data);
    } catch (err) {
      setError('Failed to load positions');
      console.error('Error loading positions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load applications
  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await hrApi.listApplications();
      setApplications(data.results || data);
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error loading applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (activeTab === 'positions') {
      loadPositions();
    } else {
      loadApplications();
    }
  }, [activeTab]);

  // Handle create/update position
  const handleSavePosition = async () => {
    if (!positionForm.title || !positionForm.department) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (selectedPosition) {
        await hrApi.updatePosition(selectedPosition.id, positionForm);
        setSuccess('Position updated successfully');
      } else {
        await hrApi.createPosition(positionForm);
        setSuccess('Position created successfully');
      }
      setShowPositionModal(false);
      setPositionForm({ title: '', department: '', description: '', openings: 1 });
      setSelectedPosition(null);
      loadPositions();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save position');
      console.error('Error saving position:', err);
    }
  };

  // Handle delete position
  const handleDeletePosition = async (positionId: number) => {
    if (!window.confirm('Are you sure you want to delete this position?')) {
      return;
    }

    try {
      await hrApi.deletePosition(positionId);
      setSuccess('Position deleted successfully');
      loadPositions();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete position');
      console.error('Error deleting position:', err);
    }
  };

  // Handle update application status
  const handleUpdateApplicationStatus = async (appId: number, newStatus: string) => {
    try {
      await hrApi.updateApplicationStatus(appId, newStatus);
      setSuccess('Application status updated successfully');
      loadApplications();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update application status');
      console.error('Error updating application:', err);
    }
  };

  // Open edit position modal
  const handleEditPosition = (position: Position) => {
    setSelectedPosition(position);
    setPositionForm({
      title: position.title,
      department: position.department,
      description: position.description || '',
      openings: position.openings,
    });
    setShowPositionModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowPositionModal(false);
    setSelectedPosition(null);
    setPositionForm({ title: '', department: '', description: '', openings: 1 });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recruitment</h1>
        <p className="text-sm text-gray-500 mt-2">Manage job positions and candidate applications</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X size={20} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('positions')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'positions'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Job Positions
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'applications'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Applications
        </button>
      </div>

      {/* Positions Tab */}
      {activeTab === 'positions' && (
        <>
          {/* Controls */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setShowPositionModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Create Position
            </button>
            <button
              onClick={loadPositions}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Positions Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading positions...</p>
              </div>
            ) : positions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No positions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Position Title</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Openings</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Applications</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {positions.map((position) => (
                      <tr key={position.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{position.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{position.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{position.openings}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{position.applications_count}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            position.status === 'open' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {position.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditPosition(position)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeletePosition(position.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <>
          {/* Controls */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={loadApplications}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Candidate Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Position</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Applied Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{app.candidate_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.position}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                          >
                            <option value="applied">Applied</option>
                            <option value="screening">Screening</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Position Modal */}
      {showPositionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {selectedPosition ? 'Edit Position' : 'Create Position'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position Title *</label>
                <input
                  type="text"
                  value={positionForm.title}
                  onChange={(e) => setPositionForm({ ...positionForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Senior Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <input
                  type="text"
                  value={positionForm.department}
                  onChange={(e) => setPositionForm({ ...positionForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Openings</label>
                <input
                  type="number"
                  value={positionForm.openings}
                  onChange={(e) => setPositionForm({ ...positionForm, openings: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={positionForm.description}
                  onChange={(e) => setPositionForm({ ...positionForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Job description..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSavePosition}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {selectedPosition ? 'Update' : 'Create'}
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
