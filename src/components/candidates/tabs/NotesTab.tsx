import { useState, useEffect, useRef, useCallback } from 'react';
import { Candidate } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/contexts/OrganizationContext';
import { api } from '@/utils/api';
import { FileText, Clock, Loader2, Check, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotesTabProps {
  candidate: Candidate;
  onCandidateUpdated?: () => void;
}

interface Activity {
  id: string;
  activityType: string;
  description: string;
  createdAt: string;
}

type SaveState = 'idle' | 'saving' | 'saved';

export function NotesTab({ candidate, onCandidateUpdated }: NotesTabProps) {
  const { toast } = useToast();
  const { organizationId } = useOrganization();
  const [notes, setNotes] = useState(candidate.notes || '');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const savedTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync notes when candidate changes
  useEffect(() => {
    setNotes(candidate.notes || '');
  }, [candidate.id, candidate.notes]);

  // Fetch note-related activities
  useEffect(() => {
    setActivitiesLoading(true);
    api.get<Activity[]>(`/activities/candidate/${candidate.id}`)
      .then(data => setActivities((data || []).filter(a =>
        a.activityType === 'note_added' || a.activityType === 'candidate_added'
      )))
      .catch(() => setActivities([]))
      .finally(() => setActivitiesLoading(false));
  }, [candidate.id]);

  const saveNotes = useCallback(async (text: string) => {
    setSaveState('saving');
    try {
      await api.put(`/candidates/${candidate.id}`, {
        id: candidate.id,
        organizationId,
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        linkedinUrl: candidate.linkedinUrl,
        city: candidate.city,
        availability: candidate.availability,
        educationLevel: candidate.educationLevel,
        isExperienced: candidate.isExperienced,
        skills: candidate.skills,
        summary: candidate.summary,
        notes: text.trim() || null,
      });
      setSaveState('saved');
      onCandidateUpdated?.();
      savedTimerRef.current = setTimeout(() => setSaveState('idle'), 2000);
    } catch {
      setSaveState('idle');
      toast({ title: 'Failed to save notes', variant: 'destructive' });
    }
  }, [candidate, organizationId, onCandidateUpdated, toast]);

  // Debounced auto-save
  const handleChange = (value: string) => {
    setNotes(value);
    setSaveState('idle');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveNotes(value), 2000);
  };

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const handleManualSave = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    saveNotes(notes);
  };

  return (
    <div className="space-y-4">
      {/* Notes Editor */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Label className="font-semibold text-foreground">Internal Notes</Label>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {saveState === 'saving' && <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>}
            {saveState === 'saved' && <><Check className="h-3 w-3 text-green-500" /> Saved</>}
          </span>
        </div>
        <Textarea
          value={notes}
          onChange={e => handleChange(e.target.value)}
          placeholder="Add internal notes about this candidate here..."
          rows={5}
          className="resize-y"
        />
        <div className="flex justify-end mt-3">
          <Button size="sm" onClick={handleManualSave} disabled={saveState === 'saving'}>
            {saveState === 'saving' && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
            Save Notes
          </Button>
        </div>
      </div>

      {/* Notes History */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-3">Notes History</h3>
        {activitiesLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notes history yet</p>
          </div>
        ) : (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {activities.map(a => (
              <li key={a.id} className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                {a.description} {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
