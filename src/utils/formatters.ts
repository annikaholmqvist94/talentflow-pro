import { formatDistanceToNow, format, isToday, isTomorrow, isYesterday } from 'date-fns';

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

export function formatDateWithDay(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  return format(date, 'EEE, MMM d');
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'h:mm a');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export const statusColors: Record<string, string> = {
  NEW: 'bg-gray-500',
  SCREENING: 'bg-blue-500',
  INTERVIEW: 'bg-purple-600',
  OFFER: 'bg-green-500',
  REJECTED: 'bg-red-500',
};

export const statusLabels: Record<string, string> = {
  NEW: 'New',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
};

export const jobStatusColors: Record<string, string> = {
  ACTIVE: 'bg-green-500',
  CLOSED: 'bg-gray-500',
  DRAFT: 'bg-yellow-500',
};
