import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: number;
  color?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, color = "text-dashboard-blue" }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className={`rounded-full p-2 ${color} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend !== undefined && (
          <div className="flex items-center text-xs space-x-1">
            <span className={trend > 0 ? "text-dashboard-green" : "text-dashboard-red"}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
            <span className="text-muted-foreground">from last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}