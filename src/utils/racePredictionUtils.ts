
import type { Activity } from "../types/activity";
import { timeToSeconds, secondsToTime } from "./activityUtil";

// Riegel's formula for race time prediction
// t2 = t1 * (d2 / d1)^1.06
// where t1 is the time for distance d1, and t2 is the predicted time for distance d2
export const predictRaceTime = (
  knownDistance: number, // in km
  knownTime: number, // in seconds
  targetDistance: number // in km
): number => {
  const factor = Math.pow(targetDistance / knownDistance, 1.06);
  return Math.round(knownTime * factor);
};

// Get the most recent activities with valid data for predictions
export const getRecentActivitiesForPrediction = (
  activities: Activity[],
  count: number = 2
): Activity[] => {
  // Filter activities to include only those with valid distance and time
  return activities
    .filter(activity => {
      const distance = parseFloat(activity.distance || "0");
      const time = activity.time;
      return (
        distance >= 2 && // Only use runs of at least 2km
        time && 
        time.trim() !== "" &&
        activity.activityType.toLowerCase().includes("run")
      );
    })
    .slice(0, count); // Get the most recent activities
};

// Calculate predicted times for standard race distances
export const calculateRacePredictions = (
  activities: Activity[]
) => {
  const recentActivities = getRecentActivitiesForPrediction(activities);
  
  if (recentActivities.length === 0) {
    return null;
  }
  
  // Use the average of recent activities for prediction
  let totalDistance = 0;
  let totalTime = 0;
  
  recentActivities.forEach(activity => {
    const distance = parseFloat(activity.distance || "0");
    const time = timeToSeconds(activity.time);
    totalDistance += distance;
    totalTime += time;
  });
  
  const avgDistance = totalDistance / recentActivities.length;
  const avgTime = totalTime / recentActivities.length;
  
  // Standard race distances in km
  const distances = {
    "5K": 5,
    "10K": 10,
    "Half Marathon": 21.0975,
    "Marathon": 42.195
  };
  
  // Calculate predictions
  const predictions: Record<string, {time: string, pace: string, splits: string[]}> = {};
  
  Object.entries(distances).forEach(([race, distance]) => {
    const predictedTimeSeconds = predictRaceTime(avgDistance, avgTime, distance);
    const predictedTime = secondsToTime(predictedTimeSeconds);
    const paceSeconds = predictedTimeSeconds / distance;
    const pace = secondsToTime(paceSeconds);
    
    // Calculate km splits
    const splits = [];
    for (let i = 1; i <= Math.ceil(distance); i++) {
      if (i <= distance) {
        const splitTime = secondsToTime(paceSeconds * i);
        splits.push(splitTime);
      }
    }
    
    predictions[race] = {
      time: predictedTime,
      pace: pace,
      splits: splits
    };
  });
  
  return {
    predictions,
    basedOn: recentActivities.length,
    averageDistance: avgDistance.toFixed(2),
    averageTime: secondsToTime(avgTime)
  };
};