import { apiClient } from './client';

/**
 * Reports & Analytics API
 *
 * Maps to the Django /api/reporting/ endpoints.
 */
export const reportsApi = {
  /** Workforce / employee breakdown dashboard */
  getWorkforceAnalytics: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/employees/', { params }),

  /** Payroll cost dashboard */
  getPayrollAnalytics: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/payroll/', { params }),

  /** Attendance compliance dashboard */
  getComplianceAnalytics: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/attendance/', { params }),

  /** Benefits utilisation dashboard */
  getBenefitsAnalytics: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/leave/', { params }),

  /** Performance metrics dashboard */
  getPerformanceAnalytics: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/performance/', { params }),

  /** Training dashboard */
  getTrainingAnalytics: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/training/', { params }),

  /** Overview / summary dashboard */
  getDashboardOverview: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/overview/', { params }),

  /** Role-specific dashboard (my-dashboard) */
  getRoleDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/my-dashboard/', { params }),

  /** Generate a custom / ad-hoc report */
  getCustomReport: (data: Record<string, unknown>) =>
    apiClient.post('/reporting/generate/', data),

  /** Preview report output without saving */
  previewReport: (data: Record<string, unknown>) =>
    apiClient.post('/reporting/preview/', data),

  /** Saved report templates */
  getTemplates: () => apiClient.get('/reporting/templates/'),
  createTemplate: (data: Record<string, unknown>) =>
    apiClient.post('/reporting/templates/', data),

  /** Report execution history */
  getExecutions: () => apiClient.get('/reporting/executions/'),
};
