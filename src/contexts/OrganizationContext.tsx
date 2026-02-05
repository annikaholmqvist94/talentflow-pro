import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Organization, User } from '@/types';
import { api } from '@/utils/api';

interface OrganizationContextType {
  organizationId: string;
  organization: Organization | null;
  currentUser: User | null;
  setOrganizationId: (id: string) => void;
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

// Default test organization ID
const DEFAULT_ORG_ID = '11111111-1111-1111-1111-111111111111';
const DEFAULT_USER_EMAIL = 'sarah@acme.com';

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organizationId, setOrganizationId] = useState(DEFAULT_ORG_ID);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [orgData, userData] = await Promise.all([
          api.get<Organization>(`/organizations/${organizationId}`).catch(() => null),
          api.get<User>(`/users/email/${DEFAULT_USER_EMAIL}`).catch(() => null),
        ]);
        
        setOrganization(orgData);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Failed to fetch organization data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [organizationId]);
  
  return (
    <OrganizationContext.Provider 
      value={{ 
        organizationId, 
        organization, 
        currentUser, 
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
