import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/contexts/OrganizationContext';
import { api } from '@/utils/api';
import { Job, Application, Candidate } from '@/types';

interface AddToJobDialogProps {
  candidate: Candidate;
  open: boolean;
  onClose: () => void;
}

export function AddToJobDialog({ candidate, open, onClose }: AddToJobDialogProps) {
  const { organizationId } = useOrganization();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedJobId('');
    setLoading(true);
    api.get<Job[]>(`/jobs/organization/${organizationId}/active`)
      .then((data) => setJobs(data || []))
      .catch(() => {
        // Fallback to all jobs if active endpoint fails
        return api.get<Job[]>(`/jobs/organization/${organizationId}`);
      })
      .then((data) => { if (data) setJobs(data); })
      .catch(() => toast({ title: 'Failed to load jobs', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [open, organizationId]);

  const handleSubmit = async () => {
    if (!selectedJobId) return;
    setSubmitting(true);
    try {
      await api.post<Application>('/applications', {
        candidateId: candidate.id,
        jobId: selectedJobId,
        organizationId,
        status: 'NEW',
        appliedAt: new Date().toISOString(),
      });
      const jobTitle = jobs.find(j => j.id === selectedJobId)?.title || 'job';
      toast({ title: `${candidate.fullName} added to ${jobTitle}!` });
      onClose();
    } catch (err) {
      toast({ title: 'Failed to add candidate to job', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Add {candidate.fullName} to Job
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active jobs found. Create a job first.</p>
          ) : (
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job..." />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} — {job.department || job.location || 'No dept'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!selectedJobId || submitting}
            className="w-full"
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Add to Pipeline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
