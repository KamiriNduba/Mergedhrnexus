/**
 * Data Synchronization Service
 * 
 * Provides utilities for keeping frontend state synchronized with backend data,
 * handling CRUD operations, and managing cache invalidation.
 */

import { api } from '../api/api';

/**
 * Cache key generator for different data types
 */
export const cacheKeys = {
  employees: 'employees',
  employee: (id: number) => `employee_${id}`,
  documents: (employeeId: number) => `documents_${employeeId}`,
  leaveRequests: (employeeId: number) => `leave_requests_${employeeId}`,
  leaveTypes: 'leave_types',
  departments: 'departments',
  branches: 'branches',
  payslips: (employeeId: number) => `payslips_${employeeId}`,
  attendance: (employeeId: number) => `attendance_${employeeId}`,
  benefits: (employeeId: number) => `benefits_${employeeId}`,
  performance: (employeeId: number) => `performance_${employeeId}`,
};

/**
 * Local cache for data
 */
const dataCache = new Map<string, { data: any; timestamp: number }>();

/**
 * Cache duration in milliseconds (5 minutes)
 */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Check if cached data is still valid
 */
function isCacheValid(key: string): boolean {
  const cached = dataCache.get(key);
  if (!cached) return false;
  
  const now = Date.now();
  return now - cached.timestamp < CACHE_DURATION;
}

/**
 * Get cached data
 */
export function getCachedData(key: string): any | null {
  if (isCacheValid(key)) {
    return dataCache.get(key)?.data ?? null;
  }
  dataCache.delete(key);
  return null;
}

/**
 * Set cached data
 */
export function setCachedData(key: string, data: any): void {
  dataCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Invalidate cache for a specific key
 */
export function invalidateCache(key: string): void {
  dataCache.delete(key);
}

/**
 * Invalidate all cache
 */
export function invalidateAllCache(): void {
  dataCache.clear();
}

/**
 * Invalidate related cache entries
 */
export function invalidateRelatedCache(pattern: string): void {
  const keys = Array.from(dataCache.keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      dataCache.delete(key);
    }
  });
}

/**
 * Fetch data with caching
 */
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: { cache?: boolean; cacheDuration?: number } = {}
): Promise<T> {
  const { cache = true, cacheDuration = CACHE_DURATION } = options;

  // Check cache first
  if (cache) {
    const cached = getCachedData(key);
    if (cached !== null) {
      return cached as T;
    }
  }

  // Fetch from backend
  const data = await fetchFn();

  // Store in cache
  if (cache) {
    dataCache.set(key, { data, timestamp: Date.now() });
  }

  return data;
}

/**
 * Generic CRUD operations with optimistic updates
 */
export class DataSyncManager {
  private pendingUpdates = new Map<string, any>();
  private updateCallbacks = new Map<string, Set<(data: any) => void>>();

