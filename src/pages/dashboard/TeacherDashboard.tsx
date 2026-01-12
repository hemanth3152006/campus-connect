import { 
  Users, 
  Calendar, 
  FileText, 
  Bell, 
  BarChart3,
  ClipboardCheck,
  Clock,
  BookOpen,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardCard, QuickActionCard, ActivityItem } from "@/components/dashboard/DashboardCard";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="teacher">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-display">
          Good Morning, <span className="gradient-text">Professor</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your classes and students efficiently.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Today's Classes"
          value="4"
          subtitle="2 completed, 2 remaining"
          icon={Calendar}
          iconColor="text-emerald-400"
        />
        <DashboardCard
          title="Total Students"
          value="156"
          subtitle="Across 4 sections"
          icon={Users}
          iconColor="text-cyan-400"
        />
        <DashboardCard
          title="Pending Reviews"
          value="23"
          subtitle="Assignments to grade"
          icon={FileText}
          iconColor="text-amber-400"
        />
        <DashboardCard
          title="Avg Attendance"
          value="89%"
          subtitle="This month"
          icon={ClipboardCheck}
          trend={{ value: 3, isPositive: true }}
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
              title="Mark Attendance"
              description="For current class"
              icon={ClipboardCheck}
              gradient="from-emerald-500 to-teal-500"
              onClick={() => navigate("/dashboard/teacher/attendance")}
            />
            <QuickActionCard
              title="Upload Notes"
              description="Share study materials"
              icon={BookOpen}
              gradient="from-blue-500 to-cyan-500"
              onClick={() => navigate("/dashboard/teacher/notes")}
            />
            <QuickActionCard
              title="Enter Marks"
              description="Update student grades"
              icon={BarChart3}
              gradient="from-purple-500 to-pink-500"
              onClick={() => navigate("/dashboard/teacher/marks")}
            />
            <QuickActionCard
              title="View Timetable"
              description="Today's schedule"
              icon={Calendar}
              gradient="from-orange-500 to-amber-500"
              onClick={() => navigate("/dashboard/teacher/timetable")}
            />
            <QuickActionCard
              title="Messages"
              description="2 new messages"
              icon={MessageSquare}
              gradient="from-rose-500 to-red-500"
              onClick={() => navigate("/dashboard/teacher/messages")}
            />
            <QuickActionCard
              title="Class Analytics"
              description="Performance reports"
              icon={TrendingUp}
              gradient="from-indigo-500 to-violet-500"
              onClick={() => navigate("/dashboard/teacher/analytics")}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-4 font-display">Recent Activity</h2>
          <div className="glass-card p-4 rounded-xl">
            <ActivityItem
              title="Attendance marked - 10A"
              time="30 minutes ago"
              icon={ClipboardCheck}
              iconColor="text-emerald-400"
            />
            <ActivityItem
              title="Notes uploaded: Chapter 5"
              time="2 hours ago"
              icon={FileText}
              iconColor="text-cyan-400"
            />
            <ActivityItem
              title="Assignment graded: Physics Quiz"
              time="Yesterday"
              icon={BarChart3}
              iconColor="text-purple-400"
            />
            <ActivityItem
              title="New announcement created"
              time="Yesterday"
              icon={Bell}
              iconColor="text-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 font-display">Today's Classes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { time: "9:00 AM", class: "Class 10-A", subject: "Mathematics", students: 42, status: "completed" },
            { time: "10:30 AM", class: "Class 11-B", subject: "Mathematics", students: 38, status: "completed" },
            { time: "12:00 PM", class: "Class 12-A", subject: "Mathematics", students: 35, status: "ongoing" },
            { time: "2:00 PM", class: "Class 10-B", subject: "Mathematics", students: 40, status: "upcoming" },
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
              <h3 className="font-semibold">{cls.class}</h3>
              <p className="text-xs text-muted-foreground mt-1">{cls.subject}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                {cls.students} students
              </div>
              {cls.status === "ongoing" && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                  In Progress
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
