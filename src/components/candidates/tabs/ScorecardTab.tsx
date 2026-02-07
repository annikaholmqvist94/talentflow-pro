import { useState } from 'react';
import { ScoreGridBox } from '../ScoreGridBox';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, Check, Loader2 } from 'lucide-react';

interface Evaluation {
  category: string;
  score: number;
  description: string;
}

const defaultEvaluations: Evaluation[] = [
  { category: 'Technical Skills', score: 4, description: 'Strong coding abilities, modern frameworks' },
  { category: 'Communication', score: 4, description: 'Clear communicator, good listener' },
  { category: 'Cultural Fit', score: 3, description: 'Values align, team player' },
  { category: 'Experience Level', score: 2, description: 'Some experience, room for growth' },
  { category: 'Problem Solving', score: 4, description: 'Analytical, creative solutions' },
];

interface ScorecardTabProps {
  candidateId: string;
}

export function ScorecardTab({ candidateId }: ScorecardTabProps) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';
  const [hasScorecard, setHasScorecard] = useState(true);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(defaultEvaluations);
  const [editing, setEditing] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const overallScore = evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;
  const percentage = Math.round((overallScore / 5) * 100);

  const handleSetScore = (index: number, score: number) => {
    if (!editing) return;
    const updated = [...evaluations];
    updated[index] = { ...updated[index], score };
    setEvaluations(updated);

    // Auto-save simulation
    setSaveState('saving');
    setTimeout(() => setSaveState('saved'), 1000);
    setTimeout(() => setSaveState('idle'), 2500);
  };

  if (!hasScorecard) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center shadow-sm">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">No Evaluation Yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create a scorecard to assess their fit for the role.
        </p>
        {isAdmin && (
          <Button onClick={() => setHasScorecard(true)}>
            Create Scorecard
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Overall Score: {overallScore.toFixed(1)}/5.0</h3>
          {saveState === 'saving' && (
            <span className="text-xs text-muted-foreground flex items-center gap-1 animate-in fade-in">
              <Loader2 className="h-3 w-3 animate-spin" /> Saving...
            </span>
          )}
          {saveState === 'saved' && (
            <span className="text-xs text-success flex items-center gap-1 animate-in fade-in">
              <Check className="h-3 w-3" /> Saved ✓
            </span>
          )}
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{percentage}% match</p>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {evaluations.map((evaluation, index) => (
          <div key={evaluation.category} className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground">{evaluation.category}</h4>
              <span className="text-sm text-muted-foreground">{evaluation.score}/5</span>
            </div>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <ScoreGridBox
                  key={num}
                  num={num}
                  filled={num <= evaluation.score}
                  editable={editing}
                  onClick={() => handleSetScore(index, num)}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">{evaluation.description}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <p>Evaluated by: {currentUser?.fullName || 'Admin User'}</p>
            <p>Last updated: 2 hours ago • Feb 7, 2026</p>
          </div>
          {isAdmin && (
            <Button
              variant={editing ? 'secondary' : 'default'}
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Done' : 'Edit Scorecard'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
