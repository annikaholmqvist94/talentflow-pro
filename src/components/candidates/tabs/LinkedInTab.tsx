import { Candidate } from '@/types';
import { Linkedin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LinkedInTabProps {
  candidate: Candidate;
}

export function LinkedInTab({ candidate }: LinkedInTabProps) {
  if (!candidate.linkedinUrl) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center shadow-sm">
        <Linkedin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">No LinkedIn profile provided</p>
        <Button variant="secondary">Add LinkedIn URL</Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Linkedin className="h-6 w-6 text-primary" />
        <h3 className="font-semibold text-foreground">LinkedIn Profile</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4 break-all">{candidate.linkedinUrl}</p>
      <Button asChild>
        <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer">
          Open in New Tab <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </Button>
    </div>
  );
}
