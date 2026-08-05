import { apiClient } from './client';

/**
 * Dashboard API
 *
 * Maps to the Django /api/reporting/dashboard/ endpoints.
 */
export const dashboardApi = {
  /** HR overview dashboard */
  getHRDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/overview/', { params }),

  /** Role-specific dashboard (executive / manager / employee) */
  getRoleDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/my-dashboard/', { params }),

  /** Branch-specific dashboard (maps to overview filtered by branch) */
  getBranchDashboard: (branchId: string, params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/overview/', { params: { branch: branchId, ...params } }),

  /** Executive summary dashboard */
  getExecutiveDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/overview/', { params }),

  /** Payroll finance dashboard */
  getFinanceDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/payroll/', { params }),

  /** Attendance dashboard */
  getAttendanceDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/attendance/', { params }),

  /** Leave / absence dashboard */
  getLeaveDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/leave/', { params }),

  /** Performance dashboard */
  getPerformanceDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/performance/', { params }),

  /** Training dashboard */
  getTrainingDashboard: (params?: Record<string, unknown>) =>
    apiClient.get('/reporting/dashboard/training/', { params }),
};