  /**
   * Subscribe to data changes
   */
  subscribe(key: string, callback: (data: any) => void): () => void {
    if (!this.updateCallbacks.has(key)) {
      this.updateCallbacks.set(key, new Set());
    }
    this.updateCallbacks.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.updateCallbacks.get(key)?.delete(callback);
    };
  }

  /**
   * Notify subscribers of data changes
   */
  private notifySubscribers(key: string, data: any): void {
    const callbacks = this.updateCallbacks.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * Create operation with optimistic update
   */
  async create<T>(
    endpoint: string,
    data: any,
    cacheKey: string
  ): Promise<T> {
    // Optimistic update
    const optimisticId = `temp_${Date.now()}`;
    const optimisticData = { ...data, id: optimisticId };
    this.notifySubscribers(cacheKey, optimisticData);

    try {
      // Send to backend
      const response = await api.post(endpoint, data);
      const createdData = response.data;

      // Update cache
      invalidateCache(cacheKey);
      this.notifySubscribers(cacheKey, createdData);

      return createdData;
    } catch (error) {
      // Rollback on error
      this.notifySubscribers(cacheKey, null);
      throw error;
    }
  }

  /**
   * Update operation with optimistic update
   */
  async update<T>(
    endpoint: string,
    id: string | number,
    data: any,
    cacheKey: string
  ): Promise<T> {
    // Get current data
    const currentData = getCachedData(cacheKey);

    // Optimistic update
    const optimisticData = { ...currentData, ...data };
    this.notifySubscribers(cacheKey, optimisticData);

    try {
      // Send to backend
      const response = await api.put(`${endpoint}${id}/`, data);
      const updatedData = response.data;

      // Update cache
      setCachedData(cacheKey, updatedData);
      this.notifySubscribers(cacheKey, updatedData);

      return updatedData;
    } catch (error) {
      // Rollback on error
      if (currentData) {
        this.notifySubscribers(cacheKey, currentData);
      }
      throw error;
    }
  }

  /**
   * Delete operation with optimistic update
   */
  async delete(
    endpoint: string,
    id: string | number,
    cacheKey: string
  ): Promise<void> {
    // Optimistic delete
    this.notifySubscribers(cacheKey, null);

    try {
      // Send to backend
      await api.delete(`${endpoint}${id}/`);

      // Invalidate cache
      invalidateCache(cacheKey);
      invalidateRelatedCache(cacheKey.split('_')[0]);
    } catch (error) {
      // Rollback on error
      invalidateCache(cacheKey);
      throw error;
    }
  }

  /**
   * Batch create operations
   */
  async batchCreate<T>(
    endpoint: string,
    items: any[],
    cacheKey: string
  ): Promise<T[]> {
    try {
      const response = await api.post(`${endpoint}batch/`, { items });
      const createdItems = response.data;

      // Invalidate cache
      invalidateCache(cacheKey);

      return createdItems;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Batch delete operations
   */
  async batchDelete(
    endpoint: string,
    ids: (string | number)[],
    cacheKey: string
  ): Promise<void> {
    try {
      await api.post(`${endpoint}batch-delete/`, { ids });

      // Invalidate cache
      invalidateCache(cacheKey);
      invalidateRelatedCache(cacheKey.split('_')[0]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sync data from backend
   */
  async sync<T>(
    endpoint: string,
    cacheKey: string,
    options: { cache?: boolean } = {}
  ): Promise<T> {
    return fetchWithCache(cacheKey, async () => {
      const response = await api.get(endpoint);
      return response.data;
    }, options);
  }

  /**
   * Get pending updates
   */
  getPendingUpdates(): Map<string, any> {
    return new Map(this.pendingUpdates);
  }

  /**
   * Clear pending updates
   */
  clearPendingUpdates(): void {
    this.pendingUpdates.clear();
  }
}

/**
 * Global data sync manager instance
 */
export const dataSyncManager = new DataSyncManager();

/**
 * Retry logic for failed requests
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Debounced sync function
 */
export function createDebouncedSync<T>(
  syncFn: () => Promise<T>,
  delayMs: number = 500
): () => Promise<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let promise: Promise<T> | null = null;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!promise) {
      promise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await syncFn();
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            promise = null;
            timeoutId = null;
          }
        }, delayMs);
      });
    }

    return promise;
  };
}

/**
 * Conflict resolution strategies
 */
export enum ConflictResolution {
  CLIENT_WINS = 'client_wins',
  SERVER_WINS = 'server_wins',
  MERGE = 'merge',
  PROMPT = 'prompt',
}

/**
 * Handle data conflicts
 */
export function resolveConflict(
  clientData: any,
  serverData: any,
  strategy: ConflictResolution = ConflictResolution.SERVER_WINS
): any {
  switch (strategy) {
    case ConflictResolution.CLIENT_WINS:
      return clientData;
    case ConflictResolution.SERVER_WINS:
      return serverData;
    case ConflictResolution.MERGE:
      return { ...serverData, ...clientData };
    case ConflictResolution.PROMPT:
      // In a real app, this would show a dialog
      console.warn('Conflict detected:', { clientData, serverData });
      return serverData;
    default:
      return serverData;
  }
}
