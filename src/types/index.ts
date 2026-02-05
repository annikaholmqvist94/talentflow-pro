export interface Organization {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';
  createdAt: string;
}

export interface Job {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  department: string;
  location: string;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  createdAt: string;
}

export interface Candidate {
  id: string;
  organizationId: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
  createdAt: string;
}

export type ApplicationStatus = 'NEW' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  organizationId: string;
  status: ApplicationStatus;
  stageOrder: number;
  notes?: string;
  appliedAt: string;
  candidate?: Candidate;
  job?: Job;
}

export interface ApplicationStats {
  newCount: number;
  screeningCount: number;
  interviewCount: number;
  offerCount: number;
  rejectedCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
  timestamp: string;
}
