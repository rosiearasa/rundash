
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import type { Activity } from "../types/activity";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
  activities: Activity[];
}

export function HeartRateChart({ activities }: Props) {
  const data = React.useMemo(() => {
    // Get the 10 most recent activities
    return activities
      .slice(0, 10)
      .map(activity => {
        const date = new Date(activity.date);
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          avgHR: parseInt(activity.avgHR || "0"),
          maxHR: parseInt(activity.maxHR || "0")
        };
      })
      .reverse(); // Show chronologically
  }, [activities]);
  
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Heart Rate Trends</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis 
                label={{ value: 'Heart Rate (bpm)', angle: -90, position: 'insideLeft' }} 
                width={60}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="avgHR" 
                stroke="#0EA5E9" 
                name="Avg HR" 
                strokeWidth={2} 
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="maxHR" 
                stroke="#EF4444" 
                name="Max HR" 
                strokeWidth={2} 
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
