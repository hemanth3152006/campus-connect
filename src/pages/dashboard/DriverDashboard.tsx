import { 
  Bus, 
  Users, 
  MapPin, 
  Clock, 
  Navigation,
  AlertTriangle,
  Gauge,
  Route,
  CheckCircle2,
  Play
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardCard, QuickActionCard, ActivityItem } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";

const DriverDashboard = () => {
  return (
    <DashboardLayout role="driver">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            Good Morning, <span className="gradient-text">Driver</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Safe driving starts here. Your route for today is ready.
          </p>
        </div>
        <Button variant="glow" size="lg" className="gap-2">
          <Play className="w-5 h-5" />
          Start Route
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Today's Passengers"
          value="45"
          subtitle="Expected pickups"
          icon={Users}
          iconColor="text-cyan-400"
        />
        <DashboardCard
          title="Total Stops"
          value="12"
          subtitle="3 completed"
          icon={MapPin}
          iconColor="text-emerald-400"
        />
        <DashboardCard
          title="Route Duration"
          value="1h 20m"
          subtitle="Estimated time"
          icon={Clock}
          iconColor="text-amber-400"
        />
        <DashboardCard
          title="Avg Speed"
          value="35 km/h"
          subtitle="Within limit"
          icon={Gauge}
          trend={{ value: 5, isPositive: false }}
          iconColor="text-purple-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Route Status */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 font-display">Route Status</h2>
          <div className="glass-card p-6 rounded-xl">
            {/* Route Progress */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Route Progress</span>
                  <span className="font-medium">3/12 stops</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>
            </div>

            {/* Stops List */}
            <div className="space-y-3">
              {[
                { name: "College Main Gate", time: "8:00 AM", status: "completed", passengers: 8 },
                { name: "City Center", time: "8:15 AM", status: "completed", passengers: 12 },
                { name: "Park Avenue", time: "8:30 AM", status: "completed", passengers: 6 },
                { name: "Metro Station", time: "8:45 AM", status: "current", passengers: 10 },
                { name: "Residential Block A", time: "9:00 AM", status: "upcoming", passengers: 9 },
              ].map((stop, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    stop.status === "current" 
                      ? "bg-primary/10 border border-primary/30" 
                      : stop.status === "completed"
                      ? "bg-white/5 opacity-60"
                      : "bg-white/5"
                  }`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${stop.status === "completed" 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : stop.status === "current"
                      ? "bg-primary/20 text-primary animate-pulse"
                      : "bg-white/10 text-muted-foreground"
                    }
                  `}>
                    {stop.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : stop.status === "current" ? (
                      <Navigation className="w-5 h-5" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{stop.name}</h4>
                    <p className="text-xs text-muted-foreground">{stop.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{stop.passengers}</span>
                    <p className="text-xs text-muted-foreground">passengers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Activity */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 font-display">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionCard
                title="Report Issue"
                description="Traffic or accident"
                icon={AlertTriangle}
                gradient="from-red-500 to-orange-500"
              />
              <QuickActionCard
                title="View Route"
                description="Full map view"
                icon={Route}
                gradient="from-blue-500 to-cyan-500"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 font-display">Today's Log</h2>
            <div className="glass-card p-4 rounded-xl">
              <ActivityItem
                title="Route started"
                time="7:45 AM"
                icon={Play}
                iconColor="text-emerald-400"
              />
              <ActivityItem
                title="Stop 1 completed"
                time="8:00 AM"
                icon={CheckCircle2}
                iconColor="text-cyan-400"
              />
              <ActivityItem
                title="Stop 2 completed"
                time="8:15 AM"
                icon={CheckCircle2}
                iconColor="text-cyan-400"
              />
              <ActivityItem
                title="Traffic delay reported"
                time="8:25 AM"
                icon={AlertTriangle}
                iconColor="text-amber-400"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;
