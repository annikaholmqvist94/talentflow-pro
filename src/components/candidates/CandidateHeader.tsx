import { Candidate } from '@/types';
import { getInitials } from '@/utils/formatters';

interface CandidateHeaderProps {
  candidate: Candidate;
}

const mockExtras = {
  city: 'Stockholm, Sweden',
  availability: 'available',
  educationLevel: 'Bachelor',
  isExperienced: true,
};

export function CandidateHeader({ candidate }: CandidateHeaderProps) {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=E91E63&color=fff&size=80&bold=true`;

  return (
    <div className="bg-gradient-to-br from-primary to-secondary p-6 sm:p-8 rounded-t-lg">
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt={candidate.fullName}
          className="w-20 h-20 rounded-full border-2 border-white/30 shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="flex-1 min-w-0">
          <h2 id="modal-title" className="text-2xl font-bold text-primary-foreground truncate">
            {candidate.fullName}
          </h2>
          <p className="text-sm text-primary-foreground/80 mt-1">
            📍 {mockExtras.city}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {mockExtras.availability === 'available' && (
              <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded text-xs font-medium">
                🟢 Available
              </span>
            )}
            <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-xs font-medium">
              🎓 {mockExtras.educationLevel}
            </span>
            {mockExtras.isExperienced && (
              <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-xs font-medium">
                💼 Experienced
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
