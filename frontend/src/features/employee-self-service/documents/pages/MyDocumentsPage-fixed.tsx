import React, { useEffect, useState } from 'react';
import { authApi } from '../../../../services/api/auth';
import { employeeApi } from '../../../../services/api/employees';
import type { DocumentItem } from '../types/documents';

export default function MyDocuments() {
  const [selectedCategory, setSelectedCategory] = useState<string>('CV');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [library, setLibrary] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowRecipients, setRowRecipients] = useState<{ [key: string]: string }>({});

  /**
   * Load documents from backend
   */
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const currentUser = await authApi.me();
        if (!currentUser) return;

        // Get employee profile
        const employees = await employeeApi.list();
        const employee = employees?.find((emp: any) => emp.user?.id === currentUser.id);
        
        if (!employee) return;

        // Get employee documents
        const documents = await employeeApi.getDocuments(employee.id);
        if (documents && Array.isArray(documents)) {
          const mappedDocs: DocumentItem[] = documents.map((doc: any) => ({
            id: doc.id.toString(),
            title: doc.document_name,
            status: doc.is_verified ? 'verified' : 'pending',
            category: doc.document_type,
            isDraft: false,
            routedTo: 'Central HR Operations'
          }));
          setLibrary(mappedDocs);
        }
      } catch (error) {
        console.error("Failed to load documents:", error);
        setFeedbackMsg("Failed to load documents");
        setTimeout(() => setFeedbackMsg(''), 5000);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, []);

  /**
   * Handle file selection
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  /**
   * Handle document upload to backend
   */
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customTitle.trim()) {
      setFeedbackMsg("Please enter a document label name.");
      return;
    }

    if (!selectedFile) {
      setFeedbackMsg("Please select a file to upload.");
      return;
    }

    try {
      setIsUploading(true);

      // Get current user
      const currentUser = await authApi.me();
      if (!currentUser) {
        setFeedbackMsg("Not authenticated");
        return;
      }

      // Get employee profile
      const employees = await employeeApi.list();
      const employee = employees?.find((emp: any) => emp.user?.id === currentUser.id);
      
      if (!employee) {
        setFeedbackMsg("Employee profile not found");
        return;
      }

      // Upload document
      const formData = new FormData();
      formData.append('employee', employee.id.toString());
      formData.append('document_name', customTitle.trim());
      formData.append('document_type', selectedCategory);
      formData.append('file', selectedFile);

      const uploadedDoc = await employeeApi.uploadDocument(employee.id, formData);
      
      if (uploadedDoc) {
        // Add to local library
        const newDoc: DocumentItem = {
          id: uploadedDoc.id.toString(),
          title: uploadedDoc.document_name,
          status: 'pending',
          category: uploadedDoc.document_type,
          isDraft: false,
          routedTo: 'Central HR Operations'
        };

        setLibrary([newDoc, ...library]);
        setCustomTitle('');
        setSelectedFile(null);
        setFeedbackMsg("Document uploaded successfully!");
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setFeedbackMsg("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setFeedbackMsg(''), 5000);
    }
  };

  /**
   * Handle document deletion
   */
  const handleDelete = async (docId: string) => {
    try {
      const currentUser = await authApi.me();
      if (!currentUser) return;

      const employees = await employeeApi.list();
      const employee = employees?.find((emp: any) => emp.user?.id === currentUser.id);
      
      if (!employee) return;

      // Delete from backend
      await employeeApi.deleteDocument(employee.id, parseInt(docId));
      
      // Remove from local library
      setLibrary(library.filter(doc => doc.id !== docId));
      setFeedbackMsg("Document deleted successfully");
      setTimeout(() => setFeedbackMsg(''), 5000);
    } catch (error) {
      console.error("Delete failed:", error);
      setFeedbackMsg("Failed to delete document");
      setTimeout(() => setFeedbackMsg(''), 5000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-12 py-10 selection:bg-transparent">
      
      {/* Title Header Section */}
      <div className="mb-10">
        <h2 className="text-[34px] font-serif font-normal text-slate-800 tracking-tight">My documents</h2>
        <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
          Contracts, letters, acknowledgements, and personal compliance submission portals
        </p>
      </div>

      {/* Two-Column Balanced Workspace Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* Left Hand: Upload Console */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl shadow-sm p-6 px-8 min-h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2 mb-4">
              Upload file to library
            </h3>
            
            {feedbackMsg && (
              <div className={`p-3 mb-4 rounded-xl text-[11px] font-medium leading-normal animate-in fade-in ${
                feedbackMsg.includes('success') || feedbackMsg.includes('Successfully')
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                  : 'bg-red-50 border border-red-100 text-red-700'
              }`}>
                {feedbackMsg}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Document Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="CV">Curriculum Vitae (CV)</option>
                  <option value="NATIONAL_ID">National ID / Passport</option>
                  <option value="ACADEMIC_CERTIFICATE">Academic Certificates</option>
                  <option value="TAX_DOCUMENT">Tax Compliance File</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Document Label Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nancy_Karanja_CV"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-amber-500 transition-colors tracking-wide"
                />
              </div>

              <div className="border border-dashed border-slate-200 hover:border-amber-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/30 flex flex-col items-center justify-center min-h-[90px] relative">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <span className="text-base">📁</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  {selectedFile ? selectedFile.name : 'Drag file here or click to browse'}
                </span>
                <span className="text-[8px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                  PDF, PNG, JPG up to 10MB
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-[#0d1424] hover:bg-slate-900 disabled:bg-slate-400 text-white font-semibold text-[11px] py-3 px-4 rounded-xl transition-all shadow-sm tracking-widest uppercase outline-none"
                >
                  {isUploading ? 'Uploading...' : 'Upload to Repository'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Hand: Document Library Tracker */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden min-h-[380px]">
          <div className="p-6 px-8 border-b border-slate-100 bg-white">
            <h3 className="text-sm font-semibold text-slate-800">Document library ({library.length})</h3>
          </div>
          
          <div className="px-8 divide-y divide-slate-100/60">
            {isLoading ? (
              <div className="py-8 text-center text-slate-400">Loading documents...</div>
            ) : library.length === 0 ? (
              <div className="py-8 text-center text-slate-400">No documents uploaded yet</div>
            ) : (
              library.map((doc) => (
                <div key={doc.id} className="py-5.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/20 transition-colors animate-in slide-in-from-top-1 duration-200">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-normal text-slate-700 block truncate">
                      {doc.title}
                    </span>
                    
                    <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                      Category: <span className="text-slate-600 font-semibold">{doc.category}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center select-none">
                    <span className={`inline-block text-center font-bold px-2.5 py-0.5 rounded text-[10px] scale-95 border lowercase tracking-wide ${
                      doc.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60' :
                      'bg-blue-50 text-blue-700 border-blue-100/60'
                    }`}>
                      {doc.status}
                    </span>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-700 text-[10px] font-bold px-2 py-1 rounded transition outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
