interface KanbanStatsProps {
  stats: {
    newCount: number;
    screeningCount: number;
    interviewCount: number;
    offerCount: number;
    rejectedCount: number;
    total: number;
  };
}

export function KanbanStats({ stats }: KanbanStatsProps) {
  return (
    <div className="flex items-center gap-2 text-sm flex-wrap">
      <StatBadge count={stats.newCount} label="NEW" color="bg-gray-500" />
      <span className="text-muted-foreground">|</span>
      <StatBadge count={stats.screeningCount} label="SCREENING" color="bg-blue-500" />
      <span className="text-muted-foreground">|</span>
      <StatBadge count={stats.interviewCount} label="INTERVIEW" color="bg-purple-600" />
      <span className="text-muted-foreground">|</span>
      <StatBadge count={stats.offerCount} label="OFFER" color="bg-green-500" />
      <span className="text-muted-foreground">|</span>
      <StatBadge count={stats.rejectedCount} label="REJECTED" color="bg-red-500" />
    </div>
  );
}

function StatBadge({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-bold">{count}</span>
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${color}`}>
        {label}
      </span>
    </div>
  );
}
