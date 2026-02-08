import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Application } from '@/types';
import { api } from '@/utils/api';
import { useOrganization } from '@/contexts/OrganizationContext';
import { getInitials } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

export function ActiveApplicationsCard() {
  const { organizationId } = useOrganization();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchApplications() {
      try {
          const data = await api.get<Application[]>(`/applications/organization/${organizationId}`);
          // Filter to active (non-rejected) applications
        const active = (data || []).filter(app => app.status !== 'REJECTED').slice(0, 4);
        setApplications(active);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, [organizationId]);
  
  return (
    <Card className="gradient-purple border-0 text-white overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <Users className="h-5 w-5" />
          Active applications 🏃
        </CardTitle>
        <p className="text-sm text-white/70">Team — you are the best.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/10">
              <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/20" />
            </div>
          ))
        ) : applications.length === 0 ? (
          <p className="text-sm text-white/70 text-center py-4">No active applications</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="flex items-center gap-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-white text-secondary text-xs font-semibold">
                    {app.candidate ? getInitials(app.candidate.fullName) : '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate">
                  {app.candidate?.fullName || 'Unknown'}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          asChild
          variant="secondary" 
          className="w-full mt-4 bg-secondary/80 hover:bg-secondary text-white border-0"
        >
          <Link to="/pipeline" className="flex items-center gap-2">
            View all candidates in segment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
