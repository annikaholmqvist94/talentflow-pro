import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';

interface InlineSummaryEditorProps {
  summary: string;
  onSave: (summary: string) => Promise<void>;
}

export function InlineSummaryEditor({ summary, onSave }: InlineSummaryEditorProps) {
  const [editing, setEditing] = useState(false);
  const [localSummary, setLocalSummary] = useState(summary);
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setLocalSummary(summary);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localSummary.trim());
      setEditing(false);
    } catch (err) {
      console.error('Failed to save summary:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalSummary(summary);
    setEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">Professional Summary</h3>
        {!editing && (
          <Button variant="ghost" size="sm" onClick={startEdit} className="text-primary gap-1">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <Textarea
            rows={4}
            value={localSummary}
            onChange={e => setLocalSummary(e.target.value)}
            placeholder="Brief professional summary..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={handleCancel} disabled={saving}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {summary || 'No summary provided'}
        </p>
      )}
    </div>
  );
}
