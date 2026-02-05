import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';

export default function Pipeline() {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-muted-foreground">
            Manage your recruitment pipeline. Drag cards to move candidates between stages.
          </p>
        </div>
        
        <KanbanBoard />
      </div>
    </MainLayout>
  );
}
