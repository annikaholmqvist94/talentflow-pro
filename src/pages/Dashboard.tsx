import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { GreetingCard } from '@/components/dashboard/GreetingCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { InternalJobsCard } from '@/components/dashboard/InternalJobsCard';
import { ActiveApplicationsCard } from '@/components/dashboard/ActiveApplicationsCard';
import { UpcomingMeetingsCard } from '@/components/dashboard/UpcomingMeetingsCard';
import { useOrganization } from '@/contexts/OrganizationContext';
import { api } from '@/utils/api';
import { Application } from '@/types';

export default function Dashboard() {
  const { organizationId } = useOrganization();
  const [totalApplications, setTotalApplications] = useState(0);
  
  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.get<Application[]>(`/applications/organization/${organizationId}`);
        setTotalApplications(data?.length || 0);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    }
    fetchStats();
  }, [organizationId]);
  
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Greeting */}
        <GreetingCard />
        
        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6">
            <InternalJobsCard />
          </div>
          
          {/* Center Column */}
          <div className="space-y-6">
            <ActiveApplicationsCard />
            <StatsCard 
              title="Career stats"
              subtitle="Total pipeline"
              value={totalApplications}
              label="Applications"
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <UpcomingMeetingsCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
