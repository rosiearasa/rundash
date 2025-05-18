import { StatCard } from "./StatCard";
import { Calendar, Activity, Clock, Heart } from "lucide-react";
import AddData from "./AddData";
import { PaceTrendChart } from "./PaceTrendChart";
import { useActivity } from "../contexts/ActivityContext";
import { RacePredictions } from "./RacePredictions";
import {
  calculateWeeklySummary,
  calculateAveragePace,
} from "../utils/activityUtil";
import { MonthlyStats } from "./MonthlyStats";
import { HeartRateChart } from "./HeartRateTrends";
import { WeeklyDistanceChart } from "./WeeklyDistanceChart";

const DashBoard = () => {
  const { activities } = useActivity();

  const summary = calculateWeeklySummary(activities);
  const avgPace = calculateAveragePace(activities);

  return (
    <>
      <div>
        <div>
          <p>
            Understand your running metrics, become a running Ninja. Start by
            uploading your data as a CSV...
          </p>
          <p>
           Simply copy and paste the data exported from Garmin csv for running activity omit the first title row
          </p>
        </div>
        <AddData />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Distance"
          value={`${summary.totalDistance} km`}
          icon={Activity}
          color="text-dashboard-blue"
        />
        <StatCard
          title="Total Activities"
          value={summary.totalActivities}
          icon={Calendar}
          color="text-dashboard-purple"
        />
        <StatCard
          title="Average Pace"
          value={`${avgPace} min/km`}
          icon={Clock}
          color="text-dashboard-teal"
        />
        <StatCard
          title="Total Calories"
          value={summary.totalCalories}
          icon={Heart}
          color="text-dashboard-orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <MonthlyStats activities={activities} />
      </div>

      <div>
        <PaceTrendChart activities={activities} />
      </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
        <RacePredictions activities={activities} />
      </div>
      <div>
        <WeeklyDistanceChart activities={activities} />
      </div>
      <HeartRateChart activities={activities} />
    </>
  );
};

export default DashBoard;
