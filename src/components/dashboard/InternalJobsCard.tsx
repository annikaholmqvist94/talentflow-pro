import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Job } from '@/types';
import { api } from '@/utils/api';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Skeleton } from '@/components/ui/skeleton';

export function InternalJobsCard() {
  const { organizationId } = useOrganization();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await api.get<Job[]>(`/jobs/organization/${organizationId}/active`);
        setJobs((data || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [organizationId]);
  
  return (
    <Card className="card-shadow border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Briefcase className="h-5 w-5 text-primary" />
          Internal jobs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No active jobs</p>
        ) : (
          jobs.map((job) => (
            <div 
              key={job.id} 
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{job.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{job.location}</span>
                </div>
              </div>
              <Button size="sm" className="ml-3 bg-primary hover:bg-primary/90">
                Apply
              </Button>
            </div>
          ))
        )}
        
        {jobs.length > 0 && (
          <Link 
            to="/jobs" 
            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 font-medium pt-2"
          >
            View all jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
