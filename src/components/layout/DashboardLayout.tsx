import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Bus, 
  Calendar, 
  FileText, 
  CreditCard, 
  Bell, 
  MessageSquare, 
  BarChart3, 
  Home,
  Menu,
  X,
  LogOut,
  User,
  Utensils,
  ClipboardCheck,
  Settings,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "student" | "teacher" | "driver" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, role: authRole, signOut } = useAuth();

  const roleConfig = {
    student: {
      title: "Student Portal",
      color: "from-blue-500 to-cyan-500",
      navigation: [
        { icon: Home, label: "Dashboard", path: "/dashboard/student" },
        { icon: Bus, label: "Bus Tracking", path: "/dashboard/student/bus" },
        { icon: ClipboardCheck, label: "Attendance", path: "/dashboard/student/attendance" },
        { icon: Calendar, label: "Timetable", path: "/dashboard/student/timetable" },
        { icon: FileText, label: "Homework & Notes", path: "/dashboard/student/homework" },
        { icon: Utensils, label: "Canteen", path: "/dashboard/student/canteen" },
        { icon: CreditCard, label: "Fee Payment", path: "/dashboard/student/fees" },
        { icon: Bell, label: "Announcements", path: "/dashboard/student/announcements" },
        { icon: MessageSquare, label: "Complaints", path: "/dashboard/student/complaints" },
        { icon: BarChart3, label: "Results", path: "/dashboard/student/results" },
      ],
    },
    teacher: {
      title: "Teacher Portal",
      color: "from-emerald-500 to-teal-500",
      navigation: [
        { icon: Home, label: "Dashboard", path: "/dashboard/teacher" },
        { icon: ClipboardCheck, label: "Mark Attendance", path: "/dashboard/teacher/attendance" },
        { icon: Calendar, label: "Timetable", path: "/dashboard/teacher/timetable" },
        { icon: FileText, label: "Upload Notes", path: "/dashboard/teacher/notes" },
        { icon: BarChart3, label: "Enter Marks", path: "/dashboard/teacher/marks" },
        { icon: Users, label: "Students", path: "/dashboard/teacher/students" },
        { icon: Bell, label: "Announcements", path: "/dashboard/teacher/announcements" },
        { icon: MessageSquare, label: "Messages", path: "/dashboard/teacher/messages" },
      ],
    },
    driver: {
      title: "Driver Portal",
      color: "from-orange-500 to-amber-500",
      navigation: [
        { icon: Home, label: "Dashboard", path: "/dashboard/driver" },
        { icon: Bus, label: "My Route", path: "/dashboard/driver/route" },
        { icon: Users, label: "Passengers", path: "/dashboard/driver/passengers" },
        { icon: ClipboardCheck, label: "Attendance", path: "/dashboard/driver/attendance" },
        { icon: MessageSquare, label: "Reports", path: "/dashboard/driver/reports" },
        { icon: Settings, label: "Settings", path: "/dashboard/driver/settings" },
      ],
    },
    admin: {
      title: "Admin Portal",
      color: "from-purple-500 to-pink-500",
      navigation: [
        { icon: Home, label: "Dashboard", path: "/dashboard/admin" },
        { icon: Users, label: "Users", path: "/dashboard/admin/users" },
        { icon: Bus, label: "Bus Management", path: "/dashboard/admin/buses" },
        { icon: Calendar, label: "Timetable", path: "/dashboard/admin/timetable" },
        { icon: Utensils, label: "Canteen Menu", path: "/dashboard/admin/canteen" },
        { icon: CreditCard, label: "Fee Management", path: "/dashboard/admin/fees" },
        { icon: Bell, label: "Announcements", path: "/dashboard/admin/announcements" },
        { icon: MessageSquare, label: "Complaints", path: "/dashboard/admin/complaints" },
        { icon: BarChart3, label: "Reports", path: "/dashboard/admin/reports" },
        { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
      ],
    },
  };

  const config = roleConfig[role];

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-display text-lg font-bold gradient-text">Campus'360</h1>
        <div className="w-10" />
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-white/10 z-50 transition-transform duration-300",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <div>
              <h1 className="font-display text-xl font-bold gradient-text">Campus'360</h1>
              <p className="text-xs text-muted-foreground mt-1">{config.title}</p>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {config.navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center",
                  config.color
                )}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{profile?.full_name ?? "Signed-in user"}</p>
                    <p className="text-xs text-muted-foreground capitalize">{authRole ?? role}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 text-muted-foreground hover:text-destructive"
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
