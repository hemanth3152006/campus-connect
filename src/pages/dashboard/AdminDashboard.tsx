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
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardCard, QuickActionCard, ActivityItem } from "@/components/dashboard/DashboardCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  const userSchema = z
    .object({
      full_name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().optional(),
      role: z.enum(["student", "teacher", "driver"], {
        required_error: "Role is required",
      }),
      password: z.string().min(6, "Password must be at least 6 characters"),
      route: z.string().optional(),
      pickup_point: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        (data.role === "driver" || data.role === "student") &&
        (!data.route || data.route.trim().length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["route"],
          message: "Route is required for drivers and students",
        });
      }

      if (
        data.role === "student" &&
        (!data.pickup_point || data.pickup_point.trim().length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pickup_point"],
          message: "Pickup point is required for students",
        });
      }
    });

  type UserFormValues = z.infer<typeof userSchema>;

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role: undefined,
      password: "",
      route: "",
      pickup_point: "",
    },
  });

  const selectedRole = form.watch("role");

  type UserRow = Tables<"users">;
  type RouteRow = Tables<"routes">;

  const editUserSchema = z.object({
     full_name: z.string().min(1, "Name is required"),
     phone: z.string().optional(),
     role: z.enum(["student", "teacher", "driver"]),
     route: z.string().optional(),
     pickup_point: z.string().optional(),
     is_active: z.boolean().optional(),
   }).superRefine((data, ctx) => {
     if (
       (data.role === "driver" || data.role === "student") &&
       (!data.route || data.route.trim().length === 0)
     ) {
       ctx.addIssue({
         code: z.ZodIssueCode.custom,
         path: ["route"],
         message: "Route is required for drivers and students",
       });
     }

     if (
       data.role === "student" &&
       (!data.pickup_point || data.pickup_point.trim().length === 0)
     ) {
       ctx.addIssue({
         code: z.ZodIssueCode.custom,
         path: ["pickup_point"],
         message: "Pickup point is required for students",
       });
     }
   });

  type EditUserFormValues = z.infer<typeof editUserSchema>;

  const editForm = useForm<EditUserFormValues>({
     resolver: zodResolver(editUserSchema),
     defaultValues: {
       full_name: "",
       phone: "",
       role: "student",
       route: "",
       pickup_point: "",
       is_active: true,
     },
   });

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery<UserRow[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []) as UserRow[];
    },
  });

  const {
    data: routes = [],
    isLoading: routesLoading,
    error: routesError,
  } = useQuery<RouteRow[]>({
    queryKey: ["admin-routes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routes")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []) as RouteRow[];
    },
  });

  const handleAddUser = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);
      // First, create an auth user with email & password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message ?? "Failed to create login credentials.");
      }

      // Then, create a profile in the public.users table
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        full_name: values.full_name,
        email: values.email,
        phone: values.phone || null,
        role: values.role,
        route: values.route || null,
        pickup_point: values.pickup_point || null,
        is_active: true,
      });

      if (profileError) {
        throw new Error(profileError.message);
      }

      toast({
        title: "User added",
        description: `Account created with login access for ${values.role}.`,
      });

      form.reset();
      setIsAddUserOpen(false);
      refetchUsers();
    } catch (err) {
      toast({
        title: "Failed to add user",
        description: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (values: EditUserFormValues) => {
    if (!editingUser) return;
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("users")
        .update({
          full_name: values.full_name,
          phone: values.phone || null,
          role: values.role,
          route: values.route || null,
          pickup_point: values.pickup_point || null,
          is_active: values.is_active ?? true,
        })
        .eq("id", editingUser.id);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "User updated",
        description: "User details have been saved.",
      });

      setIsEditUserOpen(false);
      setEditingUser(null);
      editForm.reset();
      refetchUsers();
    } catch (err) {
      toast({
        title: "Failed to update user",
        description: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: UserRow) => {
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "User deleted",
        description: "User profile removed from public.users.",
      });

      refetchUsers();
    } catch (err) {
      toast({
        title: "Failed to delete user",
        description: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  };

  const sectionKey = path.startsWith("/dashboard/admin/")
    ? path.split("/")[3] ?? ""
    : "";

  const sectionTitles: Record<string, string> = {
    users: "User Management",
    buses: "Bus Fleet Management",
    timetable: "Timetable Management",
    canteen: "Canteen Management",
    fees: "Fee Management",
    announcements: "Announcements",
    complaints: "Complaints",
    reports: "Analytics & Reports",
    settings: "Admin Settings",
  };

  let content: ReactNode;

  const isOverview = path === "/dashboard/admin" || path === "/dashboard/admin/";

  if (!isOverview && sectionKey) {
    if (sectionKey === "users") {
      content = (
        <>
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display">
                <span className="gradient-text">User Management</span>
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
                Manage student, teacher and driver accounts. Create login access and assign bus routes and pickup points.
              </p>
            </div>

            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button variant="glow" className="w-full md:w-auto">
                  + Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new campus account with login access and optional bus route assignment.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="10-digit mobile number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="driver">Driver</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temporary Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Min 6 characters" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {(selectedRole === "driver" || selectedRole === "student") && (
                      <FormField
                        control={form.control}
                        name="route"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bus Route</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                                <SelectTrigger>
                                  <SelectValue placeholder={routesLoading ? "Loading routes…" : "Select route"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {routes.map((route) => (
                                    <SelectItem key={route.id} value={route.name}>
                                      {route.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {selectedRole === "student" && (
                      <FormField
                        control={form.control}
                        name="pickup_point"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup Point</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. City Center, Block A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <DialogFooter className="pt-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save user"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold font-display">Users</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  All accounts created through this panel. Use the actions on the right to edit or delete.
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                {usersLoading ? "Loading users…" : `${users.length} users`}
              </div>
            </div>

            {usersError && (
              <p className="text-sm text-destructive mb-4">
                Failed to load users. Please check Supabase connection and policies.
              </p>
            )}

            {!usersLoading && !usersError && users.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No users found. Click "Add User" to create the first account.
              </p>
            )}

            {!usersLoading && !usersError && users.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name ?? "-"}</TableCell>
                        <TableCell>{user.email ?? "-"}</TableCell>
                        <TableCell className="capitalize">{user.role ?? "-"}</TableCell>
                        <TableCell>{user.phone ?? "-"}</TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? "outline" : "secondary"}>
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingUser(user);
                              editForm.reset({
                                full_name: user.full_name ?? "",
                                phone: user.phone ?? "",
                                role: (user.role as EditUserFormValues["role"]) ?? "student",
                                route: user.route ?? "",
                                pickup_point: user.pickup_point ?? "",
                                is_active: user.is_active ?? true,
                              });
                              setIsEditUserOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update basic details, route and status for this account.
                </DialogDescription>
              </DialogHeader>

              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="driver">Driver</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(value === "active")}
                              value={field.value ? "active" : "inactive"}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bus Route</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select route" />
                            </SelectTrigger>
                            <SelectContent>
                              {routes.map((route) => (
                                <SelectItem key={route.id} value={route.name}>
                                  {route.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="pickup_point"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Point</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. City Center, Block A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="pt-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </>
      );
    } else {
      content = (
        <div className="p-4">
          Section: {sectionTitles[sectionKey] ?? sectionKey}
        </div>
      );
    }
  } else {
    content = (
      <>
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

          {/* Bus Routes (from Supabase) */}
          <div>
            <h2 className="text-lg font-semibold mb-4 font-display">Bus Routes</h2>
            <div className="glass-card p-4 rounded-xl space-y-3">
              {routesLoading && (
                  <p className="text-sm text-muted-foreground">Loading routes…</p>
              )}
              {routesError && (
                <p className="text-sm text-destructive">
                  Failed to load routes. Please check Supabase policies and connection.
                </p>
              )}
              {!routesLoading && !routesError && (
                <>
                  {routes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No routes found. Add routes in Supabase to see them here.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Total routes</span>
                        <Badge variant="outline">{routes.length}</Badge>
                      </div>
                      <ul className="max-h-40 overflow-y-auto text-sm space-y-1">
                        {routes.map((route) => (
                          <li
                            key={route.id}
                            className="flex items-center justify-between px-2 py-1 rounded-md bg-white/5"
                          >
                            <span className="truncate">{route.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <DashboardLayout role="admin">
      {content}
    </DashboardLayout>
  );
};

export default AdminDashboard;
