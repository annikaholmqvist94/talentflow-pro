import { useState, useEffect } from 'react';
import { Candidate } from '@/types';
import { api } from '@/utils/api';
import { Mail, Phone, Linkedin, ExternalLink, MapPin, GraduationCap, FileDown, Plus, ArrowRight, FileText, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SummaryTabProps {
  candidate: Candidate;
}

interface Activity {
  id: string;
  activityType: string;
  description: string;
  createdAt: string;
}

const educationLabels: Record<string, string> = {
  high_school: 'High School',
  bachelor: 'Bachelor',
  master: 'Master',
  phd: 'PhD',
  other: 'Other',
};

const activityIcons: Record<string, React.ReactNode> = {
  candidate_added: <Plus className="h-3 w-3" />,
  status_changed: <ArrowRight className="h-3 w-3" />,
  note_added: <FileText className="h-3 w-3" />,
  scorecard_updated: <BarChart3 className="h-3 w-3" />,
};

export function SummaryTab({ candidate }: SummaryTabProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [actLoading, setActLoading] = useState(true);
  const [actError, setActError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchActivities = async () => {
      setActLoading(true);
      setActError(false);
      try {
        const data = await api.get<Activity[]>(`/activities/candidate/${candidate.id}`);
        if (!cancelled) setActivities(data || []);
      } catch {
        if (!cancelled) setActError(true);
      } finally {
        if (!cancelled) setActLoading(false);
      }
    };
    fetchActivities();
    return () => { cancelled = true; };
  }, [candidate.id]);

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
              <span className="font-medium text-foreground ml-auto">
                {candidate.educationLevel ? educationLabels[candidate.educationLevel] || candidate.educationLevel : 'Not specified'}
              </span>
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
              <span className="text-foreground">{candidate.city || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground italic">No resume uploaded</span>
            </div>
          </dl>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(candidate.skills && candidate.skills.length > 0) ? candidate.skills.map((skill) => (
              <span key={skill} className="bg-success text-success-foreground text-sm px-3 py-1 rounded-full font-medium hover:opacity-90 transition">
                {skill}
              </span>
            )) : (
              <p className="text-sm text-muted-foreground">No skills added</p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3">Professional Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {candidate.summary || 'No summary provided'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3">Recent Activity</h3>
          {actLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading activities...
            </div>
          ) : actError ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <AlertCircle className="h-4 w-4" /> Could not load activities
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <ul className="space-y-2 text-sm text-muted-foreground">
              {activities.map((act) => (
                <li key={act.id} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {activityIcons[act.activityType] || <Plus className="h-3 w-3" />}
                  </span>
                  <span>{act.description}</span>
                  <span className="ml-auto text-xs whitespace-nowrap">
                    {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
