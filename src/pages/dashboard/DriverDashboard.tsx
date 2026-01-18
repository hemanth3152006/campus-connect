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
import { useEffect, useRef, useState, type ReactNode } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardCard, QuickActionCard, ActivityItem } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type UserRow = Tables<"users">;

const DriverDashboard = () => {
  const location = useLocation();

  const path = location.pathname;
  const isOverview = path === "/dashboard/driver" || path === "/dashboard/driver/";
  const isRouteView = path.startsWith("/dashboard/driver/route");

  const sectionKey = path.startsWith("/dashboard/driver/")
    ? path.split("/")[3] ?? ""
    : "";

  const sectionTitles: Record<string, string> = {
    route: "My Route",
    passengers: "Passengers",
    attendance: "Attendance",
    reports: "Route Reports",
    settings: "Driver Settings",
  };

  const [coords] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const remindedStudentIdsRef = useRef<string[]>([]);
  const [driver, setDriver] = useState<UserRow | null>(null);
  const [students, setStudents] = useState<UserRow[]>([]);

  const notifyTripStarted = () => {
    if (!students.length) {
      toast({
        title: "No students found for this route",
        description: "Add students with this bus route in the admin panel first.",
      });
      return;
    }

    students.forEach((student) => {
      if (!student.phone) return;
      toast({
        title: "Trip started",
        description: `SMS to ${student.full_name ?? "Student"} (${student.phone}): Your bus trip has started.`,
      });
      console.log(
        `[SMS] Trip started notification to ${student.full_name ?? "Student"} (${student.phone}) for route ${student.route ?? ""}.`,
      );
    });
  };

  const notifyOneStopBefore = (
    student: UserRow,
    previousStopName: string,
    studentStopName: string,
  ) => {
    if (!student.phone) return;
    toast({
      title: "Bus is near your stop",
      description: `SMS to ${student.full_name ?? "Student"} (${student.phone}): Bus has reached ${previousStopName}. Your stop (${studentStopName}) is next, please get ready.`,
    });
    console.log(
      `[SMS] One-stop-before reminder to ${student.full_name ?? "Student"} (${student.phone}) - previous stop ${previousStopName}, next stop ${studentStopName}.`,
    );
  };

  useEffect(() => {
    const loadDriverAndStudents = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        console.error("Failed to get auth user", authError);
        return;
      }

      const { data: driverRow, error: driverError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (driverError || !driverRow) {
        console.error("Failed to load driver profile", driverError);
        return;
      }

      setDriver(driverRow);

      if (!driverRow.route) {
        toast({
          title: "Route not set",
          description: "Please assign a bus route to this driver in the admin panel.",
        });
        return;
      }

      const { data: studentsRows, error: studentsError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "student")
        .eq("route", driverRow.route);

      if (studentsError) {
        console.error("Failed to load students for route", studentsError);
      } else {
        setStudents(studentsRows ?? []);
      }

    };

    loadDriverAndStudents();
  }, []);

  useEffect(() => {
    if (!isRouteView) return;

    // GPS and lat/lng based logic removed as per requirement.
  }, [isRouteView]);

  let content: ReactNode;

  if (isRouteView) {
    content = (
      <>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">
              My Route <span className="gradient-text">(Overview)</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              This view shows key information about your assigned bus route and passengers.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-6 rounded-xl h-[360px] flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2 font-display flex items-center gap-2">
                  Route Information
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  This view shows basic information about your assigned route. Live GPS tracking has been disabled.
                </p>
                <div className="glass-card p-4 rounded-xl border border-dashed border-white/15 bg-background/60 text-sm text-muted-foreground">
                  <p>Driver: <span className="font-medium text-foreground">{driver?.full_name ?? "Not set"}</span></p>
                  <p>Route: <span className="font-medium text-foreground">{driver?.route ?? "Not set"}</span></p>
                  <p className="mt-2 text-[11px]">
                    Students on this route will receive SMS when you start the trip. One-stop-before reminders can be triggered manually from future controls.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-4 rounded-xl">
              <h2 className="text-sm font-semibold mb-2 font-display">Bus & Driver Details</h2>
              <p className="text-xs text-muted-foreground mb-2">
                These details are loaded from the driver login and route assignment.
              </p>
              <div className="space-y-1 text-xs">
                <p>
                  <span className="text-muted-foreground">Driver Name:</span>{" "}
                  <span className="font-medium">{driver?.full_name ?? "Not set"}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Driver Email:</span>{" "}
                  <span className="font-medium">{driver?.email ?? "Not set"}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Mobile No:</span>{" "}
                  <span className="font-medium">{driver?.phone ?? "Not set"}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Bus Route:</span>{" "}
                  <span className="font-medium">{driver?.route ?? "Not set"}</span>
                </p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl">
              <h2 className="text-sm font-semibold mb-2 font-display">Passengers & Stops</h2>
              <div className="space-y-1 text-xs">
                <p>
                  <span className="text-muted-foreground">Passengers in bus:</span> <span className="font-medium">45</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Total stops:</span> <span className="font-medium">12</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Stops left:</span> <span className="font-medium">9</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (!isOverview && sectionKey) {
    const title = sectionTitles[sectionKey] ?? "Driver Section";
    content = (
      <>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            <span className="gradient-text">{title}</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            This is a dedicated driver page for <span className="font-semibold">{title}</span>.
            You can later connect this screen to real data such as passenger lists, attendance logs, reports or driver settings.
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl max-w-2xl">
          <p className="text-sm text-muted-foreground">
            A detailed interface for <span className="font-semibold">{title}</span> will appear here. For now this is a
            placeholder so that each sidebar button opens its own section for the driver panel.
          </p>
        </div>
      </>
    );
  } else {
    content = (
      <>
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
          <Button
            variant="glow"
            size="lg"
            className="gap-2"
            onClick={notifyTripStarted}
          >
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
      </>
    );
  }

  return (
    <DashboardLayout role="driver">
      {content}
    </DashboardLayout>
  );
};

export default DriverDashboard;
