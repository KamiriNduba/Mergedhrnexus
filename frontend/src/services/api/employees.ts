import { apiClient } from './client';

export const employeeApi = {
  getAll: () => apiClient.get('/employees/'),
  getById: (id: string) => apiClient.get(`/employees/${id}/`),
  create: (data: any) => apiClient.post('/employees/', data),
  update: (id: string, data: any) => apiClient.put(`/employees/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/employees/${id}/`),
  getDocuments: (id: string) => apiClient.get(`/employees/${id}/documents/`),
  getEducation: (id: string) => apiClient.get(`/employees/${id}/education/`),
  getWorkExperience: (id: string) => apiClient.get(`/employees/${id}/work-experience/`),
  getDependants: (id: string) => apiClient.get(`/employees/${id}/dependants/`),
  getCertifications: (id: string) => apiClient.get(`/employees/${id}/certifications/`),
  getSkills: (id: string) => apiClient.get(`/employees/${id}/skills/`),
  getBankAccounts: (id: string) => apiClient.get(`/employees/${id}/bank-accounts/`),
  getAssets: (id: string) => apiClient.get(`/employees/${id}/assets/`),
};


// Extended API methods for enhanced functionality
export const employeeApiExtended = {
  list: async () => {
    try {
      const { api } = await import('./api');
      const response = await api.get('/employees/');
      return response.data;
    } catch (error) {
      console.error('Failed to list employees:', error);
      throw error;
    }
  },

  uploadDocument: async (employeeId: number, formData: FormData) => {
    try {
      const { api } = await import('./api');
      const response = await api.post(`/employees/${employeeId}/documents/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to upload document for employee ${employeeId}:`, error);
      throw error;
    }
  },

  deleteDocument: async (employeeId: number, documentId: number) => {
    try {
      const { api } = await import('./api');
      const response = await api.delete(`/employees/${employeeId}/documents/${documentId}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete document ${documentId}:`, error);
      throw error;
    }
  },

  createLeaveRequest: async (data: any) => {
    try {
      const { api } = await import('./api');
      const response = await api.post('/leave/requests/create/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create leave request:', error);
      throw error;
    }
  },

  getLeaveTypes: async () => {
    try {
      const { api } = await import('./api');
      const response = await api.get('/leave/types/');
      return response.data;
    } catch (error) {
      console.error('Failed to get leave types:', error);
      throw error;
    }
  },
};
