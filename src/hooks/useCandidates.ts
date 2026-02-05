import { useState, useEffect, useCallback } from 'react';
import { Candidate } from '@/types';
import { api } from '@/utils/api';
import { useOrganization } from '@/contexts/OrganizationContext';

export function useCandidates() {
  const { organizationId } = useOrganization();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Candidate[]>(`/candidates/organization/${organizationId}`);
      setCandidates(data || []);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);
  
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);
  
  const searchCandidates = async (name: string) => {
    if (!name.trim()) {
      return fetchCandidates();
    }
    setLoading(true);
    try {
      const data = await api.get<Candidate[]>(`/candidates/organization/${organizationId}/search?name=${encodeURIComponent(name)}`);
      setCandidates(data || []);
    } catch (err) {
      console.error('Failed to search candidates:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const createCandidate = async (candidate: Omit<Candidate, 'id' | 'createdAt'>) => {
    const data = await api.post<Candidate>('/candidates', candidate);
    await fetchCandidates();
    return data;
  };
  
  const updateCandidate = async (id: string, candidate: Partial<Candidate>) => {
    const data = await api.put<Candidate>(`/candidates/${id}`, candidate);
    await fetchCandidates();
    return data;
  };
  
  const deleteCandidate = async (id: string) => {
    await api.delete(`/candidates/${id}`);
    await fetchCandidates();
  };
  
  return {
    candidates,
    loading,
    error,
    searchCandidates,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    refresh: fetchCandidates,
  };
}
