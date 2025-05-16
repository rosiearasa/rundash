import React from "react";
import {
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from "recharts";
import type { Activity } from "../types/activity";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WeeklyData {
  name: string;
  fullName: string; // Full name for tooltip
  distance: number;
  isMonthStart: boolean; // Flag to determine if this is the first week of a month
}

interface Props {
  activities: Activity[];
}

export function WeeklyDistanceChart({ activities }: Props) {
  // Group activities by year, month and week with Sunday as first day
  const data = React.useMemo(() => {
    // Create a map to store data by year-month and week
    const yearMonthWeekMap: Record<string, number[]> = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.date);
      const year = date.getFullYear();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const yearMonth = `${year}-${month}`;
      
      // Calculate week within month (0-3)
      // Get the first day of the month
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      // Get days since first Sunday (negative if first day of month is after Sunday)
      const daysSinceFirstSunday = date.getDate() - 1 + getAdjustedDayIndex(firstDay.getDay());
      // Calculate week index (0-3)
      const weekIndex = Math.min(3, Math.floor(daysSinceFirstSunday / 7));
      
      const distance = parseFloat(activity.distance || "0");
      
      // Initialize year-month if not exists with 4 weeks of zeros
      if (!yearMonthWeekMap[yearMonth]) {
        yearMonthWeekMap[yearMonth] = [0, 0, 0, 0];
      }
      
      // Add distance to appropriate week (capped at 4 weeks)
      yearMonthWeekMap[yearMonth][weekIndex] += distance;
    });
    
    // Transform the map into the format expected by the chart
    const chartData: WeeklyData[] = [];
    
    // Sort keys by year and month
    const keys = Object.keys(yearMonthWeekMap).sort();
    
    keys.forEach((yearMonth) => {
      const [year, month] = yearMonth.split('-');
      
      for (let week = 0; week < 4; week++) {
        chartData.push({
          name: week === 0 ? `${month}\n${year}` : "", // Only show month name for first week
          fullName: `${month} ${year} W${week + 1}`, // Full name for tooltip
          distance: parseFloat(yearMonthWeekMap[yearMonth][week].toFixed(2)),
          isMonthStart: week === 0 // Mark first week of month
        });
      }
    });
    
    return chartData;
  }, [activities]);

  // Helper function to adjust day index so Sunday is first day (0)
  function getAdjustedDayIndex(day: number): number {
    // Convert from JavaScript day (0 = Sunday, 6 = Saturday)
    // No adjustment needed as Sunday is already 0
    return day;
  }

  // Custom tick formatter for X axis
  const CustomXAxisTick = (props: { x: any; y: any; payload: any; }) => {
    const { x, y, payload } = props;
    
    // Only render text for month labels (first week of each month)
    if (payload.value) {
      return (
        <g transform={`translate(${x},${y})`}>
          <text 
            x={0} 
            y={0} 
            dy={16} 
            textAnchor="middle" 
            fill="#666"
          >
            {payload.value}
          </text>
        </g>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Weekly Distance by Month</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={data} 
              margin={{ top: 5, right: 30, left: 5, bottom: 40 }}
            >
              <defs>
                <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={<CustomXAxisTick x={''} y={''} payload={''} />}
                interval={0}
                height={50}
              />
              <YAxis
                label={{ value: 'Distance (km)', angle: -90, position: 'insideLeft' }}
                width={60}
              />
              <Tooltip 
                formatter={(value) => [`${value} km`, 'Distance']}
         
              />
              <Area 
                type="monotone" 
                dataKey="distance" 
                stroke="#0EA5E9" 
                fillOpacity={1} 
                fill="url(#colorDistance)" 
              />
              <Line 
                type="monotone" 
                dataKey="distance" 
                stroke="#0063A5" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}