
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import type { Activity } from "../types/activity";
import { calculateMonthlyStats } from "../utils/activityUtil";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MonthlyStatsProps {
  activities: Activity[];
}

export function MonthlyStats({ activities }: MonthlyStatsProps) {
  const monthlyStats = calculateMonthlyStats(activities);
  
  // If we have less than 2 months of data, we can't compare
  const hasMultipleMonths = monthlyStats.length >= 2;
  
  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Monthly Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {monthlyStats.slice(0, 11).map((stats, index) => {
            // Compare with previous month (if available)
            const prevMonth = index < monthlyStats.length - 1 ? monthlyStats[index + 1] : null;
            
            // Calculate percentage changes if previous month exists
            const distanceChange = prevMonth ? 
              ((stats.totalDistance - prevMonth.totalDistance) / prevMonth.totalDistance * 100).toFixed(1) : 
              null;
            
            const paceChange = prevMonth ? 
              ((prevMonth.avgPaceSeconds - stats.avgPaceSeconds) / prevMonth.avgPaceSeconds * 100).toFixed(1) : 
              null;
            
            return (
              <Card key={stats.monthKey} className="bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{stats.month}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">Distance</dt>
                      <dd className="text-xl font-semibold">{stats.totalDistance.toFixed(2)} km</dd>
                      {hasMultipleMonths && distanceChange && (
                        <div className="text-xs flex items-center">
                          <span className={Number(distanceChange) >= 0 ? "text-dashboard-green flex items-center" : "text-dashboard-red flex items-center"}>
                            {Number(distanceChange) >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                            {Number(distanceChange) >= 0 ? `+${distanceChange}` : distanceChange}%
                          </span>
                          <span className="text-muted-foreground ml-1">vs previous month</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">Average Pace</dt>
                      <dd className="text-xl font-semibold">{stats.avgPace} min/km</dd>
                      {hasMultipleMonths && paceChange && (
                        <div className="text-xs flex items-center">
                          <span className={Number(paceChange) >= 0 ? "text-dashboard-green flex items-center" : "text-dashboard-red flex items-center"}>
                            {Number(paceChange) >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                            {Number(paceChange) >= 0 ? `+${paceChange}` : paceChange}%
                          </span>
                          <span className="text-muted-foreground ml-1">vs previous month</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">Activities</dt>
                      <dd className="text-xl font-semibold">{stats.totalActivities}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}