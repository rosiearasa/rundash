
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend
  } from "recharts";
  import { useState, useEffect } from "react";
  import type { Activity } from "../types/activity";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import { getPaceTrendData, secondsToPace } from "../utils/activityUtil";
  
  interface Props {
    activities: Activity[];
  }
  
  export function PaceTrendChart({ activities }: Props) {
    const [chartWidth, setChartWidth] = useState("100%");
    const data = getPaceTrendData(activities);
    
    // Dynamically adjust chart width based on number of months
    useEffect(() => {
      // Ensure minimum width is 100% of container
      // For many months, make chart wider and horizontally scrollable
      const minWidth = data.length <= 12 ? "100%" : `${Math.max(100, data.length * 8)}%`;
      setChartWidth(minWidth);
    }, [data.length]);
  
    // Calculate the average pace across all months for the reference line
    const avgPaceAllMonths = data.length > 0
      ? data.reduce((sum, item) => sum + item.avgPace, 0) / data.length
      : 0;
  
    const formatYAxis = (value: number) => {
      return secondsToPace(Math.round(value * 60));
    };
  
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const paceValue = payload[0].value;
        const distanceValue = payload[1].value;
        return (
          <div className="bg-background p-3 border rounded-md shadow-sm">
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-dashboard-blue">Average Pace:</span> {secondsToPace(Math.round(paceValue * 60))} min/km
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-dashboard-teal">Distance:</span> {distanceValue.toFixed(2)} km
            </p>
          </div>
        );
      }
      return null;
    };
  
    return (
      <Card className="col-span-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pace Trends</CardTitle>
          <div className="text-xs text-muted-foreground">
            {data.length} month{data.length !== 1 ? 's' : ''} of data
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[350px] overflow-x-auto">
            <div style={{ width: chartWidth, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={data} 
                  margin={{ top: 5, right: 45, left: 5, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                    interval={data.length > 12 ? Math.floor(data.length / 12) : 0}
                  />
                  <YAxis
                    label={{ value: 'Pace (min/km)', angle: -90, position: 'insideLeft' }}
                    width={60}
                    tickFormatter={formatYAxis}
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    // Lower values are faster paces, so we invert the axis
                    reversed
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <ReferenceLine 
                    y={avgPaceAllMonths} 
                    stroke="#888" 
                    strokeDasharray="3 3" 
                    label={{
                      value: 'Avg: ' + secondsToPace(Math.round(avgPaceAllMonths * 60)),
                      position: 'right',
                      fill: '#888',
                      fontSize: 12
                    }} 
                  />
                  <Line
                    type="monotone"
                    dataKey="avgPace"
                    stroke="#0EA5E9"
                    name="Avg Pace"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#0EA5E9" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalDistance"
                    stroke="#14B8A6"
                    name="Distance"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#14B8A6" }}
                    activeDot={{ r: 6 }}
                    yAxisId="right"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: 'Distance (km)', angle: 90, position: 'insideRight' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }