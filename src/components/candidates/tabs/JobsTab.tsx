import { useState, useEffect } from 'react';
import { Candidate, Application } from '@/types';
import { api } from '@/utils/api';
import { Briefcase, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { formatRelativeDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface JobsTabProps {
  candidate: Candidate;
}

const statusStyle: Record<string, string> = {
  NEW: 'bg-muted text-muted-foreground',
  SCREENING: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  INTERVIEW: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  OFFER: 'bg-green-500/15 text-green-700 dark:text-green-300',
  REJECTED: 'bg-destructive/15 text-destructive',
};

export function JobsTab({ candidate }: JobsTabProps) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.get<Application[]>(`/applications/candidate/${candidate.id}`)
      .then(data => setApplications(data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [candidate.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center shadow-sm">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Could not load applications</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center shadow-sm">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No applications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Applied Jobs ({applications.length})</h3>
      {applications.map((app) => {
        const appliedDate = (app as any).appliedDate || app.appliedAt;
        return (
          <div key={app.id} className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{app.job?.title || 'Unknown Job'}</p>
                  {(app.job?.department || app.job?.location) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[app.job.department, app.job.location].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  {appliedDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied {formatRelativeDate(appliedDate)}
                    </p>
                  )}
                </div>
              </div>
              <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap', statusStyle[app.status])}>
                {app.status}
              </span>
            </div>
            {app.jobId && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => navigate(`/jobs/${app.jobId}`)}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  View Job <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
