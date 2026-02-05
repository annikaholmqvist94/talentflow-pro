import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/types';
import { api } from '@/utils/api';
import { useOrganization } from '@/contexts/OrganizationContext';

export function useJobs() {
  const { organizationId } = useOrganization();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchJobs = useCallback(async (activeOnly = false) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = activeOnly
        ? `/jobs/organization/${organizationId}/active`
        : `/jobs/organization/${organizationId}`;
      
      const data = await api.get<Job[]>(endpoint);
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);
  
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  
  const searchJobs = async (title: string) => {
    if (!title.trim()) {
      return fetchJobs();
    }
    setLoading(true);
    try {
      const data = await api.get<Job[]>(`/jobs/organization/${organizationId}/search?title=${encodeURIComponent(title)}`);
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to search jobs:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const createJob = async (job: Omit<Job, 'id' | 'createdAt'>) => {
    const data = await api.post<Job>('/jobs', job);
    await fetchJobs();
    return data;
  };
  
  const updateJob = async (id: string, job: Partial<Job>) => {
    const data = await api.put<Job>(`/jobs/${id}`, job);
    await fetchJobs();
    return data;
  };
  
  const closeJob = async (id: string) => {
    await api.patch(`/jobs/${id}/close`);
    await fetchJobs();
  };
  
  const deleteJob = async (id: string) => {
    await api.delete(`/jobs/${id}`);
    await fetchJobs();
  };
  
  return {
    jobs,
    loading,
    error,
    fetchJobs,
    searchJobs,
    createJob,
    updateJob,
    closeJob,
    deleteJob,
    refresh: fetchJobs,
  };
}
