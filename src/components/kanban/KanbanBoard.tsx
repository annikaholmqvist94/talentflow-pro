import { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Application, ApplicationStatus, Job } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationModal } from './ApplicationModal';
import { KanbanStats } from './KanbanStats';
import { useKanban } from '@/hooks/useKanban';
import { useJobs } from '@/hooks/useJobs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/api';
import { useOrganization } from '@/contexts/OrganizationContext';
import { CandidateDetailModal } from '@/components/candidates/CandidateDetailModal';
import { Candidate } from '@/types';

const statuses: ApplicationStatus[] = ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED'];

interface KanbanBoardProps {
  jobId?: string;
}

export function KanbanBoard({ jobId: propJobId }: KanbanBoardProps) {
  const { organizationId } = useOrganization();
  const [selectedJobId, setSelectedJobId] = useState<string>(propJobId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<Candidate | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Application[] | null>(null);
  
  const effectiveJobId = selectedJobId === 'all' ? undefined : selectedJobId;
  const { 
    applications: fetchedApplications, 
    groupedByStatus, 
    loading, 
    stats,
    moveApplication,
    advanceApplication,
    rejectApplication,
    makeOffer,
    refresh 
  } = useKanban(effectiveJobId);
  
  const { jobs } = useJobs();
  const { toast } = useToast();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Search functionality
  useEffect(() => {
    const search = async () => {
      if (!searchQuery.trim()) {
        setSearchResults(null);
        return;
      }
      
      setIsSearching(true);
      try {
        const data = await api.get<Application[]>(
          `/applications/organization/${organizationId}/search?candidateName=${encodeURIComponent(searchQuery)}`
        );
        setSearchResults(data || []);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, organizationId]);
  
  // Use search results if searching, otherwise use fetched applications
  const applications = searchResults || fetchedApplications;
  const displayGrouped = searchResults
    ? {
        NEW: applications.filter(a => a.status === 'NEW'),
        SCREENING: applications.filter(a => a.status === 'SCREENING'),
        INTERVIEW: applications.filter(a => a.status === 'INTERVIEW'),
        OFFER: applications.filter(a => a.status === 'OFFER'),
        REJECTED: applications.filter(a => a.status === 'REJECTED'),
      }
    : groupedByStatus;
  
  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(String(event.active.id));
  };
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    const applicationId = active.id as string;
    const newStatus = over.id as ApplicationStatus;
    
    // Find the application
    const application = applications.find(a => a.id === applicationId);
    if (!application || application.status === newStatus) return;
    
    try {
      await moveApplication(applicationId, newStatus);
      toast({
        title: 'Application moved',
        description: `Moved to ${newStatus}`,
      });
    } catch (err) {
      toast({
        title: 'Failed to move application',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };
  
  const handleAdvance = async () => {
    if (!selectedApplication) return;
    try {
      await advanceApplication(selectedApplication.id);
      toast({ title: 'Application advanced' });
      setSelectedApplication(null);
    } catch (err) {
      toast({ title: 'Failed to advance', variant: 'destructive' });
    }
  };
  
  const handleReject = async () => {
    if (!selectedApplication) return;
    try {
      await rejectApplication(selectedApplication.id);
      toast({ title: 'Application rejected' });
      setSelectedApplication(null);
    } catch (err) {
      toast({ title: 'Failed to reject', variant: 'destructive' });
    }
  };
  
  const handleMakeOffer = async () => {
    if (!selectedApplication) return;
    try {
      await makeOffer(selectedApplication.id);
      toast({ title: 'Offer made!' });
      setSelectedApplication(null);
    } catch (err) {
      toast({ title: 'Failed to make offer', variant: 'destructive' });
    }
  };
  
  const activeApplication = activeId ? applications.find(a => a.id === activeId) : null;
  
  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Job Filter */}
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Search */}
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by candidate name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        
        {/* Stats */}
        <KanbanStats stats={stats} />
      </div>
      
      {/* Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                applications={displayGrouped[status]}
                onCardClick={(app) => {
                  if (app.candidate) {
                    setSelectedCandidateForDetail(app.candidate);
                  } else {
                    setSelectedApplication(app);
                  }
                }}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeApplication && (
              <div className="w-[280px]">
                <ApplicationCard application={activeApplication} />

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidateForDetail}
        open={!!selectedCandidateForDetail}
        onClose={() => setSelectedCandidateForDetail(null)}
      />
    </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
      
      {/* Application Modal */}
      <ApplicationModal
        application={selectedApplication}
        open={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onAdvance={handleAdvance}
        onReject={handleReject}
        onMakeOffer={handleMakeOffer}
      />
    </div>
  );
}
