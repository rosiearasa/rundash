import type { Activity } from "../types/activity";

// Convert pace string (MM:SS) to seconds
export const paceToSeconds = (pace: string): number => {
    const parts = pace.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };
  
  // Convert seconds to pace string (MM:SS)
  export const secondsToPace = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Convert time string (HH:MM:SS) to seconds
  export const timeToSeconds = (time: string): number => {
    const parts = time.split(':');
    if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };
  
  // Convert seconds to time string (HH:MM:SS)
  export const secondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate total weekly distance
  export const calculateWeeklyDistance = (activities: Activity[]): number => {
    return activities.reduce((total, activity) => {
      return total + parseFloat(activity.distance || "0");
    }, 0);
  };
  
  // Format date for display
  export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get distinct activity types
  export const getActivityTypes = (activities: Activity[]): string[] => {
    const types = new Set<string>();
    activities.forEach(activity => {
      if (activity.activityType) {
        types.add(activity.activityType);
      }
    });
    return Array.from(types);
  };
  
  // Calculate weekly summary stats
  export const calculateWeeklySummary = (activities: Activity[]) => {
    const totals = {
      distance: 0,
      calories: 0,
      duration: 0,
      activities: 0
    };
    
    activities.forEach(activity => {
      totals.distance += parseFloat(activity.distance || "0");
      totals.calories += parseInt(activity.calories || "0");
      totals.duration += timeToSeconds(activity.time);
      totals.activities += 1;
    });
    
    return {
      totalDistance: totals.distance.toFixed(2),
      totalCalories: totals.calories,
      totalDuration: secondsToTime(totals.duration),
      totalActivities: totals.activities
    };
  };
  
  // Calculate average pace from a list of activities
  export const calculateAveragePace = (activities: Activity[]): string => {
    if (activities.length === 0) return "0:00";
    
    let totalSeconds = 0;
    let totalDistance = 0;
    
    activities.forEach(activity => {
      const distance = parseFloat(activity.distance || "0");
      const time = timeToSeconds(activity.time);
      
      if (distance > 0 && time > 0) {
        totalDistance += distance;
        totalSeconds += time;
      }
    });
    
    if (totalDistance === 0) return "0:00";
    
    const avgSecondsPerKm = totalSeconds / totalDistance;
    return secondsToPace(avgSecondsPerKm);
  };



// Group activities by month and year
export const groupActivitiesByMonth = (activities: Activity[]) => {
    const grouped: Record<string, Activity[]> = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.date);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(activity);
    });
    
    return Object.entries(grouped)
      .sort((a, b) => b[0].localeCompare(a[0])) // Sort by date (newest first)
      .map(([key, value]) => ({
        monthYear: key,
        label: new Date(key + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        activities: value
      }));
  };
  
  // Calculate monthly stats
  export const calculateMonthlyStats = (activities: Activity[]) => {
    const monthlyGroups = groupActivitiesByMonth(activities);
    
    return monthlyGroups.map(month => {
      const stats = calculateWeeklySummary(month.activities);
      const avgPace = calculateAveragePace(month.activities);
      
      return {
        month: month.label,
        monthKey: month.monthYear,
        totalDistance: parseFloat(stats.totalDistance),
        totalActivities: stats.totalActivities,
        totalTime: stats.totalDuration,
        avgPace: avgPace,
        avgPaceSeconds: paceToSeconds(avgPace)
      };
    });
  };
  
  // Get data for pace trend chart
  export const getPaceTrendData = (activities: Activity[]) => {
    const monthlyStats = calculateMonthlyStats(activities);
    
    // Return in chronological order for the chart (oldest first)
    return [...monthlyStats].reverse().map(stat => ({
      name: stat.month,
      avgPace: stat.avgPaceSeconds / 60, // Convert to minutes for better visualization
      totalDistance: stat.totalDistance
    }));
  };
