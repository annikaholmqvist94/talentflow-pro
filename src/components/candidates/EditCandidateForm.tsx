import { useState } from 'react';
import { Candidate } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/api';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Loader2, X } from 'lucide-react';

interface EditCandidateFormProps {
  candidate: Candidate;
  onSaved: (updated: Candidate) => void;
  onCancel: () => void;
}

interface CandidateFormData {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  city: string;
  availability: string;
  educationLevel: string;
  isExperienced: boolean;
  skills: string[];
  summary: string;
}

export function EditCandidateForm({ candidate, onSaved, onCancel }: EditCandidateFormProps) {
  const { toast } = useToast();
  const { organizationId } = useOrganization();
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const c = candidate as any;
  const [form, setForm] = useState<CandidateFormData>({
    fullName: candidate.fullName || '',
    email: candidate.email || '',
    phone: candidate.phone || '',
    linkedinUrl: candidate.linkedinUrl || '',
    city: c.city || '',
    availability: c.availability || 'available',
    educationLevel: c.educationLevel || 'bachelor',
    isExperienced: c.isExperienced ?? true,
    skills: c.skills || [],
    summary: c.summary || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const body = {
        id: candidate.id,
        organizationId,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        city: form.city.trim() || undefined,
        availability: form.availability,
        educationLevel: form.educationLevel,
        isExperienced: form.isExperienced,
        skills: form.skills,
        summary: form.summary.trim() || undefined,
      };
      const updated = await api.put<Candidate>(`/candidates/${candidate.id}`, body);
      toast({ title: 'Candidate updated successfully!' });
      onSaved(updated);
    } catch (err) {
      toast({ title: 'Failed to update candidate', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const update = (field: keyof CandidateFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="space-y-5 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
      <h3 className="text-lg font-semibold text-foreground">Edit Candidate</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-fullName">Full Name *</Label>
          <Input id="edit-fullName" value={form.fullName} onChange={e => update('fullName', e.target.value)} />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-email">Email *</Label>
          <Input id="edit-email" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-phone">Phone</Label>
          <Input id="edit-phone" value={form.phone} onChange={e => update('phone', e.target.value)} />
        </div>

        {/* LinkedIn */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-linkedin">LinkedIn URL</Label>
          <Input id="edit-linkedin" value={form.linkedinUrl} onChange={e => update('linkedinUrl', e.target.value)} />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-city">City</Label>
          <Input id="edit-city" value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Stockholm, Sweden" />
        </div>

        {/* Availability */}
        <div className="space-y-1.5">
          <Label>Availability</Label>
          <Select value={form.availability} onValueChange={v => update('availability', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
              <SelectItem value="notice_period">Notice Period</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Education */}
        <div className="space-y-1.5">
          <Label>Education Level</Label>
          <Select value={form.educationLevel} onValueChange={v => update('educationLevel', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high_school">High School</SelectItem>
              <SelectItem value="bachelor">Bachelor</SelectItem>
              <SelectItem value="master">Master</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experienced */}
        <div className="flex items-center gap-2 pt-6">
          <Checkbox
            id="edit-experienced"
            checked={form.isExperienced}
            onCheckedChange={v => update('isExperienced', !!v)}
          />
          <Label htmlFor="edit-experienced" className="cursor-pointer">Experienced candidate</Label>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-1.5">
        <Label>Skills</Label>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            placeholder="Add a skill..."
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
          />
          <Button type="button" variant="secondary" onClick={addSkill} size="sm" className="shrink-0">Add</Button>
        </div>
        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.skills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-summary">Professional Summary</Label>
        <Textarea id="edit-summary" rows={4} value={form.summary} onChange={e => update('summary', e.target.value)} placeholder="Brief professional summary..." />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
