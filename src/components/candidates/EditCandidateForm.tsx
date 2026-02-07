import { useState } from 'react';
import { Candidate } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
import { Loader2 } from 'lucide-react';

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
}

export function EditCandidateForm({ candidate, onSaved, onCancel }: EditCandidateFormProps) {
  const { toast } = useToast();
  const { organizationId } = useOrganization();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CandidateFormData>({
    fullName: candidate.fullName || '',
    email: candidate.email || '',
    phone: candidate.phone || '',
    linkedinUrl: candidate.linkedinUrl || '',
    city: candidate.city || '',
    availability: candidate.availability || 'available',
    educationLevel: candidate.educationLevel || 'bachelor',
    isExperienced: candidate.isExperienced ?? true,
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
        organizationId: candidate.organizationId || organizationId,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        city: form.city.trim() || undefined,
        availability: form.availability,
        educationLevel: form.educationLevel,
        isExperienced: form.isExperienced,
        skills: candidate.skills || [],
        summary: candidate.summary || undefined,
        notes: candidate.notes,
        resumeUrl: candidate.resumeUrl,
        createdAt: candidate.createdAt,
      };
      console.log('PUT body:', body);
      const updated = await api.put<Candidate>(`/candidates/${candidate.id}`, body);
      console.log('PUT response (updated candidate):', updated);
      toast({ title: 'Candidate updated successfully!' });
      // Pass the updated candidate with form values as fallback
      const merged: Candidate = {
        ...candidate,
        ...updated,
        fullName: updated.fullName || form.fullName.trim(),
        email: updated.email || form.email.trim(),
        phone: (updated.phone ?? form.phone.trim()) || undefined,
        linkedinUrl: (updated.linkedinUrl ?? form.linkedinUrl.trim()) || undefined,
        city: (updated.city ?? form.city.trim()) || undefined,
        availability: updated.availability || form.availability,
        educationLevel: updated.educationLevel || form.educationLevel,
        isExperienced: updated.isExperienced ?? form.isExperienced,
      };
      onSaved(merged);
    } catch (err) {
      toast({ title: 'Failed to update candidate', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
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
