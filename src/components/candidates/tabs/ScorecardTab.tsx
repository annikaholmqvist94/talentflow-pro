import { useState, useEffect, useRef, useCallback } from 'react';
import { ScoreGridBox } from '../ScoreGridBox';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/api';
import { BarChart3, Check, Loader2 } from 'lucide-react';

interface ScorecardData {
  id?: string;
  candidateId: string;
  organizationId: string;
  technicalSkills: number;
  communication: number;
  culturalFit: number;
  experienceLevel: number;
  problemSolving: number;
  overallScore?: number;
  evaluatedBy?: string | null;
  notes?: string | null;
  updatedAt?: string;
}

const CATEGORY_KEYS = ['technicalSkills', 'communication', 'culturalFit', 'experienceLevel', 'problemSolving'] as const;
type CategoryKey = typeof CATEGORY_KEYS[number];

const CATEGORIES: { key: CategoryKey; label: string; description: string }[] = [
  { key: 'technicalSkills', label: 'Technical Skills', description: 'Strong coding abilities, modern frameworks' },
  { key: 'communication', label: 'Communication', description: 'Clear communicator, good listener' },
  { key: 'culturalFit', label: 'Cultural Fit', description: 'Values align, team player' },
  { key: 'experienceLevel', label: 'Experience Level', description: 'Some experience, room for growth' },
  { key: 'problemSolving', label: 'Problem Solving', description: 'Analytical, creative solutions' },
];

interface ScorecardTabProps {
  candidateId: string;
}

export function ScorecardTab({ candidateId }: ScorecardTabProps) {
  const { currentUser } = useAuth();
  const { organizationId } = useOrganization();
  const { toast } = useToast();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [scores, setScores] = useState<Record<CategoryKey, number>>({
    technicalSkills: 0,
    communication: 0,
    culturalFit: 0,
    experienceLevel: 0,
    problemSolving: 0,
  });
  const [hasScorecard, setHasScorecard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [evaluatedBy, setEvaluatedBy] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoresRef = useRef(scores);
  scoresRef.current = scores;

  // Fetch existing scorecard
  useEffect(() => {
    let cancelled = false;
    const fetchScorecard = async () => {
      setLoading(true);
      try {
        const data = await api.get<ScorecardData>(`/scorecards/candidate/${candidateId}`);
        if (!cancelled && data) {
          setScores({
            technicalSkills: data.technicalSkills || 0,
            communication: data.communication || 0,
            culturalFit: data.culturalFit || 0,
            experienceLevel: data.experienceLevel || 0,
            problemSolving: data.problemSolving || 0,
          });
          setHasScorecard(true);
          setLastUpdated(data.updatedAt || null);
          setEvaluatedBy(data.evaluatedBy || null);
        }
      } catch {
        if (!cancelled) setHasScorecard(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchScorecard();
    return () => { cancelled = true; };
  }, [candidateId]);

  const saveScorecard = useCallback(async (currentScores: Record<CategoryKey, number>) => {
    setSaveState('saving');
    try {
      const body: ScorecardData = {
        candidateId,
        organizationId,
        ...currentScores,
        evaluatedBy: currentUser?.id || null,
        notes: null,
      };
      const result = await api.post<ScorecardData>('/scorecards', body);
      if (result?.updatedAt) setLastUpdated(result.updatedAt);
      if (result?.evaluatedBy) setEvaluatedBy(result.evaluatedBy);
      setHasScorecard(true);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 1500);
    } catch (err) {
      setSaveState('idle');
      toast({ title: 'Failed to save scorecard', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
    }
  }, [candidateId, organizationId, currentUser?.id, toast]);

  const handleSetScore = (key: CategoryKey, score: number) => {
    if (!editing) return;
    const updated = { ...scoresRef.current, [key]: score };
    setScores(updated);

    // Debounce save
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveScorecard(updated), 500);
  };

  const handleCreateScorecard = () => {
    const initial: Record<CategoryKey, number> = {
      technicalSkills: 3, communication: 3, culturalFit: 3, experienceLevel: 3, problemSolving: 3,
    };
    setScores(initial);
    setHasScorecard(true);
    setEditing(true);
    saveScorecard(initial);
  };

  const handleDoneEditing = () => {
    // Flush pending save
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      saveScorecard(scoresRef.current);
    }
    setEditing(false);
  };

  const filledScores = CATEGORY_KEYS.map(k => scores[k]);
  const nonZero = filledScores.filter(s => s > 0);
  const overallScore = nonZero.length > 0 ? nonZero.reduce((a, b) => a + b, 0) / nonZero.length : 0;
  const percentage = Math.round((overallScore / 5) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasScorecard) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center shadow-sm">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">No Evaluation Yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create a scorecard to assess their fit for the role.
        </p>
        {isAdmin && (
          <Button onClick={handleCreateScorecard}>
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
        {CATEGORIES.map((cat) => (
          <div key={cat.key} className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground">{cat.label}</h4>
              <span className="text-sm text-muted-foreground">{scores[cat.key]}/5</span>
            </div>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <ScoreGridBox
                  key={num}
                  num={num}
                  filled={num <= scores[cat.key]}
                  editable={editing}
                  onClick={() => handleSetScore(cat.key, num)}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">{cat.description}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <p>Evaluated by: {evaluatedBy || currentUser?.fullName || 'Unknown'}</p>
            {lastUpdated && <p>Last updated: {new Date(lastUpdated).toLocaleString()}</p>}
          </div>
          {isAdmin && (
            <Button
              variant={editing ? 'secondary' : 'default'}
              size="sm"
              onClick={editing ? handleDoneEditing : () => setEditing(true)}
              disabled={saveState === 'saving'}
            >
              {saveState === 'saving' && editing && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              {editing ? 'Done' : 'Edit Scorecard'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
