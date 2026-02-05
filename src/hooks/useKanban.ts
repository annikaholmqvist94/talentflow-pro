import { useState, useEffect, useCallback } from 'react';
import { Application, ApplicationStatus } from '@/types';
import { api } from '@/utils/api';
import { useOrganization } from '@/contexts/OrganizationContext';

export function useKanban(jobId?: string) {
  const { organizationId } = useOrganization();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = jobId
        ? `/applications/organization/${organizationId}/job/${jobId}`
        : `/applications/organization/${organizationId}`;
      
      const data = await api.get<Application[]>(endpoint);
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId, jobId]);
  
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);
  
  const moveApplication = async (id: string, newStatus: ApplicationStatus, notes?: string) => {
    try {
      await api.patch(`/applications/${id}/status`, {
        status: newStatus,
        notes: notes || `Moved to ${newStatus}`,
      });
      await fetchApplications();
    } catch (err) {
      console.error('Failed to move application:', err);
      throw err;
    }
  };
  
  const advanceApplication = async (id: string) => {
    try {
      await api.patch(`/applications/${id}/advance`);
      await fetchApplications();
    } catch (err) {
      console.error('Failed to advance application:', err);
      throw err;
    }
  };
  
  const rejectApplication = async (id: string) => {
    try {
      await api.patch(`/applications/${id}/reject`);
      await fetchApplications();
    } catch (err) {
      console.error('Failed to reject application:', err);
      throw err;
    }
  };
  
  const makeOffer = async (id: string) => {
    try {
      await api.patch(`/applications/${id}/offer`);
      await fetchApplications();
    } catch (err) {
      console.error('Failed to make offer:', err);
      throw err;
    }
  };
  
  const groupedByStatus: Record<ApplicationStatus, Application[]> = {
    NEW: applications.filter(app => app.status === 'NEW'),
    SCREENING: applications.filter(app => app.status === 'SCREENING'),
    INTERVIEW: applications.filter(app => app.status === 'INTERVIEW'),
    OFFER: applications.filter(app => app.status === 'OFFER'),
    REJECTED: applications.filter(app => app.status === 'REJECTED'),
  };
  
  const stats = {
    newCount: groupedByStatus.NEW.length,
    screeningCount: groupedByStatus.SCREENING.length,
    interviewCount: groupedByStatus.INTERVIEW.length,
    offerCount: groupedByStatus.OFFER.length,
    rejectedCount: groupedByStatus.REJECTED.length,
    total: applications.length,
  };
  
  return { 
    applications, 
    groupedByStatus, 
    loading, 
    error,
    stats,
    moveApplication, 
    advanceApplication,
    rejectApplication,
    makeOffer,
    refresh: fetchApplications 
  };
}
