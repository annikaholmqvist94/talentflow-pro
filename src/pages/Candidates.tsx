import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCandidates } from '@/hooks/useCandidates';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Linkedin,
  Loader2,
  Users,
  ExternalLink
} from 'lucide-react';
import { getInitials } from '@/utils/formatters';
import { Candidate } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { CandidateDetailModal } from '@/components/candidates/CandidateDetailModal';

export default function Candidates() {
  const { organizationId } = useOrganization();
  const { candidates, loading, searchCandidates, createCandidate } = useCandidates();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [newCandidate, setNewCandidate] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    notes: '',
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchCandidates(query);
  };
  
  const handleCreateCandidate = async () => {
    if (!newCandidate.fullName || !newCandidate.email) {
      toast({ title: 'Name and email are required', variant: 'destructive' });
      return;
    }
    
    try {
      await createCandidate({
        ...newCandidate,
        organizationId,
      });
      toast({ title: 'Candidate added successfully!' });
      setIsCreateOpen(false);
      setNewCandidate({ fullName: '', email: '', phone: '', linkedinUrl: '', notes: '' });
    } catch (err) {
      toast({ title: 'Failed to add candidate', variant: 'destructive' });
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Candidates</h1>
            <p className="text-muted-foreground">Manage your candidate database</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input 
                    id="fullName"
                    placeholder="e.g., Anna Andersson"
                    value={newCandidate.fullName}
                    onChange={(e) => setNewCandidate({ ...newCandidate, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="e.g., anna@example.com"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone"
                    placeholder="e.g., +46 70 123 4567"
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input 
                    id="linkedin"
                    placeholder="https://linkedin.com/in/..."
                    value={newCandidate.linkedinUrl}
                    onChange={(e) => setNewCandidate({ ...newCandidate, linkedinUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Any additional notes..."
                    rows={3}
                    value={newCandidate.notes}
                    onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateCandidate} className="w-full">
                  Add Candidate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Candidates Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : candidates.length === 0 ? (
          <Card className="card-shadow border-0">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No candidates found</h3>
              <p className="text-muted-foreground text-sm">Add your first candidate to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                onClick={() => setSelectedCandidate(candidate)}
              />
            ))}
          </div>
        )}
      </div>

      <CandidateDetailModal
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </MainLayout>
  );
}

function CandidateCard({ candidate, onClick }: { candidate: Candidate; onClick: () => void }) {
  return (
    <Card 
      className="card-shadow border-0 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(candidate.fullName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{candidate.fullName}</h3>
            
            <div className="space-y-1.5 mt-2">
              <a 
                href={`mailto:${candidate.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{candidate.email}</span>
              </a>
              
              {candidate.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{candidate.phone}</span>
                </div>
              )}
              
              {candidate.linkedinUrl && (
                <a 
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Linkedin className="h-4 w-4 flex-shrink-0" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {candidate.notes && (
          <p className="text-sm text-muted-foreground mt-4 bg-muted/50 rounded-lg p-3 line-clamp-2">
            {candidate.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
