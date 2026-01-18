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
import { useEffect, useState, type ReactNode } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardCard, QuickActionCard, ActivityItem } from "@/components/dashboard/DashboardCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const path = location.pathname;

  const isOverview = path === "/dashboard/teacher" || path === "/dashboard/teacher/";
  const isAttendanceView =
    path.startsWith("/dashboard/teacher/attendance") ||
    path.startsWith("/dashboard/teacher/classes");

  const sectionKey = path.startsWith("/dashboard/teacher/")
    ? path.split("/")[3] ?? ""
    : "";

  const sectionTitles: Record<string, string> = {
    attendance: "Class Attendance",
    notes: "Upload Notes",
    marks: "Enter Marks",
    timetable: "Timetable",
    messages: "Messages",
    analytics: "Class Analytics",
  };

  // Mock data for classes and students managed by this teacher
  const classes = [
    { id: "10A", name: "Class 10-A", section: "A", subject: "Mathematics", totalStudents: 42, isCounsellor: true },
    { id: "11B", name: "Class 11-B", section: "B", subject: "Mathematics", totalStudents: 38, isCounsellor: false },
    { id: "12A", name: "Class 12-A", section: "A", subject: "Mathematics", totalStudents: 35, isCounsellor: false },
    { id: "10B", name: "Class 10-B", section: "B", subject: "Mathematics", totalStudents: 40, isCounsellor: false },
  ];

  type Student = {
    id: string;
    name: string;
    roll: string;
    hasOnlineLeave?: boolean;
  };

  const studentsByClass: Record<string, Student[]> = {
    "10A": [
      { id: "10A-01", name: "Aarav Kumar", roll: "10A-01", hasOnlineLeave: true },
      { id: "10A-02", name: "Diya Sharma", roll: "10A-02" },
      { id: "10A-03", name: "Rahul Verma", roll: "10A-03" },
      { id: "10A-04", name: "Sneha Patel", roll: "10A-04" },
      { id: "10A-05", name: "Vikram Singh", roll: "10A-05", hasOnlineLeave: true },
    ],
    "11B": [
      { id: "11B-01", name: "Karthik Rao", roll: "11B-01" },
      { id: "11B-02", name: "Meera Iyer", roll: "11B-02" },
      { id: "11B-03", name: "Ananya Gupta", roll: "11B-03" },
    ],
    "12A": [
      { id: "12A-01", name: "Rohan Mehta", roll: "12A-01" },
      { id: "12A-02", name: "Sara Khan", roll: "12A-02" },
    ],
    "10B": [
      { id: "10B-01", name: "Arjun Reddy", roll: "10B-01" },
      { id: "10B-02", name: "Nisha Das", roll: "10B-02" },
    ],
  };

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id ?? "");
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>(() => {
    const initialStudents = studentsByClass[classes[0]?.id ?? ""] ?? [];
    const map: Record<string, "present" | "absent"> = {};
    initialStudents.forEach((student) => {
      map[student.id] = student.hasOnlineLeave ? "absent" : "present";
    });
    return map;
  });

  useEffect(() => {
    const currentStudents = studentsByClass[selectedClassId] ?? [];
    setAttendance(() => {
      const map: Record<string, "present" | "absent"> = {};
      currentStudents.forEach((student) => {
        map[student.id] = student.hasOnlineLeave ? "absent" : "present";
      });
      return map;
    });
  }, [selectedClassId]);

  const selectedClass = classes.find((cls) => cls.id === selectedClassId);
  const students = studentsByClass[selectedClassId] ?? [];

  const presentCount = students.reduce((count, student) => {
    const status = attendance[student.id] ?? "present";
    return status === "present" ? count + 1 : count;
  }, 0);

  const totalStudents = students.length;
  const absentCount = totalStudents - presentCount;

  const onlineAbsences = students.filter((student) => student.hasOnlineLeave);

  const handleToggleAttendance = (studentId: string) => {
    setAttendance((prev) => {
      const current = prev[studentId] ?? "present";
      return {
        ...prev,
        [studentId]: current === "present" ? "absent" : "present",
      };
    });
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Attendance saved",
      description: `Marked ${presentCount} present and ${absentCount} absent in ${selectedClass?.name}.`,
    });
  };

  let content: ReactNode;

  if (isAttendanceView) {
    content = (
      <>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            Class Attendance <span className="gradient-text">(Teacher Panel)</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Select a class you handle to view the student list, mark today's attendance, and
            (if you are the class counsellor) review online absence requests.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Classes handled by this teacher */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold font-display">My Classes</h2>
            <p className="text-sm text-muted-foreground">
              You are handling <span className="font-semibold">{classes.length}</span> classes today.
            </p>
            <div className="space-y-2 mt-2">
              {classes.map((cls) => {
                const isActive = cls.id === selectedClassId;
                const clsStudents = studentsByClass[cls.id] ?? [];
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`w-full text-left glass-card p-4 rounded-xl border transition-all ${
                      isActive
                        ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/20"
                        : "border-transparent hover:border-primary/30 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{cls.name}</p>
                      {cls.isCounsellor && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                          Class Counsellor
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cls.subject} • Section {cls.section}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {clsStudents.length} students
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected class student list & attendance */}
          <div className="lg:col-span-2 space-y-4">
            {selectedClass ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold font-display flex items-center gap-2">
                      {selectedClass.name}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                        {selectedClass.subject}
                      </span>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Section {selectedClass.section} • {students.length} students
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                      Present: {presentCount}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-red-500/15 text-red-400 font-medium">
                      Absent: {absentCount}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl space-y-3 max-h-[420px] overflow-y-auto">
                  {students.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No students found for this class.
                    </p>
                  ) : (
                    students.map((student) => {
                      const status = attendance[student.id] ?? "present";
                      const isAbsent = status === "absent";
                      return (
                        <div
                          key={student.id}
                          className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                            isAbsent
                              ? "border-red-500/40 bg-red-500/5"
                              : "border-white/10 bg-white/5 hover:border-emerald-400/40 hover:bg-emerald-500/5"
                          }`}
                        >
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">Roll: {student.roll}</p>
                            {student.hasOnlineLeave && (
                              <p className="text-[11px] text-amber-400 mt-1">
                                Online absence request submitted
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(student.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              isAbsent
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            }`}
                          >
                            {isAbsent ? "Mark Present" : "Mark Absent"}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {selectedClass.isCounsellor && onlineAbsences.length > 0 && (
                  <div className="glass-card p-4 rounded-xl border border-amber-500/40 bg-amber-500/5">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      Online Absence Requests
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                        {onlineAbsences.length} students
                      </span>
                    </h3>
                    <p className="text-xs text-amber-100/80 mb-3">
                      These students have submitted online absence requests for today. You can
                      review and keep them marked absent while saving attendance.
                    </p>
                    <ul className="text-xs space-y-1">
                      {onlineAbsences.map((student) => (
                        <li key={student.id} className="flex justify-between">
                          <span>{student.name}</span>
                          <span className="text-amber-200/80">Roll: {student.roll}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAttendance}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Save Today's Attendance
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a class on the left to start marking attendance.
              </p>
            )}
          </div>
        </div>
      </>
    );
  } else if (!isOverview && sectionKey) {
    const title = sectionTitles[sectionKey] ?? "Teacher Section";
    content = (
      <>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-display">
            <span className="gradient-text">{title}</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            This is a dedicated teacher page for <span className="font-semibold">{title}</span>.
            You can connect this view later to your real data (notes, marks, timetable, messages and more).
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl max-w-2xl">
          <p className="text-sm text-muted-foreground">
            A detailed interface for <span className="font-semibold">{title}</span> will appear here. For now this is
            a placeholder so that each sidebar button opens its own section for the teacher panel.
          </p>
        </div>
      </>
    );
  } else {
    content = (
      <>
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
      </>
    );
  }

  return (
    <DashboardLayout role="teacher">
      {content}
    </DashboardLayout>
  );
};

export default TeacherDashboard;
