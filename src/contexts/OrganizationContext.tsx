import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Organization, User } from '@/types';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

interface OrganizationContextType {
  organizationId: string;
  organization: Organization | null;
  setOrganizationId: (id: string) => void;
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  
  const [organizationId, setOrganizationIdState] = useState<string>(() => {
    // For admins, check localStorage first
    if (currentUser?.role === 'ADMIN') {
      const saved = localStorage.getItem('adminSelectedOrgId');
      if (saved) return saved;
    }
    // Fall back to user's organization
    return currentUser?.organizationId || '11111111-1111-1111-1111-111111111111';
  });
  
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // Update organizationId when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'ADMIN') {
        const saved = localStorage.getItem('adminSelectedOrgId');
        if (saved) {
          setOrganizationIdState(saved);
        } else {
          setOrganizationIdState(currentUser.organizationId);
        }
      } else {
        // Regular users always use their organization
        setOrganizationIdState(currentUser.organizationId);
        localStorage.removeItem('adminSelectedOrgId');
      }
    }
  }, [currentUser]);
  
  useEffect(() => {
    async function fetchData() {
      if (!organizationId) return;
      
      setLoading(true);
      try {
        const orgData = await api.get<Organization>(`/organizations/${organizationId}`).catch(() => null);
        setOrganization(orgData);
      } catch (error) {
        console.error('Failed to fetch organization data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [organizationId]);

  const setOrganizationId = useCallback((id: string) => {
    setOrganizationIdState(id);
    if (currentUser?.role === 'ADMIN') {
      localStorage.setItem('adminSelectedOrgId', id);
    }
  }, [currentUser]);
  
  return (
    <OrganizationContext.Provider 
      value={{ 
        organizationId, 
        organization, 
        setOrganizationId,
        loading 
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
