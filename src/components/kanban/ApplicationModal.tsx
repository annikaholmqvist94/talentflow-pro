import { Application } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Briefcase, 
  MapPin, 
  Calendar,
  ArrowRight,
  X,
  Gift
} from 'lucide-react';
import { getInitials, formatDate, statusColors, statusLabels } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ApplicationModalProps {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onAdvance: () => void;
  onReject: () => void;
  onMakeOffer: () => void;
}

export function ApplicationModal({
  application,
  open,
  onClose,
  onAdvance,
  onReject,
  onMakeOffer,
}: ApplicationModalProps) {
  if (!application) return null;
  
  const canAdvance = application.status !== 'OFFER' && application.status !== 'REJECTED';
  const canMakeOffer = application.status === 'INTERVIEW';
  const canReject = application.status !== 'REJECTED';
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {application.candidate ? getInitials(application.candidate.fullName) : '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">
                {application.candidate?.fullName || 'Unknown'}
              </h2>
              <Badge className={cn('mt-1', statusColors[application.status])}>
                {statusLabels[application.status]}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h4>
            <div className="space-y-2">
              {application.candidate?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${application.candidate.email}`} className="text-primary hover:underline">
                    {application.candidate.email}
                  </a>
                </div>
              )}
              {application.candidate?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{application.candidate.phone}</span>
                </div>
              )}
              {application.candidate?.linkedinUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={application.candidate.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Job Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Applied For
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="font-medium">{application.job?.title || 'Unknown Job'}</span>
              </div>
              {application.job?.department && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="ml-6">{application.job.department}</span>
                </div>
              )}
              {application.job?.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 ml-0.5" />
                  <span>{application.job.location}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Applied Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Applied on {formatDate(application.appliedAt)}</span>
          </div>
          
          {/* Notes */}
          {application.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Notes
                </h4>
                <p className="text-sm bg-muted/50 rounded-lg p-3">
                  {application.notes}
                </p>
              </div>
            </>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {canAdvance && (
            <Button onClick={onAdvance} className="flex-1">
              <ArrowRight className="h-4 w-4 mr-2" />
              Advance
            </Button>
          )}
          {canMakeOffer && (
            <Button onClick={onMakeOffer} className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
              <Gift className="h-4 w-4 mr-2" />
              Make Offer
            </Button>
          )}
          {canReject && (
            <Button onClick={onReject} variant="destructive" className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
