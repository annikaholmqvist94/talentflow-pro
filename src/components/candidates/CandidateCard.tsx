import { Candidate } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, ExternalLink } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

const mockExtras = {
  city: 'Stockholm, Sweden',
  availability: 'available' as const,
  educationLevel: 'Bachelor',
  isExperienced: true,
};

function getAvatarUrl(fullName: string) {
  const name = encodeURIComponent(fullName);
  return `https://ui-avatars.com/api/?name=${name}&background=E91E63&color=fff&size=60&bold=true`;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const { city, availability, educationLevel, isExperienced } = mockExtras;

  return (
    <Card
      className="border border-border hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Top: Avatar + Info */}
        <div className="flex items-start gap-4">
          <img
            src={getAvatarUrl(candidate.fullName)}
            alt={candidate.fullName}
            className="w-[60px] h-[60px] rounded-full border-2 border-pink-200 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground truncate">
              {candidate.fullName}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              📍 {city}
            </p>
            <a
              href={`mailto:${candidate.email}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5 truncate"
            >
              📧 <span className="truncate">{candidate.email}</span>
            </a>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1">
            {availability === 'available' ? '🟢' : '🔴'} Available
          </span>
          <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1">
            🎓 {educationLevel}
          </span>
          <span className={`${isExperienced ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-indigo-100 text-indigo-800 border-indigo-200'} border px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1`}>
            {isExperienced ? '💼 Experienced' : '🌱 Entry Level'}
          </span>
        </div>

        {/* Divider */}
        <hr className="my-4 border-border" />

        {/* Bottom: Actions */}
        <div className="space-y-3">
          {candidate.linkedinUrl && (
            <a
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="w-full"
            size="sm"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
