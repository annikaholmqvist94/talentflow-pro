import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { cn } from '@/lib/utils';

// Mock meetings data
const meetings = [
  {
    id: '1',
    title: 'First interview',
    date: new Date(),
    time: '10:00 - 11:00',
    participants: ['Anna A.', 'John D.'],
  },
  {
    id: '2',
    title: 'Second interview',
    date: new Date(Date.now() + 86400000),
    time: '14:00 - 15:00',
    participants: ['Sarah M.'],
  },
];

export function UpcomingMeetingsCard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  return (
    <Card className="card-shadow border-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming meetings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Calendar */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-[10px] text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
            {days.map((day, i) => (
              <div
                key={i}
                className={cn(
                  'text-xs py-1.5 rounded-md transition-colors',
                  !isSameMonth(day, currentMonth) && 'text-muted-foreground/40',
                  isToday(day) && 'bg-primary text-primary-foreground font-semibold',
                  !isToday(day) && isSameMonth(day, currentMonth) && 'hover:bg-muted'
                )}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>
        
        {/* Meeting List */}
        <div className="space-y-2">
          {meetings.map((meeting) => (
            <div 
              key={meeting.id} 
              className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                <span className="text-lg font-bold leading-none">{format(meeting.date, 'd')}</span>
                <span className="text-[10px] uppercase">{format(meeting.date, 'MMM')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{meeting.title}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3" />
                  {meeting.time}
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  {meeting.participants.map((p, i) => (
                    <Avatar key={i} className="h-5 w-5 border-2 border-card -ml-1 first:ml-0">
                      <AvatarFallback className="text-[8px] bg-secondary text-secondary-foreground">
                        {p.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
