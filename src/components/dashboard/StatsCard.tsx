import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title?: string;
  subtitle?: string;
  value: string | number;
  label: string;
}

export function StatsCard({ title = "Career stats", subtitle = "Since last week", value, label }: StatsCardProps) {
  return (
    <Card className="gradient-teal border-0 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-white/90">{title}</CardTitle>
        <p className="text-sm text-white/70">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold">{value}</span>
          <TrendingUp className="h-6 w-6 mb-2 text-white/80" />
        </div>
        <p className="text-white/80 mt-1 text-sm font-medium">{label}</p>
      </CardContent>
    </Card>
  );
}
