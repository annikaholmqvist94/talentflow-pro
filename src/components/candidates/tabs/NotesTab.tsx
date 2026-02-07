import { Candidate } from '@/types';
import { FileText, Clock } from 'lucide-react';

interface NotesTabProps {
  candidate: Candidate;
}

export function NotesTab({ candidate }: NotesTabProps) {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-3">Internal Notes</h3>
        {candidate.notes ? (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.notes}</p>
        ) : (
          <div className="text-center py-4">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notes added yet</p>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-3">Notes History</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Admin updated notes 2 hours ago
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            System added candidate 3 days ago
          </li>
        </ul>
      </div>
    </div>
  );
}
