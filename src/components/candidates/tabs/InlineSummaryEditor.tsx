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
  const [showSuccess, setShowSuccess] = useState(false);

  const startEdit = () => {
    setLocalSummary(summary);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    console.log('🔵 InlineSummaryEditor handleSave called');
    console.log('🔵 Summary to save:', localSummary.trim());
    console.log('🔵 onSave function exists:', typeof onSave === 'function');
    try {
      await onSave(localSummary.trim());
      console.log('✅ Summary onSave completed successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setEditing(false);
    } catch (err) {
      console.error('❌ Failed to save summary:', err);
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
              {saving ? 'Saving...' : showSuccess ? '✓ Saved' : 'Save'}
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
