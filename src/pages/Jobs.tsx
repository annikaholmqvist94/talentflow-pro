import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useJobs } from '@/hooks/useJobs';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  MapPin, 
  Building2, 
  Users, 
  MoreVertical,
  Loader2,
  Briefcase
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { jobStatusColors } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { Job } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Jobs() {
  const { organizationId } = useOrganization();
  const { jobs, loading, searchJobs, createJob, closeJob, deleteJob } = useJobs();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    status: 'ACTIVE' as const,
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchJobs(query);
  };
  
  const filteredJobs = statusFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === statusFilter);
  
  const handleCreateJob = async () => {
    try {
      await createJob({
        ...newJob,
        organizationId,
      });
      toast({ title: 'Job created successfully!' });
      setIsCreateOpen(false);
      setNewJob({ title: '', description: '', department: '', location: '', status: 'ACTIVE' });
    } catch (err) {
      toast({ title: 'Failed to create job', variant: 'destructive' });
    }
  };
  
  const handleCloseJob = async (id: string) => {
    try {
      await closeJob(id);
      toast({ title: 'Job closed' });
    } catch (err) {
      toast({ title: 'Failed to close job', variant: 'destructive' });
    }
  };
  
  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob(id);
      toast({ title: 'Job deleted' });
    } catch (err) {
      toast({ title: 'Failed to delete job', variant: 'destructive' });
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Jobs</h1>
            <p className="text-muted-foreground">Manage your job postings</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department"
                    placeholder="e.g., Engineering"
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    placeholder="e.g., Stockholm, Sweden"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Job description..."
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateJob} className="w-full">
                  Create Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="card-shadow border-0">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No jobs found</h3>
              <p className="text-muted-foreground text-sm">Create your first job posting to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClose={() => handleCloseJob(job.id)}
                onDelete={() => handleDeleteJob(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function JobCard({ 
  job, 
  onClose, 
  onDelete 
}: { 
  job: Job; 
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="card-shadow border-0 hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <Link 
                to={`/jobs/${job.id}`}
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {job.title}
              </Link>
              <Badge 
                className={cn(
                  'text-white text-xs',
                  jobStatusColors[job.status]
                )}
              >
                {job.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
              {job.department && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>{job.department}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              )}
            </div>
            
            {job.description && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {job.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/jobs/${job.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/pipeline?job=${job.id}`}>View Applications</Link>
              </DropdownMenuItem>
              {job.status === 'ACTIVE' && (
                <DropdownMenuItem onClick={onClose}>Close Job</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
