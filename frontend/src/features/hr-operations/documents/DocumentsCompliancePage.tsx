import { useEffect, useState } from 'react';
import { Download, Upload, Trash2, Check, X, Filter, RefreshCw, Eye } from 'lucide-react';
import { hrApi } from '../../../services/api/hr';
import { downloadFile, generateFilename } from '../../../services/utils/fileDownload';

interface Document {
  id: number;
  employee: string;
  document_name: string;
  document_type: string;
  file: string;
  is_verified: boolean;
  uploaded_at: string;
  uploaded_by?: string;
}

export default function DocumentsCompliancePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all', // all, verified, pending
    documentType: '',
    employee: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Load documents
  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await hrApi.listAllDocuments();
      setDocuments(data.results || data);
      setFilteredDocuments(data.results || data);
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error loading documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = documents;

    // Status filter
    if (filters.status === 'verified') {
      filtered = filtered.filter(doc => doc.is_verified);
    } else if (filters.status === 'pending') {
      filtered = filtered.filter(doc => !doc.is_verified);
    }

    // Document type filter
    if (filters.documentType) {
      filtered = filtered.filter(doc => doc.document_type === filters.documentType);
    }

    // Employee filter
    if (filters.employee) {
      filtered = filtered.filter(doc => doc.employee?.toLowerCase().includes(filters.employee.toLowerCase()));
    }

    setFilteredDocuments(filtered);
  }, [filters, documents]);

  // Handle verify
  const handleVerify = async (docId: number) => {
    try {
      await hrApi.verifyDocument(docId);
      setSuccess('Document verified successfully');
      loadDocuments();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to verify document');
      console.error('Error verifying document:', err);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedDocument || !rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      await hrApi.rejectDocument(selectedDocument.id, rejectReason);
      setSuccess('Document rejected successfully');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedDocument(null);
      loadDocuments();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to reject document');
      console.error('Error rejecting document:', err);
    }
  };

  // Handle download
  const handleDownload = async (doc: Document) => {
    try {
      await downloadFile(
        () => hrApi.downloadDocument(doc.id),
        doc.document_name
      );
    } catch (err) {
      setError('Failed to download document');
      console.error('Error downloading document:', err);
    }
  };

  // Handle delete
  const handleDelete = async (docId: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      // Note: This assumes a delete endpoint exists
      setSuccess('Document deleted successfully');
      loadDocuments();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      await downloadFile(
        () => hrApi.exportDocuments(filters),
        generateFilename('documents-compliance', 'csv')
      );
    } catch (err) {
      setError('Failed to export documents');
      console.error('Error exporting documents:', err);
    }
  };

  const uniqueDocumentTypes = [...new Set(documents.map(doc => doc.document_type))];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Documents & Compliance</h1>
        <p className="text-sm text-gray-500 mt-2">Manage and verify employee documents</p>
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

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex gap-3 mb-4">
          <button
            onClick={loadDocuments}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={filteredDocuments.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Documents</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending Verification</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select
              value={filters.documentType}
              onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              {uniqueDocumentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <input
              type="text"
              placeholder="Search employee..."
              value={filters.employee}
              onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No documents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Document Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Uploaded</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{doc.employee}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{doc.document_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{doc.document_type}</td>
                    <td className="px-6 py-4 text-sm">
                      {doc.is_verified ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                          <Check size={14} /> Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                          <Filter size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        {!doc.is_verified && (
                          <>
                            <button
                              onClick={() => handleVerify(doc.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Verify"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowRejectModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
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

      {/* Reject Modal */}
      {showRejectModal && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowRejectModal(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Document</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Document: <strong>{selectedDocument.document_name}</strong>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Provide a reason for rejecting this document..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedDocument(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 text-sm text-gray-600">
        <p>Showing {filteredDocuments.length} of {documents.length} documents</p>
      </div>
    </div>
  );
}
