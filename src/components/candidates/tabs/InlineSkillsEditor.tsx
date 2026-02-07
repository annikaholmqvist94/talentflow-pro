import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

interface InlineSkillsEditorProps {
  skills: string[];
  onSave: (skills: string[]) => Promise<void>;
}

export function InlineSkillsEditor({ skills, onSave }: InlineSkillsEditorProps) {
  const [editing, setEditing] = useState(false);
  const [localSkills, setLocalSkills] = useState<string[]>(skills);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setLocalSkills([...skills]);
    setEditing(true);
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !localSkills.includes(skill)) {
      setLocalSkills(prev => [...prev, skill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setLocalSkills(prev => prev.filter(s => s !== skill));
  };

  const handleDone = async () => {
    setSaving(true);
    try {
      await onSave(localSkills);
      setEditing(false);
    } catch (err) {
      console.error('Failed to save skills:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalSkills([...skills]);
    setEditing(false);
    setSkillInput('');
  };

  const displaySkills = editing ? localSkills : skills;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Skills</h3>
        {!editing && (
          <Button variant="ghost" size="sm" onClick={startEdit} className="text-primary gap-1">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {displaySkills.length > 0 ? displaySkills.map(skill => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 bg-success text-success-foreground text-sm px-3 py-1 rounded-full font-medium"
          >
            {skill}
            {editing && (
              <button type="button" onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors ml-0.5">
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        )) : (
          <p className="text-sm text-muted-foreground">No skills added</p>
        )}
      </div>

      {editing && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              className="flex-1"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addSkill} className="shrink-0">Add</Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={handleCancel} disabled={saving}>Cancel</Button>
            <Button size="sm" onClick={handleDone} disabled={saving}>
              {saving ? 'Saving...' : 'Done'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
