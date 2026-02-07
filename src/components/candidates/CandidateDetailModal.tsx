import { useState } from 'react';
import { Candidate } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CandidateHeader } from './CandidateHeader';
import { SummaryTab } from './tabs/SummaryTab';
import { LinkedInTab } from './tabs/LinkedInTab';
import { JobsTab } from './tabs/JobsTab';
import { NotesTab } from './tabs/NotesTab';
import { ScorecardTab } from './tabs/ScorecardTab';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
}

type TabKey = 'summary' | 'linkedin' | 'jobs' | 'notes' | 'scorecard';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'linkedin', label: 'LinkedIn →' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'notes', label: 'Notes' },
  { key: 'scorecard', label: '📊 Scorecard' },
];

export function CandidateDetailModal({ candidate, open, onClose }: CandidateDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');

  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden p-0 gap-0"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <CandidateHeader candidate={candidate} />

        {/* Tabs */}
        <div className="border-b border-border px-6 overflow-x-auto" role="tablist">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'pb-3 pt-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-220px)]">
          {activeTab === 'summary' && <SummaryTab candidate={candidate} />}
          {activeTab === 'linkedin' && <LinkedInTab candidate={candidate} />}
          {activeTab === 'jobs' && <JobsTab candidate={candidate} />}
          {activeTab === 'notes' && <NotesTab candidate={candidate} />}
          {activeTab === 'scorecard' && <ScorecardTab candidateId={candidate.id} />}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button>Edit Candidate</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
