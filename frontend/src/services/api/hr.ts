/**
 * HR Operations API Client
 * Handles all HR-related API calls including employees, payroll, recruitment, contracts, etc.
 */

import { api } from './api';

export const hrApi = {
  // ============ EMPLOYEES ============
  
  /**
   * List all employees with optional filters
   */
  listEmployees: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/employees/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to list employees:', error);
      throw error;
    }
  },

  /**
   * Get employee by ID
   */
  getEmployee: async (id: number) => {
    try {
      const response = await api.get(`/employees/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get employee ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new employee
   */
  createEmployee: async (data: any) => {
    try {
      const response = await api.post('/employees/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw error;
    }
  },

  /**
   * Update employee
   */
  updateEmployee: async (id: number, data: any) => {
    try {
      const response = await api.put(`/employees/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update employee ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete employee
   */
  deleteEmployee: async (id: number) => {
    try {
      const response = await api.delete(`/employees/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete employee ${id}:`, error);
      throw error;
    }
  },

  // ============ PAYROLL ============

  /**
   * Generate payroll
   */
  generatePayroll: async (data: any) => {
    try {
      const response = await api.post('/payroll/generate/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to generate payroll:', error);
      throw error;
    }
  },

  /**
   * Approve payroll
   */
  approvePayroll: async (id: number) => {
    try {
      const response = await api.post(`/payroll/${id}/approve/`, {});
      return response.data;
    } catch (error) {
      console.error(`Failed to approve payroll ${id}:`, error);
      throw error;
    }
  },

  /**
   * List payroll records
   */
  listPayroll: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/payroll/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to list payroll:', error);
      throw error;
    }
  },

  /**
   * Export payroll as CSV
   */
  exportPayroll: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/payroll/export/?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export payroll:', error);
      throw error;
    }
  },

  // ============ RECRUITMENT ============

  /**
   * Create job position
   */
  createPosition: async (data: any) => {
    try {
      const response = await api.post('/recruitment/positions/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create position:', error);
      throw error;
    }
  },

  /**
   * List job positions
   */
  listPositions: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/recruitment/positions/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to list positions:', error);
      throw error;
    }
  },

  /**
   * Update job position
   */
  updatePosition: async (id: number, data: any) => {
    try {
      const response = await api.put(`/recruitment/positions/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update position ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete job position
   */
  deletePosition: async (id: number) => {
    try {
      const response = await api.delete(`/recruitment/positions/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete position ${id}:`, error);
      throw error;
    }
  },

  /**
   * List candidate applications
   */
  listApplications: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/recruitment/applications/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to list applications:', error);
      throw error;
    }
  },

  /**
   * Update application status
   */
  updateApplicationStatus: async (id: number, status: string) => {
    try {
      const response = await api.patch(`/recruitment/applications/${id}/`, { status });
      return response.data;
    } catch (error) {
      console.error(`Failed to update application ${id}:`, error);
      throw error;
    }
  },

  // ============ CONTRACTS ============

  /**
   * List contracts
   */
  listContracts: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/contracts/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to list contracts:', error);
      throw error;
    }
  },

  /**
   * Create contract
   */
  createContract: async (data: any) => {
    try {
      const response = await api.post('/contracts/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create contract:', error);
      throw error;
    }
  },

  /**
   * Update contract
   */
  updateContract: async (id: number, data: any) => {
    try {
      const response = await api.put(`/contracts/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update contract ${id}:`, error);
      throw error;
    }
  },

  /**
   * Export contract
   */
  exportContract: async (id: number, format: 'pdf' | 'docx' = 'pdf') => {
    try {
      const response = await api.get(`/contracts/${id}/export/?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to export contract ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete contract
   */
  deleteContract: async (id: number) => {
    try {
      const response = await api.delete(`/contracts/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete contract ${id}:`, error);
      throw error;
    }
  },

  // ============ DOCUMENTS & COMPLIANCE ============

  /**
   * List all employee documents (HR view)
   */
  listAllDocuments: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/documents/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to list documents:', error);
      throw error;
    }
  },

  /**
   * Verify document
   */
  verifyDocument: async (id: number) => {
    try {
      const response = await api.post(`/documents/${id}/verify/`, {});
      return response.data;
    } catch (error) {
      console.error(`Failed to verify document ${id}:`, error);
      throw error;
    }
  },

  /**
   * Reject document
   */
  rejectDocument: async (id: number, reason: string) => {
    try {
      const response = await api.post(`/documents/${id}/reject/`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Failed to reject document ${id}:`, error);
      throw error;
    }
  },

  /**
   * Download document
   */
  downloadDocument: async (id: number) => {
    try {
      const response = await api.get(`/documents/${id}/download/`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to download document ${id}:`, error);
      throw error;
    }
  },

  /**
   * Export documents as CSV
   */
  exportDocuments: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/documents/export/?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export documents:', error);
      throw error;
    }
  },

  // ============ ACTIVITY LOG ============

  /**
   * List activity logs
   */
  listActivityLogs: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/audit/logs/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to list activity logs:', error);
      throw error;
    }
  },

  /**
   * Search activity logs
   */
  searchActivityLogs: async (query: string, filters?: any) => {
    try {
      const params = new URLSearchParams({ search: query });
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/audit/logs/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search activity logs:', error);
      throw error;
    }
  },

  /**
   * Export activity logs
   */
  exportActivityLogs: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/audit/logs/export/?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export activity logs:', error);
      throw error;
    }
  },

  // ============ LEAVE MANAGEMENT ============

  /**
   * List leave requests
   */
  listLeaveRequests: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/leave/requests/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to list leave requests:', error);
      throw error;
    }
  },

  /**
   * Approve leave request
   */
  approveLeaveRequest: async (id: number) => {
    try {
      const response = await api.post(`/leave/requests/${id}/approve/`, {});
      return response.data;
    } catch (error) {
      console.error(`Failed to approve leave request ${id}:`, error);
      throw error;
    }
  },

  /**
   * Reject leave request
   */
  rejectLeaveRequest: async (id: number, reason: string) => {
    try {
      const response = await api.post(`/leave/requests/${id}/reject/`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Failed to reject leave request ${id}:`, error);
      throw error;
    }
  },

  // ============ REPORTS & ANALYTICS ============

  /**
   * Get HR dashboard metrics
   */
  getHRDashboardMetrics: async () => {
    try {
      const response = await api.get('/reporting/hr-dashboard/');
      return response.data;
    } catch (error) {
      console.error('Failed to get HR dashboard metrics:', error);
      throw error;
    }
  },

  /**
   * Export HR dashboard report
   */
  exportHRDashboardReport: async (format: 'csv' | 'pdf' = 'csv') => {
    try {
      const response = await api.get(`/reporting/hr-dashboard/export/?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export HR dashboard report:', error);
      throw error;
    }
  },

  /**
   * Generate employee report
   */
  generateEmployeeReport: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/reporting/employees/?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate employee report:', error);
      throw error;
    }
  },

  /**
   * Generate payroll report
   */
  generatePayrollReport: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/reporting/payroll/?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate payroll report:', error);
      throw error;
    }
  },

  /**
   * Generate leave report
   */
  generateLeaveReport: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }
      const response = await api.get(`/reporting/leave/?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate leave report:', error);
      throw error;
    }
  },
};
