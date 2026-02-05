import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Calendar,
  Loader2,
  Briefcase
} from 'lucide-react';
import { Job, ApplicationStats } from '@/types';
import { api } from '@/utils/api';
import { jobStatusColors, formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      
      try {
        const [jobData, statsData] = await Promise.all([
          api.get<Job>(`/jobs/${id}`),
          api.get<ApplicationStats>(`/applications/job/${id}/stats`).catch(() => null),
        ]);
        
        setJob(jobData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to fetch job:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchJob();
  }, [id]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!job) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">Job not found</h3>
          <Button asChild variant="link" className="mt-2">
            <Link to="/jobs">Back to Jobs</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/jobs" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        
        {/* Job Header */}
        <Card className="card-shadow border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  <Badge className={cn('text-white', jobStatusColors[job.status])}>
                    {job.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                  {job.department && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      <span>{job.department}</span>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              {stats && (
                <div className="flex gap-3">
                  <StatBox label="New" count={stats.newCount} color="bg-gray-500" />
                  <StatBox label="Active" count={stats.screeningCount + stats.interviewCount} color="bg-blue-500" />
                  <StatBox label="Offers" count={stats.offerCount} color="bg-green-500" />
                </div>
              )}
            </div>
            
            {job.description && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Pipeline for this job */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Applications Pipeline</h2>
          <KanbanBoard jobId={id} />
        </div>
      </div>
    </MainLayout>
  );
}

function StatBox({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="text-center">
      <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg', color)}>
        {count}
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
