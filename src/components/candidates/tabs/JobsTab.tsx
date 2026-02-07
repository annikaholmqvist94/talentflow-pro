import { useState, useEffect } from 'react';
import { Candidate, Application } from '@/types';
import { api } from '@/utils/api';
import { Briefcase, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface JobsTabProps {
  candidate: Candidate;
}

const statusStyle: Record<string, string> = {
  NEW: 'bg-gray-500 text-white',
  SCREENING: 'bg-blue-500 text-white',
  INTERVIEW: 'bg-purple-600 text-white',
  OFFER: 'bg-green-500 text-white',
  REJECTED: 'bg-red-500 text-white',
};

export function JobsTab({ candidate }: JobsTabProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await api.get<Application[]>(`/applications/candidate/${candidate.id}`);
        setApplications(data || []);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [candidate.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
      {applications.map((app) => (
        <div key={app.id} className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">{app.job?.title || 'Unknown Job'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Applied {formatRelativeDate(app.appliedAt)}
                </p>
              </div>
            </div>
            <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', statusStyle[app.status])}>
              {app.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
