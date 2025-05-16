import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { Activity } from "../types/activity";
import { parseCSV } from "../utils/csvParser";

interface ActivityContextType {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  selectedActivity: Activity | null;
  setSelectedActivity: React.Dispatch<React.SetStateAction<Activity | null>>;
  importCSV: (csvData: string) => void;
  isLoading: boolean;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
};

interface ActivityProviderProps {
  children: ReactNode;
}

// Sample data for initial load
const sampleData = ``;

export const ActivityProvider = ({ children }: ActivityProviderProps) => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    return parseCSV(sampleData);
  });
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const importCSV = (csvData: string) => {
    setIsLoading(true);
    try {
      const parsedActivities = parseCSV(csvData);
      setActivities(parsedActivities);
      setSelectedActivity(null);
    } catch (error) {
      console.error("Error importing CSV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        setActivities,
        selectedActivity,
        setSelectedActivity,
        importCSV,
        isLoading
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};