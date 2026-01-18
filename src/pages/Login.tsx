import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Bus, GraduationCap, BookOpen, Shield } from "lucide-react";
import campusHero from "@/assets/campus-hero.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type UserRole = "student" | "teacher" | "driver" | "admin";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "student" as UserRole, label: "Student", icon: GraduationCap, color: "from-blue-500 to-cyan-500" },
    { id: "teacher" as UserRole, label: "Teacher", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
    { id: "driver" as UserRole, label: "Driver", icon: Bus, color: "from-orange-500 to-amber-500" },
    { id: "admin" as UserRole, label: "Admin", icon: Shield, color: "from-purple-500 to-pink-500" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({
        title: "Please accept the terms",
        description: "You must agree to the terms of Service to continue.",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        toast({
          title: "Login failed",
          description: error?.message ?? "Invalid email or password.",
        });
        return;
      }

      navigate(`/dashboard/${selectedRole}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Main Container */}
      <div className="relative w-full max-w-5xl glass-card overflow-hidden animate-scale-in">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left Side - Hero Image */}
          <div className="relative hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-black/50 to-transparent">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,hsl(var(--primary)/0.1)_50%,transparent_60%)]" />
            <div className="relative float">
              <img 
                src={campusHero} 
                alt="Campus 360" 
                className="w-full max-w-md object-contain drop-shadow-2xl"
              />
            </div>
            {/* Decorative Lines */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center relative">
            {/* Cyber Lines Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32">
              <div className="absolute top-4 right-0 w-full h-px bg-gradient-to-l from-primary/50 to-transparent" />
              <div className="absolute top-8 right-0 w-3/4 h-px bg-gradient-to-l from-primary/30 to-transparent" />
              <div className="absolute top-12 right-0 w-1/2 h-px bg-gradient-to-l from-primary/20 to-transparent" />
            </div>

            {/* Logo */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold gradient-text">
                Campus'360
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome back! Sign in to continue
              </p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`
                    flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all duration-300
                    ${selectedRole === role.id 
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20" 
                      : "border-white/10 text-muted-foreground hover:border-white/20 hover:bg-white/5"}
                  `}
                >
                  <role.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{role.label}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">E-mail</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={async () => {
                      if (!email) {
                        toast({
                          title: "Enter your email first",
                          description: "Please type your email, then click reset.",
                        });
                        return;
                      }

                      try {
                        setLoading(true);
                        const { error } = await supabase.auth.resetPasswordForEmail(email, {
                          redirectTo: window.location.origin,
                        });

                        if (error) {
                          toast({
                            title: "Reset failed",
                            description: error.message,
                          });
                          return;
                        }

                        toast({
                          title: "Reset link sent",
                          description: "Check your email for a password reset link.",
                        });
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the terms of Service
                </label>
              </div>

              <Button 
                type="submit" 
                variant="glow" 
                size="lg" 
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
