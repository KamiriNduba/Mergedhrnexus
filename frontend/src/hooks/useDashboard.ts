import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api/dashboard';

export const useDashboard = () => {
  const getHRDashboard = (branch?: string) =>
    useQuery({
      queryKey: ['dashboard', 'hr', branch],
      queryFn: () => dashboardApi.getHRDashboard(branch).then((res) => res.data),
      staleTime: 5 * 60 * 1000,
    });

  const getBranchDashboard = (branchId: string) =>
    useQuery({
      queryKey: ['dashboard', 'branch', branchId],
      queryFn: () => dashboardApi.getBranchDashboard(branchId).then((res) => res.data),
      enabled: !!branchId,
      staleTime: 5 * 60 * 1000,
    });

  const getFinanceDashboard = (params?: Record<string, unknown>) =>
    useQuery({
      queryKey: ['dashboard', 'finance', params],
      queryFn: () => dashboardApi.getFinanceDashboard(params).then((res) => res.data),
      staleTime: 5 * 60 * 1000,
    });

  const getAttendanceDashboard = (params?: Record<string, unknown>) =>
    useQuery({
      queryKey: ['dashboard', 'attendance', params],
      queryFn: () => dashboardApi.getAttendanceDashboard(params).then((res) => res.data),
      staleTime: 5 * 60 * 1000,
    });

  const getExecutiveDashboard = (params?: any) =>
    useQuery({
      queryKey: ['dashboard', 'executive', params],
      queryFn: () => dashboardApi.getExecutiveDashboard(params).then((res) => res.data),
      staleTime: 5 * 60 * 1000,
    });

  return {
    getHRDashboard,
    getBranchDashboard,
    getExecutiveDashboard,
    getFinanceDashboard,
    getAttendanceDashboard,
  };
};