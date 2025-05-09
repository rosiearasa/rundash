
import { StatCard } from './StatCard'
import { Calendar, Activity, Clock, Heart } from 'lucide-react'
import AddData from './AddData'
import { PaceTrendChart } from './PaceTrendChart'
import { useActivity } from '../contexts/ActivityContext'
import { calculateWeeklySummary, calculateAveragePace } from '../utils/activityUtil'
import { MonthlyStats } from './MonthlyStats'


const DashBoard = () => {
    const { activities, selectedActivity } = useActivity();
  
    const summary = calculateWeeklySummary(activities);
    const avgPace = calculateAveragePace(activities);
   
  return (
    <>
    <div>
        <AddData/>
    </div>
    <div className="flex flex-col items-start justify-start w-full">
  
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

      
       {/* Pace Trend Chart */}
  


      
      
      {/* {selectedActivity && <ActivityDetail />} */}

    
        </div>
        <div>
    <PaceTrendChart activities={activities} />
    </div>

        </>

  )
}

export default DashBoard