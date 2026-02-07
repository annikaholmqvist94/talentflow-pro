import { Candidate } from '@/types';
import { Mail, Phone, Linkedin, ExternalLink, MapPin, GraduationCap, FileDown } from 'lucide-react';

interface SummaryTabProps {
  candidate: Candidate;
}

const mockSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Agile'];
const mockSummary = 'Experienced full-stack developer with 5+ years building scalable web applications. Strong in React, Node.js, and cloud technologies.';

export function SummaryTab({ candidate }: SummaryTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left Column - Details */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Candidate Details</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-20">Name</span>
              <span className="font-medium text-foreground">{candidate.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Education</span>
              <span className="font-medium text-foreground ml-auto">Bachelor</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{candidate.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${candidate.email}`} className="text-primary hover:underline truncate">
                {candidate.email}
              </a>
            </div>
            {candidate.linkedinUrl && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Stockholm, Sweden</span>
            </div>
            <div className="flex items-center gap-2">
              <FileDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground italic">No resume uploaded</span>
            </div>
          </dl>
        </div>
      </div>

      {/* Right Column - Skills & Summary */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockSkills.map((skill) => (
              <span
                key={skill}
                className="bg-success text-success-foreground text-sm px-3 py-1 rounded-full font-medium hover:opacity-90 transition"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3">Professional Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{mockSummary}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3">Recent Activity</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Added to pipeline 2 days ago
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Moved to SCREENING yesterday
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
