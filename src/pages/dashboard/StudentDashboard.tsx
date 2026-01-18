import { 
  Bus, 
  Calendar, 
  FileText, 
  CreditCard, 
  Bell, 
  BarChart3,
  ClipboardCheck,
  Utensils,
  MapPin,
  Clock,
  TrendingUp,
  BookOpen
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardCard, QuickActionCard, ActivityItem } from "@/components/dashboard/DashboardCard";
import { useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  const isOverview = path === "/dashboard/student" || path === "/dashboard/student/";
  const sectionKey = path.startsWith("/dashboard/student/")
    ? path.split("/")[3] ?? ""
    : "";

  const sectionTitles: Record<string, string> = {
    bus: "Bus Tracking",
    attendance: "Attendance Details",
    timetable: "Today's Timetable",
    homework: "Homework & Assignments",
    canteen: "Canteen Menu",
    fees: "Fee Payment",
    announcements: "Announcements",
    complaints: "Complaints & Helpdesk",
    results: "Results & Performance",
  };

  let content: ReactNode;

  if (!isOverview && sectionKey) {
    const title = sectionTitles[sectionKey] ?? "Student Section";

    content = (
      <>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            <span className="gradient-text">{title}</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            This is a brief view for <span className="font-semibold">{title}</span>. We will later
            connect this section to your real data (bus tracking, timetable, homework, fees and
            more) so you can manage everything in one place.
          </p>
        </div>

        {sectionKey === "bus" && (
          <div className="glass-card p-6 rounded-xl max-w-2xl">
            <h2 className="text-lg font-semibold mb-2 font-display flex items-center gap-2">
              Track My Bus
              <MapPin className="w-4 h-4 text-cyan-400" />
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              Soon you will see a live map here showing where your bus is right now,
              using the driver's GPS and your assigned route.
            </p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
              <li>Current stop and next stop</li>
              <li>Estimated arrival time (ETA)</li>
              <li>Bus number and driver details</li>
            </ul>
          </div>
        )}

        {sectionKey === "attendance" && (
          <div className="glass-card p-6 rounded-xl max-w-2xl space-y-4">
            <h2 className="text-lg font-semibold font-display flex items-center gap-2">
              Attendance Summary
              <ClipboardCheck className="w-4 h-4 text-emerald-400" />
            </h2>
            <p className="text-sm text-muted-foreground">
              View how many days you have been present, on leave, or absent this semester.
              Counsellors and teachers will also see your online absence requests here.
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="glass-card p-3 rounded-lg text-center">
                <p className="text-muted-foreground">Present</p>
                <p className="text-xl font-display font-semibold">92%</p>
              </div>
              <div className="glass-card p-3 rounded-lg text-center">
                <p className="text-muted-foreground">On Leave</p>
                <p className="text-xl font-display font-semibold">5%</p>
              </div>
              <div className="glass-card p-3 rounded-lg text-center">
                <p className="text-muted-foreground">Absent</p>
                <p className="text-xl font-display font-semibold">3%</p>
              </div>
            </div>
          </div>
        )}

        {sectionKey !== "bus" && sectionKey !== "attendance" && (
          <div className="glass-card p-6 rounded-xl max-w-2xl">
            <p className="text-sm text-muted-foreground">
              A detailed view for <span className="font-semibold">{title}</span> will appear here –
              for now this is a placeholder so each button on the left opens its own brief
              section.
            </p>
          </div>
        )}
      </>
    );
  } else {
    content = (
      <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            Good Morning, <span className="gradient-text">Student</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your campus today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            title="Attendance"
            value="92%"
            subtitle="This semester"
            icon={ClipboardCheck}
            trend={{ value: 2.5, isPositive: true }}
            iconColor="text-emerald-400"
          />
          <DashboardCard
            title="Pending Tasks"
            value="5"
            subtitle="Due this week"
            icon={FileText}
            iconColor="text-amber-400"
          />
          <DashboardCard
            title="Bus ETA"
            value="12 min"
            subtitle="Route B - Stop 5"
            icon={Bus}
            iconColor="text-cyan-400"
          />
          <DashboardCard
            title="Overall Grade"
            value="A-"
            subtitle="Current CGPA: 8.5"
            icon={BarChart3}
            trend={{ value: 5, isPositive: true }}
            iconColor="text-purple-400"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 font-display">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <QuickActionCard
                title="Track My Bus"
                description="See real-time location"
                icon={MapPin}
                gradient="from-cyan-500 to-blue-500"
                onClick={() => navigate("/dashboard/student/bus")}
              />
              <QuickActionCard
                title="Today's Timetable"
                description="View your schedule"
                icon={Calendar}
                gradient="from-purple-500 to-pink-500"
                onClick={() => navigate("/dashboard/student/timetable")}
              />
              <QuickActionCard
                title="Canteen Menu"
                description="See today's menu"
                icon={Utensils}
                gradient="from-orange-500 to-amber-500"
                onClick={() => navigate("/dashboard/student/canteen")}
              />
              <QuickActionCard
                title="View Homework"
                description="3 pending assignments"
                icon={BookOpen}
                gradient="from-emerald-500 to-teal-500"
                onClick={() => navigate("/dashboard/student/homework")}
              />
              <QuickActionCard
                title="Pay Fees"
                description="Due: Jan 30, 2026"
                icon={CreditCard}
                gradient="from-rose-500 to-red-500"
                onClick={() => navigate("/dashboard/student/fees")}
              />
              <QuickActionCard
                title="View Results"
                description="Mid-term results out"
                icon={TrendingUp}
                gradient="from-indigo-500 to-violet-500"
                onClick={() => navigate("/dashboard/student/results")}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold mb-4 font-display">Recent Activity</h2>
            <div className="glass-card p-4 rounded-xl">
              <ActivityItem
                title="Assignment submitted: Math HW"
                time="2 hours ago"
                icon={FileText}
                iconColor="text-emerald-400"
              />
              <ActivityItem
                title="New announcement posted"
                time="5 hours ago"
                icon={Bell}
                iconColor="text-amber-400"
              />
              <ActivityItem
                title="Attendance marked - Present"
                time="Today, 9:00 AM"
                icon={ClipboardCheck}
                iconColor="text-cyan-400"
              />
              <ActivityItem
                title="Bus arrival at Stop 5"
                time="Today, 8:30 AM"
                icon={Bus}
                iconColor="text-purple-400"
              />
              <ActivityItem
                title="Fee payment received"
                time="Yesterday"
                icon={CreditCard}
                iconColor="text-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Today's Schedule Preview */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 font-display">Today's Classes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { time: "9:00 AM", subject: "Mathematics", room: "Room 101", status: "completed" },
              { time: "10:30 AM", subject: "Physics", room: "Lab 2", status: "completed" },
              { time: "12:00 PM", subject: "English", room: "Room 205", status: "ongoing" },
              { time: "2:00 PM", subject: "Computer Science", room: "Lab 1", status: "upcoming" },
            ].map((cls, index) => (
              <div 
                key={index}
                className={`glass-card p-4 rounded-xl border transition-all ${
                  cls.status === "ongoing" 
                    ? "border-primary/50 bg-primary/5" 
                    : cls.status === "completed"
                    ? "opacity-60"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Clock className="w-3 h-3" />
                  {cls.time}
                </div>
                <h3 className="font-semibold">{cls.subject}</h3>
                <p className="text-xs text-muted-foreground mt-1">{cls.room}</p>
                {cls.status === "ongoing" && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                    Ongoing
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <DashboardLayout role="student">
      {content}
    </DashboardLayout>
  );
};

export default StudentDashboard;
