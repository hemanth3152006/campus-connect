import { 
  Users, 
  Bus, 
  GraduationCap, 
  CreditCard, 
  Bell, 
  BarChart3,
  MessageSquare,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardCard, QuickActionCard, ActivityItem } from "@/components/dashboard/DashboardCard";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="admin">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-display">
          Welcome, <span className="gradient-text">Administrator</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete campus overview at your fingertips.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Students"
          value="2,456"
          subtitle="Active enrollments"
          icon={GraduationCap}
          trend={{ value: 12, isPositive: true }}
          iconColor="text-cyan-400"
        />
        <DashboardCard
          title="Total Staff"
          value="124"
          subtitle="Teachers & Admin"
          icon={Users}
          iconColor="text-emerald-400"
        />
        <DashboardCard
          title="Active Buses"
          value="18"
          subtitle="Currently on route"
          icon={Bus}
          iconColor="text-amber-400"
        />
        <DashboardCard
          title="Fee Collection"
          value="₹12.5L"
          subtitle="This month"
          icon={CreditCard}
          trend={{ value: 8, isPositive: true }}
          iconColor="text-purple-400"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 font-display">Management</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <QuickActionCard
            title="Manage Users"
            description="Add or edit accounts"
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
            onClick={() => navigate("/dashboard/admin/users")}
          />
          <QuickActionCard
            title="Bus Fleet"
            description="Track & manage"
            icon={Bus}
            gradient="from-orange-500 to-amber-500"
            onClick={() => navigate("/dashboard/admin/buses")}
          />
          <QuickActionCard
            title="Announcements"
            description="Broadcast info"
            icon={Bell}
            gradient="from-emerald-500 to-teal-500"
            onClick={() => navigate("/dashboard/admin/announcements")}
          />
          <QuickActionCard
            title="Complaints"
            description="5 pending"
            icon={MessageSquare}
            gradient="from-rose-500 to-red-500"
            onClick={() => navigate("/dashboard/admin/complaints")}
          />
          <QuickActionCard
            title="Analytics"
            description="View reports"
            icon={BarChart3}
            gradient="from-purple-500 to-pink-500"
            onClick={() => navigate("/dashboard/admin/reports")}
          />
          <QuickActionCard
            title="Settings"
            description="System config"
            icon={Settings}
            gradient="from-indigo-500 to-violet-500"
            onClick={() => navigate("/dashboard/admin/settings")}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Overview Stats */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 font-display">Campus Overview</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Attendance Overview */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Today's Attendance</h3>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Students</span>
                    <span>2,245/2,456 (91%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "91%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Teachers</span>
                    <span>118/124 (95%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Status */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Bus Fleet Status</h3>
                <Bus className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">On Route</span>
                  </div>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-sm">Delayed</span>
                  </div>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm">Issues Reported</span>
                  </div>
                  <span className="font-semibold">1</span>
                </div>
              </div>
            </div>

            {/* Pending Fees */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Fee Status</h3>
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold font-display mb-2">₹45.2L</div>
              <p className="text-sm text-muted-foreground">Total pending dues</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                  312 students
                </span>
                <span className="text-muted-foreground">with pending fees</span>
              </div>
            </div>

            {/* Complaints Summary */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Complaints</h3>
                <MessageSquare className="w-5 h-5 text-rose-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-muted-foreground">New</span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">5</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">8</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Resolved (Today)</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-4 font-display">Recent Activity</h2>
          <div className="glass-card p-4 rounded-xl">
            <ActivityItem
              title="New student registered"
              time="10 minutes ago"
              icon={GraduationCap}
              iconColor="text-cyan-400"
            />
            <ActivityItem
              title="Bus #12 reported delay"
              time="25 minutes ago"
              icon={Bus}
              iconColor="text-amber-400"
            />
            <ActivityItem
              title="Fee payment received"
              time="1 hour ago"
              icon={CreditCard}
              iconColor="text-emerald-400"
            />
            <ActivityItem
              title="Complaint resolved"
              time="2 hours ago"
              icon={CheckCircle2}
              iconColor="text-emerald-400"
            />
            <ActivityItem
              title="Announcement published"
              time="3 hours ago"
              icon={Bell}
              iconColor="text-purple-400"
            />
            <ActivityItem
              title="Canteen menu updated"
              time="5 hours ago"
              icon={Settings}
              iconColor="text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
