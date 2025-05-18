
import { useState } from "react";
import type { Activity } from ".././types/activity";
import { calculateRacePredictions } from ".././utils/racePredictionUtils";
import { Card, CardContent, CardHeader, CardTitle } from ".././components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from ".././components/ui/tabs";
import { Clock, Timer } from "lucide-react";
import { cn } from "../lib/utils";

interface RacePredictionsProps {
  activities: Activity[];
}

export function RacePredictions({ activities }: RacePredictionsProps) {
  const [activeTab, setActiveTab] = useState("5K");
  
  const predictions = calculateRacePredictions(activities);
  
  if (!predictions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Timer className="mr-2 h-5 w-5 text-dashboard-purple" />
            Race Time Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Not enough data for predictions</p>
        </CardContent>
      </Card>
    );
  }

  const races = ["5K", "10K", "Half Marathon", "Marathon"];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Timer className="mr-2 h-5 w-5 text-dashboard-purple" />
          Race Time Predictions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on your {predictions.basedOn} most recent runs ({predictions.averageDistance} km avg. at {predictions.averageTime})
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="5K" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            {races.map(race => (
              <TabsTrigger key={race} value={race}>
                {race}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {races.map(race => {
            const raceData = predictions.predictions[race];
            return (
              <TabsContent key={race} value={race}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm font-medium mb-1 text-muted-foreground">Predicted Time</p>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-dashboard-purple" />
                        <span className="text-2xl font-bold">{raceData.time}</span>
                      </div>
                    </div>
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm font-medium mb-1 text-muted-foreground">Average Pace</p>
                      <div className="flex items-center">
                        <Timer className="h-4 w-4 mr-2 text-dashboard-teal" />
                        <span className="text-2xl font-bold">{raceData.pace}/km</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Kilometer Splits</h4>
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      {raceData.splits.map((split, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "bg-muted rounded p-2 text-center",
                            (index + 1) % 5 === 0 ? "bg-muted/80 font-medium" : ""
                          )}
                        >
                          <div className="text-muted-foreground text-xs">km {index + 1}</div>
                          <div>{split}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}