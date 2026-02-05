import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/utils/formatters';

export function GreetingCard() {
  const { currentUser } = useAuth();
  const firstName = currentUser?.fullName?.split(' ')[0] || 'there';
  
  return (
    <Card className="card-shadow border-0 bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Hello there, {firstName} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your recruitment pipeline.
            </p>
          </div>
          <Avatar className="h-14 w-14 hidden sm:flex">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {currentUser ? getInitials(currentUser.fullName) : 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}
