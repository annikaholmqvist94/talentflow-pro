import { cn } from '@/lib/utils';

interface ScoreGridBoxProps {
  num: number;
  filled: boolean;
  editable: boolean;
  onClick?: () => void;
}

export function ScoreGridBox({ num, filled, editable, onClick }: ScoreGridBoxProps) {
  return (
    <button
      type="button"
      onClick={editable ? onClick : undefined}
      disabled={!editable}
      aria-label={`Rating box ${num} of 5`}
      className={cn(
        'w-10 h-10 rounded-lg border-2 font-bold text-sm transition-all duration-200 flex items-center justify-center',
        filled
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-muted border-border text-muted-foreground',
        editable && 'cursor-pointer hover:bg-accent hover:border-accent hover:text-accent-foreground hover:scale-105',
        !editable && 'cursor-default'
      )}
    >
      {num}
    </button>
  );
}
