import { Application } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Briefcase, Calendar, FileText } from 'lucide-react';
import { getInitials, formatRelativeDate, truncateText } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: Application;
  onClick?: () => void;
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all border bg-card',
        isDragging && 'opacity-50 shadow-lg rotate-2'
      )}
    >
      {/* Candidate Info */}
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {application.candidate ? getInitials(application.candidate.fullName) : '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">
            {application.candidate?.fullName || 'Unknown Candidate'}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Briefcase className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{application.job?.title || 'Unknown Job'}</span>
          </div>
        </div>
      </div>
      
      {/* Applied Date */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
        <Calendar className="h-3 w-3" />
        <span>Applied {formatRelativeDate(application.appliedAt)}</span>
      </div>
      
      {/* Notes Preview */}
      {application.notes && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-2 bg-muted/50 rounded p-2">
          <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{truncateText(application.notes, 60)}</span>
        </div>
      )}
    </Card>
  );
}
