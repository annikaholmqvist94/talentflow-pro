import { Application, ApplicationStatus } from '@/types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ApplicationCard } from './ApplicationCard';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  onCardClick: (application: Application) => void;
}

const columnConfig: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  NEW: { label: 'New', color: 'bg-gray-500', bgColor: 'bg-gray-50' },
  SCREENING: { label: 'Screening', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
  INTERVIEW: { label: 'Interview', color: 'bg-purple-600', bgColor: 'bg-purple-50' },
  OFFER: { label: 'Offer', color: 'bg-green-500', bgColor: 'bg-green-50' },
  REJECTED: { label: 'Rejected', color: 'bg-red-500', bgColor: 'bg-red-50' },
};

export function KanbanColumn({ status, applications, onCardClick }: KanbanColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(status === 'REJECTED');
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = columnConfig[status];
  
  return (
    <div className={cn(
      'flex flex-col min-w-[280px] w-[280px] bg-muted/30 rounded-xl',
      isCollapsed && 'min-w-[60px] w-[60px]'
    )}>
      {/* Column Header */}
      <div className={cn(
        'p-3 rounded-t-xl',
        config.bgColor
      )}>
        <div className="flex items-center justify-between">
          {isCollapsed ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-0 h-auto"
              onClick={() => setIsCollapsed(false)}
            >
              <div className="flex flex-col items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                <span className="writing-mode-vertical text-xs font-semibold [writing-mode:vertical-rl] rotate-180">
                  {config.label}
                </span>
                <span className={cn(
                  'w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center',
                  config.color
                )}>
                  {applications.length}
                </span>
              </div>
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', config.color)} />
                <h3 className="font-semibold text-sm">{config.label}</h3>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-white text-xs font-bold',
                  config.color
                )}>
                  {applications.length}
                </span>
              </div>
              {status === 'REJECTED' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsCollapsed(true)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Cards Container */}
      {!isCollapsed && (
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin min-h-[200px]',
            isOver && 'bg-primary/5 ring-2 ring-primary/20 ring-inset rounded-b-xl'
          )}
        >
          <SortableContext 
            items={applications.map(a => a.id)} 
            strategy={verticalListSortingStrategy}
          >
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onClick={() => onCardClick(application)}
              />
            ))}
          </SortableContext>
          
          {applications.length === 0 && (
            <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border-2 border-dashed border-muted rounded-lg">
              Drop here
            </div>
          )}
        </div>
      )}
    </div>
  );
}
