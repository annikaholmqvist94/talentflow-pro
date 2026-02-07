import { useState, useEffect } from 'react';
import { Candidate } from '@/types';
import { api } from '@/utils/api';
import { Mail, Phone, Linkedin, ExternalLink, MapPin, GraduationCap, FileDown, Plus, ArrowRight, FileText, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/contexts/OrganizationContext';
import { InlineSkillsEditor } from './InlineSkillsEditor';
import { InlineSummaryEditor } from './InlineSummaryEditor';

interface SummaryTabProps {
    candidate: Candidate;
    onCandidateUpdated?: (updated: Candidate) => void;
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

function parseDate(value: string | number): Date {
    if (typeof value === 'number') {
        return value < 1e12 ? new Date(value * 1000) : new Date(value);
    }
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
    return new Date();
}

export function SummaryTab({ candidate, onCandidateUpdated }: SummaryTabProps) {
    const { toast } = useToast();
    const { organizationId } = useOrganization();
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
                <InlineSkillsEditor
                    skills={candidate.skills || []}
                    onSave={async (skills) => {
                        console.log('🔵 SummaryTab onSave called for skills:', skills);
                        console.log('🔵 Candidate ID:', candidate.id);
                        console.log('🔵 PUT URL:', `/candidates/${candidate.id}`);
                        const body = {
                            id: candidate.id,
                            organizationId: candidate.organizationId || organizationId,
                            fullName: candidate.fullName,
                            email: candidate.email,
                            phone: candidate.phone,
                            linkedinUrl: candidate.linkedinUrl,
                            resumeUrl: candidate.resumeUrl,
                            notes: candidate.notes,
                            city: candidate.city,
                            availability: candidate.availability,
                            educationLevel: candidate.educationLevel,
                            isExperienced: candidate.isExperienced,
                            summary: candidate.summary,
                            skills,
                        };
                        console.log('🔵 Request body:', body);
                        const updated = await api.put<Candidate>(`/candidates/${candidate.id}`, body);
                        console.log('🔵 Backend response:', updated);

                        // ✅ CRITICAL DEBUG: Check what backend actually returns
                        console.log('🔵 updated.skills:', updated.skills);
                        console.log('🔵 updated.summary:', updated.summary);
                        console.log('🔵 updated.city:', updated.city);
                        console.log('🔵 All updated keys:', Object.keys(updated));

                        const merged: Candidate = {
                            ...candidate,
                            skills: (updated?.skills && updated.skills.length > 0) ? updated.skills : skills,  // ✅ Kolla längd
                            ...updated
                        };
                        console.log('🔵 Merged candidate:', merged);
                        console.log('🔵 Merged skills:', merged.skills);
                        toast({ title: 'Skills updated!' });
                        onCandidateUpdated?.(merged);
                    }}
                />

                <InlineSummaryEditor
                    summary={candidate.summary || ''}
                    onSave={async (summary) => {
                        console.log('🔵 SummaryTab onSave called for summary:', summary);
                        console.log('🔵 Candidate ID:', candidate.id);
                        const body = {
                            id: candidate.id,
                            organizationId: candidate.organizationId || organizationId,
                            fullName: candidate.fullName,
                            email: candidate.email,
                            phone: candidate.phone,
                            linkedinUrl: candidate.linkedinUrl,
                            resumeUrl: candidate.resumeUrl,
                            notes: candidate.notes,
                            city: candidate.city,
                            availability: candidate.availability,
                            educationLevel: candidate.educationLevel,
                            isExperienced: candidate.isExperienced,
                            skills: candidate.skills,
                            summary: summary || undefined,
                        };
                        console.log('🔵 Request body:', body);
                        const updated = await api.put<Candidate>(`/candidates/${candidate.id}`, body);
                        console.log('🔵 Backend response:', updated);

                        // ✅ CRITICAL DEBUG: Check what backend actually returns
                        console.log('🔵 updated.summary:', updated.summary);
                        console.log('🔵 All updated keys:', Object.keys(updated));

                        const merged: Candidate = {
                            ...candidate,
                            summary: updated?.summary !== undefined ? updated.summary : summary,  // ✅ Explicit check
                            ...updated
                        };
                        console.log('🔵 Merged candidate:', merged);
                        console.log('🔵 Merged summary:', merged.summary);
                        toast({ title: 'Summary updated!' });
                        onCandidateUpdated?.(merged);
                    }}
                />

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
                    {formatDistanceToNow(parseDate(act.createdAt), { addSuffix: true })}
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